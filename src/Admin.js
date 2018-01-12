import React, {Component} from 'react';
import * as firebase from 'firebase';
import './Admin.css';
import {AppBar,
        Dialog,
        FloatingActionButton,
        FlatButton,
        Tabs,
        Tab,
        Popover,
        Snackbar,
        Menu,
        MenuItem } from 'material-ui';
import {PopoverAnimationVertical} from 'material-ui/Popover';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppraiserIcon from 'material-ui/svg-icons/action/assignment-ind';
import ClientIcon from 'material-ui/svg-icons/action/account-balance';
import OrderIcon from 'material-ui/svg-icons/communication/business';
import ContentAdd from 'material-ui/svg-icons/content/add';
import AdminAppraiser from './AdminAppraiser.js';
import AdminOrder from './AdminOrder.js';
import AdminClient from './AdminClient.js';
import OrderCreate from './OrderCreate.js';
import ClientCreate from './ClientCreate.js';

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab:1,
      user: 'Login',
      popoveropen: false,
      open: false,
      anchorEl: {},
      createDialog: false,
      createType: '',
      notification:false,
      notificationMessage: ''
    }
    this.handlePopover = this.handlePopover.bind(this);
    this.openCreateMenu = this.openCreateMenu.bind(this);
    this.handlePopoverRequestClose = this.handlePopoverRequestClose.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.closeCreate = this.closeCreate.bind(this);
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((firebaseUser)=>{
      if (firebaseUser){
        this.setState({
          user: firebase.auth().currentUser.email
        })
      }
    })
  }
  handlePopover(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    })
  }
  adminCreate(type) {
    this.setState({
      createDialog : true,
      createType: type,
      popoveropen: false,
      anchorEl: {}
    })
  }
  openCreateMenu(event){
    event.preventDefault();
    this.setState({
      popoveropen: true,
      anchorEl: event.currentTarget
    })
  }
  handleRequestClose(){
    this.setState({
      open: false
    });
  }
  handlePopoverRequestClose(){
    this.setState({
      popoveropen: false
    })
  }
  closeCreate(didCreate = false, type = '') {
    if (didCreate === true) {
      this.setState({
        notification: true,
        notificationMessage: `Added New ${type} Successfully`
      })
    }
    this.setState({
      createDialog: false,
      createType: ''
    })
  }
  render() {
    return(
      <MuiThemeProvider>
        <div>
        <Snackbar 
          open={this.state.notification}
          message={this.state.notificationMessage}
          autoHideDuration={3000}
          onRequestClose={()=>{this.setState({notification:false,notificationMessage:''})}}
        />
        <Dialog 
          autoScrollBodyContent={true}
          open={this.state.createDialog}
          handleRequestClose={()=>{this.setState({createDialog:false,createType:''})}}
        >
          {
            this.state.createType === 'order' ? 
            <OrderCreate goBack={this.closeCreate} /> :
            this.state.createType === 'client' ?
            <ClientCreate goBack={this.closeCreate}/> :
            <div>Something went wrong...</div>
          }
        </Dialog>
        <Popover
          open={this.state.open}
          animation={PopoverAnimationVertical}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}>
          <Menu>
            <MenuItem primaryText="Sign out" onTouchTap={()=>{firebase.auth().signOut()}}/>
          </Menu>
        </Popover>
        <AppBar
          className="admin-appbar"
          title="APM | Administrator Panel"
          onTitleTouchTap={()=>{this.props.pageChanger(1)}}
          onLeftIconButtonTouchTap={()=>{this.props.pageChanger(1)}}
          iconElementLeft={<img />}
          iconElementRight={<FlatButton className="user-button" label={this.state.user} onTouchTap={this.handlePopover}/>} />
          <Tabs className="admin-tabs">
            <Tab icon={<AppraiserIcon />} label="Appraisers">
              <AdminAppraiser />
            </Tab>
            <Tab icon={<OrderIcon />} label="Orders">
              <AdminOrder />
            </Tab>
            <Tab icon={<ClientIcon />} label="Clients">
              <AdminClient />
            </Tab>
          </Tabs>
          <Popover
            open={this.state.popoveropen}
            animated={false}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'middle', vertical: 'top'}}
            targetOrigin={{horizontal: 'right', vertical: 'center'}}
            onRequestClose={this.handlePopoverRequestClose}>
            <Menu>
              <MenuItem primaryText="Create New Order" onClick={()=>{this.adminCreate('order')}}/>
              <MenuItem primaryText="Add Client Profile" onClick={()=>{this.adminCreate('client')}}/>
            </Menu>
          </Popover>
          <FloatingActionButton onTouchTap={this.openCreateMenu} className="add-item">
            <ContentAdd/>
          </FloatingActionButton>
        </div>
      </MuiThemeProvider>
    );
  }
}
export default Admin;
