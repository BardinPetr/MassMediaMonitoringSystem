import React from 'react';
import Button from './button'
import { FaBeer } from 'react-icons/fa';
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
    const {Ref, children } = this.props;
    const SearchBarStyle = {
      zIndex: 1000,
      right: 0,
      position: 'absolute',
      margin: '14px 60px',
      height: '36px',
      fontWeight: '85px',
      border: 0,
      borderRadius: '10px',
      outline: 'none',
      border: 'none',
      padding: '0px 0px 0px 15px',
    };
    return (
      <div>
      <input style={SearchBarStyle}
        onChange = {this.updateState}
        placeholder={children}
        type="text"
        value = {this.state.data}/>
      <Button onClick={(e) => Ref(this.state.data, e)}><FaBeer/></Button>
      </div>
    );
  };
}