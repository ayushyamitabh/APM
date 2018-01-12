import React, {Component} from 'react';
import Admin from './Admin.js';
import {Dialog, FlatButton, TextField, RaisedButton} from 'material-ui';
import * as firebase from 'firebase';
import loading from './res/loading2.gif';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AdminLogin extends Component{
  constructor(props) {
    super(props);
    this.state = {
      a : false,
      dialogopen:false,
      dialogtitle: '',
      dialogmessage:''
    }
    this.login = this.login.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
  }
  componentWillMount() {
    this.authListener = this.authListener.bind(this);
    this.authListener();
  }
  componentWillUnmount() {
     this.fireBaseListener && this.fireBaseListener();
     this.authListener = undefined;
  }
  authListener() {
    this.fireBaseListener = firebase.auth().onAuthStateChanged((firebaseUser)=>{
      if (firebaseUser) {
        this.setState({
          logged: 'loading'
        })
        var uid = firebaseUser.uid;
        firebase.database().ref(`Admins/${uid}`).once('value',(snapshot)=>{
          if (snapshot.val()) {
            this.setState({
              logged: true
            })
          } else {
            this.setState({
              dialogopen:true,
              dialogtitle: 'Access Denied',
              dialogmessage:`You don't have admin privileges.\nIf you are an Appraiser or Client please login through the proper portals at https://apm-main.firebaseapp.com/`
            })
            firebase.auth().signOut();
          }
        })
      } else {
        this.setState({
          logged: false
        })
      }
    })
  }
  login(e){
    e.preventDefault();
    var email = document.getElementById('adminEmail').value;
    var password = document.getElementById('adminPassword').value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch((error)=>{
      this.setState({
        dialogopen:true,
        dialogtitle: `Login Error [Error Code: ${error.code}]`,
        dialogmessage:`${error.message}`
      })
    })
  }
  handleDialogClose() {
    this.setState({
      dialogopen:false,
      dialogtitle: '',
      dialogmessage:''
    })
  }
  render() {
    return(
      <MuiThemeProvider>
      <div>
        <Dialog
          title={this.state.dialogtitle}
          actions={<RaisedButton label="Ok" secondary={true} keyboardFocused={true} onTouchTap={this.handleDialogClose} />}
          modal={false}
          open={this.state.dialogopen}
          onRequestClose={this.handleDialogClose}
        >
          {this.state.dialogmessage}
        </Dialog>
      {
        this.state.logged ? <Admin pageChanger={this.props.pageChanger} status={this.props.status} /> :
        <form className="admin-login-panel" onSubmit={this.login}>
          {
            this.state.logged === 'loading' ? <img alt="Loading" src={loading}/> :
            <div>
              <h1>APM</h1>
              <h3>Administrator Login</h3>
              <FlatButton onTouchTap={()=>{this.props.pageChanger(1)}} label="← Back To Homepage" fullWidth={true}/>
              <TextField required={true} type="email" floatingLabelText="E-Mail *" name="adminEmail" id="adminEmail" fullWidth={true} autoComplete={false}/>
              <TextField required={true} type="password" floatingLabelText="Password *" name="adminPassword" id="adminPassword" fullWidth={true} autoComplete={false}/>
              <RaisedButton type="submit" type="submit" label="Sign In" name="adminLogin" id="adminLogin" fullWidth={true} primary={true} autoComplete={false}/>
            </div>
          }
        </form>
      }
      </div>
    </MuiThemeProvider>
    );
  }
}

export default AdminLogin;
