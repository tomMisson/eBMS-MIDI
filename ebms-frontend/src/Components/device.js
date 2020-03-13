import React, { Component } from 'react';
import Gateway from './devices/GatewaySiren';
import MeterSwitch from './devices/MeterSwitch';
import FloodMultiSensor from './devices/FloodMultiSensor';
import MasterSwitch from './devices/MasterSwitch';
import update from 'immutability-helper';

class Devices extends Component {
    state = { 
        devices:[{_id:0, name:"gatewaySiren"}]
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

        // this.state.devices.map(function (device) { 
        //     unmountComponentAtNode(document.getElementById(device.uid));
        //  });

        clearInterval(this.intervalID);

        console.log("Devices Unmounted");
    } 

    addDevice () {
        fetch("http://" +  window.location.hostname +":3000/api/control/256/zwnosecure/1")
        .then(response => fetch("http://" +  window.location.hostname +":3000/api/control/256/include/1"))
        .catch()
    }

    async getDevicesInfo() {
        const response = await fetch("http://" +  window.location.hostname +":3000/api/devices");
        const data = await response.json();
        const supportedDevices = ["FloodMulti-Sensor", "EnergyPlug", "SWITCH_ALL"];
        for (let index = 0; index < data.length; index++) {
            let device = data[index]
            device.channels.forEach(channel => {
                channel.name = channel.name.replace(/ /g, "");
                if (supportedDevices.includes(channel.name)) {
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
    }

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.getDevicesInfo(),
            1000
        );

        this.changeActiveNav();
    }

    getDeviceComponent(device, index) {
        if (device.name === "gatewaySiren")
            return <Gateway key={device._id} deviceInfo={this.state.devices[index]}/>
        else if (device.name == "SWITCH_ALL") 
            return <MasterSwitch key={device._id} deviceInfo={this.state.devices[index]} />
        else if (device.name == "EnergyPlug") 
            return <MeterSwitch key={device._id} deviceInfo={this.state.devices[index]}/>
        else if (device.name == "FloodMulti-Sensor") 
            return <FloodMultiSensor key={device._id} deviceInfo={this.state.devices[index]}/>
    }

    render() { 
        const rDevices = this.state.devices.map(function(device, index) { return this.getDeviceComponent(device, index) }, this);
        
        return ( 
            <section id="devices">
                {rDevices}
                <button id="AddDevice" onClick={this.addDevice}><img class="largeIcon roundButton positiveIcon" src="images/generalIcons/add.svg"></img></button>
            </section>
        );
    }
}
 
export default Devices;