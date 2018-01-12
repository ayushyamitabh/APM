import React, {Component} from 'react';
import './ClientCreate.css';
import {IconButton, RaisedButton, TextField, Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui';
import BackIcon from 'material-ui/svg-icons/content/backspace';
import * as firebase from 'firebase';

class ClientCreate extends Component {
    constructor (props) {
        super(props);
        this.state = {
            ucid: 'cli_' + Math.random().toString(36).substr(2, 9)
        };
        this.createClient = this.createClient.bind(this);
    }
    createClient(e) {
        e.preventDefault();
        var data = {
            Info: {
                Address: document.getElementById('address').value,
                Name: document.getElementById('name').value,
                Contact: document.getElementById('contact').value,
                Email: document.getElementById('email').value
            },
            Orders: [],
            UCID: this.state.ucid
        };
        firebase.database().ref(`Clients/${this.state.ucid}`).set(data).then(()=>{
            this.props.goBack(true, 'Client');
        })
    }
    render() {
        return (
            <div>
                <Toolbar>
                    <ToolbarGroup firstChild={true} >
                        <IconButton className="back-btn" tooltip="Go Back / Cancel" onClick={this.props.goBack}>
                            <BackIcon />
                        </IconButton>
                        <ToolbarTitle className="toolbar-title" text="Add Client" />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        {this.state.ucid}
                    </ToolbarGroup>
                </Toolbar>
                <form onSubmit={this.createClient}>
                    <TextField 
                        fullWidth
                        required
                        id="name"
                        floatingLabelText="Organization Name"
                    />
                    <TextField 
                        fullWidth
                        required
                        id="address"
                        floatingLabelText="Full Address"
                    />
                    <TextField
                        type="email"
                        fullWidth
                        required
                        id="email"
                        floatingLabelText="Primary Contact E-Mail"
                    />
                    <TextField 
                        type="tel"
                        fullWidth
                        required
                        id="contact"
                        floatingLabelText="Primary Contact Number"
                    />
                    <RaisedButton 
                        fullWidth
                        primary
                        type="submit"
                        label="ADD CLIENT"
                    />
                </form>
            </div>
        );
    }
}

export default ClientCreate;