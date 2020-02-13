import React, { Component } from 'react';

class Rooms extends Component {
    state = {  }

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
        <h1>Rooms</h1>
        
        );
    }
}
 
export default Rooms;