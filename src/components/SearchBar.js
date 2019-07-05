import React from 'react';
import Button from './button'
export default class SearchBar extends React.Component {

  constructor(props){
    super(props);
    this.state = {data: '' };
    this.updateState = this.updateState.bind(this);
  }

  updateState(e) {
    this.setState({data: e.target.value});
 }

  render(){
    const {Ref, ButText, children } = this.props;
    const SearchBarStyle = {
      zIndex: 1000,
      right: '48px',
      position: 'absolute',
      height: '36px',
      fontWeight: '85px',
      border: 0,
      borderRadius: '10px',
      outline: 'none',
      border: 'none',
      padding: '0px 15px 0px 15px',
    };

    const DivStyle = {
      margin: '0px 0px 0px 0px',
      position: 'absolute',
      zIndex: 1000,
      right: '12px',
      top: '14px'
    };
    return (
      <div style={DivStyle}>
      <input style={SearchBarStyle}
        onChange = {this.updateState}
        placeholder={children}
        type="text"
        value = {this.state.data}/>
      <Button onClick={(e) => Ref(this.state.data, e)}>{ButText}</Button>
      </div>
    );
  };
}