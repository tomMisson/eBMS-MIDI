import React, { Component } from 'react';
import update from 'immutability-helper';

class Schedule extends Component {

    state = {
        controllableDevices:[{_id:0, name:"gatewaySiren"}],
        eventDevices:[],
        currentDeviceControlls:<div class="controls siren">
            <select id='sirenSound' name='gatewaySiren'>
                <option value='1'>Siren: 1</option>
                <option value='2'>Siren: 2</option>
                <option value='3'>Siren: 3</option>
                <option value='4'>Siren: 4</option>
                <option value='5'>Siren: 5</option>
                <option value='6'>Siren: 6</option>
            </select>
            <br/>
            <hr size="80%"/>
            <input class="powerOnRadio" type="radio" id="powerOn" name="power" value="255"/>
            <label class="powerOnLabel power" for="powerOn">on</label>
            <div class="vl"></div>
            <input class="powerOffRadio" type="radio" id="powerOff" name="power" value="0" required/>
            <label class="powerOffLabel power" for="powerOff">off</label>
        </div>
    }

    componentDidMount() {
        this.changeActiveNav();
        this.getDevicesInfo();
    }

    changeActiveNav() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/schedule") {
                link.classList.add("navLinkActive");
            }
        });
    }

    showAddEvent() {
        this.getDevicesInfo();
        document.getElementById("addEventScreen").classList.remove("invisible");
    }

    hideAddEvent() {
        document.getElementById("addEventScreen").classList.add("invisible");
    }

    async getDevicesInfo() {
        this.state.controllableDevices = [{_id:0, name:"gatewaySiren"}];
        this.state.eventDevices = [];
        const response = await fetch("http://" +  window.location.hostname +":3000/api/devices");
        const data = await response.json();
        const supportedControllableDevices = ["EnergyPlug", "SWITCH_ALL"];
        const supportedEventDevices = ["TemperatureSensor", "HumiditySensor", "FloodSensor"];
        for (let index = 0; index < data.length; index++) {
            let device = data[index]
            device.channels.forEach(channel => {
                channel.name = channel.name.replace(/ /g, "");
                if (supportedControllableDevices.includes(channel.name)) {  
                    device.name = channel.name;
                    this.state.controllableDevices.push(device);
                }
                else if (supportedEventDevices.includes(channel.name)) {
                    device.name = channel.name;
                    this.state.eventDevices.push(device);
                }
            });
        }
        this.setState({eventDevices:this.state.eventDevices, controllableDevices:this.state.controllableDevices})
    }

    changeConDevice(e) {
        const deviceName = e.target.value.split("-")[1];
        if (deviceName === "gatewaySiren") {
            this.setState({currentDeviceControlls:
                <div class="controls siren">
                    <select id='sirenSound' name='gatewaySiren'>
                        <option value='1'>Siren: 1</option>
                        <option value='2'>Siren: 2</option>
                        <option value='3'>Siren: 3</option>
                        <option value='4'>Siren: 4</option>
                        <option value='5'>Siren: 5</option>
                        <option value='6'>Siren: 6</option>
                    </select>
                    <br/>
                    <hr size="80%"/>
                    <input class="powerOnRadio" type="radio" id="powerOn" name="power" value="255"/>
                    <label class="powerOnLabel power" for="powerOn">on</label>
                    <div class="vl"></div>
                    <input class="powerOffRadio" type="radio" id="powerOff" name="power" value="0" required/>
                    <label class="powerOffLabel power" for="powerOff">off</label>
                </div>
            });
        }
        else if (["EnergyPlug", "SWITCH_ALL"].includes(deviceName)) {
            this.setState({currentDeviceControlls:
                <div class="controls">
                    <input class="powerOnRadio" type="radio" id="powerOn" name="power" value="255"/>
                    <label class="powerOnLabel power" for="powerOn">on</label>
                    <div class="vl"></div>
                    <input class="powerOffRadio" type="radio" id="powerOff" name="power" value="0" required/>
                    <label class="powerOffLabel power" for="powerOff">off</label>
                </div>
            });
        }
    }

    preventSubmit(e) {
        e.preventDefault();
        e.target.reportValidity();
    }

    addEvent(e) {
        const form = document.getElementById("addEventBox");
        const valid = form.reportValidity();
        if (valid) {
            const selectedDevice = document.getElementById("controllableDevices");
            const deviceName = selectedDevice.value.split("-")[1];
            const deviceID = selectedDevice.value.split("-")[0];
            const radios = form.elements["power"];
            let val;
            const event = {};
            event.title = document.getElementById("eventTitle").value;
            event.day = document.getElementById("eventDay").value;
            event.deviceID = deviceID;
            event.time = document.getElementById("eventTime").value;
            for (var i=0, len=radios.length; i<len; i++) {
                if ( radios[i].checked ) {
                    val = radios[i].value;
                    break;
                }
            }
            event.value = val;
            if (deviceName === "gatewaySiren") {
                event.command = "syssound";
                if (val == 255) event.value = document.getElementById("sirenSound").value;
            }
            else if (["EnergyPlug", "SWITCH_ALL"].includes(deviceName)) {
                event.command = "switch";
            }
            this.sendEvent(event);
        }
    }

    sendEvent(sEvent) {
        console.log(sEvent);
        //fetch("http://" +  window.location.hostname +":3000/api/schedule/create/", {method:"POST", body:sEvent})
        //.then(res => console.log(res));
    }

    render() { 
        let rConDeviceList = this.state.controllableDevices.map(function(device, index) { 
            return <option value={this.state.controllableDevices[index]._id + "-" + this.state.controllableDevices[index].name}>{this.state.controllableDevices[index].name}</option>
        }, this);

        return ( 
            <section id="schedule">
                <table class="scheduleTable">
                    <thead>
                        <tr class="schedule-header">
                            <td colspan="7">
                                <h3>Weekly Schedule</h3>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                    <tr id="daysOfWeekHeaders">
                        <th></th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                    </tr>
                    <tr>
                        <td>00</td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                        <td rowspan="24"></td>
                    </tr>
                    <tr>
                        <td>01</td>
                    </tr>
                    <tr>
                        <td>02</td>
                    </tr>
                    <tr>
                        <td>03</td>
                    </tr>
                    <tr>
                        <td>04</td>
                    </tr>
                    <tr>
                        <td>05</td>
                    </tr>
                    <tr>
                        <td>06</td>
                    </tr>
                    <tr>
                        <td>07</td>
                    </tr>
                    <tr>
                        <td>08</td>
                    </tr>
                    <tr>
                        <td>09</td>
                    </tr>
                    <tr>
                        <td>10</td>
                    </tr>
                    <tr>
                        <td>11</td>
                    </tr>
                    <tr>
                        <td>12</td>
                    </tr>
                    <tr>
                        <td>13</td>
                    </tr>
                    <tr>
                        <td>14</td>
                    </tr>
                    <tr>
                        <td>15</td>
                    </tr>
                    <tr>
                        <td>16</td>
                    </tr>
                    <tr>
                        <td>17</td>
                    </tr>
                    <tr>
                        <td>18</td>
                    </tr>
                    <tr>
                        <td>19</td>
                    </tr>
                    <tr>
                        <td>20</td>
                    </tr>
                    <tr>
                        <td>21</td>
                    </tr>
                    <tr>
                        <td>22</td>
                    </tr>
                    <tr>
                        <td>23</td>
                    </tr>
                    <tr>
                        <td>24</td>
                    </tr>
                    </tbody>
                </table>
                <div id="addEventScreen" class="invisible pos-fix right left top bottom dis-flx">
                    <form id="addEventBox" class="" onSubmit={this.preventSubmit.bind(this)}>
                        <div id="scheduleDetails">
                            <input type="text" id="eventTitle" required/>
                            <br/><br/>
                            <select id='controllableDevices' onChange={this.changeConDevice.bind(this)}>
                                {rConDeviceList}
                            </select>
                            <br/><br/>
                            {this.state.currentDeviceControlls}
                            <br/><br/>
                            <select id='eventDay' required>
                                <option value='0'>Monday</option>
                                <option value='1'>Tuesday</option>
                                <option value='2'>Wednesday</option>
                                <option value='3'>Thursday</option>
                                <option value='4'>Friday</option>
                                <option value='5'>Saturday</option>
                                <option value='6'>Sunday</option>
                            </select>
                            <input id="eventTime" type="time" required></input>
                        </div>
                        <div class="controls">
                            <button class="powerOn power" type="submit" onClick={this.addEvent.bind(this)}>AddEvent</button>
                            <div class="vl"></div>
                            <button class="powerOff power" onClick={this.hideAddEvent.bind(this)}>Cancel</button>
                        </div>
                    </form>
                </div>
                <button id="AddEvent" onClick={this.showAddEvent.bind(this)}><img class="largeIcon roundButton positiveIcon" src="images/generalIcons/add.svg"></img></button>
            </section>
         );
    }
}
 
export default Schedule;