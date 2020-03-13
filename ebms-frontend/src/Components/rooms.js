import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Rooms extends Component {
    state = { rooms: [
        {"name": "demo",
        "devices": [{"name":"test1"}, {"name":"test2"}]
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
                    <section>
                        <h2>{room.name}</h2>
                        {
                            room.devices.map((device) =>
                            <Link to="devices">{device.name}</Link>
                        )}   
                    </section>
                )}
            </main>
        
        );
    }
}
 
export default Rooms;
