import React, { Component } from 'react';
import './schedule.css';
import Calendar from './calendar';
import Schedule_Event from './schedule_event';

class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            show: false, 
            showEvent: false,
            bgColour: 'none'
        };

        this.toggleCalendar = this.toggleCalendar.bind(this);
        this.toggleEvent = this.toggleEvent.bind(this);
        this.changeSchedule = this.changeSchedule.bind(this);
    }

    changeSchedule(colour) {
        this.setState({bgColour: colour});
    }

    toggleCalendar = () => {
        const {show} = this.state;
        this.setState({show:!show});
    }

    toggleEvent = () => {
        const {showEvent} = this.state;
        this.setState({showEvent:!showEvent});
    }

    render() { 
        return ( 
            <div className="schedule-container">
                {this.state.show && <Calendar/>}
                {this.state.showEvent && <Schedule_Event/>}
                <table className="schedule-table">
                    <thead>
                        <tr className="schedule-header">
                            <td colSpan="10">
                               <h3>Daily Schedule</h3> 
                            </td>
                            <td colSpan="5">
                                <button onClick={this.toggleEvent} id="addEvent-btn">Add Event</button>
                            </td>
                            <td colSpan="5">
                                <img onClick={this.toggleCalendar} src="images/schedule.svg" alt ="calendar" id="schedule-btn"></img>
                            </td>
                            <td colSpan="5">
                                <span>Wed, 19 February, 2020</span>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td>12</td>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                            <td>10</td>
                            <td>11</td>
                            <td>12</td>
                            <td>1</td>
                            <td>2</td>
                            <td>3</td>
                            <td>4</td>
                            <td>5</td>
                            <td>6</td>
                            <td>7</td>
                            <td>8</td>
                            <td>9</td>
                            <td>10</td>
                            <td>11</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Lighting</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{backgroundColor:this.state.bgColour}}></td>
                            <td style={{backgroundColor:this.props.bgColour}}></td>
                            <td style={{backgroundColor:this.props.bgColour}}></td>
                            <td style={{backgroundColor:this.props.bgColour}}></td>
                            <td style={{backgroundColor:this.props.bgColour}}></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Heating</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Alarms</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Air-Con</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
                </table>
            </div>
         );
    }
}
 
export default Schedule;