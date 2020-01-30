import React, { Component } from 'react';
import './device.css'
class Devices extends Component {
    state = {  }
    render() { 
        return ( 
        
        <div id="device">
            <h2>Devices</h2>
            <div id="search">
                <b>Search for a device</b>
                <input type="text"></input>
            </div>
            <b>Room: </b>
            <select>
                
            </select>
            <div id="list">
                <div className="titles">
                    <b>Device List</b>
                </div>
            </div>
            <div id="group">
                <div className="titles">
                    <b>Grouped Devices</b>
                </div>
            </div>
        </div> 
        
        );
    }
}
 
export default Devices;