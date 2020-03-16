import React, { Component } from 'react';
import Parent from '../device.js';

class FloodMultiSensor extends Component {
    state = {
        temperature: '',
        humidity: '',
        flood: '',
        style: {}
    }

    componentWillUnmount() {
        console.log("flood be gone");
    }

    removeClick = () => {
        this.props.removeFunction();
    }

    render() {
        let triggered = "off"
        if (this.props.deviceInfo.channels[0].basicValue/255 == 0) {
            triggered = "No Flood";
            this.state.style={};
    }
        else {
            triggered =  "Flood Detected!";
            this.state.style = {"background-color": "rgb(127, 255, 255)"};
        } 
        
        this.props.deviceInfo.channels.map(function(device, index) {
            if (device.name === "Temperature Sensor") {
                this.state.temperature = Math.round(((device.sensorValue/10 - 32) * 5 / 9)*10)/10 + '°C / ' + (device.sensorValue/10) + '°F';
            }
            else if (device.name === "Humidity Sensor") {
                this.state.humidity = device.sensorValue + '%';
            }
            else if (device.name === "Flood Sensor") {
                this.state.flood = triggered;
            }
        }, this);
        return ( 
        
            <div class="device" id={this.props.deviceInfo._id} style={this.state.style}>
                <section class="deviceHeader dis-flx">
                    <img alt="flood icon" class="smallIcon neutralIcon" src="images/deviceIcons/home-flood.svg" ></img>
                    <h3 class="deviceTitle">Flood Multi-Sensor</h3>
                </section>
                <section class="deviceContent">
                    <h4 class="deviceStatus">Flood Sensor: {this.state.flood}</h4>
                    <h4 class="deviceStatus">Temperature Sensor: {this.state.temperature}</h4>
                    <h4 class="deviceStatus">Humidity Sensor: {this.state.humidity}</h4>
                </section>
                <section class="deviceFooter dis-flx">
                    <h5>Last Updated: ...</h5>
                    <img class="smallIcon roundButton dangerIcon" onClick={this.removeClick} src="images/generalIcons/remove.svg"></img>
                </section>
            </div>
        
        );
    }
}
 
export default FloodMultiSensor;