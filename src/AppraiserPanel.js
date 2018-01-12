import React, {Component} from 'react';
import * as firebase from 'firebase';
import review from './res/review.jpg';
import loading from './res/loading2.gif';
import UserPanel from './UserPanel';
import UserUpdate from './UserUpdate';
import {Well} from 'react-bootstrap';
import {RaisedButton} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paste from 'material-ui/svg-icons/content/content-paste'
import Account from 'material-ui/svg-icons/action/assignment-ind'

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
};

class AppraiserPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: 'a',
      approved : 'loading',
      open: false,
      pane: 2
    }

    this.menuHandler = this.menuHandler.bind(this);

  }


  componentDidMount() {
    this.authListener = firebase.auth().onAuthStateChanged((firebaseUser)=>{
      if (firebaseUser) {
        var uid = firebaseUser.uid;
        firebase.database().ref(`Users/${uid}`).once('value', (snapshot)=> {
          var uaid = snapshot.val();
          this.setState({
            uaid:uaid
          })
          firebase.database().ref(`Appraisers/${uaid}/approved`).once('value', (approval)=>{
            if (approval.val()) {
              this.setState({
                approved: true,

              })
            } else if (!approval.val()) {
              this.setState({
                approved: false,

              })
            }
          })
        })
      }
    })
  }

  menuHandler(e){
    this.setState({
      pane:e
    })
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  handleToggle = () => this.setState({open: !this.state.open});

  handleClose = () => this.setState({open: false});

  render() {
    return (
      <MuiThemeProvider>
        <div>
        {
         this.state.approved === 'loading' ? <div className="panelloading"><img src={loading} alt="loading..."/><h4>Getting User Data...</h4></div> :
         this.state.approved ? <MainPanel
          menuHandler={this.menuHandler}
          handleToggle={this.handleToggle}
          value={this.state.value}
          onChange={this.handleChange}
          open={this.state.open}
          pane={this.state.pane}
          handleClose={this.handleClose}/> : <AwaitingApproval />
        }
        </div>
      </MuiThemeProvider>
    );
  }
}

function AwaitingApproval(){
  return(
    <div className="awaiting-approval">
      <Well>
        <img src={review} alt="" />
        <h2>Your application is still under review.</h2>
        <h6></h6>
        <h4>Keep an eye on your email - {firebase.auth().currentUser.email}.</h4>
        <h6></h6>
        <h4>We will send you an email letting you know when your application has been processed.</h4>
      </Well>
    </div>
  );
}

function MainPanel (props) {
  return (
    <MuiThemeProvider>
      <div>
        <br/>
        <Tabs className="appraiser-tabs" onChange={props.handleChange}>
          <Tab icon={<Paste/>} label="Mission Board">
            <UserPanel/>
          </Tab>
          <Tab icon={<Account/>}label="My Account">
            <UserUpdate/>
          </Tab>
        </Tabs>
      </div>
    </MuiThemeProvider>
  );
}



export default AppraiserPanel;
