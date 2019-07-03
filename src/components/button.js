import React from 'react';
import { IconContext } from "react-icons";

const buttonStyle = {
  position: 'absolute',
  zIndex: 100,
  right: 0,
  width: '36px',
  height: '36px',
  backgroundColor: '#6A7485',
  color: '#FFFFFF',
  cursor: 'pointer',
  border: 0,
  fontSize: '13px',
  margin:'14px 12px 0px 0px',
  align: 'center',
  alingItem: 'center',
  borderRadius: '18px',
};

const Button = ({onClick, children}) => (
  <IconContext.Provider value={{ color: "white", size: 18}}>
    <button style={buttonStyle} onClick={onClick}><div align='center'>{children}</div></button>
  </IconContext.Provider>
);


export default Button;
