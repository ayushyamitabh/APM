import React, {Component} from 'react';
import $ from 'jquery';
import logo from './logo.svg';
import client from './res/client.png';
import appraiser from './res/appraiser.png';
import homeowner from './res/homeowner.png';
import vid1 from './res/video.mp4';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { AppBar, RaisedButton, FlatButton, Paper } from 'material-ui';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props);
    this.pushPageChange = this.pushPageChange.bind(this);
    this.tabHandler = this.tabHandler.bind(this);
    this.state ={
      tab: 1
    }
  }
  componentDidMount(){
    document.body.classList.add("overflow-hidden");
    $(window).on('scroll', () => {
      if (parseInt($(window).scrollTop()) >= parseInt($('.home-tile-second').offset().top) ) {
        $('.home-appbar').addClass('colored-appbar');
        $('video').animate({opacity:0},0);
      } else {
        $('.home-appbar').removeClass('colored-appbar');
        $('video').animate({opacity:1},0);
      }
    })
  }
  componentWillUnmount() {
    $(window).off('scroll');
  }
  pushPageChange(page){
    this.props.pageChanger(page.number);
    this.props.status(page.status);
  }
  tabHandler(tabNumber){
    this.setState({
      tab: tabNumber
    })
  }
  optionChosen(optVal){
   console.log(optVal);
  }
  formHandler(e){
    e.preventDefault();
    console.log('submitting');
    var data = $('form').serialize();
    console.log(data);
    $.ajax({
      type: 'POST',
      url: 'partner.php',
      data: data
    })
    .done(function(phpDataDone){
      console.log('submitted');
      console.log(phpDataDone);
    })
    .fail(function(phpDataFail) {
      console.log('failed');
      console.log(phpDataFail);
    })
  }
  render(){
    return(
      <MuiThemeProvider>
        <div className="home-page">
          <AppBar
            className="home-appbar"
            title={<div><img src={logo} alt="APM" />APPRAISAL PARNTERS MANAGEMENT</div>}
            iconElementLeft={<div></div>}
            iconElementRight={<FlatButton className="appbar-tag-line" label="Redefining Appraisal Management" />}
            onTitleTouchTap={()=>{this.tabHandler(1)}}
          />
        <div className="home-tile-first">
          <video autoPlay={true} muted={true} loop={true} controls={false}>
            <source src={vid1} type="video/mp4" />
          </video>
        </div>
        <div className="home-tile-second">
          <h1>APM</h1>
          <h4>Redefining Appraisal Management</h4>
        </div>
        <Paper className="login-tile client" zDepth={2}>
          <img src={client} alt="Client Portal"/>
          <h3>Client Portal</h3>
          <RaisedButton fullWidth={true} primary={true} label="Sign-In / Sign-Up" />
        </Paper>
        <Paper className="login-tile homeowner" zDepth={2}>
          <img src={homeowner} alt="Homeowner Portal"/>
          <h3>Homeowner Portal</h3>
          <RaisedButton fullWidth={true} primary={true} label="Check Appraisal Status" />
        </Paper>
        <Paper className="login-tile appraiser" zDepth={2}>
          <img src={appraiser} alt="Appraiser Portal"/>
          <h3>Appraiser Portal</h3>
          <RaisedButton onClick={()=>this.pushPageChange({number:2,status:'login'})} fullWidth={true} primary={true} label="Sign-In / Sign-Up" />
        </Paper>
        <Paper className="home-tile-about-us" zDepth={3}>
          <h2>ABOUT US</h2>
          <p>Appraisal Partners Management (APM) is a nationwide appraisal management firm,
          created with the purpose of simplifying client-vendor relationship. Working
          alongside both clients and vendors, APM is proud to implement its own cutting-edge
          application.  We are dedicated to provide the best service anywhere and everywhere.</p>
          <p>Partnering with APM means going with the leaders of the business. By working with us:
            <li>Work remotely and efficiently, through our extensive network with homeowners, banks and appraisers</li>
            <li>Expect quicker and better payouts through our approve-and-pay system</li>
            <li>Through our simple to-use platform, vendor and clients alike will be able to monitor due dates, payments and updates at all times</li>
          </p>
        </Paper>
        <Paper className="home-footer" zDepth={3}>
          <h2>Appraisal Partners Management</h2>
          <p className="admin-btn" onClick={()=>{this.pushPageChange({number:3,status:'login'})}}>Admin Portal</p>
          <p>Terms & Conditions</p>
          <p>Privacy Statement</p>
          <p>Copyright 2017, Appraisal Partners Management (APM)</p>
        </Paper>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Home;
