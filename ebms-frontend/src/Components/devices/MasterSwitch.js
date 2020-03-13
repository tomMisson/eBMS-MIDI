import React, { Component } from 'react';

class MasterSwitch extends Component {

    powerOn() {
        fetch("http://" +  window.location.hostname +":3000/api/control/" + this.props.deviceInfo._id + "/switch/" + 255);
    }

    powerOff() {
        fetch("http://" +  window.location.hostname +":3000/api/control/" + this.props.deviceInfo._id + "/switch/" + 0);
    }

    render() {
        let LastCommandPower = "off"
        if (this.props.deviceInfo.channels[0].basicValue/255 == 0) LastCommandPower = "off";
        else LastCommandPower =  "on";
        return ( 

            <div class="device" id={this.props.deviceInfo._id}>
                <section class="deviceHeader dis-flx">
                    <img alt="Master Switch Icon" class="smallIcon neutralIcon" src="images/deviceIcons/all_switch_on.svg" ></img>
                    <h3 class="deviceTitle">Master Switch</h3>
                </section>
                <section class="deviceContent">
                    <h4 class="deviceStatus">All Power Plugs Power Draw: {this.props.deviceInfo.channels[0].sensorValue/10} Watts</h4>
                    <h4 class="deviceStatus">Last Power Command: {LastCommandPower}</h4>
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
 
export default MasterSwitch;