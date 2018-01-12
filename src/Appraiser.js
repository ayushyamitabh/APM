import React, {Component} from 'react';
import AppraiserLogin from './AppraiserLogin';
import AppraiserSignup from './AppraiserSignup';
import AppraiserPanel from './AppraiserPanel';
import * as firebase from 'firebase';
import logo from './logo.svg';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import UserPanel from './UserPanel';
import UserUpdate from './UserUpdate';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';

class Appraiser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status: this.props.status,
      toPanel: false,
      user: 'Login',
      open: false,
      changed: false,
      newData : {},
      activeTab:1,
      pane: 2
    }
    this.statusHandler = this.statusHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeSaver = this.changeSaver.bind(this);
  }

  menuHandler(e){
    this.setState({
      pane:e
    })
  }
  handleTouchTap = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }
  handleRequestClose = () => {
  this.setState({
    open: false,
    });
  }

  handleClose = () => this.setState({open: false});

  handleClose_copy = () => this.setState({open: false});

  componentDidMount(){
    this.authListener = firebase.auth().onAuthStateChanged((firebaseUser)=>{
      if (firebaseUser){
        this.setState({
          user: firebase.auth().currentUser.email
        })
      } else {
        this.setState({
          status:'login'
        })
      }
      if (firebaseUser && !this.state.toPanel) {
        if(this.state.status === 'signup') {
          this.setState({
            userName: firebaseUser.email
          })
        } else if (this.state.status === 'login') {
          this.setState({
            toPanel: true,
            userName: firebaseUser.email
          })
        }
      }
      if (firebaseUser && this.state.toPanel) {
        this.setState({
          userName: firebaseUser.email
        })
      }
    })
  }
  statusHandler(newStatus){
    if (newStatus === "loggedin") {
      this.setState({
        toPanel: true
      })
    } else {
      this.setState({
        status: newStatus
      })
    }
  }
  logout(){
    firebase.auth().signOut();
    this.setState({
      toPanel: false,
      status: 'login',
      userName: null
    })
  }
  changeSaver(){
    console.log(this.state.newData);
  }

  handleChange(e){
    e.preventDefault();
    if (!this.state.changed) {
      this.setState({
        changed: true
      })
    }
    var currSet = this.state.newData;
    currSet[e.target.id] = e.target.value;
    this.setState({
      newData:currSet
    })
  }

  render(){
    return(
      <div>
        <Navigation
          pageHandle={this.props.pageChanger}
          userName={this.state.userName}
          logout={this.logout}
          open={this.state.open}
          user={this.state.user}
          handleTouchTap={this.handleTouchTap}
          anchorEl={this.state.anchorEl}
          handleRequestClose={this.handleRequestClose}
          statusHandle={this.statusHandler}
          isloggedin={this.state.toPanel}
        />
        {
          this.state.toPanel === true ? <AppraiserPanel/>
        : this.state.status === 'login'? <AppraiserLogin statusHandle={this.statusHandler} pageChanger={this.props.pageChanger} />
        : this.state.status === 'signup'? <AppraiserSignup statusHandle={this.statusHandler} />
        : <p>default</p>
        }
      </div>
    );
  }
}

function Navigation(props) {
  return(
    <MuiThemeProvider>
      {
        !props.isloggedin === true ? <div></div> :

        <AppBar
          className="admin-appbar"
          onTitleTouchTap={()=>{props.pageHandle(1)}}
          title="Apparisal Partners Management"
          showMenuIconButton={false}
          iconElementRight={
            <div>
              <FlatButton className="user-button" onTouchTap={props.handleTouchTap} label={props.user} secondary={true}/>
                <Popover
                  open={props.open}
                  anchorEl={props.anchorEl}
                  anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                  targetOrigin={{horizontal: 'right', vertical: 'top'}}
                  onRequestClose={props.handleRequestClose}>
                    <Menu>
                      <MenuItem primaryText="Settings"/>
                      <MenuItem primaryText="Sign Out" onTouchTap = {props.logout}/>
                    </Menu>
                </Popover>
            </div>
          }
        />
        }
    </MuiThemeProvider>
  );
}

export default Appraiser;
