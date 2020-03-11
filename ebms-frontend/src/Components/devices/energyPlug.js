import React, { Component } from 'react';

class MeterSwitch extends Component {

     async updateDevice() {
        try {
            const response = await fetch("http://" +  window.location.hostname +":3000/api/devices/"+this.state.uid);
            const data = await response.json();
            this.setState({wattage: data[0].channels[0].watt});
        } catch (error) {}
    }

    

    componentWillUnmount() {
        
    } 

    render() {
        return ( 
        
            <div class="device meterSwitch">
                <h3 class="deviceTitle inline">Meter Switch</h3>
                <h4 id="" class="deviceStatus inline">Power Draw: {this.props.deviceInfo.channels[0].watt} Watts</h4>
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