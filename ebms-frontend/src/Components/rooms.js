import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Rooms extends Component {
    state = { rooms: [
<<<<<<< HEAD
        {   
            "id": 0,
            "name": "Demo",
            "devices": [{"name": "test1"},{"name": "test2"}]
=======
        {"name": "demo",
        "devices": [{"name":"test1"}, {"name":"test2"}]
>>>>>>> ee087fb0ad1d690ead3a5c7c8b05fc3c3d822eac
        }
    ] }

    componentDidMount() {
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

    render() {
        return ( 
        
            <main>
                {
                this.state.rooms.map( (room) => 
                    <section key={room.id} className="room">
                        <h2>{room.name}</h2>
<<<<<<< HEAD
                        <br></br>
                        {
                        room.devices.map((device) => 
                            <Link to="/devices" className="deviceName">{device.name}</Link>
                        )}
=======
                        {
                            room.devices.map((device) =>
                            <Link to="devices">{device.name}</Link>
                        )}   
>>>>>>> ee087fb0ad1d690ead3a5c7c8b05fc3c3d822eac
                    </section>
                )}
            </main>
        
        );
    }
}
 
export default Rooms;
