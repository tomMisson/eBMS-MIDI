import React, { Component } from 'react';

class Lighting extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (  
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
    </div> 
        );
    }
}
 
export default Lighting;