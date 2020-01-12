import React, { Component } from 'react';
import './App.css';


class App extends Component {
    
    render() { 
        return ( 
          <React.Fragment>
            <header>
              <div class="bar">
                <img id="menu" src="images/menu.svg" alt="menu"></img>
                <b id="title">eBMS/MIDI Interface</b>
                <img id="logo" src="images/tyrrell-products-logo.png" alt="logo"></img>
              </div>
            </header>
            <aside>
              <nav>
                <ul>
                  <li><a href="#"><i class="fas fa-home"><span class="tooltiptext">Home</span></i></a></li>
                  <li><a href="#"><i class="fas fa-tablet-alt"><span class="tooltiptext">Devices</span></i></a></li>
                  <li><a href="#"><i class="fas fa-eye"><span class="tooltiptext">Views</span></i></a></li>
                  <li><a href="#"><i class="fas fa-map-marker-alt"><span class="tooltiptext">Location</span></i></a></li>
                  <li><a href="#"><i class="far fa-calendar-alt"><span class="tooltiptext">Schedule</span></i></a></li>
                  <li><a href="#"><i class="fas fa-exclamation-triangle"><span class="tooltiptext">Alerts</span></i></a></li>
                  <li><a href="#"><i class="fas fa-cog"><span class="tooltiptext">Settings</span></i></a></li>
                </ul>
              </nav>
            </aside>
            <main>
              
            </main>
          </React.Fragment>
          );
    }
}
 
export default App;
