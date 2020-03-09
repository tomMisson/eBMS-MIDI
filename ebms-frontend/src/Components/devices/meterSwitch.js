import React, { Component } from 'react';

class MeterSwitch extends Component {
    state = {  }

    render() {
        return ( 
        
            <div class="device meterSwitch">
                <h3 class="deviceTitle inline">Meter Switch</h3>
                <h4 class="deviceStatus inline">Power Draw: </h4>
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