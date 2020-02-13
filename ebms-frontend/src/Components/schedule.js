import React, { Component } from 'react';

class Schedule extends Component {
    state = {  }

    componentDidMount() {
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

    render() {
        return ( 
        <h1>Schedule</h1>
        
        );
    }
}
 
export default Schedule;