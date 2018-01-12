import React, { Component } from 'react';
import Home from './Home.js';
import Appraiser from './Appraiser.js';
import AdminLogin from './AdminLogin.js';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      status: 'login',
      page: 1
    }
    this.updatePage = this.updatePage.bind(this);
    this.loginsignup = this.loginsignup.bind(this);
  }
  updatePage(newPage){
    this.setState({
      page: newPage,
    })
  }
  loginsignup(which){
    this.setState({
      status: which
    })
  }
  render() {
    return (
      <div className="App">
        {
          this.state.page === 1 ? <Home pageChanger={this.updatePage} status={this.loginsignup} /> :
          this.state.page === 2 ? <Appraiser pageChanger={this.updatePage} status={this.state.status} /> :
          this.state.page === 3 ? <AdminLogin pageChanger={this.updatePage} status={this.state.status} /> :
          <div>blank</div>
        }
      </div>
    );
  }
}

export default App;
