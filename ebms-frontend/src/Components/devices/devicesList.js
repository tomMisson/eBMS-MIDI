import React from 'react';
import Gateway from './gatewaySiren';
import MeterSwitch from './energyPlug';
import FloodMultiSensor from './FloodMulti-Sensor';
import MasterSwitch from './SWITCH_ALL';


export const gatewaySiren = () => {
  return(Gateway)
};
export const meterSwitch = () => {
  return( MeterSwitch)
};
export const floodMultiSensor = () => {
  return( FloodMultiSensor)
};
export const masterSwitch = () => {
  return( MasterSwitch)
};