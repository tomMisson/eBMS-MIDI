import React, { Component } from 'react';

class MeterSwitch extends Component {

    powerOn() {
        fetch("http://" +  window.location.hostname +":3000/api/control/" + this.props.deviceInfo._id + "/switch/" + 255);
    }

    powerOff() {
        fetch("http://" +  window.location.hostname +":3000/api/control/" + this.props.deviceInfo._id + "/switch/" + 0);
    }

    render() {
        let power = "off"
        if (this.props.deviceInfo.channels[0].basicValue/255 == 0) power = "off";
        else power =  "on";
        return ( 

            <div class="device" id={this.props.deviceInfo._id}>
                <section class="deviceHeader dis-flx">
                    <img alt="Meter Switch Icon" class="smallIcon neutralIcon" src="images/deviceIcons/power-plug.svg" ></img>
                    <h3 class="deviceTitle">Meter Switch</h3>
                </section>
                <section class="deviceContent">
                    <h4 class="deviceStatus">Power Draw: {this.props.deviceInfo.channels[0].sensorValue/10} Watts</h4>
                    <h4 class="deviceStatus">Power Status: {power}</h4>
                    <div class="controls">
                        <button class="powerOn power" onClick={this.powerOn.bind(this)}>On</button>
                        <div class="vl"></div>
                        <button class="powerOff power" onClick={this.powerOff.bind(this)}>Off</button>
                    </div>
                </section>
                <section class="deviceFooter dis-flx">
                    <h5>Last Updated: ...</h5>
                    <img class="smallIcon roundButton dangerIcon" src="images/generalIcons/remove.svg"></img>
                </section>
            </div>
        
        );
    }
}
 
export default MeterSwitch;