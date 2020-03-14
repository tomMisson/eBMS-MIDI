import React, { Component } from 'react';
import { Link } from "react-router-dom";
import update from 'immutability-helper';
import load from './loading.gif';
import {Modal,Button} from 'react-bootstrap';
import $ from "jquery";

class Rooms extends Component {
    state = { 
        rooms:[],
        devices:[],
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
                if(devData.length>0){room.devices[index].name = devData[index].channels[index].name}
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

    async getDevices()
    {
        const devResponse = await fetch("http://" +  window.location.hostname +":3000/api/devices/");
        await devResponse.json().then((data) => this.setState({devices:data}))
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
        
        if(rRooms.length != 0)
        {
            this.getDevices()
            return ( 
                <section id="devices">
                    {rRooms}
                    <button id="AddRoom"><AddRoom devicesData={this.state.devices} rooms={this.state.rooms}/></button>
                </section>
            )
        }
        else{
            return(
                <section>
                    <img alt="loading" src={load}></img>
                </section>
            )
        }
    }
}
 
export default Rooms;

class AddRoom extends React.Component {
    constructor(props, context) {
      super(props, context);
  
      this.handleShow = this.handleShow.bind(this);
      this.handleClose = this.handleClose.bind(this);
  
      this.state = {
        show: false,
       
      };
    }
  
    handleClose() {
      this.setState({ show: false });
    }
  
    handleShow() {
      this.setState({ show: true });
    }

    async devicesList(){
        let response = await fetch("http://" +  window.location.hostname +":3000/api/devices");
        let data = await response.json();
        console.log(data);
        return data;
    }

    saveRoom(){
        
    }
  
    render() {
  
      return (
        <div>
  
          <Button style={{backgroundColor:"#fff", border:"none", outline:"none"}} onClick={this.handleShow}>
          <img class="largeIcon roundButton positiveIcon" src="images/generalIcons/add.svg"></img>
          </Button>
  
          <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add new room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form>
                <label for="exampleInputEmail1">Room name</label>
                <input type="text" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Name"/>
                <small id="emailHelp" class="form-text text-muted">Group your devices under one name</small>
                <br/>
                <div>
                {
                    this.props.devicesData.map((device) =>
                        <div key={device._id}>
                            <input name={device._id} type="checkbox"/>
                            <label for={device._id}>{device.channels[0].name}</label>
                        </div>
                    )
                }
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.saveRoom()}>Add</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    }
  }