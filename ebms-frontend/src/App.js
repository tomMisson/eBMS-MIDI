import React, { Component } from 'react';
import { BrowserRouter, Route, Link } from "react-router-dom";
import RegisterBox from './Components/login';
import Devices from './Components/device';
import Home from './Components/home';
// import Views from './Components/views';
import Rooms from './Components/rooms';
import Schedule from './Components/schedule';
import Alerts from './Components/alerts';
import Settings from './Components/settings';



class App extends Component {
    
    state = {
      signedIn: true,
    }

    toggleNavigation(e) {
      const navBar = document.getElementById("menu");
      const menuButton = document.getElementById("menuButton");
      const navTitles = navBar.firstChild.childNodes;
      const main = document.getElementsByTagName("MAIN")[0];
      const block = document.getElementById("block");

        if (navBar.classList.contains("expanded")) {
          block.removeAttribute("class");
          navBar.removeAttribute("class");
          navBar.classList.add("closed");
          main.removeAttribute("class");
          main.classList.add("pad-main-2");
          menuButton.src = "images/navIcons/menu.svg"
        }
        else {
          block.classList.add("block");
          navBar.removeAttribute("class");
          navBar.classList.add("expanded");
          main.removeAttribute("class");
          main.classList.add("pad-main-1");
          menuButton.src = "images/navIcons/close.svg"
        }
    }

    render() {

        return ( 
          <BrowserRouter>
            <header>
              <section id = "headerLeft">
                <img id="menuButton" onClick={this.toggleNavigation.bind(this)} src="images/navIcons/menu.svg" alt="menu"></img>
                <img id="logo" src="images/tyrrell-products-logo.png" alt="logo"></img>
              </section>
              
              <section id = "headerRight">
                <Link to="/account"><img id="navAccountIcon" src="images/account_circle.svg" alt="Account"></img><h4>Account</h4></Link>
              </section>
              <h1 id="title">eBMS/MIDI Interface</h1>
            </header>
            <nav id="menu" class="closed">
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
            <div id="block" class="" onClick={this.toggleNavigation.bind(this)}></div>
            <main class="pad-main-2">
              <Route exact path="/" component={Home}/>
              <Route exact path="/home" component={Home}/>
              <Route path="/devices" component={Devices}/>
              {/* <Route path="/views" component={Views}/> */}
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