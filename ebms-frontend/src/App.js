import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import './App.css';
import RegisterBox from './Components/login';
import Devices from './Components/device';
import Home from './Components/home';
import Views from './Components/views';
import Rooms from './Components/rooms';
import Schedule from './Components/schedule';
import Alerts from './Components/alerts';
import Settings from './Components/settings';



class App extends Component {
    
    state = {
      signedIn: true,
    }

    render() { 
      function toggleNavigation(e) {
        let navBar = document.getElementById("menu");
        let sideSpacer = document.getElementById("sideSpacer");
        let menuButton = document.getElementById("menuButton");
        let navTitles = navBar.firstChild.childNodes;

        if (navBar.style.width === "15em") {
          sideSpacer.style.maxWidth = "";
          navBar.style.width = "4.5em";
          sideSpacer.style.width = "4.5em"
          navTitles.forEach(element => {
            element.childNodes[0].childNodes[1].style.display = "";
            /*element.childNodes[0].childNodes[1].style.visibility = "hidden";
            
            element.childNodes[0].childNodes[1].style.height = "0";
            
            element.childNodes[0].childNodes[1].style.width = "0";*/
          });
          menuButton.src = "images/navIcons/menu.svg"
        }
        else {
          sideSpacer.style.maxWidth = "100vw";
          navBar.style.width = "15em";
          sideSpacer.style.width = "15em";
          
          navTitles.forEach(element => {
            element.childNodes[0].childNodes[1].style.display = "inline";
            /*element.childNodes[0].childNodes[1].style.visibility = "";
            
            element.childNodes[0].childNodes[1].style.height = "";
            
            element.childNodes[0].childNodes[1].style.width = "";*/
          });
          menuButton.src = "images/navIcons/close.svg"
        }
      }

        return ( 
          <BrowserRouter>
            <header>
              <section id = "headerLeft">
                <img id="menuButton" onClick={toggleNavigation} src="images/navIcons/menu.svg" alt="menu"></img>
                <img id="logo" src="images/tyrrell-products-logo.png" alt="logo"></img>
              </section>
              
              <section id = "headerRight">
                <Link to="/account"><img id="navAccountIcon" src="images/account_circle.svg" alt="Account"></img><h4>Account</h4></Link>
              </section>
              <h1 id="title">eBMS/MIDI Interface</h1>
            </header>
            <div id="topSpacer"></div>
            <aside id="sideSpacer"></aside>
            <nav id="menu">
                <ul id="menuOptions">
                  <li><Link to="/home"><img id="navHomeIcon" src="images/navIcons/home.svg" alt="Home"></img><h4>Home</h4></Link></li>
                  <li><Link to="/devices"><img id="navDevicesIcon" src="images/navIcons/devices.svg" alt="Devices"></img><h4>Devices</h4></Link></li>
                  {/* <li><Link to="/views"><img id="navViewsIcon" src="images/navIcons/menu.svg" alt="Views"></img><h4>Views</h4></Link></li> */}
                  <li><Link to="rooms"><img id="navRoomsIcon" src="images/navIcons/room.svg" alt="Rooms"></img><h4>Groups</h4></Link></li>
                  <li><Link to="/schedule"><img id="navScheduleIcon" src="images/navIcons/event.svg" alt="Schedule"></img><h4>Schedule</h4></Link></li>
                  <li><Link to="/alerts"><img id="navAlertIcon" src="images/navIcons/warning.svg" alt="Alerts"></img><h4>Alerts</h4></Link></li>
                  <li><Link to="/settings"><img id="navSettingsIcon" src="images/navIcons/settings.svg" alt="Settings"></img><h4>Settings</h4></Link></li>
                </ul>
              </nav>
            
            <main>
              <Route exact path="/" component={Home}/>
              <Route exact path="/home" component={Home}/>
              <Route path="/devices" component={Devices}/>
              <Route path="/views" component={Views}/>
              <Route path="/rooms" component={Rooms}/>
              <Route path="/schedule" component={Schedule}/>
              <Route path="/alerts" component={Alerts}/>
              <Route path="/settings" component={Settings}/>
              <Route path="/account" component={RegisterBox}/>
            </main>
            <footer></footer>
          </BrowserRouter>
          );
    }
}
 
export default App;
