import React, {Component} from 'react';
import * as firebase from 'firebase';
import $ from 'jquery';
import {Divider,
        Card,
        CardHeader,
        CardActions,
        FlatButton,
        Tabs,
        Dialog,
        Tab,
        Table,
        TableRow,
        TableBody,
        TableRowColumn,
        TableHeader,
        TableHeaderColumn,
        Toolbar,
        ToolbarGroup,
        SvgIcon,
        ToolbarTitle,
        TextField,
        ToolbarSeparator,
        RaisedButton,
        Snackbar,
        BottomNavigation,
        BottomNavigationItem} from 'material-ui';
import FileFolder from 'material-ui/svg-icons/file/folder';
import SocialPerson from 'material-ui/svg-icons/social/person';
import UserOrder from 'material-ui/svg-icons/action/assignment-turned-in';
import AdminOrderDetail from './AdminOrderDetail.js';

class AdminAppraiserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    }
    this.bottomNavHandler = this.bottomNavHandler.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.changeSaver = this.changeSaver.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.openOrder = this.openOrder.bind(this);
  }
  componentWillMount() {
    firebase.database().ref(`/Appraisers/${this.state.uaid}`).on('value',(snapshot)=>{
      var data = snapshot.val();
      this.setState({
        data: data
      })
    });
  }
  bottomNavHandler(i) {
    this.setState({
      selectedIndex: i
    })
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
  openOrder(uoid) {
    this.setState({
      dialogopen: true,
      dialoguoid: uoid
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
  render() {
    return (
      <div>
        <Snackbar
          open={this.state.snackbaropen}
          message={this.state.snackbarmessage}
          autoHideDuration={2500}
          onRequestClose={this.handleSnackbarClose}
        />
        <Dialog
          open={this.state.dialogopen}
          title={`Order Details for ${this.state.dialoguoid}`}
          onRequestClose={this.handleDialogClose}
          bodyClassName="admin-appraiser-order-details">
          <AdminOrderDetail isDialog={true} hideDetails={this.handleDialogClose} uoid={this.state.dialoguoid} />
        </Dialog>
        <Toolbar className="appraiser-profile-head">
          <ToolbarGroup firstChild={true}>
            <FlatButton onClick={this.props.goBack} label="← Back" />
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarTitle text={`${this.state.data.fname} ${this.state.data.lname}`} />
            <ToolbarSeparator />
            <RaisedButton onClick={this.changeSaver} label="Save Changes" primary={true} disabled={!this.state.changed}/>
          </ToolbarGroup>
        </Toolbar>
        <Tabs className="appraiser-profile-tabs">
          <Tab icon={<SocialPerson />} label="Personal Information">
            <Personal data={this.state.data} changeHandler={this.handleChange}/>
          </Tab>
          <Tab icon={<FileFolder />} label="User's Folder">
            <Folder data={this.state.data} />
          </Tab>
          <Tab icon={<UserOrder />} label="User's Orders">
            <Orders data={this.state.data} openOrder={this.openOrder}/>
          </Tab>
        </Tabs>
      </div>
    );
  }
}

function Folder(props) {
  return (
    <div className="appraiser-profile-folder">
      <h4>Download User Files</h4>
      <RaisedButton className="doc-btn" label="EOI" href={props.data.userFolder.eoi} primary={true} />
      <RaisedButton className="doc-btn" label="Pricings" href={props.data.userFolder.pricings} primary={true} />
      <br /><Divider className="divider" />
      <h6>Supporting Documents</h6>
      <RaisedButton className="doc-btn" label="Resume" href={props.data.userFolder.SupportingDocuments.resume} secondary={true}/>
      <RaisedButton className="doc-btn" label="W9" href={props.data.userFolder.SupportingDocuments.w9} secondary={true}/>
      <RaisedButton className="doc-btn" label="Sample Appraisal 1" href={props.data.userFolder.SupportingDocuments.sa} secondary={true}/>
      <RaisedButton className="doc-btn" label="Sample Appraisal 2" href={props.data.userFolder.SupportingDocuments.sa2} secondary={true}/>
      <RaisedButton className="doc-btn" label="References" href={props.data.userFolder.SupportingDocuments.ref} secondary={true}/>
      <RaisedButton className="doc-btn" label="Background Check" href={props.data.userFolder.SupportingDocuments.bc} secondary={true}/>
      <br /><Divider className="divider" />
      <h6>Licenses</h6>
      {
        Object.keys(props.data.userFolder.Licenses).map((key,index)=>{
          if (key.substring(0,3) === 'LiD') {
            var num = key.substring(3,4);
            return (
              <Card key={index}>
                <CardHeader
                  className="license-head"
                  title={`${props.data.userFolder.Licenses[`licensestate${num}`]} License`}
                  subtitle={`License Number: ${props.data.userFolder.Licenses[`LiLN${num}`]}`}
                />
                <CardActions>
                  <FlatButton label={props.data.userFolder.Licenses[`LiED${num}`]} disabled={true} />
                  <FlatButton label="View License" href={props.data.userFolder.Licenses[key]} />
                </CardActions>
              </Card>
            );
          }
        })
      }
    </div>
  );
}

function Orders(props) {
  var orderDetails = [];
  if (!props.data.orders) {
    return (<div className="no-appraiser-orders">No Assigned Orders</div>);
  } else {
    Object.keys(props.data.orders).map((key,index)=>{
      var uoid = props.data.orders[key];
      firebase.database().ref(`Orders/${uoid}`).once('value',(dataSnap)=>{
        var data = dataSnap.val();
        orderDetails.push(data);
      });
    });
    return (
      <div className="appraiser-profile-orders">
        <Table
          className="admin-appraiser-table"
          fixedHeader={true}
          selectable={true}
          multiSelectable={false}>
          <TableHeader enableSelectAll={false}>
            <TableRow>
              <TableHeaderColumn>#</TableHeaderColumn>
              <TableHeaderColumn>Address</TableHeaderColumn>
              <TableHeaderColumn>UOID</TableHeaderColumn>
              <TableHeaderColumn>Action</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody
          displayRowCheckbox={true}
          deselectOnClickaway={false}
          showRowHover={true}
          stripedRows={true}>
          {
            orderDetails.map((data, index)=>{
              return (
                <TableRow key={index}>
                  <TableRowColumn>
                    {index}
                  </TableRowColumn>
                  <TableRowColumn>
                    {data.Homeowner.Address}
                  </TableRowColumn>
                  <TableRowColumn>
                    {data.UOID}
                  </TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton onTouchTap={()=>{props.openOrder(data.UOID)}} secondary={true} label="View Order"/>
                  </TableRowColumn>
                </TableRow>
              );
            })
          }
          </TableBody>
        </Table>
      </div>
    );
  }
}

function Personal(props) {
  return(
    <div className="appraiser-profile-personal">
      <TextField
        onChange={props.changeHandler}
        id="fname"
        defaultValue={props.data.fname}
        floatingLabelText="First Name"/>
      <TextField
        onChange={props.changeHandler}
        id="lname"
        defaultValue={props.data.lname}
        floatingLabelText="Last Name"/>
      <br />
      <TextField
        onChange={props.changeHandler}
        id="cname"
        defaultValue={props.data.cname}
        floatingLabelText="Name on Check"/>
      <TextField
        onChange={props.changeHandler}
        id="company"
        defaultValue={props.data.company}
        floatingLabelText="Company Name"/>
      <br />
      <TextField
        onChange={props.changeHandler}
        id="ssn"
        defaultValue={props.data.ssn}
        floatingLabelText="EIN/SSN"/>
      <br />
      <Divider className="divider" />
      <TextField
        onChange={props.changeHandler}
        id="phone"
        defaultValue={props.data.phone}
        floatingLabelText="Primary Phone"/>
      <TextField
        onChange={props.changeHandler}
        id="phoneAlt"
        defaultValue={props.data.phoneAlt}
        floatingLabelText="Alternate Phone"/>
      <br />
      <TextField
        onChange={props.changeHandler}
        id="email"
        defaultValue={props.data.email}
        floatingLabelText="Contact Email"/>
      <br />
      <TextField
        onChange={props.changeHandler}
        id="loginemail"
        defaultValue={props.data.loginemail}
        floatingLabelText="Login Email"/>
      <TextField
        onChange={props.changeHandler}
        id="loginpassword"
        defaultValue={props.data.loginpassword}
        floatingLabelText="Login Password"/>
      <Divider className="divider" />
      <TextField
        onChange={props.changeHandler}
        id="address"
        defaultValue={props.data.address}
        floatingLabelText="Address"/>
      <TextField
        onChange={props.changeHandler}
        id="city"
        defaultValue={props.data.city}
        floatingLabelText="City"/>
      <TextField
        onChange={props.changeHandler}
        id="state"
        defaultValue={props.data.state}
        floatingLabelText="State"/>
      <TextField
        onChange={props.changeHandler}
        id="zip"
        defaultValue={props.data.zip}
        floatingLabelText="Zip"/>
      <br />
      <Divider className="divider" />
      <TextField
        onChange={props.changeHandler}
        id="mailingaddress"
        defaultValue={props.data.mailingaddress}
        floatingLabelText="Mailing Address"/>
      <TextField
        onChange={props.changeHandler}
        id="mailingcity"
        defaultValue={props.data.mailingcity}
        floatingLabelText="Mailing City"/>
      <TextField
        onChange={props.changeHandler}
        id="mailingstate"
        defaultValue={props.data.mailingstate}
        floatingLabelText="Mailing State"/>
      <TextField
        onChange={props.changeHandler}
        id="mailingzip"
        defaultValue={props.data.mailingzip}
        floatingLabelText="Mailing Zip"/>
      <br />
      <Divider className="divider" />
      {
        props.data.approved ? 
        <RaisedButton 
          onClick={()=>{
            firebase.database().ref(`/Appraisers/${props.data.uaid}/approved`).set(false);
          }} 
          className="approval" 
          label="Rescind Approval" 
          secondary={true} />:
        <RaisedButton 
          onClick={()=>{
            firebase.database().ref(`/Appraisers/${props.data.uaid}/approved`).set(true);
          }}
          className="approval" 
          label="Approve" 
          primary={true} 
        />
      }
    </div>
  );
}

export default AdminAppraiserProfile;
