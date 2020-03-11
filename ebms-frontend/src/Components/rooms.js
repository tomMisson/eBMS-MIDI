import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Rooms extends Component {
    state = { rooms: [
        {   
            "id": 0,
            "name": "Demo",
            "devices": [{"name": "test1"},{"name": "test2"}]
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
                        <br></br>
                        {
                        room.devices.map((device) => 
                            <Link to="/devices" className="deviceName">{device.name}</Link>
                        )}
                    </section>
                )}
            </main>
        
        );
    }
}
 
export default Rooms;