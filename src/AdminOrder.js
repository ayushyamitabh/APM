import React, {Component} from 'react';
import * as firebase from 'firebase';
import AdminOrderDetail from './AdminOrderDetail.js';
import AdminAppraiserProfile from './AdminAppraiserProfile.js';
import AdminClientDetails from './AdminClientDetails.js';
import {DatePicker,
        Dialog,
        FlatButton,
        RaisedButton,
        AutoComplete,
        List,
        ListItem,
        Snackbar,
        Table,
        TableRow,
        TableHeaderColumn,
        TableRowColumn,
        TableHeader,
        TableBody,
        Toolbar,
        ToolbarGroup,
        ToolbarTitle} from 'material-ui';

const dataSourceConfig = {
  text: 'data',
  value: 'uoid'
}

class AdminOrder extends Component{
  constructor(props) {
    super(props);
    this.state = {
      a:'',
      today: new Date(),
      orders: '',
      dataSource: [],
      appraiserList: [],
      uoid: '',
      appraiserPick:false,
      uaid: '',
      appraiserShow:false,
      notification:false,
      notificationMessage: '',
      clientShow: false,
      ucid: '',
      selected: false,
      deleteConfirm: false
    }
    this.handleNewRequest = this.handleNewRequest.bind(this);
    this.showOrderDetails = this.showOrderDetails.bind(this);
    this.hideOrderDetails = this.hideOrderDetails.bind(this);
    this.showAppraiser = this.showAppraiser.bind(this);
    this.pickAppraiser = this.pickAppraiser.bind(this);
    this.assignAppraiser = this.assignAppraiser.bind(this);
    this.selectedOrder = this.selectedOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
  }
  componentDidMount(){
    firebase.database().ref('Orders').on('value',(orderBranch)=>{
      var orders = orderBranch.val();
      this.setState({
        orders: orders
      })
      Object.keys(orders).map((key, index)=>{
        this.state.dataSource.push({
          data: orders[key].Homeowner.Address,
          uoid: key
        })
        this.state.dataSource.push({
          data: key,
          uoid: key
        })
      })
    });
    firebase.database().ref('Appraisers').once('value',(data)=>{
      var appraisers = data.val();
      Object.keys(appraisers).map((key,index)=>{
        this.state.appraiserList.push({
          uaid: appraisers[key]['uaid'],
          name: `${appraisers[key]['fname']} ${appraisers[key]['lname']}`
        })
      })
    })
  }
  handleNewRequest(chosenRequest, index){
    this.showOrderDetails(chosenRequest.uoid);
  }
  assignAppraiser () {
    if (this.state.uaid === '') {
      this.setState({
        notification: true,
        notificationMessage: 'Pick An Appraiser to Assign To'
      })
    } else {
      this.setState({
        appraiserPick: false,
        notificationMessage: 'Assigning Order ...',
        notification: true
      })
      firebase.database().ref(`Appraisers/${this.state.uaid}/orders`).once('value',(data)=>{
        var newOrders = [];
        if (data.val()){
          newOrders = data.val();
        }        
        newOrders.push(this.state.uoid);
        firebase.database().ref(`Appraisers/${this.state.uaid}/orders`).set(newOrders);
      })
      firebase.database().ref(`Orders/${this.state.uoid}/Appraiser`).set(this.state.uaid);
      firebase.database().ref(`Orders/${this.state.uoid}/DueDate`).set(document.getElementById('assign-due-date').value).then(()=>{
        var u = this.state.uoid;
        this.setState({
          uoid: '',
          notification: true,
          notificationMessage: `Succesfully assigned order ${u}`
        })
      });
    }
  }
  pickAppraiser(uoid) {
    this.setState({
      uoid: uoid,
      appraiserPick: true
    })
  }
  showAppraiser(uaid) {
    this.setState({
      appraiserShow: true,
      uaid: uaid
    })
  }
  showOrderDetails(uoid) {
    this.setState({
      showOrder: true,
      uoid: uoid
    })
  }
  hideOrderDetails() {
    this.setState({
      showOrder: false,
      uoid: ''
    })
  }
  selectedOrder(o){
    if (o.length >= 1) {
      var index = o[0];
      var uoid = this.state.orders[Object.keys(this.state.orders)[index]]['UOID'];
      this.setState({
        selected: uoid,
        selectedIndex: index
      })
    } else {
      this.setState({
        selected: false,
        selectedIndex: ''
      })
    }
  }
  deleteOrder() {
    firebase.database().ref(`Orders/${this.state.selected}`).once('value', (snap)=>{
      var order = snap.val();
      if (order.Appraiser === false || order.Appraiser.toLowerCase() === 'false') {
        firebase.database().ref(`Clients/${order.Bank}/Orders`).once('value',(bankSnap)=>{
          var bankOrders = bankSnap.val();
          var iBankOrder = bankOrders.indexOf(this.state.selected);
          bankOrders.splice(iBankOrder,1);
          firebase.database().ref(`Clients/${order.Bank}/Orders`).set(bankOrders).then(()=>{
            firebase.database().ref(`Orders/${this.state.selected}`).remove().then(()=>{
              this.setState({
                deleteConfirm: false,
                selected: false,
                selectedIndex: '',
                notification: true,
                notificationMessage: 'Deleted Order.'
              })
            })
          });
        })
      } else {
        firebase.database().ref(`Appraisers/${order.Appraiser}/orders`).once('value', (appSnap)=>{
          var appOrders = appSnap.val();
          var iOrder = appOrders.indexOf(this.state.selected);
          appOrders.splice(iOrder,1);
          firebase.database().ref(`Appraisers/${order.Appraiser}/orders`).set(appOrders).then(()=>{
            firebase.database().ref(`Clients/${order.Bank}/Orders`).once('value',(bankSnap)=>{
              var bankOrders = bankSnap.val();
              var iBankOrder = bankOrders.indexOf(order.UOID);
              bankOrders.splice(iBankOrder,1);
              firebase.database().ref(`Clients/${order.Bank}/Orders`).set(bankOrders).then(()=>{
                firebase.database().ref(`Orders/${this.state.selected}`).remove().then(()=>{
                  this.setState({
                    deleteConfirm: false,
                    selected: false,
                    selectedIndex: '',
                    notification: true,
                    notificationMessage: 'Deleted Order.'
                  })
                })
              });
            })
          })
        })
      }
    })
  }
  render() {
    return(
      <div>
        {
          this.state.showOrder ? <AdminOrderDetail hideDetails={this.hideOrderDetails} uoid={this.state.uoid} /> :
          <div className="admin-orders">
            <Dialog
              modal={false}
              open={this.state.clientShow}
              onRequestClose={()=>{this.setState({clientShow:false,ucid:''})}}
            >
                <AdminClientDetails hideDetails={()=>{this.setState({clientShow:false,ucid:''})}} ucid={this.state.ucid} />
            </Dialog>
            <Dialog
              bodyClassName="order-dialog"
              title="Delete Order?"
              actions={[
                <RaisedButton
                  primary
                  label="Delete"
                  onTouchTap={this.deleteOrder}
                />,
                <FlatButton 
                  label="Cancel"
                  secondary
                  onTouchTap={()=>{this.setState({deleteConfirm:false,selected:false,selectedIndex:''})}}
                />
              ]}
              modal={false}
              open={this.state.deleteConfirm}
              onRequestClose={()=>{this.setState({deleteConfirm:false,selected:false,selectedIndex:''})}}
            >
              Are you sure you want to delete this order?
            </Dialog>
            <Dialog
              bodyClassName="order-dialog"
              title={this.state.uaid}
              modal={false}
              open={this.state.appraiserShow}
              onRequestClose={()=>{this.setState({appraiserShow:false,uaid:''})}}
            >
                <AdminAppraiserProfile uaid={this.state.uaid} goBack={()=>{this.setState({appraiserShow:false,uaid:''})}} />
            </Dialog>
            <Snackbar 
              open={this.state.notification}
              message={this.state.notificationMessage}
              autoHideDuration={3000}
              onRequestClose={()=>{this.setState({notification:false,notificationMessage:''})}}
            />
            <Dialog
              bodyClassName="order-assign-dialog"
              title="Pick An Appraiser"
              modal={false}
              open={this.state.appraiserPick}
              onRequestClose={()=>{this.setState({appraiserPick:false,uoid:'',uaid: ''})}}
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
                  onTouchTap={()=>{this.setState({appraiserPick:false,uoid:'',uaid: ''})}}
                />
              ]}
            >
              <List>
                {
                  this.state.appraiserList.map((data, index) => {
                    return (<ListItem 
                      key={index}
                      primaryText={data.name}
                      secondaryText={data.uaid}
                      onClick={()=>{this.setState({uaid:data.uaid, notification: true, notificationMessage: `Selected ${data.name}`})}}
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
            <AutoComplete
              hintText="Search by order's address or UOID"
              openOnFocus={false}
              onNewRequest={this.handleNewRequest}
              dataSource={this.state.dataSource}
              dataSourceConfig={dataSourceConfig}
              filter={AutoComplete.fuzzyFilter}
              floatingLabelText="SEARCH ORDERS"
              fullWidth={true}
            />
            <Toolbar className="admin-order-toolbar">
              <ToolbarGroup firstChild={true}>
                <ToolbarTitle className="title" text="Options" />
              </ToolbarGroup>
              <ToolbarGroup>
                <RaisedButton primary disabled={this.state.selected === false ? true : false} label="Delete" onTouchTap={()=>{this.setState({deleteConfirm: true})}}/>
              </ToolbarGroup>
            </Toolbar>
            <Table
              fixedHeader={true}
              selectable={true}
              multiSelectable={false}
              onRowSelection={this.selectedOrder}>
              <TableHeader enableSelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>#</TableHeaderColumn>
                  <TableHeaderColumn>Details</TableHeaderColumn>
                  <TableHeaderColumn>Appraiser</TableHeaderColumn>
                  <TableHeaderColumn>Client</TableHeaderColumn>
                  <TableHeaderColumn>Actions</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                displayRowCheckbox={true}
                deselectOnClickaway={false}
                showRowHover={true}
                stripedRows={true}>
                {
                  Object.keys(this.state.orders).map((key, index)=>{
                    return(
                      <TableRow key={index} selected={this.state.selectedIndex === index? true : false}>
                        <TableRowColumn>
                          {index}
                        </TableRowColumn>
                        <TableRowColumn>
                          {`${this.state.orders[key]['Homeowner']['Address']}\n${this.state.orders[key]['Homeowner']['Name']}\n${this.state.orders[key]['Homeowner']['Contact']}`}
                        </TableRowColumn>
                        <TableRowColumn>
                          {
                            this.state.orders[key]['Appraiser'] === false ?
                            <FlatButton primary label="Assign Order" onTouchTap={()=>{this.pickAppraiser(key)}}/>:
                            <FlatButton primary label={this.state.orders[key]['Appraiser']} onTouchTap={()=>{this.showAppraiser(this.state.orders[key]['Appraiser'])}} />
                          }
                        </TableRowColumn>
                        <TableRowColumn>
                          <FlatButton primary label={this.state.orders[key]['Bank']} onTouchTap={()=>{this.setState({clientShow:true, ucid:this.state.orders[key]['Bank']})}}/>                          
                        </TableRowColumn>
                        <TableRowColumn>
                          <RaisedButton secondary={true} label="View Details" onTouchTap={()=>{this.showOrderDetails(key)}} />
                        </TableRowColumn>
                      </TableRow>
                    );
                  })
                }
              </TableBody>
            </Table>
          </div>
        }
      </div>
    );
  }
}

export default AdminOrder;
