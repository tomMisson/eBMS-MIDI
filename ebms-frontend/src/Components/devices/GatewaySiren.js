import React, { Component } from 'react';

class Gateway extends Component {
    state = { 
        
    }


    sirenOn() {
        const sirenSound = document.getElementById("sirenSound").value;
        fetch("http://" +  window.location.hostname +":3000/api/control/0/syssound/" + sirenSound);
    }

    sirenOff() {
        fetch("http://" +  window.location.hostname +":3000/api/control/0/syssound/0");
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
                    <div class="controls">
                    <select id='sirenSound' name='gatewaySiren'>
                        <option value='1'>Siren: 1</option>
                        <option value='2'>Siren: 2</option>
                        <option value='3'>Siren: 3</option>
                        <option value='4'>Siren: 4</option>
                        <option value='5'>Siren: 5</option>
                        <option value='6'>Siren: 6</option>
                    </select>
                        <br/>
                        <hr size="80%"/>
                        <button class="powerOn power" onClick={this.sirenOn.bind(this)}>On</button>
                        <div class="vl"></div>
                        <button class="powerOff power" onClick={this.sirenOff.bind(this)}>Off</button>
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
