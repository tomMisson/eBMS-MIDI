import React, { Component } from 'react';

class Views extends Component {
    state = {  }

    componentDidMount() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/views") {
                link.classList.add("navLinkActive");
            }
        });
    }

    render() {
        return ( 
        <h1>Views</h1>
        
        );
    }
}
 
export default Views;