import React, {Component} from 'react';
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table,TableBody,TableHeader,TableHeaderColumn,TableRow,TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Toolbar, ToolbarGroup, ToolbarTitle,} from 'material-ui';
import Dialog from 'material-ui/Dialog';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));
let allViews = Object.keys(BigCalendar.views).map(k => BigCalendar.views[k])

const styles = {
  headline: {
    fontSize: 24,
    paddingTop: 16,
    marginBottom: 12,
    fontWeight: 400,
  },
  chip: {
    margin: 4,
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

let desc = "Example"

class UserPanel extends Component {
  constructor(props){
    super(props);
    this.state = {
      index: 1,
      open: false,
      value: 'a',
      fixedIndex: 1
    };
    this.showEvent = this.showEvent.bind(this);
  }

  handleChange = (value) => {
    this.setState({
      value: value,
    });
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleToggle = () => this.setState({open: !this.state.open});

  componentDidMount(){

    var uaid = '';
    firebase.auth().onAuthStateChanged((firebaseUser)=>{
      if (firebaseUser) {
        const uid = firebaseUser.uid;
        var uaid = '';
        firebase.database().ref('Users/'+uid).once('value', (snap)=>{
          uaid = snap.val();
        }).then(()=>{
          firebase.database().ref('Appraisers/'+uaid).once('value', (snapshot)=>{
            this.setState({
              cname: snapshot.val().cname,
              company: snapshot.val().company,
              ssn: snapshot.val().ssn,
              phone: snapshot.val().phone,
              email: snapshot.val().email,
              address: snapshot.val().address,
              city: snapshot.val().city,
              state: snapshot.val().state,
              zip: snapshot.val().zip
            })
          })
        })
      }
    });
  }

  showEvent(calendarEvent){
    this.setState({
      open:true,
      calendarEvent: calendarEvent,
    })
  }

  render() {

    const actions = [
      <FlatButton label="Go Back" primary={true} onTouchTap={this.handleClose}/>,
      <FlatButton label="OK!" primary={true} keyboardFocused={true} onTouchTap={this.handleClose}/>
    ];

    return(
      <MuiThemeProvider>
      <div>
        <Tabs value={this.state.value} onChange={this.handleChange}>
          <Tab label="Overview" value="a">
            <br/><br/>

            <Toolbar className="appraiser-list">
              <ToolbarGroup>
                <ToolbarTitle text="New Orders" />
              </ToolbarGroup>
            </Toolbar>

            <Table className="appraiser-list" fixedHeader={true} selectable={true}multiSelectable={false}>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>Order Number</TableHeaderColumn>
                  <TableHeaderColumn>Order</TableHeaderColumn>
                  <TableHeaderColumn>Client</TableHeaderColumn>
                  <TableHeaderColumn>Data</TableHeaderColumn>
                  <TableHeaderColumn>Item(s)</TableHeaderColumn>
                  <TableHeaderColumn>Status</TableHeaderColumn>
                  <TableHeaderColumn>Accept</TableHeaderColumn>
                  <TableHeaderColumn>Decline</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={true}deselectOnClickaway={false}showRowHover={true}stripedRows={true}>
                <TableRow>
                  <TableRowColumn>1</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton label="Accept" primary={true} onTouchTap={this.handleOpen}disabled={true}/>

                  </TableRowColumn>
                  <TableRowColumn>
                    <RaisedButton label="Deny" secondary={true} onTouchTap={this.handleOpen}disabled={true}/>

                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>

            <br/>
            <br/>

            <Toolbar className="appraiser-list">
              <ToolbarGroup>
                <ToolbarTitle text="Upcoming..." />
              </ToolbarGroup>
            </Toolbar>

            <br/>
            <br/>

            <div className='appraiser-list'>
              <BigCalendar
                selectable
                events={
                  [{
                    'title': 'Event-1',
                    'allDay': false,
                    'start': new Date(2017, 7, 14),
                    'end': new Date(2017, 7, 16),
                    'desc': 'This is the input of the first event.'
                  }]
                }
                step={15}
                timeslots={8}
                popup={true}
                views={allViews}
                defaultDate={new Date(2017, 7, 16)}
                defaultView='week'
                onSelectEvent={this.showEvent}
              />
                <Dialog title="Calendar Event!" actions={actions}modal={false}open={this.state.open}onRequestClose={this.handleClose}>
                </Dialog>
            </div>

            <br/><br/>
          </Tab>

          <Tab label="Progress" value="b">
            <br/>
            <br/>

            <Toolbar className="appraiser-list">
              <ToolbarGroup>
                <ToolbarTitle text="Active Orders" />
              </ToolbarGroup>
            </Toolbar>

            <Table className="appraiser-list" fixedHeader={true} selectable={true}multiSelectable={false}>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>New Orders</TableHeaderColumn>
                  <TableHeaderColumn>All Orders in Progress</TableHeaderColumn>
                  <TableHeaderColumn>Inspection Scheduled</TableHeaderColumn>
                  <TableHeaderColumn>Inspection Completed</TableHeaderColumn>
                  <TableHeaderColumn>Rush Orders</TableHeaderColumn>
                  <TableHeaderColumn>Due in 1-2 Days</TableHeaderColumn>
                  <TableHeaderColumn>Orders Past Due</TableHeaderColumn>
                  <TableHeaderColumn>Revision Requests</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={true}deselectOnClickaway={false}showRowHover={true}stripedRows={true}>
                <TableRow>
                  <TableRowColumn>x</TableRowColumn>
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

            <Toolbar className="appraiser-list">
              <ToolbarGroup>
                <ToolbarTitle text="Other Orders" />
              </ToolbarGroup>
            </Toolbar>

            <Table className="appraiser-list" fixedHeader={true} selectable={true}multiSelectable={false}>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>In Review</TableHeaderColumn>
                  <TableHeaderColumn>Orders on Hold</TableHeaderColumn>
                  <TableHeaderColumn>Completed</TableHeaderColumn>
                  <TableHeaderColumn>Cancelled Orders</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={true}deselectOnClickaway={false}showRowHover={true}stripedRows={true}>
                <TableRow>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  </TableRow>
                </TableBody>
            </Table>

            <br/>
            <br/>

            <Toolbar className="appraiser-list">
              <ToolbarGroup>
                <ToolbarTitle text="Appraiser Stats" />
              </ToolbarGroup>
            </Toolbar>

            <Table className="appraiser-list" fixedHeader={true} selectable={true}multiSelectable={false}>
              <TableHeader>
                <TableRow>
                  <TableHeaderColumn>Average Appraisal Score</TableHeaderColumn>
                  <TableHeaderColumn>Average Appraisal Quality Rating</TableHeaderColumn>
                  <TableHeaderColumn>Average Appraisal Communication</TableHeaderColumn>
                  <TableHeaderColumn>Overall Score</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={true}deselectOnClickaway={false}showRowHover={true}stripedRows={true}>
                <TableRow>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                  <TableRowColumn>x</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
            <br/>
            <br/>
          </Tab>

      </Tabs>
      </div>
      </MuiThemeProvider>
    );
  }
}

export default UserPanel;
