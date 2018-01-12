import React, {Component} from 'react';
import * as firebase from 'firebase';
import{ Toolbar,
        TextField,
        DatePicker,
        Divider,
        ToolbarGroup,
        FlatButton,
        RaisedButton,
        ToolbarTitle,
        Chip,
        List,
        ListItem,
        Avatar,
        Dialog,
        Snackbar,
        ToolbarSeparator} from 'material-ui';
import AdminAppraiserProfile from './AdminAppraiserProfile.js';
import AdminClientDetails from './AdminClientDetails.js';
import AppraiserIcon from 'material-ui/svg-icons/action/assignment-ind';
import ClientIcon from 'material-ui/svg-icons/action/account-balance';
import SocialPerson from 'material-ui/svg-icons/social/person';
import HomeownerIcon from 'material-ui/svg-icons/action/home';
import {blue200, red200, teal200, purple200} from 'material-ui/styles/colors';

class AdminOrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      today: new Date(),
      changed: false,
      clientShow: false,
      ucid: '',
      uaid: '',
      newmessage: '',
      // Dialog Controls
      dialogtitle:'',
      dialogopen:false,
      dialogid:'',
      dialogcontent:'',
      // Snackbar Controls
      snackbaropen: false,
      snackbarmessage: '',
      // User's Data
      data:{
        Homeowner: {},
        Products: {}
      },
      // Pick Appraiser
      appraiserPick: false,
      appraisers: []
    }
    this.handleDataChange = this.handleDataChange.bind(this);
    this.saveDataChange = this.saveDataChange.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.showProfile = this.showProfile.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.assignAppraiser = this.assignAppraiser.bind(this);
  }
  componentWillMount(){
    firebase.database().ref(`Orders/${this.props.uoid}`).on('value',(orderBranch)=>{
      if (orderBranch.val()) {
        var orderDetails = orderBranch.val();
        this.setState({
          data:orderDetails
        })
        if (orderDetails.Appraiser !== false && orderDetails.Appraiser.toLowerCase() !== 'false') {
          this.setState({
            appraiser: orderDetails.Appraiser
          })
        }
      }
    })
    firebase.database().ref('Appraisers').once('value',(list)=>{
      var listOfApp = list.val();
      Object.keys(listOfApp).map((key,index)=>{
        var fullName = `${listOfApp[key]['fname']} ${listOfApp[key]['lname']}`;
        this.state.appraisers.push({name: fullName, uaid: key});
      })
    })
  }
  saveDataChange() {
    this.setState({
      snackbaropen: true,
      snackbarmessage: 'Saving changes... Please wait'
    })
    firebase.database().ref(`Orders/${this.props.uoid}`).update(this.state.data).then(()=>{
      if (this.state.data.Appraiser === false || this.state.data.Appraiser.toLowerCase() === 'false') {
        var appOrders = [];
        firebase.database().ref(`Appraisers/${this.state.appraiser}/orders`).once('value', (data)=>{
          appOrders = data.val();
        }).then(()=>{
          var iOrder = appOrders.indexOf(this.props.uoid);
          appOrders.splice(iOrder, 1);
          firebase.database().ref(`Appraisers/${this.state.appraiser}/orders`).set(appOrders);
        })
      }
      this.setState({
        snackbaropen: true,
        snackbarmessage: 'Changes saved',
        changed: false
      })
    });
  }
  handleDataChange(id, root){
    if (!this.state.changed) {
      this.setState({
        changed: true
      })
    }
    var curr = this.state.data;
    if (root === true) {
      curr[id] = document.getElementById(id).value;
      if (id === 'Appraiser') {
        if (document.getElementById(id).value.toLowerCase() === 'false') {
          curr[id] = false;
        }
      }
      this.setState({
        data: curr
      })
    } else {
      curr[root][id] = document.getElementById(id).value;
      this.setState({
        data: curr
      })
    }
  }
  showProfile(type){
    if (type === 'appraiser') {
      this.setState({
        dialogtitle:"Appraiser's Profile",
        dialogopen:true,
        dialogid:document.getElementById('Appraiser').value,
        dialogcontent:'appraiser'
      })
    }
  }
  handleDialogClose() {
    this.setState({
      dialogtitle:'',
      dialogopen:false,
      dialogid:'',
      dialogcontent:''
    })
  }
  assignAppraiser () {
    var uaid = this.state.uaid;
    if (uaid === '') {
      this.setState({
        snackbaropen: true,
        snackbarmessage: 'Pick An Appraiser to Assign To'
      })
    } else {
      this.setState({
        appraiserPick: false,
        snackbarmessage: 'Assigning Order ...',
        snackbaropen: true
      })
      firebase.database().ref(`Appraisers/${uaid}/orders`).once('value',(data)=>{
        if (data.val()){
          var newOrders = data.val();
          newOrders.push(this.props.uoid);
          firebase.database().ref(`Appraisers/${uaid}/orders`).set(newOrders);
        } else {
          var newOrders = [this.props.uoid];
          firebase.database().ref(`Appraisers/${uaid}/orders`).set(newOrders);
        }
      })
      firebase.database().ref(`Orders/${this.props.uoid}/Appraiser`).set(uaid);
      firebase.database().ref(`Orders/${this.props.uoid}/DueDate`).set(document.getElementById('assign-due-date').value).then(()=>{
        var u = this.props.uoid;
        this.setState({
          changed: false,
          uoid: '',
          uaid: '',
          snackbaropen: true,
          snackbarmessage: `Succesfully assigned order ${u}`
        })
      });
    }
  }
  handleSnackbarClose() {
    this.setState({
      snackbaropen: false,
      snackbarmessage: ''
    })
  }
  render() {
    return(
      <div className="admin-order-details">
        <Snackbar
          open={this.state.snackbaropen}
          message={this.state.snackbarmessage}
          autoHideDuration={2500}
          onRequestClose={this.handleSnackbarClose}
        />
        <Dialog
          modal={false}
          open={this.state.clientShow}
          onRequestClose={()=>{this.setState({clientShow:false,ucid:''})}}
        >
            <AdminClientDetails hideDetails={()=>{this.setState({clientShow:false,ucid:''})}} ucid={this.state.ucid} />
        </Dialog>
        <Dialog
          bodyClassName="order-assign-dialog"
          title="Pick An Appraiser"
          modal={false}
          open={this.state.appraiserPick}
          onRequestClose={()=>{this.setState({appraiserPick:false, uaid:''})}}
          autoScrollBodyContent={true}
          actions={[
            <FlatButton
              label="Assign"
              primary={true}
              onTouchTap={this.assignAppraiser}
            />,
            <FlatButton
              label="Cancel"
              secondary={true}
              onTouchTap={()=>{this.setState({appraiserPick:false, uaid:''})}}
            />
          ]}
        >
          <List>
            {
              this.state.appraisers.map((data, index) => {
                return (<ListItem 
                  key={index}
                  primaryText={data.name}
                  secondaryText={data.uaid}
                  onClick={()=>{this.setState({uaid:data.uaid, snackbaropen: true, snackbarmessage: `Selected ${data.name}`})}}
                />);
              }) 
            }
          </List>
          <DatePicker
            id="assign-due-date"
            className="assign-due-date"
            floatingLabelText="Due Date"
            autoOk={this.state.autoOk}
            minDate={new Date(this.state.today.getFullYear(),this.state.today.getMonth(), this.state.today.getDate()+1)}
            disableYearSelection={true}
            defaultDate={
              this.state.today.getDay() >= 5 ?
              new Date(this.state.today.getFullYear(),this.state.today.getMonth(), this.state.today.getDate()+5) :
              this.state.today.getDay() === 4 ?
              new Date(this.state.today.getFullYear(),this.state.today.getMonth(), this.state.today.getDate()+6) :
              this.state.today.getDay() <= 3 ?
              new Date(this.state.today.getFullYear(),this.state.today.getMonth(), this.state.today.getDate()+3) :
              new Date(this.state.today.getFullYear(),this.state.today.getMonth(), this.state.today.getDate()+3)
            }
            fullWidth
          />
        </Dialog>
        <Dialog
          bodyClassName="order-dialog"
          title={this.state.dialogtitle}
          modal={false}
          open={this.state.dialogopen}
          onRequestClose={this.handleDialogClose}>
          {
            this.state.dialogcontent === 'appraiser' ?
            <AdminAppraiserProfile uaid={this.state.dialogid} goBack={this.handleDialogClose} /> :
            <div>Client Profile</div>
          }
        </Dialog>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <FlatButton label="← Back" onTouchTap={this.props.hideDetails}/>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarTitle text={`${this.state.data.UOID}`} />
            <ToolbarSeparator />
            <RaisedButton onTouchTap={this.saveDataChange} disabled={!this.state.changed} label="Save Changes" primary={true} />
          </ToolbarGroup>
        </Toolbar>
        <div>
          <h1>Important Dates</h1>
          <TextField
            onChange={()=>{this.handleDataChange("Date",true)}}
            fullWidth={true}
            floatingLabelText="Assigned Date"
            id="Date"
            value={this.state.data.Date} />
          <TextField
            onChange={()=>{this.handleDataChange("DueDate",true)}}
            fullWidth={true}
            floatingLabelText="Due Date"
            id="DueDate"
            value={this.state.data.DueDate} />

          <h1>Homeowner's Information</h1>
          <TextField
            onChange={()=>{this.handleDataChange("Address","Homeowner")}}
            fullWidth={true}
            id="Address"
            floatingLabelText="Address"
            value={this.state.data.Homeowner.Address} />
          <TextField
            onChange={()=>{this.handleDataChange("Name","Homeowner")}}
            fullWidth={true}
            floatingLabelText="Homeowner's Name"
            id="Name"
            value={this.state.data.Homeowner.Name} />
          <TextField
            fullWidth={true}
            onChange={()=>{this.handleDataChange("Contact","Homeowner")}}
            floatingLabelText="Homeowner's Contact"
            id="Contact"
            value={this.state.data.Homeowner.Contact} />

          <h1>Products Listed</h1>
          <TextField
            onChange={()=>{this.handleDataChange("PropertyType",true)}}
            fullWidth={true}
            floatingLabelText="Property Type"
            id="PropertyType"
            value={this.state.data.PropertyType} />
          {
            Object.keys(this.state.data.Products).map((key, index)=>{
              return (<TextField
                        key={index}
                        fullWidth={true}
                        onChange={()=>{this.handleDataChange(key,'Products')}}
                        id={`Product ${parseInt(index)+1}`}
                        floatingLabelText={`Product ${parseInt(index)+1}`}
                        value={this.state.data.Products[key]} />
                     );
            })
          }

          <h1>Order Information</h1>
          {
            this.state.data.Appraiser === false ? 
            <div>
              <TextField 
                fullWidth
                disabled
                floatingLabelText="No Appraiser Assigned"
              />
              <RaisedButton
                fullWidth
                label="Assign Order"
                secondary
                onClick={()=>{this.setState({appraiserPick:true})}}
              />
            </div>:
            <div>
              <TextField
                onChange={()=>{this.handleDataChange("Appraiser",true)}}
                fullWidth={true}
                floatingLabelText="Appraiser ID"
                id="Appraiser"
                value={this.state.data.Appraiser} />
              <RaisedButton
                fullWidth={true}
                label="View Appraiser's Profile"
                onClick={()=>{this.showProfile('appraiser')}}
                secondary={true} />
            </div>
          }          
          <TextField
            onChange={()=>{this.handleDataChange("Bank",true)}}
            fullWidth={true}
            floatingLabelText="Client ID"
            id="Bank"
            disabled={true}
            value={this.state.data.Bank} />
          <RaisedButton
            fullWidth={true}
            label="View Client's Profile"
            secondary={true} 
            onTouchTap={()=>{this.setState({clientShow:true, ucid:this.state.data.Bank})}}
          />

          <h1>Order Chat</h1>
          <div className="chat-legend">
            <Chip className="chip" backgroundColor={teal200}>
              <Avatar backgroundColor={teal200} icon={<AppraiserIcon />} />
              Appraiser
            </Chip>
            <Chip className="chip" backgroundColor={purple200}>
              <Avatar backgroundColor={purple200} icon={<ClientIcon />} />
              Bank / Client
            </Chip>
            <Chip className="chip" backgroundColor={blue200}>
              <Avatar backgroundColor={blue200} icon={<HomeownerIcon />} />
              Homeowner
            </Chip>
            <Chip className="chip" backgroundColor={red200}>
              <Avatar backgroundColor={red200} icon={<SocialPerson />} />
              Admin
            </Chip>
            <Divider className="divider" />
          </div>
          <div className="chat-field">
            {
              Object.keys(this.state.data.Chat).map((key,index)=>{
                if (key === 'number') {
                } else {
                  if (this.state.data.Chat[key].From === 'Appraiser') {
                    return(
                      <div key={`chat${index}`} className="chip-right">
                        <Chip backgroundColor={teal200}>
                          <Avatar backgroundColor={teal200} icon={<AppraiserIcon />} />
                          {this.state.data.Chat[key].Content}
                        </Chip>
                      </div>
                    );
                  } else if (this.state.data.Chat[key].From === 'Client') {
                    return(
                      <div key={`chat${index}`} className="chip-left">
                        <Chip backgroundColor={purple200}>
                          <Avatar backgroundColor={purple200} icon={<ClientIcon />} />
                          {this.state.data.Chat[key].Content}
                        </Chip>
                      </div>
                    );
                  } else if (this.state.data.Chat[key].From === 'Admin'){
                    return(
                      <div key={`chat${index}`} className="chip-left">
                        <Chip backgroundColor={red200}>
                          <Avatar backgroundColor={red200} icon={<SocialPerson />} />
                          {this.state.data.Chat[key].Content}
                        </Chip>
                      </div>
                    );
                  } else {
                    return(
                      <div key={`chat${index}`} className="chip-right">
                        <Chip backgroundColor={blue200}>
                          <Avatar backgroundColor={blue200} icon={<HomeownerIcon />} />
                          {this.state.data.Chat[key].Content}
                        </Chip>
                      </div>
                    );
                  }
                }
              })
            }
          </div>
        </div>
          <TextField
            multiLine={true}
            floatingLabelText="Enter new message"
            fullWidth={true}
            value = {this.state.newmessage}
            onChange={(event)=>{
              this.setState({
                newmessage: event.target.value
              })
            }}
            id="new-message-content" />
          <RaisedButton
            primary={true}
            disabled={this.state.newmessage === '' || this.state.newmessage === null}
            onClick={()=>{
              var message = {
                From: 'Admin',
                Content: document.getElementById('new-message-content').value
              };
              if (message.Content === '' || message.Content === null) {
                console.log("Empty messge");
              } else {
                firebase.database().ref(`Orders/${this.props.uoid}/Chat/number`).once('value',(snap)=>{
                  var number = parseInt(snap.val());
                  firebase.database().ref(`Orders/${this.props.uoid}/Chat/${number}`).set(message);
                  number = number + 1;
                  firebase.database().ref(`Orders/${this.props.uoid}/Chat/number`).set(number);
                }).then(()=>{
                  this.setState({
                    newmessage: ''
                  })
                })
              }
            }}
            label="Send"
            fullWidth={true} />
        <div className="buffer"></div>
      </div>
    );
  }
}
export default AdminOrderDetail;
