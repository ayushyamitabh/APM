import React, {Component} from 'react';
import './OrderCreate.css';
import {AutoComplete,
        Chip,
        DatePicker,
        IconButton,
        RaisedButton,
        TextField,
        Toolbar,
        ToolbarGroup,
        ToolbarTitle} from 'material-ui';
import BackIcon from 'material-ui/svg-icons/content/backspace';
import * as firebase from 'firebase';

const dataSourceConfig = {
  text: 'name',
  value: 'ucid'
};

class OrderCreate extends Component {
    constructor (props) {
        super (props);
        this.products = ['1004D Co Detector | Water Heater Double Strapped','2 SFR','2075 Desktop Underwriter Property Insp. Report','216 and 1007','5-Plex','6-Plex','AVM','Chargeback','Co-op Appraisal (FNMA 2090)','Comparable Rent Survey 1007','Completion Report - 1004d','Condition and Marketability Report (FHLMC 2070)','Condo 1073 FHA 203K','Condo-1073','Condo-1073 FHA','Condo-1073 FHA with Comparable Rent (1007)','Condo-1073 FHA with Operating Income (216)','Condo-1073 FHA-w/216 and 1007 (Investment)','Condo-1073 w/216 and 1007 (Investment)','Condo-1073 w/Comparable Rent (1007)','Condo-1073 w/Operating Income (216)','Condo-1075 Drive-by Appraisal','Desk Review','Disaster Report (Exterior Only)','Disaster Report (Int and Ext)','E.O.R.R. w/Comparable Photos (FNMA 2055)','Employee Relocation Council Report (ERC)','Estimated Value $3 MM +','Exterior Only Co-op Appraisal (FNMA 2095)','Exterior Only Residential Report (FNMA 2055)','FHA Field Review (HUD 1038)','FHA Inspection (CIR)','Field Review','Field Review (FNMA 2000)','GLA 3','500+','Homes with 10+ Acres','Inspection Fee (Cancelled after Inspection)','Land Appraisal','Manufactured Home - 1004C','Manufactured Home - 1004C w/216 and 1007 (Inv)','Manufactured Home - 1004C w/Comparable Rent (1007)','Manufactured Home - 1004C w/Operating Income (216)','Manufactured Home FHA w/203K','Manufactured Home-1004C FHA','Multi-family FHA (FNMA 1025)','Multi-Family Field Review (FNMA 2000A)','Operating Income Statement 216','Property Inspection (FNMA 2075)','Reverse Mortgage Appraisal (1004/FHA)','Rush Fee','Single Family - 1004 w/ 203k','Single Family 1004 USDA/Rural Housing Service','Single Family-1004','Single Family-1004 FHA','Single Family-1004 FHA with Comparable Rent (1007)','Single Family-1004 FHA with Operating Income (216)','Single Family-1004 FHA-w/216 and 1007 (Investment)','Single Family-1004 w/216 and 1007 (Investment)','Single Family-1004 w/Comparable Rent (1007)','Single Family-1004 w/Operating Income (216)','Single Family-2055 Drive-by Appraisal','Single Family-2055 w/216 and 1007 (Investment)','Small Residential Income Property-2 Unit','Small Residential Income Property-2 Unit-FHA','Small Residential Income Property-3 Unit','Small Residential Income Property-3 Unit-FHA','Small Residential Income Property-4 Unit','Small Residential Income Property-4 Unit-FHA','Supplement REO Addendum','Trip Fee','Trip Fee - 2nd Trip','Uniform Residentail Appraisal w/REO (FNMA 1004)','VA 1004','Value update-1004D','Commercial'];
        this.state = {
            clients: [],
            chosenClient: '',
            products: [],
            uoid: 'apm_' + Math.random().toString(36).substr(2, 9)
        }
        this.handleProductAuto = this.handleProductAuto.bind(this);
        this.createOrder = this.createOrder.bind(this);
        this.handleClientAuto = this.handleClientAuto.bind(this);
    }
    componentWillMount() {
        firebase.database().ref(`Clients`).on('value', (list)=>{
            var listOfClient = list.val();
            Object.keys(listOfClient).map((key, index)=>{
                this.state.clients.push({name:listOfClient[key]['Info']['Name'],ucid:listOfClient[key].UCID});
            })
        })
    }
    handleProductAuto(chosen, index) {
        var newProducts = this.state.products;
        newProducts.push(chosen);
        this.setState({
            products: newProducts
        })
    }
    handleClientAuto(chosen, index) {
        this.setState({
            chosenClient: chosen.ucid
        })
    }
    removeProduct(i) {
        var newProducts = this.state.products;
        newProducts.splice(i,1);
        this.setState({
            products: newProducts
        })
    }
    createOrder(e){
        e.preventDefault();
        var data = {
            Chat: {
                number: 1
            },
            Appraiser: false,
            Bank: this.state.chosenClient,
            Products: this.state.products,
            UOID: this.state.uoid,
            PropertyType: document.getElementById('propertyType').value,
            Date: document.getElementById('Date').value,
            DueDate: false,
            Homeowner: {
                Address: document.getElementById('homeownerAddress').value,
                Contact: document.getElementById('homeownerContact').value,
                Email: document.getElementById('homeownerEmail').value,
                Name: document.getElementById('homeownerName').value
            }
        };
        firebase.database().ref(`Orders/${this.state.uoid}`).set(data);
        var orders = [];
        firebase.database().ref(`Clients/${data.Bank}/Orders`).once('value',(list)=>{
            orders = list.val();
            if (orders) {
                orders.push(this.state.uoid);
            } else {
                orders = [this.state.uoid];
            }
        });
        firebase.database().ref(`Clients/${data.Bank}/Orders`).set(orders).then(()=>{
            this.props.goBack(true, 'Order');
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
                        <ToolbarTitle className="toolbar-title" text="Create New Order" />
                    </ToolbarGroup>
                    <ToolbarGroup>
                        {this.state.uoid}
                    </ToolbarGroup>
                </Toolbar>
                <form className="order-create" onSubmit={this.createOrder}>
                    <TextField 
                        id="UOID"
                        disabled={true}
                        fullWidth
                        floatingLabelText="UOID"
                        value={this.state.uoid}
                    />
                    <AutoComplete
                        id="Bank"
                        required={true}
                        hintText="Search by client's name"
                        openOnFocus={true}
                        onNewRequest={this.handleClientAuto}
                        dataSource={this.state.clients}
                        dataSourceConfig={dataSourceConfig}
                        filter={AutoComplete.fuzzyFilter}
                        floatingLabelText="CLIENT"
                        fullWidth={true}
                    />
                    <DatePicker 
                        floatingLabelText="Date"
                        id="Date"
                        defaultDate={new Date()}
                        disableYearSelection={true}
                        fullWidth
                    />
                    <h3>ABOUT HOMEOWNER</h3>
                    <TextField 
                        fullWidth
                        required
                        id="homeownerName"
                        floatingLabelText="Full Name"
                    />
                    <TextField
                        type="tel"
                        fullWidth
                        required
                        id="homeownerContact"
                        floatingLabelText="Primary Contact"
                    />
                    <TextField
                        type="email"
                        fullWidth
                        required
                        id="homeownerEmail"
                        floatingLabelText="E-Mail"
                    />
                    <TextField
                        fullWidth
                        required
                        id="homeownerAddress"
                        floatingLabelText="Full Address"
                    />
                    <h3>ORDER DETAILS</h3>
                    <AutoComplete 
                        fullWidth
                        required
                        floatingLabelText="Product Types"
                        hintText="Click product type to add to list"
                        dataSource={this.products}
                        filter={AutoComplete.fuzzyFilter}
                        onNewRequest={this.handleProductAuto}
                        maxSearchResults={5}
                    />
                    <div className="product-display">
                    {
                        this.state.products.map((data, index)=>{
                            return (
                                <Chip 
                                    className="product-chip" 
                                    key={index}
                                    onRequestDelete={()=>{this.removeProduct(index)}}>
                                    {data}
                                </Chip>
                            );
                        })
                    }
                    </div>
                    <TextField 
                        required
                        fullWidth
                        id="propertyType"
                        floatingLabelText="Property Type"
                    />
                    <RaisedButton 
                        primary
                        fullWidth
                        type="submit"
                        label="CREATE ORDER"
                    />
                </form>
            </div>
        );
    }
}

export default OrderCreate;