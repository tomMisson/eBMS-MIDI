import React, { Component } from 'react';
import './schedule_event.css';

class Schedule_Event extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            lightingStartTime: '9am',
            lightingEndTime: '5pm',
            lightingChecked: false,
            
        }
    }

    handleLightingCheck = () => {
        this.setState({lightingChecked: !this.state.lightingChecked});
      }

    handleLightStartTimeChange =(e) => {
        this.setState({lightingStartTime:e.target.value});
      }

      handleLightEndTimeChange =(e) => {
        this.setState({lightingEndTime:e.target.value});
      }

    commitSchedule = (props) => {
        if(this.state.lightingChecked) {
            props.changeSchedule('Blue');
        }
        
    }

    render() { 
        return ( 
            <div className="event-container">
                <table id="event-table">
                    <tr>
                        <td>
                            <label>Lighting</label>
                            </td>
                            <td>
                            <input type="checkbox" onChange={this.handleLightingCheck}></input>
                        </td>
                        <td>
                            <label>Start Time</label>
                        </td>
                        <td>
                            <select value={this.state.lightingStartTime} 
                                    onChange={this.handleLightStartTimeChange} >
                                <option value="1am">1am</option>
                                <option value="2am">2am</option>
                                <option value="3am">3am</option>
                                <option value="4am">4am</option>
                                <option value="5am">5am</option>
                                <option value="6am">6am</option>
                                <option value="7am">7am</option>
                                <option value="8am">8am</option>
                                <option value="9am">9am</option>
                                <option value="10am">10am</option>
                                <option value="11am">11am</option>
                                <option value="12pm">12pm</option>
                                <option value="1pm">1pm</option>
                                <option value="2pm">2pm</option>
                                <option value="3pm">3pm</option>
                                <option value="4pm">4pm</option>
                                <option value="5pm">5pm</option>
                                <option value="6pm">6pm</option>
                                <option value="7pm">7pm</option>
                                <option value="8pm">8pm</option>
                                <option value="9pm">9pm</option>
                                <option value="10pm">10pm</option>
                                <option value="11pm">11pm</option>
                                <option value="12am">12am</option>
                            </select>
                        </td>
                        <td>
                            <label>End Time</label>
                        </td>
                        <td>
                        <select value={this.state.lightingEndTime} 
                                    onChange={this.handleLightEndTimeChange} >
                                <option value="1am">1am</option>
                                <option value="2am">2am</option>
                                <option value="3am">3am</option>
                                <option value="4am">4am</option>
                                <option value="5am">5am</option>
                                <option value="6am">6am</option>
                                <option value="7am">7am</option>
                                <option value="8am">8am</option>
                                <option value="9am">9am</option>
                                <option value="10am">10am</option>
                                <option value="11am">11am</option>
                                <option value="12pm">12pm</option>
                                <option value="1pm">1pm</option>
                                <option value="2pm">2pm</option>
                                <option value="3pm">3pm</option>
                                <option value="4pm">4pm</option>
                                <option value="5pm">5pm</option>
                                <option value="6pm">6pm</option>
                                <option value="7pm">7pm</option>
                                <option value="8pm">8pm</option>
                                <option value="9pm">9pm</option>
                                <option value="10pm">10pm</option>
                                <option value="11pm">11pm</option>
                                <option value="12am">12am</option>
                            </select>
                        </td>
                </tr>
                <tr>
                    <td>
                        <label>Heating</label>
                        </td>
                        <td>
                        <input type="checkbox"></input>
                    </td>
                    <td>
                        <label>Start Time</label>
                    </td>
                    <td>
                <select>
                    <option>1am</option>
                    <option>2am</option>
                    <option>3am</option>
                    <option>4am</option>
                    <option>5am</option>
                    <option>6am</option>
                    <option>7am</option>
                    <option>8am</option>
                    <option>9am</option>
                    <option>10am</option>
                    <option>11am</option>
                    <option>12pm</option>
                    <option>1pm</option>
                    <option>2pm</option>
                    <option>3pm</option>
                    <option>4pm</option>
                    <option>5pm</option>
                    <option>6pm</option>
                    <option>7pm</option>
                    <option>8pm</option>
                    <option>9pm</option>
                    <option>10pm</option>
                    <option>11pm</option>
                    <option>12am</option>
                </select>
                </td>
                <td>
                <label>End Time</label>
                </td>
                <td>
                <select>
                    <option>1am</option>
                    <option>2am</option>
                    <option>3am</option>
                    <option>4am</option>
                    <option>5am</option>
                    <option>6am</option>
                    <option>7am</option>
                    <option>8am</option>
                    <option>9am</option>
                    <option>10am</option>
                    <option>11am</option>
                    <option>12pm</option>
                    <option>1pm</option>
                    <option>2pm</option>
                    <option>3pm</option>
                    <option>4pm</option>
                    <option>5pm</option>
                    <option>6pm</option>
                    <option>7pm</option>
                    <option>8pm</option>
                    <option>9pm</option>
                    <option>10pm</option>
                    <option>11pm</option>
                    <option>12am</option>
                </select>
                </td>
                </tr>
                <tr>
                    <td>
                        <label>Temperature</label>
                        </td>
                        <td>
                        <input type="checkbox"></input>
                    </td>
                    <td>
                        <label>Start Time</label>
                    </td>
                    <td>
                <select>
                    <option>1am</option>
                    <option>2am</option>
                    <option>3am</option>
                    <option>4am</option>
                    <option>5am</option>
                    <option>6am</option>
                    <option>7am</option>
                    <option>8am</option>
                    <option>9am</option>
                    <option>10am</option>
                    <option>11am</option>
                    <option>12pm</option>
                    <option>1pm</option>
                    <option>2pm</option>
                    <option>3pm</option>
                    <option>4pm</option>
                    <option>5pm</option>
                    <option>6pm</option>
                    <option>7pm</option>
                    <option>8pm</option>
                    <option>9pm</option>
                    <option>10pm</option>
                    <option>11pm</option>
                    <option>12am</option>
                </select>
                </td>
                <td>
                <label>End Time</label>
                </td>
                <td>
                <select>
                    <option>1am</option>
                    <option>2am</option>
                    <option>3am</option>
                    <option>4am</option>
                    <option>5am</option>
                    <option>6am</option>
                    <option>7am</option>
                    <option>8am</option>
                    <option>9am</option>
                    <option>10am</option>
                    <option>11am</option>
                    <option>12pm</option>
                    <option>1pm</option>
                    <option>2pm</option>
                    <option>3pm</option>
                    <option>4pm</option>
                    <option>5pm</option>
                    <option>6pm</option>
                    <option>7pm</option>
                    <option>8pm</option>
                    <option>9pm</option>
                    <option>10pm</option>
                    <option>11pm</option>
                    <option>12am</option>
                </select>
                </td>
                </tr>
                <tr>
                    <td>
                <label>Air-Con</label>
                </td>
                <td>
                <input type="checkbox"></input>
                </td>
                <td>
                <label>Start Time</label>
                </td>
                <td>
                <select>
                    <option>1am</option>
                    <option>2am</option>
                    <option>3am</option>
                    <option>4am</option>
                    <option>5am</option>
                    <option>6am</option>
                    <option>7am</option>
                    <option>8am</option>
                    <option>9am</option>
                    <option>10am</option>
                    <option>11am</option>
                    <option>12pm</option>
                    <option>1pm</option>
                    <option>2pm</option>
                    <option>3pm</option>
                    <option>4pm</option>
                    <option>5pm</option>
                    <option>6pm</option>
                    <option>7pm</option>
                    <option>8pm</option>
                    <option>9pm</option>
                    <option>10pm</option>
                    <option>11pm</option>
                    <option>12am</option>
                </select>
                </td>
                <td>
                <label>End Time</label>
                </td>
                <td>
                <select>
                    <option>1am</option>
                    <option>2am</option>
                    <option>3am</option>
                    <option>4am</option>
                    <option>5am</option>
                    <option>6am</option>
                    <option>7am</option>
                    <option>8am</option>
                    <option>9am</option>
                    <option>10am</option>
                    <option>11am</option>
                    <option>12pm</option>
                    <option>1pm</option>
                    <option>2pm</option>
                    <option>3pm</option>
                    <option>4pm</option>
                    <option>5pm</option>
                    <option>6pm</option>
                    <option>7pm</option>
                    <option>8pm</option>
                    <option>9pm</option>
                    <option>10pm</option>
                    <option>11pm</option>
                    <option>12am</option>
                </select>
                </td>
                </tr>
                <button onClick={this.props.commitSchedule} className="commit-btn">Commit</button>
                </table>
            </div>
         );
    }
}
 
export default Schedule_Event;