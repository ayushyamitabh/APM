import React, {Component} from 'react';
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import { Toolbar, ToolbarGroup, ToolbarTitle,} from 'material-ui'
import FlatButton from 'material-ui/FlatButton';
import {Table, TableBody, TableHeader, TableHeaderColumn,TableRow,TableRowColumn,} from 'material-ui/Table';

const style = {
  marginLeft: 20,
};

class UserUpdate extends Component{
  constructor(props){
    super(props);
    this.state={
    index: 1,
    open: false,
    value: 'a',
    fixedIndex: 1,
    selectedIndex : null,
    dialogopen: false,
    dialoguoid: '',
    data : {
      fname:'',
      lname:'',
      userFolder:{
        SupportingDocuments: {},
        Licenses: {}
      },
      orders : {}
    },
    uaid: props.uaid,
    changed: false,
    newData : {},
    snackbaropen:false,
    snackbarmessage:''

    };
    this.handleDataChange = this.handleDataChange.bind(this);
    this.changeSaver = this.changeSaver.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.openOrder = this.openOrder.bind(this);
  }

  changeSaver(){
    this.setState({
      snackbaropen: true,
      snackbarmessage: 'Saving changes... Please wait'
    })
    const uaid = this.state.uaid;
    const setData = this.state.newData;
    firebase.database().ref(`Appraisers/${this.state.uaid}`).update(setData).then(()=>{
      this.setState({
        snackbaropen: true,
        snackbarmessage: 'Changes saved',
        newData : {},
        changed : false
      })
    });
  }

  handleDataChange(e){
    e.preventDefault();
    if (!this.state.changed) {
      this.setState({
        changed: true
      })
    }
    var currSet = this.state.newData;
    currSet[e.target.id] = e.target.value;
    console.log(e.target.id, e.target.value);
    this.setState({
      newData:currSet
    })
  }
  handleDialogClose() {
      this.setState({
        dialogopen: false,
        dialoguoid: ''
      })
  }
  handleSnackbarClose() {
      this.setState({
        snackbaropen: false,
        snackbarmessage: ''
      })
  }
  openOrder(uoid) {
      this.setState({
        dialogopen: true,
        dialoguoid: uoid
      })
  }
  handleTouchTap = () => {
      this.setState({
        open: true,
      });
  };

  handleRequestClose = () => {
      this.setState({
        open: false,
      });
  };
  componentWillMount() {
    firebase.database().ref(`/Appraisers/${this.state.uaid}`).on('value',(snapshot)=>{
      var data = snapshot.val();
      this.setState({
        data: data
      })
    });
  }
  y
  componentDidMount(){
    var uaid = '';
    firebase.auth().onAuthStateChanged((firebaseUser)=>{
      if (firebaseUser){
        const uid = firebaseUser.uid;
        firebase.database().ref('Users/'+uid).once('value', (snap)=>{
          uaid = snap.val();
        }).then(()=>{
          this.setState({
            uaid:uaid
          })
          firebase.database().ref('Appraisers/'+uaid).once('value', (snapshot)=>{
            this.setState({
              fname: snapshot.val().fname,
              cname: snapshot.val().cname,
              company: snapshot.val().company,
              ssn: snapshot.val().ssn,
              phone: snapshot.val().phone,
              email: snapshot.val().email,
              address: snapshot.val().address,
              city: snapshot.val().city,
              state: snapshot.val().state,
              zip: snapshot.val().zip,
            })
          })
        })
      }
    });
  }

  render() {
    return (
      <MuiThemeProvider>
      <div>
        <Tabs>
          <Tab label="Account Information">
            <div className="format_width" changeHandler={this.handleDataChange}>
              <center>
                <br/>
                <RaisedButton onClick={this.changeSaver} onTouchTap={this.handleTouchTap} disabled={!this.state.changed} secondary={true}label="Save Changes"/>
                  <Snackbar open={this.state.open} message="Changes Saved" autoHideDuration={2000}onRequestClose={this.handleRequestClose}/>
                <br/>
                <br/>
              </center>

              <Toolbar className="admin-appraiser-toolbar">
                <ToolbarGroup>
                  <ToolbarTitle text="Vendor Details" />
                </ToolbarGroup>
              </Toolbar>

                  <TextField onChange={this.handleDataChange} id='fname' floatingLabelText="First Name" floatingLabelFixed={true} hintText={this.state.fname} style={style} underlineShow={false}/>
                  <Divider/>
                  <TextField onChange={this.handleDataChange} id='company' floatingLabelText="Company" floatingLabelFixed={true} hintText={this.state.company} style={style} underlineShow={false}/>
                  <Divider/>
                  <TextField onChange={this.handleDataChange} id='cname' floatingLabelText="Check-Name" floatingLabelFixed={true}  hintText={this.state.cname} style={style} underlineShow={false}/>
                  <Divider/>
                  <TextField onChange={this.handleDataChange} id='ssn' floatingLabelText="SSN: " floatingLabelFixed={true} hintText={this.state.ssn} style={style} underlineShow={false}/>
                  <Divider/>
                  <TextField onChange={this.handleDataChange} id='phone' floatingLabelText="Phone Number" floatingLabelFixed={true} hintText={this.state.phone}style={style} underlineShow={false}/>
                  <Divider/>
                  <TextField onChange={this.handleDataChange} id='email' floatingLabelText="Email address" floatingLabelFixed={true} hintText={this.state.email} style={style} underlineShow={false}/>
                  <Divider/>
                    <br/>
                    <br/>
              <Toolbar className="admin-appraiser-toolbar">
                <ToolbarGroup>
                  <ToolbarTitle text="Physical Address" />
                </ToolbarGroup>
              </Toolbar>
                  <TextField onChange={this.handleDataChange} id='address' floatingLabelText="Address" floatingLabelFixed={true} hintText={this.state.address}style={style} underlineShow={false} />
                  <Divider />
                  <TextField onChange={this.handleDataChange} id='city' floatingLabelText="City" floatingLabelFixed={true} hintText={this.state.city} style={style} underlineShow={false} />
                  <Divider />
                  <TextField onChange={this.handleDataChange} id='state' floatingLabelText="State" floatingLabelFixed={true} hintText={this.state.state} style={style} underlineShow={false} />
                  <Divider />
                  <TextField onChange={this.handleDataChange} id='zip' floatingLabelText="ZIP: " floatingLabelFixed={true} hintText={this.state.zip} style={style} underlineShow={false} />
                  <Divider />
                    <br/>
                    <br/>
              <Toolbar className="admin-appraiser-toolbar">
                <ToolbarGroup>
                  <ToolbarTitle text="Mailing Address" />
                </ToolbarGroup>
              </Toolbar>
                  <TextField onChange={this.handleDataChange} id='address' floatingLabelText="Address" floatingLabelFixed={true} hintText={this.state.address}style={style} underlineShow={false} />
                  <Divider />
                  <TextField onChange={this.handleDataChange} id='city' floatingLabelText="City" floatingLabelFixed={true} hintText={this.state.city} style={style} underlineShow={false} />
                  <Divider />
                  <TextField onChange={this.handleDataChange} id='state' floatingLabelText="State" floatingLabelFixed={true} hintText={this.state.state} style={style} underlineShow={false} />
                  <Divider />
                  <TextField onChange={this.handleDataChange} id='zip' floatingLabelText="ZIP: " floatingLabelFixed={true} hintText={this.state.zip}style={style} underlineShow={false} />
                  <Divider />
                    <br/>
                    <br/>
                  <br/>
                  <br/>
              </div>
            </Tab>

            <Tab label="Other Information" >
              <div className="format_width">
                <br/><br/>
                <Toolbar className="admin-appraiser-toolbar">
                  <ToolbarGroup>
                    <ToolbarTitle text="Licenses" />
                  </ToolbarGroup>
                </Toolbar>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHeaderColumn>License Number</TableHeaderColumn>
                      <TableHeaderColumn>State</TableHeaderColumn>
                      <TableHeaderColumn>Expiration Date</TableHeaderColumn>
                      <TableHeaderColumn>ASC Verified</TableHeaderColumn>
                      <TableHeaderColumn>Last Verified</TableHeaderColumn>
                      <TableHeaderColumn>Effective Date</TableHeaderColumn>
                      <TableHeaderColumn>Verify</TableHeaderColumn>
                      <TableHeaderColumn>Delete</TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody showRowHover={true}stripedRows={true}>
                    <TableRow>
                      <TableRowColumn>L1C-3NC-E1</TableRowColumn>
                      <TableRowColumn>x</TableRowColumn>
                      <TableRowColumn>x</TableRowColumn>
                      <TableRowColumn>x</TableRowColumn>
                      <TableRowColumn>x</TableRowColumn>
                      <TableRowColumn>x</TableRowColumn>
                      <TableRowColumn>x</TableRowColumn>
                      <TableRowColumn>x</TableRowColumn>
                    </TableRow>
                  </TableBody>
                </Table>
              <br/>
              <br/>

              <Toolbar className="admin-appraiser-toolbar">
                <ToolbarGroup>
                  <ToolbarTitle text="Supporting Documents" />
                </ToolbarGroup>
              </Toolbar>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHeaderColumn>File Details</TableHeaderColumn>
                    <TableHeaderColumn>Issued Date</TableHeaderColumn>
                    <TableHeaderColumn>Expiration Date</TableHeaderColumn>
                    <TableHeaderColumn>Submission Details</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody showRowHover={true}stripedRows={true}>
                  <TableRow>
                    <TableRowColumn>Insert</TableRowColumn>
                    <TableRowColumn>Insert </TableRowColumn>
                    <TableRowColumn>Insert </TableRowColumn>
                    <TableRowColumn>Insert </TableRowColumn>
                  </TableRow>
                </TableBody>
              </Table>

              <br/>
              <br/>

              <Toolbar className="admin-appraiser-toolbar">
                <ToolbarGroup>
                  <ToolbarTitle text="Coverage Areas: New York" />
                </ToolbarGroup>
              </Toolbar>
              <center>
                <FlatButton label="Bronx" primary={true} />
                <FlatButton label="Manhattan" primary={true} />
                <FlatButton label="Queens" primary={true} />
                <FlatButton label="Erie" secondary={true} />
                <FlatButton label="Kings" secondary={true} />
                <FlatButton label="Monroe" secondary={true} />
                <FlatButton label="Nassau" secondary={true} />
              </center>
              <br/>
              <br/>
              <br/>
              </div>
          </Tab>
      </Tabs>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default UserUpdate;
