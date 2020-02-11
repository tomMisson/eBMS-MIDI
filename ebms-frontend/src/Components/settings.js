import React, { Component } from 'react';

class Settings extends Component {
    state = {  }

    componentDidMount() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/settings") {
                link.classList.add("navLinkActive");
            }
        });
    }

    render() {
        return ( 
        <h1>Settings</h1>
        
        );
    }
}
 
export default Settings;