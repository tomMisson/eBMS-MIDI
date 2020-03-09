import React, { Component } from 'react';

class Gateway extends Component {
    state = {  }

    render() {
        return ( 
        
            <div class="device gatewaySiren contain clearfix">
                <section class="deviceLeft">
                    <img class="largeIcon neutralIcon" src="images/deviceIcons/bullhorn.svg" ></img>
                </section>
                
                <section class="deviceRight">
                    <img class="largeIcon dangerIcon" src="images/generalIcons/remove.svg"></img>
                </section>

                <section class="deviceBody">
                    <h3 class="deviceTitle inline">Gateway Siren</h3>
                    <div id="gatewaySiren_Controls">
                        <select id='' name='gatewaySiren'>
                            <option value='1'>1</option>
                            <option value='2'>2</option>
                            <option value='3'>3</option>
                            <option value='4'>4</option>
                            <option value='5'>5</option>
                            <option value='6'>6</option>
                            <option value='7'>7</option>
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