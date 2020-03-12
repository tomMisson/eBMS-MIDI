import React, { Component } from 'react';

class MeterSwitch extends Component {

    render() {
        let power = "off"
        if (this.props.deviceInfo.channels[0].basicValue/255 == 0) power = "off";
        else power =  "on";
        return ( 
        
            <div class="device meterSwitch">
                <section class="deviceLeft">
                    <img class="largeIcon neutralIcon" src="images/deviceIcons/power-plug.svg" ></img>
                </section>
                
                <section class="deviceRight">
                    <img class="smallIcon roundButton dangerIcon" src="images/generalIcons/remove.svg"></img>
                </section>

                <h3 class="deviceTitle inline">Meter Switch</h3>
                <h4 class="deviceStatus inline">Power Draw: {this.props.deviceInfo.channels[0].sensorValue/10} Watts</h4>
                <h4 class="deviceStatus inline">Power Status: {power}</h4>
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
 
export default MeterSwitch;