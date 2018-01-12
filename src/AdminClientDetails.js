import React, {Component} from 'react';
import * as firebase from 'firebase';
import AdminOrderDetail from './AdminOrderDetail.js';
import {Dialog,
        FlatButton,
        RaisedButton,
        Snackbar,
        TextField,
        Toolbar,
        ToolbarGroup,
        ToolbarSeparator,
        ToolbarTitle} from 'material-ui';

class AdminClientDetails extends Component {
    constructor (props) {
        super(props);
        this.state = {
            data: '',
            dialogopen: false,
            uoid:'',
            edited: false,
            notification: false,
            notificationMessage: ''
        };
        this.showOrder = this.showOrder.bind(this);
        this.editVal = this.editVal.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
    }
    componentWillMount() {
        firebase.database().ref(`Clients/${this.props.ucid}`).on('value',(snap)=>{
            this.setState({
                data: snap.val()
            })
        })
    }
    showOrder(uoid) {
        this.setState({
            dialogopen: true,
            uoid: uoid
        })
    }
    editVal(e){
        var id = e.target.id.toString().substr(1,e.target.id.length);
        var data = this.state.data;
        data['Info'][id] = e.target.value;
        this.setState({
            data: data,
            edited: true
        })
    }
    saveChanges() {
        this.setState({
            notification: true,
            notificationMessage: 'Saving changes...',
            edited: false
        })
        firebase.database().ref(`Clients/${this.props.ucid}`).set(this.state.data).then(()=>{
            this.setState({
                notification: true,
                notificationMessage: 'Successfully Saved Changes'
            })
        })
    }
    render() {
        return (
            <div className="admin-client-details">
                <Snackbar
                    open={this.state.notification}
                    message={this.state.notificationMessage}
                    autoHideDuration={3000}
                    onRequestClose={()=>{this.setState({notification:false,notificationMessage:''})}}
                />
                <Dialog
                    open={this.state.dialogopen}
                    title={`Order Details for ${this.state.dialoguoid}`}
                    onRequestClose={this.handleDialogClose}
                    bodyClassName="admin-appraiser-order-details"
                >
                    <AdminOrderDetail isDialog={true} hideDetails={()=>{this.setState({uoid:'',dialogopen:false})}} uoid={this.state.uoid} />
                </Dialog>
                <Toolbar>
                    <ToolbarGroup firstChild={true}>
                        <FlatButton label="← Back" onTouchTap={this.props.hideDetails}/>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarTitle text={this.props.ucid} />
                        <ToolbarSeparator />
                        <RaisedButton onTouchTap={this.saveChanges} disabled={!this.state.edited} label="Save Changes" primary={true} />
                    </ToolbarGroup>
                </Toolbar>
                <h4>INFORMATION</h4>
                <TextField 
                    fullWidth
                    id="OName"
                    floatingLabelText="Client Name"
                    value={this.state.data.Info.Name}
                    onChange={this.editVal}
                />
                <TextField 
                    id="OAddress"
                    fullWidth
                    floatingLabelText="Client Address"
                    value={this.state.data.Info.Address}
                    onChange={this.editVal}
                />
                <TextField 
                    id="OEmail"
                    fullWidth
                    floatingLabelText="Client E-Mail"
                    value={this.state.data.Info.Email}
                    onChange={this.editVal}
                />
                <TextField 
                    id="OContact"
                    fullWidth
                    floatingLabelText="Client Phone"
                    value={this.state.data.Info.Contact}
                    onChange={this.editVal}
                />
                {
                    !this.state.data.Orders ? <h4>THIS CLIENT DOESN'T HAVE ANY ORDERS YET</h4> :
                    <div>
                        <h4>ORDERS</h4>
                        {
                            this.state.data.Orders.map((uoid,index)=>{
                                return (
                                    <RaisedButton 
                                        onTouchTap={()=>{this.showOrder(uoid)}} 
                                        className="order-btn" 
                                        key={`Order${index}`} 
                                        primary 
                                        label={uoid.toString().toUpperCase()}
                                    />
                                );
                            })
                        }
                    </div>
                }
            </div>
        );
    }
}

export default AdminClientDetails;