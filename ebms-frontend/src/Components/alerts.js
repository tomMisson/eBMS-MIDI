import React, { Component } from 'react';
import './alerts.css';

class Alerts extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
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