import React, { Component } from 'react';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom';
import './App.css';
import Devices from './Components/device';
import Schedule from './Components/schedule';
import Alerts from './Components/alerts';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
    this.toggleAlerts = this.toggleAlerts.bind(this);
}

toggleAlerts = () => {
    const {show} = this.state;
    this.setState({show:!show});
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
                  
                  <li><Link to="/devices"><i className="fas fa-tablet-alt"><span className="tooltiptext">Devices</span></i></Link></li>
                 
                  <li><Link to="rooms"><i className="fas fa-map-marker-alt"><span className="tooltiptext">Rooms</span></i></Link></li>
                  <li><Link to="/shedule"><i className="far fa-calendar-alt"><span className="tooltiptext">Schedule</span></i></Link></li>
                  <li><i onClick={this.toggleAlerts} className="fas fa-exclamation-triangle"><span className="tooltiptext">Alerts</span></i></li>
                  
                </ul>
              </nav>
            </aside>
            <main>
            {this.state.show && <Alerts/>}
              <Switch>
                
                <Route path="/devices">
                  <Devices></Devices>
                  
                </Route>
                
                <Route path="/rooms">
                  
                </Route>
                <Route path="/shedule">
                  <Schedule></Schedule>
                </Route>
                
              </Switch>
            </main>
          </BrowserRouter>
          );
    }
}
 
export default App;
