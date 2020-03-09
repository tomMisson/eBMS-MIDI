import React, { Component } from 'react';
import Gateway from './devices/gateway';
import MeterSwitch from './devices/meterSwitch';

class Devices extends Component {
    state = {  }

    componentDidMount() {
        const {show} = this.state;
        this.setState({show:!show});

        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/devices") {
                link.classList.add("navLinkActive");
            }
        });
    }

    render() { 
        return ( 
            <section id="devices">
                
                {this.state.show && <Gateway/>}
                {this.state.show && <MeterSwitch/>}
                <button id="AddDevice"><img class="positiveIcon" src="images/generalIcons/add.svg"></img></button>
            </section>
        
        );
    }
}
 
export default Devices;