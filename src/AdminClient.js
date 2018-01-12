import React, {Component} from 'react';
import * as firebase from 'firebase';
import AdminClientDetails from './AdminClientDetails.js';
import {AutoComplete,
        RaisedButton,
        Table,
        TableBody,
        TableHeader,
        TableHeaderColumn,
        TableRow,
        TableRowColumn,
        Toolbar, 
        ToolbarGroup, 
        ToolbarTitle} from 'material-ui';

const dataSourceConfig = {
  text: 'name',
  value: 'ucid'
};

class AdminClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
            searchSource: [],
            showClientDetails: false,
            ucid: ''
        };
        this.handleSearchRequest = this.handleSearchRequest.bind(this);
        this.hideClientDetails = this.hideClientDetails.bind(this);
    }
    componentWillMount() {
        firebase.database().ref(`Clients`).on('value',(snap)=>{
            var data = snap.val();
            this.setState({
                data: data
            })
            Object.keys(data).map((key,index)=>{
                var ucid = data[key]['UCID'];
                var name = data[key]['Info']['Name'];
                this.state.searchSource.push({name:name, ucid:ucid});
                this.state.searchSource.push({name:ucid, ucid:ucid});
            })
        })
    }
    hideClientDetails () {
        this.setState({
            showClientDetails: false,
            ucid: ''
        })
    }
    handleSearchRequest(chosen, index) {
        this.setState({
            showClientDetails: true,
            ucid: chosen.ucid
        })
    }
    render() {
        return (
            <div>
            {
                this.state.showClientDetails === true ? <AdminClientDetails hideDetails={this.hideClientDetails} ucid={this.state.ucid} /> :
                <div className="admin-client">
                    <AutoComplete
                        hintText="Search by client's name or UCID"
                        openOnFocus={false}
                        onNewRequest={this.handleSearchRequest}
                        dataSource={this.state.searchSource}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.fuzzyFilter}
                        floatingLabelText="SEARCH CLIENTS"
                        fullWidth={true}
                        maxSearchResults={5}
                    />
                    <Toolbar className="admin-client-toolbar">
                        <ToolbarGroup>
                            <ToolbarTitle text="Options" />
                        </ToolbarGroup>
                    </Toolbar>
                    <Table
                    fixedHeader={true}
                    selectable={true}
                    multiSelectable={false}>
                    <TableHeader enableSelectAll={false}>
                        <TableRow>
                        <TableHeaderColumn>#</TableHeaderColumn>
                        <TableHeaderColumn>Name</TableHeaderColumn>
                        <TableHeaderColumn>Address</TableHeaderColumn>
                        <TableHeaderColumn>E-Mail</TableHeaderColumn>
                        <TableHeaderColumn>Contact</TableHeaderColumn>
                        <TableHeaderColumn>Actions</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody
                        displayRowCheckbox={true}
                        deselectOnClickaway={false}
                        showRowHover={true}
                        stripedRows={true}>
                    {
                        Object.keys(this.state.data).map((key, index)=>{
                            return(
                                <TableRow key={index}>
                                    <TableRowColumn>
                                        {index}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {this.state.data[key]['Info']['Name']}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {this.state.data[key]['Info']['Address']}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {this.state.data[key]['Info']['Email']}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        {this.state.data[key]['Info']['Contact']}
                                    </TableRowColumn>
                                    <TableRowColumn>
                                        <RaisedButton secondary={true} label="View Details" onTouchTap={()=>{this.setState({ucid: key, showClientDetails: true})}} />
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

export default AdminClient;