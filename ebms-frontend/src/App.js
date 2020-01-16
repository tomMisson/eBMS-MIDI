import React, { Component } from 'react';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './App.css';
import RegisterBox from './Components/login';



class App extends Component {
    
    state = {
      signedIn: true,
    }

    render() { 
        return ( 
          <BrowserRouter>
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
                  <li><Link to="/"><i class="fas fa-home"><span class="tooltiptext">Home</span></i></Link></li>
                  <li><Link to="/devices"><i class="fas fa-tablet-alt"><span class="tooltiptext">Devices</span></i></Link></li>
                  <li><Link to="/views"><i class="fas fa-eye"><span class="tooltiptext">Views</span></i></Link></li>
                  <li><Link to="location"><i class="fas fa-map-marker-alt"><span class="tooltiptext">Location</span></i></Link></li>
                  <li><Link to="/shedule"><i class="far fa-calendar-alt"><span class="tooltiptext">Schedule</span></i></Link></li>
                  <li><Link to="/alerts"><i class="fas fa-exclamation-triangle"><span class="tooltiptext">Alerts</span></i></Link></li>
                  <li><Link to="/settings"><i class="fas fa-cog"><span class="tooltiptext">Settings</span></i></Link></li>
                </ul>
              </nav>
            </aside>
            <main>
              <Switch>
                <Route path="/">
                  {
                    () => {
                      if(this.state.signedIn) {
                        var comp = null;
                      }
                      else{
                        var comp = <RegisterBox></RegisterBox>
                      }
                    }
                  }
                </Route>
                <Route path="/devices">
                  
                </Route>
                <Route path="/views ">
                  
                </Route>
                <Route path="/location">
                  
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
