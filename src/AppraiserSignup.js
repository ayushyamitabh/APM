import React, {Component} from 'react';
import * as firebase from 'firebase';
import $ from 'jquery';
import {AutoComplete,
        Checkbox,
        DatePicker,
        Divider,
        LinearProgress,
        Paper,
        RaisedButton,
        Stepper,
        Step,
        StepLabel,
        StepContent,
        TextField,
        Toggle} from 'material-ui';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import UploadFile from 'material-ui/svg-icons/file/cloud-upload';
import RemoveCircle from 'material-ui/svg-icons/content/remove-circle';
import './Appraiser.css';

const tobeUAID = 'app_' + Math.random().toString(36).substr(2, 9);

class AppraiserSignup extends Component{
  constructor (props) {
    super(props);

    this.pushPageChange = this.pushPageChange.bind(this);

    this.products = ['1004D Co Detector | Water Heater Double Strapped','2 SFR','2075 Desktop Underwriter Property Insp. Report','216 and 1007','5-Plex','6-Plex','AVM','Chargeback','Co-op Appraisal (FNMA 2090)','Comparable Rent Survey 1007','Completion Report - 1004d','Condition and Marketability Report (FHLMC 2070)','Condo 1073 FHA 203K','Condo-1073','Condo-1073 FHA','Condo-1073 FHA with Comparable Rent (1007)','Condo-1073 FHA with Operating Income (216)','Condo-1073 FHA-w/216 and 1007 (Investment)','Condo-1073 w/216 and 1007 (Investment)','Condo-1073 w/Comparable Rent (1007)','Condo-1073 w/Operating Income (216)','Condo-1075 Drive-by Appraisal','Desk Review','Disaster Report (Exterior Only)','Disaster Report (Int and Ext)','E.O.R.R. w/Comparable Photos (FNMA 2055)','Employee Relocation Council Report (ERC)','Estimated Value $3 MM +','Exterior Only Co-op Appraisal (FNMA 2095)','Exterior Only Residential Report (FNMA 2055)','FHA Field Review (HUD 1038)','FHA Inspection (CIR)','Field Review','Field Review (FNMA 2000)','GLA 3','500+','Homes with 10+ Acres','Inspection Fee (Cancelled after Inspection)','Land Appraisal','Manufactured Home - 1004C','Manufactured Home - 1004C w/216 and 1007 (Inv)','Manufactured Home - 1004C w/Comparable Rent (1007)','Manufactured Home - 1004C w/Operating Income (216)','Manufactured Home FHA w/203K','Manufactured Home-1004C FHA','Multi-family FHA (FNMA 1025)','Multi-Family Field Review (FNMA 2000A)','Operating Income Statement 216','Property Inspection (FNMA 2075)','Reverse Mortgage Appraisal (1004/FHA)','Rush Fee','Single Family - 1004 w/ 203k','Single Family 1004 USDA/Rural Housing Service','Single Family-1004','Single Family-1004 FHA','Single Family-1004 FHA with Comparable Rent (1007)','Single Family-1004 FHA with Operating Income (216)','Single Family-1004 FHA-w/216 and 1007 (Investment)','Single Family-1004 w/216 and 1007 (Investment)','Single Family-1004 w/Comparable Rent (1007)','Single Family-1004 w/Operating Income (216)','Single Family-2055 Drive-by Appraisal','Single Family-2055 w/216 and 1007 (Investment)','Small Residential Income Property-2 Unit','Small Residential Income Property-2 Unit-FHA','Small Residential Income Property-3 Unit','Small Residential Income Property-3 Unit-FHA','Small Residential Income Property-4 Unit','Small Residential Income Property-4 Unit-FHA','Supplement REO Addendum','Trip Fee','Trip Fee - 2nd Trip','Uniform Residentail Appraisal w/REO (FNMA 1004)','VA 1004','Value update-1004D','Commercial'];
    this.certifications = ['Certified General',
                           'Certified Residential',
                           'Licensed',
                           'Trainee',
                           'Transitional License'];
    this.softwares = ['ACI',
                      'AIReady',
                      'Alamode',
                      'Appraisal',
                      'Bradford',
                      'CRAL',
                      'DayOne',
                      'Homeputer',
                      'SFREP',
                      'United Systems',
                      'Wilson'];
    this.usa_states = ["Alaska",
                       "Alabama",
                       "Arkansas",
                       "American Samoa",
                       "Arizona",
                       "California",
                       "Colorado",
                       "Connecticut",
                       "District of Columbia",
                       "Delaware",
                       "Florida",
                       "Georgia",
                       "Guam",
                       "Hawaii",
                       "Iowa",
                       "Idaho",
                       "Illinois",
                       "Indiana",
                       "Kansas",
                       "Kentucky",
                       "Louisiana",
                       "Massachusetts",
                       "Maryland",
                       "Maine",
                       "Michigan",
                       "Minnesota",
                       "Missouri",
                       "Mississippi",
                       "Montana",
                       "North Carolina",
                       "North Dakota",
                       "Nebraska",
                       "New Hampshire",
                       "New Jersey",
                       "New Mexico",
                       "Nevada",
                       "New York",
                       "Ohio",
                       "Oklahoma",
                       "Oregon",
                       "Pennsylvania",
                       "Puerto Rico",
                       "Rhode Island",
                       "South Carolina",
                       "South Dakota",
                       "Tennessee",
                       "Texas",
                       "Utah",
                       "Virginia",
                       "Virgin Islands",
                       "Vermont",
                       "Washington",
                       "Wisconsin",
                       "West Virginia",
                       "Wyoming"];
    this.state = {
      stepnumber: 0,
      disableMailing: false,
      uaid: tobeUAID,
      personalInfo: {},
      addressInfo: {},
      otherInfo: {
        com: false,
        fha: false,
        va: false,
        userFolder: {
          Licenses: {},
          SupportingDocuments: {}
        }
      },
      licenses: [1]
    }
    this.toggleMailingAddress = this.toggleMailingAddress.bind(this);
    this.createUser = this.createUser.bind(this);
    this.setPersonalInfo = this.setPersonalInfo.bind(this);
    this.setAddress = this.setAddress.bind(this);
    this.setOtherDetails = this.setOtherDetails.bind(this);
    this.removeLicense = this.removeLicense.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.completeSignup = this.completeSignup.bind(this);
    this.checkboxToggle = this.checkboxToggle.bind(this);
  }
  toggleMailingAddress() {
    this.setState({
      disableMailing: !this.state.disableMailing
    })
  }
  createUser(e) {
    e.preventDefault();
    var email = document.getElementById('loginemail').value;
    var emailcon = document.getElementById('loginemailcon').value;
    var password = document.getElementById('loginpassword').value;
    var passwordcon = document.getElementById('loginpasswordcon').value;
    if (email !== emailcon || password !== passwordcon) {
      alert('E-Mails or Passwords don\'t match, please make sure you don\'t have a typo.');
    } else {
      firebase.auth().createUserWithEmailAndPassword(email, password);
      this.setState({
        stepnumber: this.state.stepnumber + 1
      })
      console.log(document.getElementById('loginemail').value);
      console.log(document.getElementById('loginpassword').value);
    }
  }
  setPersonalInfo(e) {
    e.preventDefault();
    var data = {};
    $('.personal input').each((key, value) => {
      data[value.id] = value.value;
    })
    this.setState({
      stepnumber: this.state.stepnumber + 1,
      personalInfo: data
    })
    console.log(data);
  }
  setAddress(e) {
    e.preventDefault();
    var data = {};
    $('.address input').each((key, value) => {
      if (value.id === 'mailingtoggle') {
        // don't keep this
      } else {
        data[value.id] = value.value;
      }
    })
    if (this.state.disableMailing) {
      data['mailingaddress'] = data['address'];
      data['mailingcity'] = data['city'];
      data['mailingstate'] = data['state'];
      data['mailingzip'] = data['zip'];
    }
    this.setState({
      stepnumber: this.state.stepnumber + 1,
      addressInfo: data
    })
    console.log(data);
  }
  setOtherDetails(e) {
    e.preventDefault();
    var data = this.state.otherInfo;
    var pricings = '';
    $('.other input').each((key, value) => {
      if (value.id === 'va' || value.id === 'fha' || value.id === 'com' ) {
        // do nothing - need to preserve true or false
      } else if (value.id.substring(0,2) === 'Li' || value.id.substring(0,12) === 'licensestate') {
        	data.userFolder.Licenses[value.id] = value.value;
          if (value.id.substring(0,3) === 'LiD') {
            firebase.storage().ref(`${this.state.uaid}/Licenses/${value.id}`).getDownloadURL().then( (url) => {
        	    data.userFolder.Licenses[value.id] = url;
            }, (err) => {
              data.userFolder.Licenses[value.id] = null;
            });
	        }
      } else if (value.id === 'w9' || value.id === 'resume' || value.id === 'ref' || value.id === 'sa' || value.id === 'sa2' || value.id === 'bc' ||value.id === 'bcdate') {
        firebase.storage().ref(`${this.state.uaid}/SupportingDocuments/${value.id}`).getDownloadURL().then ( (url) => {
          data.userFolder.SupportingDocuments[value.id] = url;
        }, (err) => {
          data.userFolder.SupportingDocuments[value.id] = null;
        })
      } else if (value.id === 'eoi') {
        firebase.storage().ref(`${this.state.uaid}/${value.id}`).getDownloadURL().then ( (url) => {
          data.userFolder[value.id] = url;
        }, (err) => {
          data.userFolder[value.id] = null;
        })
      } else if (value.id.substring(0,3) === 'fee') {
        pricings += '\n';
        pricings += value.id;
        pricings += '\t';
        pricings += value.value;
      } else {
        data[value.id] = value.value;
      }
    })
    firebase.storage().ref(`${this.state.uaid}/pricings.xls`).putString(pricings).then( (snap) => {
      firebase.storage().ref(`${this.state.uaid}/pricings.xls`).getDownloadURL().then( (url) => {
        data.userFolder.pricings = url;
      })
    })
    this.setState({
      otherInfo: data
    })
    console.log(this.state.otherInfo);
    this.completeSignup();
  }
  completeSignup() {
    var userdata = Object.assign({},this.state.personalInfo, this.state.addressInfo, this.state.otherInfo);
    console.log(userdata);
    userdata.uaid = this.state.uaid;
    firebase.database().ref(`Appraisers/${this.state.uaid}`).set(userdata, ()=>{
      this.setState({
        stepnumber: this.state.stepnumber+ 1
      })
    });
    firebase.database().ref(`Users/${firebase.auth().currentUser.uid}`).set(this.state.uaid);
  }
  removeLicense(num) {
    var licenses = this.state.licenses;
    licenses[num] = 'removed';
    this.setState({
      licenses: licenses
    })
  }
  uploadHandler(e) {
    console.log(e.target.id);
    const fileID = e.target.id;
    const metadata = {
      user: this.state.uaid
    }
    const file = e.target.files[0];
    if (fileID === 'w9' || fileID === 'resume' || fileID === 'sa' || fileID === 'sa2' || fileID === 'bc' || fileID === 'ref') {
      firebase.storage().ref(`${this.state.uaid}/SupportingDocuments/${fileID}`).put(file, metadata).on('state_changed', (uploadSnap) => {
        var progress = Math.round(100 * uploadSnap.bytesTransferred / uploadSnap.totalBytes);
        this.setState({
          [`${fileID}upload`] : progress
        })
      }, (err)=> {
        alert('Something went wrong while trying to upload your file.')
      }, () => {
        //COMPLETE
      })
    } else if ( fileID.substring(0,2) === 'Li') {
      firebase.storage().ref(`${this.state.uaid}/Licenses/${fileID}`).put(file, metadata).on('state_changed', (uploadSnap) => {
        var progress = Math.round(100 * uploadSnap.bytesTransferred / uploadSnap.totalBytes);
        this.setState({
          [`${fileID}upload`] : progress
        })
      }, (err)=> {
        alert('Something went wrong while trying to upload your file.')
      }, () => {
        //COMPLETE
      })
    } else {
      firebase.storage().ref(`${this.state.uaid}/${fileID}`).put(file, metadata).on('state_changed', (uploadSnap) => {
        var progress = Math.round(100 * uploadSnap.bytesTransferred / uploadSnap.totalBytes);
        this.setState({
          [`${fileID}upload`] : progress
        })
      }, (err)=> {
        alert('Something went wrong while trying to upload your file.')
      }, () => {
        //COMPLETE
      })
    }
  }
  checkboxToggle(e) {
    e.preventDefault();
    var checkstate = this.state.otherInfo;
    checkstate[e.target.id] = !this.state.otherInfo[e.target.id];
    this.setState({
      otherInfo: checkstate
    })
  }

  pushPageChange(page){
    this.props.pageChanger(page.number);
    this.props.status(page.status);
  }
  render() {
    return (
      <MuiThemeProvider>
        <div className="appraiser-signup-page">
          <RaisedButton onClick={()=>this.pushPageChange({number:2,status:'login'})} label="← Back To Login" fullWidth={false}/>
          <Stepper activeStep={this.state.stepnumber} orientation="vertical" >
            <Step>
              <StepLabel>Login Information</StepLabel>
              <StepContent className="step-content">
                <form onSubmit={this.createUser}>
                  <TextField
                    id="loginemail"
                    name="loginemail"
                    fullWidth={true}
                    type="email"
                    required={true}
                    floatingLabelText="Login E-Mail" />
                  <TextField
                    id="loginemailcon"
                    fullWidth={true}
                    type="email"
                    required={true}
                    floatingLabelText="Confirm E-Mail" />
                  <TextField
                    id="loginpassword"
                    name="loginpassword"
                    fullWidth={true}
                    type="password"
                    required={true}
                    floatingLabelText="Password" />
                  <TextField
                    id="loginpasswordcon"
                    fullWidth={true}
                    type="password"
                    required={true}
                    floatingLabelText="Confirm Password" />
                  <RaisedButton
                    className="next-step-button"
                    primary={true}
                    type="submit"
                    label="Sign-Up & Get Started" />
                </form>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Personal Details</StepLabel>
                <StepContent className="step-content">
                  <form className="personal" onSubmit={this.setPersonalInfo}>
                  <TextField
                    id="fname"
                    name="fname"
                    required={true}
                    fullWidth={true}
                    floatingLabelText="First Name"/>
                  <TextField
                    id="lname"
                    name="lname"
                    required={true}
                    fullWidth={true}
                    floatingLabelText="Last Name"/>
                  <TextField
                    id="cname"
                    name="cname"
                    required={true}
                    fullWidth={true}
                    floatingLabelText="Name On Check"/>
                  <TextField
                    id="company"
                    name="company"
                    required={true}
                    fullWidth={true}
                    floatingLabelText="Company Name"/>
                  <TextField
                    id="phone"
                    name="phone"
                    required={true}
                    fullWidth={true}
                    floatingLabelText="Phone"/>
                  <TextField
                    id="phoneAlt"
                    name="phoneAlt"
                    required={true}
                    fullWidth={true}
                    floatingLabelText="Alternate Phone"/>
                  <TextField
                    id="email"
                    name="email"
                    type="email"
                    required={true}
                    fullWidth={true}
                    floatingLabelText="Contact E-Mail"/>
                  <TextField
                    id="ssn"
                    name="ssn"
                    required={true}
                    fullWidth={true}
                    floatingLabelText="EIN / SSN"/>
                  <RaisedButton
                    className="next-step-button"
                    primary={true}
                    type="submit"
                    label="Continue"/>
              </form>
              </StepContent>
            </Step>

            <Step>
              <StepLabel>Address</StepLabel>
                <StepContent className="step-content">
                  <p>Physical Address</p>
                  <form className="address" onSubmit={this.setAddress}>
                    <TextField
                      id="address"
                      name="address"
                      required={true}
                      fullWidth={true}
                      floatingLabelText="Address" />
                    <TextField
                      id="city"
                      name="city"
                      required={true}
                      fullWidth={true}
                      floatingLabelText="City"/>
                    <AutoComplete
                      id="state"
                      name="state"
                      floatingLabelText="State"
                      maxSearchResults={3}
                      openOnFocus={true}
                      fullWidth={true}
                      filter={AutoComplete.fuzzyFilter}
                      dataSource={this.usa_states}/>
                    <TextField
                      id="zip"
                      name="zip"
                      required={true}
                      fullWidth={true}
                      floatingLabelText="Zip"/>
                    <p>Mailing Address</p>
                    <Toggle
                      onToggle={this.toggleMailingAddress}
                      id="mailingtoggle"
                      name="mailingtoggle"
                      className="address-checkbox"
                      labelPosition="right"
                      label="Same as physical address" />
                    <TextField
                      disabled={this.state.disableMailing}
                      id="mailingaddress"
                      name="mailingaddress"
                      required={true}
                      fullWidth={true}
                      floatingLabelText="Address" />
                    <TextField
                      disabled={this.state.disableMailing}
                      id="mailingcity"
                      name="mailingcity"
                      required={true}
                      fullWidth={true}
                      floatingLabelText="City"/>
                    <AutoComplete
                      disabled={this.state.disableMailing}
                      id="mailingstate"
                      name="mailingstate"
                      floatingLabelText="State"
                      maxSearchResults={3}
                      openOnFocus={true}
                      fullWidth={true}
                      filter={AutoComplete.fuzzyFilter}
                      dataSource={this.usa_states}/>
                    <TextField
                      disabled={this.state.disableMailing}
                      id="mailingzip"
                      name="mailingzip"
                      required={true}
                      fullWidth={true}
                      floatingLabelText="Zip"/>
                    <RaisedButton
                      className="next-step-button"
                      type="submit"
                      primary={true}
                      label="Continue" />
                  </form>
                </StepContent>
            </Step>

            <Step>
              <StepLabel>Appraiser Details</StepLabel>
              <StepContent className="step-content">
                <form className="other" onSubmit={this.setOtherDetails}>
                  <AutoComplete
                    required={true}
                    id="softwareChoice"
                    name="softwareChoice"
                    floatingLabelText="Appraisal Software Choice"
                    maxSearchResults={3}
                    openOnFocus={true}
                    fullWidth={true}
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={this.softwares} />
                  <TextField
                    floatingLabelText="Other Details"
                    rowsMax={4}
                    id="details"
                    name="details"
                    className="details"
                    fullWidth={true}
                    multiLine={true} />
                  <AutoComplete
                    required={true}
                    id="certificationType"
                    name="certificationType"
                    floatingLabelText="Certification Type"
                    maxSearchResults={3}
                    openOnFocus={true}
                    fullWidth={true}
                    filter={AutoComplete.fuzzyFilter}
                    dataSource={this.certifications} />
                  <div className="inline-checkbox">
                    <Checkbox
                      onCheck={this.checkboxToggle}
                      checked={this.state.otherInfo.fha}
                      id="fha"
                      className="checkbox"
                      label="FHA Certified"/>
                    <Checkbox
                      onCheck={this.checkboxToggle}
                      checked={this.state.otherInfo.va}
                      id="va"
                      className="checkbox"
                      label="VA Certified"/>
                    <Checkbox
                      onCheck={this.checkboxToggle}
                      checked={this.state.otherInfo.com}
                      id="com"
                      className="checkbox"
                      label="Commercial Certified"/>
                  </div>
                  <Divider className="divider" />
                  <p>E&O Insurance</p>
                  <TextField
                    required={true}
                    fullWidth={true}
                    id="ibn"
                    name="ibn"
                    floatingLabelText="Insurance Beneficiary Name"/>
                  <TextField
                    required={true}
                    fullWidth={true}
                    id="ipn"
                    name="ipn"
                    floatingLabelText="Insurance Policy Number"/>
                  <TextField
                    required={true}
                    fullWidth={true}
                    id="ic"
                    name="ic"
                    floatingLabelText="Insurance Company"/>
                  <TextField
                    required={true}
                    fullWidth={true}
                    id="ca"
                    name="ca"
                    floatingLabelText="Coverage Amount"/>
                  <TextField
                    required={true}
                    fullWidth={true}
                    id="pca"
                    name="pca"
                    floatingLabelText="Per Incident Coverage Amount"/>
                  <FileUpload uploadHandler={this.uploadHandler} itemID='eoi' value={this.state.eoiupload}  />
                  <Divider className="divider" />
                  <p>Licenses</p>
                  {
                    this.state.licenses.map((data, index)=>{
                      var item = '';
                      if (data === 'removed') {
                        item = <div key={index}></div>;
                      } else {
                        item =
                          <SingleLicense
                            value={this.state[`LiD${index}upload`]}
                            uploadHandler={this.uploadHandler}
                            states={this.usa_states}
                            key={index}
                            number={index}
                            removeLicense={this.removeLicense}/>;
                      }
                      return item;
                    })
                  }
                  <RaisedButton
                    onTouchTap={()=>{
                      var licenses = this.state.licenses;
                      var len = licenses.length + 1;
                      licenses.push(len);
                      this.setState({
                        licenses: licenses
                      })
                    }}
                    label="Add License"/>
                  <Divider className="divider" />
                  <p>Supporting Documents</p>
                  <FileUpload label="W-9 Document" uploadHandler={this.uploadHandler} itemID='w9' value={this.state.w9upload}  />
                  <FileUpload label="Resume" uploadHandler={this.uploadHandler} itemID='resume' value={this.state.resumeupload}  />
                  <FileUpload label="Sample Appraisal" uploadHandler={this.uploadHandler} itemID='sa' value={this.state.saupload}  />
                  <FileUpload label="Sample Appraisal 2" uploadHandler={this.uploadHandler} itemID='sa2' value={this.state.sa2upload}  />
                  <FileUpload label="References" uploadHandler={this.uploadHandler} itemID='ref' value={this.state.refupload}  />
                  <DatePicker
                    required={true}
                    floatingLabelText="Background Check Issue Date"
                    id="bcdate"
                    name="bcdate"
                    fullWidth={true}
                    locale="en-US"/>
                  <FileUpload label="Background Check" uploadHandler={this.uploadHandler} itemID='bc' value={this.state.bcupload}  />
                  <Divider className="divider" />
                  <p>Product Fees</p>
                  <p className="sub">(Amount in USD '$' )</p>
                  <div className="product-fees">
                    {
                      this.products.map((data, index)=>{
                        return (
                          <TextField
                            key={`fee${index}`}
                            id={`fee${index}`}
                            name={`fee${index}`}
                            floatingLabelText={data}
                            fullWidth={true}/>
                        );
                      })
                    }
                  </div>
                  <RaisedButton
                    className="next-step-button"
                    type="submit"
                    primary={true}
                    label="Complete Sign-Up"/>
                </form>
              </StepContent>
            </Step>
          </Stepper>
        </div>
      </MuiThemeProvider>
    );
  }
}

function FileUpload (props) {
  return (
    <div>
      <LinearProgress color="#4CAF50" className="progress" mode="determinate" value={props.value} />
      <RaisedButton
        backgroundColor={props.label !== null ? "#7cb342" : "#039be5"}
        containerElement='label'
        className='upload'
        fullWidth={true}
        primary={true}
        label={props.label ? props.label : "Upload File"}
        onChange={props.uploadHandler}
        >
          <input id={props.itemID} type="file" style={{ display: 'none' }} />
      </RaisedButton>
    </div>
  );
}

function SingleLicense (props) {
  return (
    <Paper zDepth={2} className="licenses">
      <AutoComplete
        required={true}
        id={`licensestate${props.number}`}
        name={`licensestate${props.number}`}
        floatingLabelText="State"
        maxSearchResults={3}
        openOnFocus={true}
        fullWidth={true}
        filter={AutoComplete.fuzzyFilter}
        dataSource={props.states}/>
      <TextField
        id={`LiLN${props.number}`}
        name={`LiLN${props.number}`}
        floatingLabelText="License Number"
        fullWidth={true}
        required={true}/>
      <DatePicker
        required={true}
        id={`LiED${props.number}`}
        name={`LiED${props.number}`}
        className="date"
        fullWidth={true}
        floatingLabelText="Expiration Date"
        locale="en-US" />
      <FileUpload uploadHandler={props.uploadHandler} itemID={`LiD${props.number}`} value={props.value}  />
      <RaisedButton
        secondary={true}
        fullWidth={true}
        label="Remove License"
        onTouchTap={()=>{props.removeLicense(props.number)}} />
    </Paper>
  );
}

export default AppraiserSignup;
