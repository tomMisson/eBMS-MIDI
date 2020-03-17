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
        </div>,
        mondayEvents:[],
        tuesdayEvents:[],
        wednesdayEvents:[],
        thursdayEvents:[],
        fridayEvents:[],
        saturdayEvents:[],
        sundayEvents:[],
        eventID:0
    }

    componentDidMount() {
        this.changeActiveNav();
        this.getSchedules();
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

    async getSchedules() {
        const response = await fetch("http://" +  window.location.hostname +":3000/api/schedule");
        const data = await response.json();
        this.state.mondayEvents=[];
        this.state.tuesdayEvents=[];
        this.state.wednesdayEvents=[];
        this.state.thursdayEvents=[];
        this.state.fridayEvents=[];
        this.state.saturdayEvents=[];
        this.state.sundayEvents=[];
        for (let index = 0; index < data.length; index++) {
            const event = data[index];
            if (event.day == 0) {
                this.state.mondayEvents.push(event);
            }
            else if (event.day == 1) {
                this.state.tuesdayEvents.push(event);
            }
            else if (event.day == 2) {
                this.state.wednesdayEvents.push(event);
            }
            else if (event.day == 3) {
                this.state.thursdayEvents.push(event);
            }
            else if (event.day == 4) {
                this.state.fridayEvents.push(event);
            }
            else if (event.day == 5) {
                this.state.saturdayEvents.push(event);
            }
            else if (event.day == 6) {
                this.state.sundayEvents.push(event);
            }
        }
        this.setState({
            mondayEvents:this.state.mondayEvents,
            tuesdayEvents:this.state.tuesdayEvents,
            wednesdayEvents:this.state.wednesdayEvents,
            thursdayEvents:this.state.thursdayEvents,
            fridayEvents:this.state.fridayEvents,
            saturdayEvents:this.state.saturdayEvents,
            sundayEvents:this.state.sundayEvents
        });
    }

    changeConDevice(update, e) {
        const deviceName = e.target.value.split("-")[1];
        let stateName = "currentDeviceControlls";
        let name = "power";
        let powerOn = "powerOn";
        let powerOff = "powerOff";
        if(update) {
            name += "Update";
            powerOn += "Update";
            powerOff += "Update";
            stateName += "Update"
        }
        if (deviceName === "gatewaySiren") {
            this.setState({[stateName]:
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
                    <input class="powerOnRadio" type="radio" id={powerOn} name={name} value="255"/>
                    <label class="powerOnLabel power" for={powerOn}>on</label>
                    <div class="vl"></div>
                    <input class="powerOffRadio" type="radio" id={powerOff} name={name} value="0" required/>
                    <label class="powerOffLabel power" for={powerOff}>off</label>
                </div>
            });
        }
        else if (["EnergyPlug", "SWITCH_ALL"].includes(deviceName)) {
            this.setState({[stateName]:
                <div class="controls">
                    <input class="powerOnRadio" type="radio" id={powerOn} name={name} value="255"/>
                    <label class="powerOnLabel power" for={powerOn}>on</label>
                    <div class="vl"></div>
                    <input class="powerOffRadio" type="radio" id={powerOff} name={name} value="0" required/>
                    <label class="powerOffLabel power" for={powerOff}>off</label>
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
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch("http://" +  window.location.hostname +":3000/api/schedule/create/", {method:"POST", body:JSON.stringify(sEvent), headers: myHeaders})
            .then(res => {
                if(res.ok) {
                    this.getSchedules();
                    console.log(res);
                    alert("Event added");
                }
            });
    }

    createEventElement(eventInfo) {
        const hours = eventInfo.time.split(":")[0];
        const min = eventInfo.time.split(":")[1];
        let smallTop = (((min/60)*100)/24);
        let top = (((hours/24)*100)+smallTop)+"%";
        const style = {
            "top": top, 
            "width": "100%", 
            "height": "0.25rem", 
            "background-color": "red",
            "cursor": "pointer",
            "position": "absolute"
        };
    return <div id={eventInfo._id} style={style} onClick={this.showEditEvent.bind(this, eventInfo._id, eventInfo.title, eventInfo.time, eventInfo.deviceID, eventInfo.day)} class="eventDiv"><div class="tooltip"><span class="tooltiptext">{eventInfo.time}<br/>{eventInfo.title}</span></div></div>
    }

    editEvent(e) {
        const form = document.getElementById("editEventBox");
        const valid = form.reportValidity();
        if (valid) {
            const selectedDevice = document.getElementById("controllableDevicesUpdate");
            const deviceName = selectedDevice.value.split("-")[1];
            const deviceID = selectedDevice.value.split("-")[0];
            const radios = form.elements["powerUpdate"];
            let val;
            const event = {};
            event._id = e.target.id;
            event.title = document.getElementById("eventTitleUpdate").value;
            event.day = document.getElementById("eventDayUpdate").value;
            event.deviceID = deviceID;
            event.time = document.getElementById("eventTimeUpdate").value;
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
            this.sendEventUpdate(event);
        }
    }

    sendEventUpdate(sEvent) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        fetch("http://" +  window.location.hostname +":3000/api/schedule/edit/", {method:"POST", body:JSON.stringify(sEvent), headers: myHeaders})
            .then(res => {
                if(res.ok) {
                    this.getSchedules();
                    alert("Event Updated");
                }
            });
    }

    async showEditEvent(eventID, eventTitle, eventTime, eventDeviceID, eventDay) {
        await this.getDevicesInfo();
        const eventBox = document.getElementById("editEventBox");
        const titleInput = document.getElementById("eventTitleUpdate");
        const timeInput = document.getElementById("eventTimeUpdate");
        const deviceSelect = document.getElementById("controllableDevicesUpdate");
        const daySelect = document.getElementById("eventDayUpdate");
        titleInput.value = eventTitle;
        timeInput.value = eventTime;
        this.setState({eventID:eventID});
        daySelect.selectedIndex = eventDay;
        for (let index = 0; index < deviceSelect.options.length; index++) {
            const option = deviceSelect.options[index];
            if (option.value.split("-")[0] == eventDeviceID) {
                deviceSelect.selectedIndex = index;
                break;
            }
        }
        var ev2 = new Event('change', { bubbles: true});
        deviceSelect.dispatchEvent(ev2);
        document.getElementById("editEventScreen").classList.remove("invisible");
    }

    hideEditEvent() {
        document.getElementById("editEventScreen").classList.add("invisible");
    }

    render() { 
        let rConDeviceList = this.state.controllableDevices.map(function(device, index) { 
            return <option value={this.state.controllableDevices[index]._id + "-" + this.state.controllableDevices[index].name}>{this.state.controllableDevices[index].name}</option>
        }, this);

        let eMonday = this.state.mondayEvents.map(function(event) { return this.createEventElement(event)}, this);
        let eTuesday = this.state.tuesdayEvents.map(function(event) { return this.createEventElement(event)}, this);
        let eWednesday = this.state.wednesdayEvents.map(function(event) { return this.createEventElement(event)}, this);
        let eThursday = this.state.thursdayEvents.map(function(event) { return this.createEventElement(event)}, this);
        let eFriday = this.state.fridayEvents.map(function(event) { return this.createEventElement(event)}, this);
        let eSaturday = this.state.saturdayEvents.map(function(event) { return this.createEventElement(event)}, this);
        let eSunday = this.state.sundayEvents.map(function(event) { return this.createEventElement(event)}, this);

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
                    <tr id="daysOfWeekHeaders" class="columnBorder">
                        <th class="noDay"></th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                        <th>Saturday</th>
                        <th>Sunday</th>
                    </tr>
                    <tr id="dayColumns" class="columnBorder">
                        <td class="noDay">00</td>
                        <td rowspan="24">{eMonday}</td>
                        <td rowspan="24">{eTuesday}</td>
                        <td rowspan="24">{eWednesday}</td>
                        <td rowspan="24">{eThursday}</td>
                        <td rowspan="24">{eFriday}</td>
                        <td rowspan="24">{eSaturday}</td>
                        <td rowspan="24">{eSunday}</td>
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
                    </tbody>
                </table>
                <div id="editEventScreen" class="invisible pos-fix right left top bottom dis-flx">
                    <form id="editEventBox" class="" onSubmit={this.preventSubmit.bind(this)}>
                        <div id="scheduleDetails">
                            <input type="text" id="eventTitleUpdate" placeholder="Title..." required/>
                            <br/><br/>
                            <select id='controllableDevicesUpdate' onChange={this.changeConDevice.bind(this,true)}>
                                {rConDeviceList}
                            </select>
                            <br/><br/>
                            {this.state.currentDeviceControllsUpdate}
                            <br/><br/>
                            <select id='eventDayUpdate' required>
                                <option value='0'>Monday</option>
                                <option value='1'>Tuesday</option>
                                <option value='2'>Wednesday</option>
                                <option value='3'>Thursday</option>
                                <option value='4'>Friday</option>
                                <option value='5'>Saturday</option>
                                <option value='6'>Sunday</option>
                            </select>
                            <br/><br/>
                            <input id="eventTimeUpdate" type="time" placeholder="12:00" required></input>
                            <br/><br/>
                            <div class="controls">
                                <button class="powerOn power" type="submit" id={this.state.eventID} onClick={this.editEvent.bind(this)}>Update</button>
                                <div class="vl"></div>
                                <button class="powerOff power" onClick={this.hideEditEvent.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
                <div id="addEventScreen" class="invisible pos-fix right left top bottom dis-flx">
                    <form id="addEventBox" class="" onSubmit={this.preventSubmit.bind(this)}>
                        <div id="scheduleDetails">
                            <input type="text" id="eventTitle" placeholder="Title..." required/>
                            <br/><br/>
                            <select id='controllableDevices' onChange={this.changeConDevice.bind(this, false)}>
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
                            <br/><br/>
                            <input id="eventTime" type="time" placeholder="12:00" required></input>
                            <br/><br/>
                            <div class="controls">
                                <button class="powerOn power" type="submit" onClick={this.addEvent.bind(this)}>AddEvent</button>
                                <div class="vl"></div>
                                <button class="powerOff power" onClick={this.hideAddEvent.bind(this)}>Cancel</button>
                            </div>
                        </div>
                    </form>
                </div>
                <button id="AddEvent" onClick={this.showAddEvent.bind(this)}><img class="largeIcon roundButton positiveIcon" src="images/generalIcons/add.svg"></img></button>
            </section>
         );
    }
}
 
export default Schedule;