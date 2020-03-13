import React, { Component } from 'react';

class Gateway extends Component {
    state = { 
        num:this.props.rand
     }


    toggleSiren() {

    }
    
    componentWillUpdate(nextProps, nextState) {
        if (nextProps.rand !== this.props.rand) {
            this.prepareRender();
        }
    }

    render() {
        return ( 

            <div class="device contain clearfix" id={this.props.deviceInfo._id}>
                <section class="deviceHeader dis-flx">
                    <img alt="siren" class="smallIcon neutralIcon" src="images/deviceIcons/bullhorn.svg" ></img>
                    <h3 class="deviceTitle">Gateway Siren</h3>
                </section>
                <section class="deviceContent">
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
                        
                    <div class="controls">
                        <button class="powerOn power">On</button>
                        <div class="vl"></div>
                        <button class="powerOff power">Off</button>
                    </div>
                    </div>
                </section>
                <section class="deviceFooter dis-flx">
                    <h5>Status: ...</h5>
                    <div></div>
                </section>
            </div>
        
        );
    }
}
 
export default Gateway;
