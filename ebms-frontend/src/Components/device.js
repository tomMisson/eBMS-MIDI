import React, { Component } from 'react';
import Gateway from './devices/gatewaySiren';
import MeterSwitch from './devices/energyPlug';
import FloodMultiSensor from './devices/FloodMulti-Sensor';
import MasterSwitch from './devices/SWITCH_ALL';
import ReactDOM, { unmountComponentAtNode } from 'react-dom'

class Devices extends Component {
    state = { 
        devices:[{uid:0, name:"gatewaySiren"}]
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

    componentDidUpdate() {
        this.changeActiveNav();
        const devicesSection = document.getElementById('devices');
        this.state.devices.map(function(device){
            const deviceContainer = document.createElement("div");
            deviceContainer.id = device.uid;
            devicesSection.appendChild(deviceContainer);
            if (device.name == "gatewaySiren") 
                ReactDOM.render(<Gateway uid={device.uid}/>, document.getElementById(device.uid));
            else if (device.name == "SWITCH_ALL") {}
                //return <MasterSwitch key={device.uid}/>
            else if (device.name == "EnergyPlug ") 
                ReactDOM.render(<MeterSwitch uid={device.uid}/>, document.getElementById(device.uid));  
            else if (device.name == "FloodMulti-Sensor ") {}
                //return <Gateway key={device.uid}/>
        });
    }

    componentWillUnmount() {
        
        this.state.devices.map(function (device) { 
            unmountComponentAtNode(document.getElementById(device.uid));
         });
    } 

    async UNSAFE_componentWillMount() {
        
        const {show} = this.state;
        this.setState({show:!show});

        const response = await fetch("http://" +  window.location.hostname +":3000/api/devices");
        const data = await response.json();
        const supportedDevices = ["Flood Multi-Sensor ", "Energy Plug ", "SWITCH_ALL"];
        data.forEach(element => {
            let deviceName = '';
            element.channels.forEach(channel => {
                if (supportedDevices.includes(channel.name)) {
                    deviceName = channel.name.replace(" ", "");
                }
            });
            if (deviceName != '') this.state.devices.push({'uid':element._id, 'name':deviceName});
        });
        this.componentDidUpdate();
    }

    render() { 
        return ( 
            <section id="devices">
                
                <button id="AddDevice"><img class="positiveIcon" src="images/generalIcons/add.svg"></img></button>
                </section>

        
        );
    }
}
 
export default Devices;