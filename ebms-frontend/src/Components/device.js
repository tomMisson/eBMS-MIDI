import React, { Component } from 'react';
import Gateway from './devices/gatewaySiren';
import MeterSwitch from './devices/energyPlug';
import FloodMultiSensor from './devices/FloodMulti-Sensor';
import MasterSwitch from './devices/SWITCH_ALL';
import ReactDOM, { unmountComponentAtNode } from 'react-dom'
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
            if(link.href === window.location.origin + "/devices") {
                link.classList.add("navLinkActive");
            }
        });
    }

    componentWillUnmount() {

        // this.state.devices.map(function (device) { 
        //     unmountComponentAtNode(document.getElementById(device.uid));
        //  });

         clearInterval(this.intervalID);
    } 

    renderDevices() {
        // const devicesSection = document.getElementById('devices');
        // const deviceScope = this;
        // this.setState({renderDevices:this.state.devices.map(function(device, index) {
        //     if (device.name == "gatewaySiren")
        //         return <Gateway key={device._id} someProp={deviceScope.state.rand}/>
        //     else if (device.name == "SWITCH_ALL") {
        //         //return <MasterSwitch key={device.uid}/>
        //         return <div key={device._id}></div>
        //     }
        //     else if (device.name == "EnergyPlug ") 
        //         return <MeterSwitch key={device._id} someProp={deviceScope.state.rand} deviceInfo={device}/>
        //     else if (device.name == "FloodMulti-Sensor ") {
        //         //return <Gateway key={device.uid}/>
        //         return <div key={device._id}></div>
        //     }
        // })});
        // //  (let index = 0; index < this.state.devices.length; index++) {
        // //     let device = this.state.devices[index];
            
    }

    async getDevicesInfo() {
        const response = await fetch("http://" +  window.location.hostname +":3000/api/devices");
        const data = await response.json();
        const supportedDevices = ["Flood Multi-Sensor ", "Energy Plug ", "SWITCH_ALL"];
        for (let index = 0; index < data.length; index++) {
            let device = data[index]
            device.channels.forEach(channel => {
                if (supportedDevices.includes(channel.name)) {
                    device.name = channel.name.replace(" ", "");
                    let deviceExists = false
                    let deviceIndex = 0;
                    console.log(channel.watt);
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

    UNSAFE_componentWillMount() {
        this.intervalID = setInterval(
            () => this.getDevicesInfo(),
            1000
        );
    }

    componentDidMount() {
        this.changeActiveNav();
    }

    render() { 
        const rDevices = this.state.devices.map(function(device, index) {
            if (device.name === "gatewaySiren")
                return <Gateway key={device._id} deviceInfo={this.state.devices[index]}/>
            else if (device.name == "SWITCH_ALL") {
                //return <MasterSwitch key={device.uid}/>
                return <div key={device._id}></div>
            }
            else if (device.name === "EnergyPlug ") 
                return <MeterSwitch key={device._id} deviceInfo={this.state.devices[index]}/>
            else if (device.name === "FloodMulti-Sensor ") {
                //return <Gateway key={device.uid}/>
                return <div key={device._id}></div>
            }
        },this);
        return ( 
            <section id="devices">
                {rDevices}
                <button id="AddDevice"><img alt="Add devices icon" class="positiveIcon" src="images/generalIcons/add.svg"></img></button>
            </section>
        );
    }
}
 
export default Devices;