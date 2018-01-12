import React, {Component} from 'react';
import * as firebase from 'firebase';
import AdminAppraiserProfile from './AdminAppraiserProfile.js';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RaisedButton,
        Table,
        TableRow,
        TableHeader,
        TableHeaderColumn,
        TableRowColumn,
        TableBody,
        Toolbar,
        ToolbarGroup,
        ToolbarTitle,
        AutoComplete } from 'material-ui';

const dataSourceConfig = {
  text: 'name',
  value: 'uaid'
}

class AdminAppraiser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appraisers : {},
      dataSource : [],
      profile: false,
      profileUAID: ''
    };
    this.showProfile = this.showProfile.bind(this);
    this.resetView = this.resetView.bind(this);
    this.handleNewRequest = this.handleNewRequest.bind(this);
  }
  componentWillMount(){
    firebase.database().ref('Appraisers').on('value',(appSnap)=>{
      this.setState({
        appraisers: appSnap.val()
      })
      Object.keys(appSnap.val()).map((key,index)=>{
        var val = appSnap.val();
        this.state.dataSource.push({
          name: `${val[key]['fname']} ${val[key]['lname']}`,
          uaid: key
        });
        this.state.dataSource.push({
          name: key,
          uaid: key
        });
      })
    })
  }
  handleNewRequest(chosenRequest, index){
    //chosenRequest.uaid
    this.showProfile(chosenRequest.uaid);
  }
  showProfile(uaid){
    this.setState({
      profile: true,
      profileUAID: uaid
    })
  }
  resetView() {
    this.setState({
      profile: false,
      profileUAID: 0
    })
  }
  render(){
    return(
      <MuiThemeProvider>
        { this.state.profile ? <AdminAppraiserProfile uaid={this.state.profileUAID} goBack={this.resetView}/> :
          <div>
            <div className="admin-appraiser-search">
              <AutoComplete
                hintText="Search by appraiser's name or UAID"
                openOnFocus={false}
                onNewRequest={this.handleNewRequest}
                dataSource={this.state.dataSource}
                dataSourceConfig={dataSourceConfig}
                filter={AutoComplete.fuzzyFilter}
                floatingLabelText="SEARCH APPRAISERS"
                fullWidth={true}
              />
            </div>
            <Toolbar className="admin-appraiser-toolbar">
              <ToolbarGroup>
                <ToolbarTitle text="Options" />
              </ToolbarGroup>
            </Toolbar>
            <Table
              className="admin-appraiser-list"
              fixedHeader={true}
              selectable={true}
              multiSelectable={false}>
              <TableHeader enableSelectAll={false}>
                <TableRow>
                  <TableHeaderColumn>#</TableHeaderColumn>
                  <TableHeaderColumn>Name</TableHeaderColumn>
                  <TableHeaderColumn>UAID</TableHeaderColumn>
                  <TableHeaderColumn>Action</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
              displayRowCheckbox={true}
              deselectOnClickaway={false}
              showRowHover={true}
              stripedRows={true}>
                {
                  Object.keys(this.state.appraisers).map((key, index)=>{
                    return( <TableRow key={index}>
                      <TableRowColumn>
                        {index}
                      </TableRowColumn>
                      <TableRowColumn>
                        {`${this.state.appraisers[key]['fname']} ${this.state.appraisers[key]['lname']}`}
                      </TableRowColumn>
                      <TableRowColumn>
                        {this.state.appraisers[key]['uaid']}
                      </TableRowColumn>
                      <TableRowColumn>
                        <RaisedButton label="View Profile" secondary={true} onClick={()=>{this.showProfile(this.state.appraisers[key]['uaid']);}}/>
                      </TableRowColumn>
                    </TableRow>);
                  })
                }
              </TableBody>
            </Table>
          </div>
        }
      </MuiThemeProvider>
    );
  }
}

export default AdminAppraiser;
