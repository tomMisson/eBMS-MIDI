import React, { Component } from 'react';
import Gateway from './devices/GatewaySiren';
import MeterSwitch from './devices/MeterSwitch';
import FloodMultiSensor from './devices/FloodMultiSensor';
import MasterSwitch from './devices/MasterSwitch';
import update from 'immutability-helper';

class Devices extends Component {

    state = { 
        devices:[{_id:0, name:"gatewaySiren"}],
        addingRemovingDevice:false,
        timer:60,
        searchEllipsis:'...',
        searchText:'Searching',
        removeFunction:this.removeDevice.bind(this)
    }

    changeActiveNav() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/devices" || link.href === window.location.origin) {
                link.classList.add("navLinkActive");
            }
        });
    }

    componentWillUnmount() {

        this.cancelAddRemoveDevice();

        clearInterval(this.intervalID);
    } 

    addDevice () {
        fetch("http://" +  window.location.hostname +":3000/api/control/256/abort/2")
        .then(res => fetch("http://" +  window.location.hostname +":3000/api/control/256/zwnosecure/1")
            .then(res2 => fetch("http://" +  window.location.hostname +":3000/api/control/256/include/0")
                .then(res3 => this.showAddDevice()
                )
                .catch()
            )
            .catch()
        )
        .catch()
    }

    removeDevice() {
        fetch("http://" +  window.location.hostname +":3000/api/control/256/abort/4")
        .then(res => fetch("http://" +  window.location.hostname +":3000/api/control/256/exclude/5")
            .then(res2 => this.showRemoveDevice())
            .catch()
        )
        .catch()
    }

    showAddDevice() {
        this.setState({addingRemovingDevice:true});
        this.setState({searchText:'Searching'});
        document.getElementById("addRemoveDeviceScreen").classList.remove("invisible");
        this.addRemoveInterval = setInterval(
            () => this.addRemoveCountdown(),
            1000
        );
    }

    showRemoveDevice() {
        this.setState({addingRemovingDevice:true});
        this.setState({searchText:'Looking For Device'});
        document.getElementById("addRemoveDeviceScreen").classList.remove("invisible");
        this.addRemoveInterval = setInterval(
            () => this.addRemoveCountdown(),
            1000
        );
    }

    addRemoveCountdown() {
        this.setState({timer:this.state.timer-1});
        if ((this.state.timer % 3) == 0) this.setState({searchEllipsis:'...'});
        else if ((this.state.timer % 3) == 1) this.setState({searchEllipsis:'..'});
        else if ((this.state.timer % 3) == 2) this.setState({searchEllipsis:'.'});
        if (this.state.timer <= 0) {
            this.cancelAddRemoveDevice();
        }
        if (!this.state.addingRemovingDevice) {
            this.cancelAddRemoveDevice();
        }
    }

    cancelAddRemoveDevice() {
        fetch("http://" +  window.location.hostname +":3000/api/control/256/abort/3")
        .then(
            this.hideAddRemoveDevice()
        )
        .catch()
    }

    hideAddRemoveDevice() {
        document.getElementById("addRemoveDeviceScreen").classList.add("invisible");
        this.setState({addingRemovingDevice:false});
        clearInterval(this.addRemoveInterval);
        this.setState({timer:60});
    }

    async getDevicesInfo() {
        const response = await fetch("http://" +  window.location.hostname +":3000/api/devices");
        const data = await response.json();
        const supportedDevices = ["FloodMulti-Sensor", "EnergyPlug", "SWITCH_ALL"];
        const currentDeviceCount = this.state.devices.length;
        let deviceIDs = [0];
        for (let index = 0; index < data.length; index++) {
            let device = data[index]
            device.channels.forEach(channel => {
                channel.name = channel.name.replace(/ /g, "");
                if (supportedDevices.includes(channel.name)) {
                    deviceIDs.push(device._id);
                    device.name = channel.name;
                    let deviceExists = false
                    let deviceIndex = 0;
                    this.state.devices.map(function(currentDevice, currentIndex) {
                        if (currentDevice._id === device._id) {
                            deviceExists = true;
                            deviceIndex = currentIndex;
                        }
                    });
                    if (deviceExists) {
                        this.setState({
                            devices: update(this.state.devices, {[deviceIndex] :{$set:device}})
                          })
                    }
                    else {
                        this.state.devices.push(device);
                    }
                }
            });
        }
        this.state.devices.map(function(checkingDevice, checkingIndex) {
            if (!deviceIDs.includes(checkingDevice._id)) {
                this.state.devices.splice(checkingIndex);
            }
        }, this);
        if (currentDeviceCount != this.state.devices.length) this.setState({addingRemovingDevice:false});
    }

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.getDevicesInfo(),
            1000
        );

        this.changeActiveNav();
        this.cancelAddRemoveDevice();
    }

    getDeviceComponent(device, index) {
        if (device.name === "gatewaySiren")
            return <Gateway key={device._id} deviceInfo={this.state.devices[index]} removeFunction={this.removeDevice.bind(this)}/>
        else if (device.name == "SWITCH_ALL") 
            return <MasterSwitch key={device._id} deviceInfo={this.state.devices[index]} removeFunction={this.removeDevice.bind(this)}/>
        else if (device.name == "EnergyPlug") 
            return <MeterSwitch key={device._id} deviceInfo={this.state.devices[index]} removeFunction={this.removeDevice.bind(this)}/>
        else if (device.name == "FloodMulti-Sensor") 
            return <FloodMultiSensor key={device._id} deviceInfo={this.state.devices[index]} removeFunction={this.removeDevice.bind(this)}/>
    }

    render() { 
        const rDevices = this.state.devices.map(function(device, index) { return this.getDeviceComponent(device, index) }, this);
        
        return ( 
            <section id="devices">
                {rDevices}
                <div id="addRemoveDeviceScreen" class="pos-fix right left top bottom dis-flx">
                    <section id="addRemoveSearchingBox" class="">
                        <h2>{this.state.searchText}{this.state.searchEllipsis}</h2>
                        <h3>{this.state.timer} Seconds Remaining</h3>
                        <button id="addRemoveAbortButton" onClick={this.cancelAddRemoveDevice.bind(this)}><b>Cancel</b></button>
                    </section>
                </div>
                <button id="AddDevice" onClick={this.addDevice.bind(this)}><img class="largeIcon roundButton positiveIcon" src="images/generalIcons/add.svg"></img></button>
            </section>
        );
    }
}
 
export default Devices;