import React, { Component } from 'react';
import { Link } from "react-router-dom";
import update from 'immutability-helper';

class Rooms extends Component {
    state = { 
        rooms:[]
    }

    changeActiveNav() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/rooms") {
                link.classList.add("navLinkActive");
            }
        });
    }

    componentWillUnmount() {

        clearInterval(this.intervalID);

        console.log("Rooms Unmounted");
    } 

    async getRoomsInfo() {
        const response = await fetch("http://" +  window.location.hostname +":3000/api/rooms");
        const data = await response.json();
        for (let index = 0; index < data.length; index++) {
            let room = data[index];
            
            for (let index = 0; index < room.devices.length; index++) {
                const device = room.devices[index];
                const devResponse = await fetch("http://" +  window.location.hostname +":3000/api/devices/" + device.devID);
                const devData = await devResponse.json();
                room.devices[index].name = await devData[0].channels[0].name
            }

            let roomExists = false;
            let roomIndex = 0;
            this.state.rooms.map(function(currentRoom, currentIndex) {
                if (currentRoom._id === room._id) {
                    roomExists = true;
                    roomIndex = currentIndex;
                }
            });
            if (roomExists) {
                this.setState({
                    rooms: update(this.state.rooms, {[roomIndex] :{$set:room}})
                });
            }
            else {
                this.state.rooms.push(room);
            }
        }
    }

    componentDidMount() {
        this.intervalID = setInterval(
            () => this.getRoomsInfo(),
            1000
        );
        
        this.changeActiveNav();
    }

    getRoomsDevices(devices, roomIndex) {
        devices.map(function(device, index) {
            return (
                <h4 class="deviceStatus">Name: {this.state.rooms[roomIndex].devices[index].devID}, UID: {this.state.rooms[roomIndex].devices[index].devID}</h4>
            );
        }, this);
    }


    render() { 
        const rRooms = this.state.rooms.map(function(room, index) { 
            return (
                <div class="device" key={this.state.rooms[index]._id} id={this.state.rooms[index]._id}>
                <section class="deviceHeader dis-flx">
                    <img alt="flood icon" class="smallIcon neutralIcon" src="images/deviceIcons/home-flood.svg" ></img>
                    <h3 class="deviceTitle">{this.state.rooms[index]._id}</h3>
                </section>
                <Link to="/devices"><section class="deviceContent">
                    <h4 class="deviceStatus">Devices:</h4>
                    <div>{
                        this.state.rooms[index].devices.map(function(device, devIndex) {
                            return (
                                <h4 class="deviceStatus">Name: {this.state.rooms[index].devices[devIndex].name}, UID: {this.state.rooms[index].devices[devIndex].devID}</h4>
                            );
                        }, this)
                        }</div>
                </section></Link>
                <section class="deviceFooter dis-flx">
                    <button onClick=""><img class="smallIcon roundButton positiveIcon" src="images/generalIcons/add.svg"></img></button>
                    <img class="smallIcon roundButton dangerIcon" src="images/generalIcons/remove.svg"></img>
                </section>
            </div>
            )
         }, this);
        
        return ( 
            <section id="devices">
                {rRooms}
                
                <button id="AddRoom" onClick=""><img class="largeIcon roundButton positiveIcon" src="images/generalIcons/add.svg"></img></button>
            </section>
        );
    }
}
 
export default Rooms;
