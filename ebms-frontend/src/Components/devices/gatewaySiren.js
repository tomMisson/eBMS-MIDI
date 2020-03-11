import React, { Component } from 'react';

class Gateway extends Component {
    state = { 
        num:this.props.rand
     }


    toggleSiren() {

    }

    componentDidMount() {
        if (this.props.rand != null) {
            this.prepareRender();
        }
    }
    
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.rand !== this.props.rand) {
            this.prepareRender();
        }
    }
    
    prepareRender() {
        //simplified
        this.setState({
            num:this.props.rand
        });
    }

    render() {
        return ( 
        
            <div class="device gatewaySiren contain clearfix">
                <section class="deviceLeft">
                    <img alt="siren" class="largeIcon neutralIcon" src="images/deviceIcons/bullhorn.svg" ></img>
                </section>
                
                <section class="deviceRight">
                    <img alt="remove icon" class="largeIcon dangerIcon" src="images/generalIcons/remove.svg"></img>
                </section>

                <section class="deviceBody">
                    
                <h3 class="deviceTitle inline">Gateway {this.state.num} Siren {this.props.rand}</h3>
                    <div id="gatewaySiren_Controls">
                        <select id='sirenSound' name='gatewaySiren'>
                            <option value='1'>Siren: 1</option>
                            <option value='2'>Siren: 2</option>
                            <option value='3'>Siren: 3</option>
                            <option value='4'>Siren: 4</option>
                            <option value='5'>Siren: 5</option>
                            <option value='6'>Siren: 6</option>
                            <option value='7'>Siren: 7</option>
                        </select>
                        
                    <label class="switch">
                        <input type="checkbox"/>
                        <span class="slider round"></span>
                    </label>
                    </div>
                    <div id="gatewaySiren_Status">
                        <h4 class="deviceStatus inline">Status: </h4>
                    </div>
                </section>
            </div>
        
        );
    }
}
 
export default Gateway;