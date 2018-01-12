import React, {Component} from 'react';
import LicenseInformation from './LicenseInformation';
import SupportingDocuments from './SupportingDocuments';
import {Button, Panel, FormGroup, InputGroup, FormControl, Checkbox, ControlLabel, Well, ListGroup, ListGroupItem, ProgressBar} from 'react-bootstrap';
import $ from 'jquery';
import * as firebase from 'firebase';

const tobeUAID = 'app_' + Math.random().toString(36).substr(2, 9);

class AppraiserSignup extends Component{
  constructor(props){
    super(props);
    this.states= ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];
    this.softwares = ['ACI','AIReady','Alamode','Appraisal','Bradford','CRAL','DayOne','Homeputer','SFREP','United Systems','Wilson','Other'];
    this.certifications = ['Certified General','Certified Residential','Licensed','Trainee','Transitional License'];
    this.products = ['1004D Co Detector | Water Heater Double Strapped','2 SFR','2075 Desktop Underwriter Property Insp. Report','216 and 1007','5-Plex','6-Plex','AVM','Chargeback','Co-op Appraisal (FNMA 2090)','Comparable Rent Survey 1007','Completion Report - 1004d','Condition and Marketability Report (FHLMC 2070)','Condo 1073 FHA 203K','Condo-1073','Condo-1073 FHA','Condo-1073 FHA with Comparable Rent (1007)','Condo-1073 FHA with Operating Income (216)','Condo-1073 FHA-w/216 and 1007 (Investment)','Condo-1073 w/216 and 1007 (Investment)','Condo-1073 w/Comparable Rent (1007)','Condo-1073 w/Operating Income (216)','Condo-1075 Drive-by Appraisal','Desk Review','Disaster Report (Exterior Only)','Disaster Report (Int and Ext)','E.O.R.R. w/Comparable Photos (FNMA 2055)','Employee Relocation Council Report (ERC)','Estimated Value $3 MM +','Exterior Only Co-op Appraisal (FNMA 2095)','Exterior Only Residential Report (FNMA 2055)','FHA Field Review (HUD 1038)','FHA Inspection (CIR)','Field Review','Field Review (FNMA 2000)','GLA 3','500+','Homes with 10+ Acres','Inspection Fee (Cancelled after Inspection)','Land Appraisal','Manufactured Home - 1004C','Manufactured Home - 1004C w/216 and 1007 (Inv)','Manufactured Home - 1004C w/Comparable Rent (1007)','Manufactured Home - 1004C w/Operating Income (216)','Manufactured Home FHA w/203K','Manufactured Home-1004C FHA','Multi-family FHA (FNMA 1025)','Multi-Family Field Review (FNMA 2000A)','Operating Income Statement 216','Property Inspection (FNMA 2075)','Reverse Mortgage Appraisal (1004/FHA)','Rush Fee','Single Family - 1004 w/ 203k','Single Family 1004 USDA/Rural Housing Service','Single Family-1004','Single Family-1004 FHA','Single Family-1004 FHA with Comparable Rent (1007)','Single Family-1004 FHA with Operating Income (216)','Single Family-1004 FHA-w/216 and 1007 (Investment)','Single Family-1004 w/216 and 1007 (Investment)','Single Family-1004 w/Comparable Rent (1007)','Single Family-1004 w/Operating Income (216)','Single Family-2055 Drive-by Appraisal','Single Family-2055 w/216 and 1007 (Investment)','Small Residential Income Property-2 Unit','Small Residential Income Property-2 Unit-FHA','Small Residential Income Property-3 Unit','Small Residential Income Property-3 Unit-FHA','Small Residential Income Property-4 Unit','Small Residential Income Property-4 Unit-FHA','Supplement REO Addendum','Trip Fee','Trip Fee - 2nd Trip','Uniform Residentail Appraisal w/REO (FNMA 1004)','VA 1004','Value update-1004D','Commercial'];
    this.state = {
      eoi: 0,
      eoiStyle: 'info',
      w9: 0,
      w9Style: 'info',
      resume: 0,
      resumeStyle: 'info',
      sa: 0,
      saStyle: 'info',
      sa2: 0,
      saStyle2: 'info',
      ref: 0,
      refStyle: 'info',
      bc : 0,
      bcStyle: 'info',
      emailStyle: null,
      UAID: tobeUAID
    }
    this.updateFormData = this.updateFormData.bind(this);
    this.verification = this.verification.bind(this);
    this.signupHandler = this.signupHandler.bind(this);
    this.uploadHandler = this.uploadHandler.bind(this);
    this.populateUserData = this.populateUserData.bind(this);
    this.sendToPanel = this.sendToPanel.bind(this);
    this.formData = {
      approved: false,
      uaid: this.state.UAID,
      userFolder : {
        Licenses: {placeholder:false},
        SupportingDocuments: {placeholder:false},
        pricings : false
      }
    }
  }
  componentWillMount(){
    document.body.classList.add("overflow-y");
  }
  componentDidMount(){
    this.authListener = firebase.auth().onAuthStateChanged((firebaseUser) => {
      if (firebaseUser){
        firebase.database().ref(`Users/${firebaseUser.uid}`).once("value", (snapshot) => {
          if (snapshot.val() === null) {
            firebase.database().ref(`Users/${firebaseUser.uid}`).set(this.state.UAID);
            $('form select').each((key, value) => {
              if (value.id.substring(0,12) === "licensestate") {
                if (value.value !== 'select') {
                  firebase.database().ref(`States/${value.value}/Appraisers/${firebaseUser.uid}`).set(this.state.UAID);
                } else {
                }
              }
            })
          }
        }).then(()=>{
          this.sendToPanel("loggedin");
        })
      }
    })
    $('#sameasabove').on('click', () => {
      if($('#sameasabove').is(':checked')){
        document.getElementById('mailingaddress').value = document.getElementById('address').value;
        document.getElementById('mailingcity').value = document.getElementById('city').value;
        document.getElementById('mailingstate').value = document.getElementById('state').value;
        document.getElementById('mailingzip').value = document.getElementById('zip').value;
      } else {
        document.getElementById('mailingaddress').value = '';
        document.getElementById('mailingcity').value = '';
        document.getElementById('mailingstate').value = '';
        document.getElementById('mailingzip').value = '';
      }
    })
  }
  componentWillUnmount(){
    $('body').scrollTop(0);
    document.body.classList.remove("overflow-y");
  }
  sendToPanel() {
    this.props.statusHandle('loggedin');
  }
  updateFormData(data, id, folder) {
    this.formData['userFolder'][folder][id] = data;
  }
  populateUserData(){
    const UAID = this.state.UAID;
    $('form input, form select').each((key, value) => {
      if (value.id.substring(0,3) === "fee") {
        return;
      } else if (value.id.toLowerCase().substring(0,2) === "li") {
        return;
      } else if (value.id.toLowerCase() === 'eoi') {
        return;
      } else {
        this.formData[value.id] = value.value;
      }
    })
    this.formData['details'] = document.getElementById('details').value;
    // SAMEASABOVE, FHA, VA, AND COM - Checkbox handling -----------------------
    if ($("#sameasabove").is(':checked')) {this.formData['sameasabove'] = true;}
    else {this.formData['sameasabove'] = false;}
    if ($("#fha").is(':checked')) {this.formData['fha'] = true;}
    else {this.formData['fha'] = false;}
    if ($('#va').is(':checked')) {this.formData['va']=true;}
    else {this.formData['va'] = false;}
    if ($('#com').is(':checked')) {this.formData['com']=true;}
    else {this.formData['com'] = false;}
    // -------------------------------------------------------------------------
    var prices = 'Prices: ';
    for (var i =0; i < this.products.length; i++) {
      var value = document.getElementById(`fee${i}`).value;
      prices += '\n-------------------------------------------------\n';
      prices += this.products[i];
      prices += `\t::\t${value}`;
    }
    firebase.storage().ref(`${UAID}/pricings.xls`).putString(prices).then((snapshot)=> {
      firebase.storage().ref(`${UAID}/pricings.xls`).getDownloadURL().then((url)=> {
        this.formData['userFolder']['pricings'] = url;
        console.log(this.formData['userFolder']['pricings']);
        firebase.database().ref(`Appraisers/${UAID}`).set(this.formData);
      });
    });
  }
  verification = (event : Object) => {
    const check = document.getElementById(event.target.id).value;
    const checkId = event.target.id;
    const checkIdLength = event.target.id.toString().length;
    var checkConId = '';
    var stateId = '';
    if (checkId.substring(checkIdLength-3, checkIdLength) === 'con'){
       checkConId = checkId.substring(0,checkIdLength-3);
       stateId = checkConId + 'Style';
    } else {
      checkConId = checkId + 'con';
      stateId = checkId + 'Style';
    }
    const checkCon = document.getElementById(checkConId).value;
    if (check !== '' && check === checkCon){
      this.setState({
        [stateId]: 'success'
      })
    } else if (check !== '' && check !== checkCon) {
      this.setState({
        [stateId]: 'error'
      })
    } else if (check === '' && check === checkCon) {
      this.setState({
        [stateId]: null
      })
    }
  }
  signupHandler(){
    this.populateUserData();
    const uEmail = document.getElementById('loginemail').value;
    const uPass = document.getElementById('loginpassword').value;
    const uEmailCon = document.getElementById('loginemailcon').value;
    const uPassCon = document.getElementById('loginpasswordcon').value;
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const cname = document.getElementById('cname').value;
    const company = document.getElementById('company').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const ssn = document.getElementById('ssn').value;
    if ( uEmail === '') {
      $('html, body').animate({scrollTop: $('#loginemail').offset().top-50}, 500);
      $('#loginemail').focus();
      alert("You forgot to enter what email you want to use. Please enter it here.");
      return;
    }
    if ( uEmailCon === '') {
      $('html, body').animate({scrollTop:$('#loginemailcon').offset().top-50}, 500);
      $('#loginemailcon').focus();
      alert("You need to confirm your email by entering it again.");
      return;
    }
    if ( uPass === '') {
      $('html, body').animate({scrollTop:$('#loginpassword').offset().top-50-50}, 500);
      $('#loginpassword').focus();
      alert("You forgot to enter what password you want. Please enter it here.");
      return;
    }
    if ( uPassCon === '') {
      $('html, body').animate({scrollTop:$('#loginpasswordcon').offset().top-50}, 500);
      $('#loginpasswordcon').focus();
      alert("You need to confirm the password by entering it again.");
      return;
    }
    if ( fname === '') {
      $('html, body').animate({scrollTop:$('#fname').offset().top-50}, 500);
      $('#fname').focus();
      alert("We need to know your first name. Please enter it here.");
      return;
    }
    if ( lname === '') {
      $('html, body').animate({scrollTop:$('#lname').offset().top-50}, 500);
      $('#lname').focus();
      alert("We need to know your last name. Please enter it here.");
      return;
    }
    if ( cname === '') {
      $('html, body').animate({scrollTop:$('#cname').offset().top-50}, 500);
      $('#cname').focus();
      alert("You forgot to tell us what name you want on your checks.");
      return;
    }
    if ( company === '') {
      $('html, body').animate({scrollTop:$('#company').offset().top-50}, 500);
      $('#company').focus();
      alert("Looks like you're missing a company name.");
      return;
    }
    if ( phone === '') {
      $('html, body').animate({scrollTop:$('#phone').offset().top-50}, 500);
      $('#phone').focus();
      alert("Looks like you're missing a contact number. Please enter a valid phone number.");
      return;
    }
    if ( email === '') {
      $('html, body').animate({scrollTop:$('#email').offset().top-50}, 500);
      $('#email').focus();
      alert("Looks like you're missing a personal email.\n It can be the same as your login email.");
      return;
    }
    if ( ssn === '') {
      $('html, body').animate({scrollTop:$('#ssn').offset().top-50}, 500);
      $('#ssn').focus();
      alert("Looks like you missed SSN/EIN.");
      return;
    }
    if (uEmail === uEmailCon && uPass === uPassCon){
      firebase.auth().createUserWithEmailAndPassword(uEmail, uPass);
    } else {

    }
  }
  /*---------------------------------UPLOAD HANDLER----------------------------------------*/
  uploadHandler = (event : Object) => {
    const file = event.target.files[0];
    const storageRef = firebase.storage().ref();
    const location = this.state.UAID;
    const profileRef = storageRef.child(location.toString());
    const profile = profileRef.child(event.target.id);
    const metadata = {
      name: 'userFile'
    }
    event.persist();
    profile.put(file, metadata).on('state_changed', (snapshot:Object) =>{
      const progress = Math.round(100 * snapshot.bytesTransferred / snapshot.totalBytes);
      this.setState({
        [event.target.id]: progress
      })
    }, () => {
      alert("There was an error uploading your file, please try again.");
    }, (file)=>{
      this.setState({
        [`${event.target.id}Style`] : 'success',
        [`${event.target.id}`] : "Successfully Uploaded"
      })
      profile.getDownloadURL().then((url) => {
        this.formData['userFolder'][event.target.id] = url;
      })
    })
  }
  /*-----------------------------------------------------------------------------------*/
  render(){
    return(
      <div className="signup-screen">
      <Well bsStyle="danger" className="well-top">
        Sections marked in red are required. <p></p> Fill out the application as accurately as possible.
      </Well>
        <form>
          <Panel header="Login Information" bsStyle="danger">
            <FormGroup validationState={this.state.loginemailStyle} onChange={this.verification}>
              <InputGroup className="signup-item" >
                <FormControl type="email" id="loginemail" name="loginemail" placeholder="E-mail" />
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl type="email" id="loginemailcon" name="loginemailcon" placeholder="Confirm E-mail" />
              </InputGroup>
              </FormGroup>
              <FormGroup validationState={this.state.loginpasswordStyle} onChange={this.verification}>
              <InputGroup className="signup-item">
                <FormControl type="password" id="loginpassword" name="loginpassword" placeholder="Password"/>
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl type="password" id="loginpasswordcon" name="loginpasswordcon" placeholder="Confirm Password"/>
              </InputGroup>
            </FormGroup>
          </Panel>
          <Panel bsStyle="danger" header="Personal Details">
              <FormGroup>
                <InputGroup className="signup-item">
                  <FormControl type="text" id="fname" name="fname" placeholder="First Name"/>
                </InputGroup>
                <InputGroup className="signup-item">
                  <FormControl type="text" id="lname" name="lname" placeholder="Last Name"/>
                </InputGroup>
                <InputGroup className="signup-item">
                  <FormControl type="text" id="cname" name="cname" placeholder="Name On Check"/>
                </InputGroup>
                <InputGroup className="signup-item">
                  <FormControl type="text" id="company" name="company" placeholder="Company Name"/>
                </InputGroup>
                <InputGroup className="signup-item">
                  <FormControl type="tel" id="phone" name="phone" placeholder="Phone"/>
                </InputGroup>
                <InputGroup className="signup-item">
                  <FormControl type="tel" id="phoneAlt" name="phoneAlt" placeholder="Alternate Phone"/>
                </InputGroup>
                <InputGroup className="signup-item">
                  <FormControl type="email" id="email" name="email" placeholder="E-mail"/>
                </InputGroup>
                <InputGroup className="signup-item">
                  <FormControl type="num" id="ssn" name="ssn" placeholder="EIN/SSN"/>
                </InputGroup>
              </FormGroup>
          </Panel>
          <Panel bsStyle="danger" header="Physical Address">
            <FormGroup>
              <InputGroup className="signup-item">
                <FormControl type="text" id="address" name="address" placeholder="Address"/>
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl type="text" id="city" name="city" placeholder="City"/>
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl componentClass="select" id="state" name="state" placeholder="State">
                  <option value="select">State</option>
                  {this.states.map((item,i) => <option key={i} value={item.toString().toLowerCase()}>{item}</option>)}
                </FormControl>
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl type="text" id="zip" name="zip" placeholder="Zip"/>
              </InputGroup>
            </FormGroup>
          </Panel>
          <Panel header="Mailing Address">
            <FormGroup>
            <Checkbox id="sameasabove" name="sameasabove" inline>
              Same as Physical Address
            </Checkbox>
              <InputGroup className="signup-item">
                <FormControl type="text" id="mailingaddress" name="mailingaddress" placeholder="Address"/>
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl type="text" id="mailingcity" name="mailingcity" placeholder="City"/>
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl componentClass="select" id="mailingstate" name="mailingstate" placeholder="State">
                  <option value="select">State</option>
                  {this.states.map((item,i) => <option key={i} value={item.toString().toLowerCase()}>{item}</option>)}
                </FormControl>
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl type="text" id="mailingzip" name="mailingzip" placeholder="Zip"/>
              </InputGroup>
            </FormGroup>
          </Panel>
          <Panel header="Other Information">
            <FormGroup>
              <InputGroup className="signup-item">
                <FormControl componentClass="select" id="softwareChoice" name="softwareChoice" placeholder="State">
                  <option value="select">Appraisal Software</option>
                  {this.softwares.map((item,i) => <option key={i} value={item.toString().toLowerCase()}>{item}</option>)}
                </FormControl>
              </InputGroup>
              <InputGroup className="signup-item">
                <FormControl componentClass="textarea" id="details" name="details" placeholder="Other Details"/>
              </InputGroup>
            </FormGroup>
          </Panel>
          <Panel header="Certification Information">
            <FormGroup>
              <InputGroup className="signup-item">
                <FormControl componentClass="select" id="certificationType" name="certificationType" placeholder="State">
                  <option value="select">Certification Type</option>
                  {this.certifications.map((item,i) => <option key={i} value={item.toString().toLowerCase()}>{item}</option>)}
                </FormControl>
              </InputGroup>
              <InputGroup className="signup-item">
                <Checkbox id="fha" name="fha" inline>
                  FHA Certified
                </Checkbox>
                <Checkbox id="va" name="va" inline>
                  VA Certified
                </Checkbox>
                <Checkbox id="com" name="com" inline>
                  Commercial
                </Checkbox>
              </InputGroup>
            </FormGroup>
          </Panel>
          <EOInsurance uploadHandle={this.uploadHandler} currProgress={this.state.eoi} />
          <LicenseInformation uaid={this.state.UAID} updateFormData={this.updateFormData} />
          <SupportingDocuments uaid={this.state.UAID} updateFormData={this.updateFormData} />
          <Panel header="Product Fees">
              <FormGroup className="products-panel-form">
                <ListGroup fill>
                  {this.products.map((item,i) => <ProductListItem key={i} idNum={i} productName={item} /> )}
                </ListGroup>
              </FormGroup>
          </Panel>
          <Panel className="agreement" header="APM-Appraiser Agreement"  bsStyle="warning">
            Insert Terms & Conditions here...
          </Panel>
        </form>
        <Well bsStyle="warning" className="well-top">
          By clicking the sign-up button below, you are agreeing to the terms and conditions above.
          <Button bsStyle="primary" type="submit" className="signup-button" onClick={this.signupHandler}>
            Sign-Up
          </Button>
        </Well>
      </div>
    );
  }
}

function ProductListItem(props){
  return(
    <ListGroupItem>
      <ControlLabel className="product-label">{props.productName}</ControlLabel>
      <InputGroup className="signup-item">
          <InputGroup.Addon>$</InputGroup.Addon>
        <FormControl type="number" id={`fee${props.idNum}`} name={`fee${props.idNum}`} placeholder="Fee"/>
      </InputGroup>
    </ListGroupItem>
  );
}

function EOInsurance(props) {
  return (
    <Panel header="E&O Insurance">
      <FormGroup>
        <InputGroup className="signup-item">
          <FormControl type="text" id="ibn" name="ibn" placeholder="Insurance Beneficiary Name"/>
        </InputGroup>
        <InputGroup className="signup-item">
          <FormControl type="text" id="ipn" name="ipn" placeholder="Insurance Policy Number"/>
        </InputGroup>
        <InputGroup className="signup-item">
          <FormControl type="text" id="ic" name="ic" placeholder="Insurance Company"/>
        </InputGroup>
        <InputGroup className="signup-item">
          <FormControl type="text" id="ca" name="ca" placeholder="Coverage Amount"/>
        </InputGroup>
        <InputGroup className="signup-item">
          <FormControl type="text" id="pca" name="pca" placeholder="Per Incident Coverage Amount"/>
        </InputGroup>
        <InputGroup className="signup-item">
          <ControlLabel>E&O Insurance</ControlLabel>
          <ProgressBar striped label={`${props.currProgress}`} now={props.currProgress} max={100} id="eoiDoc" bsStyle="success"/>
          <FormControl type="file" id="eoi" name="eoi" onChange={props.uploadHandle}/>
        </InputGroup>
      </FormGroup>
    </Panel>
  );
}

export default AppraiserSignup;
