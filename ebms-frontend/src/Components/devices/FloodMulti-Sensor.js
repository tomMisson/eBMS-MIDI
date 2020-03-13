import React, { Component } from 'react';

class FloodMultiSensor extends Component {

    render() {
        let triggered = "off"
        if (this.props.deviceInfo.channels[0].basicValue/255 == 0) triggered = "No Flood";
        else triggered =  "Flood Detected!";

        let temperature = '';
        let humidity = '';
        let flood = '';
        
        this.props.deviceInfo.channels.map(function(device, index) {
            if (device.name === "Temperature Sensor") {
                temperature = Math.round(((device.sensorValue/10 - 32) * 5 / 9)*10)/10 + '°C / ' + (device.sensorValue/10) + '°F';
            }
            else if (device.name === "Humidity Sensor") {
                humidity = device.sensorValue;
            }
            else if (device.name === "Flood Sensor") {
                flood = triggered;
            }
        });
        return ( 
        
            <div class="device meterSwitch" id={this.key}>
                <section class="deviceLeft">
                    <img class="largeIcon neutralIcon" src="images/deviceIcons/home-flood.svg" ></img>
                </section>
                
                <section class="deviceRight">
                    <img class="smallIcon roundButton dangerIcon" src="images/generalIcons/remove.svg"></img>
                </section>

                <h3 class="deviceTitle inline">Flood Multi-Sensor</h3>
                <h4 class="deviceStatus inline">Flood Sensor: {flood}</h4>
                <h4 class="deviceStatus inline">Temperature Sensor: {temperature}</h4>
                <h4 class="deviceStatus inline">Humidity Sensor: {humidity}</h4>
            </div>
        
        );
    }
}
 
export default FloodMultiSensor;