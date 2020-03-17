import React, { Component } from 'react';

class Alerts extends Component {
    state = {
        deviceAlerts:[]
    }

    componentDidMount() {
        this.changeActiveNav();
        this.getAlerts();
        this.intervalID = setInterval(
            () => this.getAlerts(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.intervalID);
    } 

    changeActiveNav() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/alerts") {
                link.classList.add("navLinkActive");
            }
        });
    }

    async getAlerts() {
        const response = await fetch("http://" +  window.location.hostname +":3000/api/alerts");
        const data = await response.json();
        this.state.deviceAlerts=[];
        for (let index = 0; index < data.length; index++) {
            const device = data[index];
            this.state.deviceAlerts.push(device);
        }
        this.setState({deviceAlerts:this.state.deviceAlerts});
    }

    createAlertElement(device) {
        let tamperTimes = device.tamperTimes.map(time => {
            return <h4 class="deviceStatus">Tamper Alert: {time}</h4>
        });
        
        return (
            <div class="device">
                <section class="deviceHeader dis-flx">
                    <h3 class="deviceTitle">{device.name} ({device._id})</h3>
                </section>
                <section class="deviceContent">
                    {tamperTimes}
                </section>
            </div>
        )
    }

    render() { 

        const rDeviceAlerts = this.state.deviceAlerts.map(function (device) { return this.createAlertElement(device) }, this);

        return ( 
            <section id="alerts">
                {rDeviceAlerts}
            </section>
         );
    }
}
 
export default Alerts;