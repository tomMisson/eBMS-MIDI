import React, { Component } from 'react';

class Home extends Component {
    state = {  }

    componentDidMount() {
        let pageLinks = document.getElementById("menuOptions").childNodes;

        pageLinks.forEach(element => {
            const link = element.firstChild;
            link.classList.remove("navLinkActive");
            link.classList.add("navLinkInactive");
            if(link.href === window.location.origin + "/home") {
                link.classList.add("navLinkActive");
            }
        });
    }

    render() {
        return ( 
        <h1>Home</h1>
        
        );
    }
}
 
export default Home;