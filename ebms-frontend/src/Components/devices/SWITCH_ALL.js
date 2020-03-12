import React, { Component } from 'react';

class MasterSwitch extends Component {

    render() {
        let LastCommandPower = "off"
        if (this.props.deviceInfo.channels[0].basicValue/255 == 0) LastCommandPower = "off";
        else LastCommandPower =  "on";
        return ( 
        
            <div class="device meterSwitch">
                <section class="deviceLeft">
                    <img class="largeIcon neutralIcon" src="images/deviceIcons/all_switch_on.svg" ></img>
                </section>
                
                <section class="deviceRight">
                    <img class="smallIcon roundButton dangerIcon" src="images/generalIcons/remove.svg"></img>
                </section>
                <h3 class="deviceTitle inline">Master Switch</h3>
                <h4 class="deviceStatus inline">All Power Plugs Power Draw: {this.props.deviceInfo.channels[0].sensorValue/10} Watts</h4>
                <h4 class="deviceStatus inline">Last Power Command: {LastCommandPower}</h4>
                <form class="controls gatewayControls">
                    <label class="switch">
                        <input type="checkbox"/>
                        <span class="slider round"></span>
                    </label>
                </form>
            </div>
        
        );
    }
}
 
export default MasterSwitch;