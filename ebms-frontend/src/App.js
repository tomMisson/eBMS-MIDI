import React, { Component } from 'react';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './App.css';
import RegisterBox from './Components/login';
import Devices from './Components/device';
import Lighting from './Components/lighting';


class App extends Component {
    
    state = {
      signedIn: true,
    }

    render() { 
        return ( 
          <BrowserRouter>
            <header>
              <div className="bar">
                <img id="menu" src="images/menu.svg" alt="menu"></img>
                <img id="logo" src="images/tyrrell-products-logo.png" alt="logo"></img>
              </div>
            </header>
            <aside>
              <nav>
                <ul>
                  <li><Link to="/"><i className="fas fa-home"><span className="tooltiptext">Home</span></i></Link></li>
                  <li><Link to="/devices"><i className="fas fa-tablet-alt"><span className="tooltiptext">Devices</span></i></Link></li>
                  <li><Link to="/views"><i className="fas fa-eye"><span className="tooltiptext">Views</span></i></Link></li>
                  <li><Link to="rooms"><i className="fas fa-map-marker-alt"><span className="tooltiptext">Rooms</span></i></Link></li>
                  <li><Link to="/shedule"><i className="far fa-calendar-alt"><span className="tooltiptext">Schedule</span></i></Link></li>
                  <li><Link to="/alerts"><i className="fas fa-exclamation-triangle"><span className="tooltiptext">Alerts</span></i></Link></li>
                  <li><Link to="/settings"><i className="fas fa-cog"><span className="tooltiptext">Settings</span></i></Link></li>
                </ul>
              </nav>
            </aside>
            <main>
              <Switch>
                <Route exact path="/" component={RegisterBox}>
                  <RegisterBox></RegisterBox>
                </Route>
                <Route path="/devices">
                  <Devices></Devices>
                  <Lighting></Lighting>
                </Route>
                <Route path="/views ">
                  
                </Route>
                <Route path="/rooms">
                  
                </Route>
                <Route path="/shedule">
                  
                </Route>
                <Route path="/alerts">
                  
                </Route>
                <Route path="/settings">
                  
                </Route>            
              </Switch>
            </main>
          </BrowserRouter>
          );
    }
}
 
export default App;
