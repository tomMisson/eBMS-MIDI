import React, { Component } from 'react';

class Alerts extends Component {

    componentDidMount() {
        this.changeActiveNav();
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

    render() { 
        return ( 
            <div className="alert-container">
                <span className="notifications">NO NEW NOTIFICATIONS</span>
            </div>
         );
    }
}
 
export default Alerts;