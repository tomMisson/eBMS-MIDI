import React, { Component } from 'react';
import './device.css'
class Devices extends Component {
    constructor(props) {
        super(props);
        this.state = {
            heat: 0,
            air: 0
        };
    }

    increaseHeat = () => {
        if (this.state.heat >=80) {
           return
        }
        else this.setState({heat: this.state.heat + 1});
    }

    decreaseHeat = () => {
        if (this.state.heat <=0) {
            return
         }
        else this.setState({heat: this.state.heat - 1});
    }

    increaseAirCon = () => {
        this.setState({air: this.state.air + 1});
    }

    decreaseAirCon = () => {
        this.setState({air: this.state.air - 1});
    }

    render() { 
        return ( 
        
        <div id="device">
            <header id="banner">
                <h3>Device Manager</h3>
                <div id="search-box">
                    <input id="search" placeholder="search device"></input>
                    <img id="search-btn" src="images/search.svg" alt="search"></img>
                </div>
                <div className="addDevice">
                    <h5>Add Device</h5>
                    <button id="addDev-btn">+</button>
                </div>
            </header>
            <section id="devices">
                <div className="deviceBar d1">
                    <img id="light" src= "images/idea.png" alt="bulb"></img>
                    <b>Lighting</b>
                    <table>
                        <tr>
                            <th className="control-title">On/Off</th>
                            <th className="control-title">Room</th>
                            <th className="control-title">Status</th>
                        </tr>
                        <tr>
                            <td>
                            <label className="switch">
                                <input className= "input" type="checkbox"></input>
                                <span className="slider round"></span>
                            </label>
                            </td>
                            <td>
                            <div className="rooms">
                                <select>
                                    <option value="Living room">Living room</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Bedroom">Bedroom</option>
                                </select>
                            </div>
                            </td>
                            <td>
                            </td>
                        </tr>
                    </table>
                    <button className="manage-btn">Manage Device</button>
                </div>
                <div className="deviceBar d2">
                    <img id="light" src= "images/weather.png" alt="themometer"></img>
                    <b>Heating</b>
                    <table className="big-table">
                        <tr>
                            <th className="control-title">On/Off</th>
                            <th className="control-title">Room</th>
                            <th className="control-title">Status</th>
                            <th className="control-title">Temperature</th>
                        </tr>
                        <tr>
                            <td>
                            <label className="switch">
                                <input className= "input" type="checkbox"></input>
                                <span className="slider round"></span>
                            </label>
                            </td>
                            <td>
                            <div className="rooms">
                                <select>
                                    <option value="Living room">Living room</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Bedroom">Bedroom</option>
                                </select>
                            </div>
                            </td>
                            <td>

                            </td>
                            <td>
                                <button className="control-btn" onClick={this.decreaseHeat}>-</button><span>{this.state.heat}</span><button className="control-btn" onClick={this.increaseHeat}>+</button>
                            </td>
                        </tr>
                    </table>
                    <button className="manage-btn">Manage Device</button>
                </div>
                <div className="deviceBar d3">
                <img id="light" src= "images/alarm.png" alt="alarm"></img>
                    <b>Alarms</b>
                    <table>
                        <tr>
                            <th className="control-title">On/Off</th>
                            <th className="control-title">Room</th>
                            <th className="control-title">Status</th>
                        </tr>
                        <tr>
                            <td>
                            <label className="switch">
                                <input className= "input" type="checkbox"></input>
                                <span className="slider round"></span>
                            </label>
                            </td>
                            <td>
                            <div className="rooms">
                                <select>
                                    <option value="Living room">Living room</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Bedroom">Bedroom</option>
                                </select>
                            </div>
                            </td>
                        </tr>
                    </table>
                    <button className="manage-btn">Manage Device</button>
                </div>
                <div className="deviceBar d4">
                <img id="light" src= "images/fan.png" alt="bulb"></img>
                    <b>Air-Con</b>
                     <table className="big-table">
                        <tr>
                            <th className="control-title">On/Off</th>
                            <th className="control-title">Room</th>
                            <th className="control-title">Status</th>
                            <th className="control-title">Temperature</th>
                        </tr>
                        <tr>
                            <td>
                            <label className="switch">
                                <input className= "input" type="checkbox"></input>
                                <span className="slider round"></span>
                            </label>
                            </td>
                            <td>
                            <div className="rooms">
                                <select>
                                    <option value="Living room">Living room</option>
                                    <option value="Kitchen">Kitchen</option>
                                    <option value="Bedroom">Bedroom</option>
                                </select>
                            </div>
                            </td>
                            <td>

                            </td>
                            <td>
                                <button className="control-btn" onClick={this.decreaseAirCon}>-</button><span>{this.state.air}</span><button className="control-btn" onClick={this.increaseAirCon}>+</button>
                            </td>
                        </tr>
                    </table>
                    <button className="manage-btn">Manage Device</button>
                </div>
            </section>
        </div> 
        
        );
    }
}
 
export default Devices;