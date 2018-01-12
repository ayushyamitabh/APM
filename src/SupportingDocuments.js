import React, {Component} from 'react';
import {Panel, FormGroup, InputGroup, FormControl, ControlLabel, Well, ProgressBar} from 'react-bootstrap';
import * as firebase from 'firebase';

class SupportingDocuments extends Component{
  constructor(props){
    super(props);
    this.state = {
      w9now : 0,
      resumenow : 0,
      sanow : 0,
      sa2now : 0,
      refnow : 0,
      bcnow : 0
    }
  }
  uploadHandler = (event : Object) => {
      const file = event.target.files[0];
      const ref = firebase.storage().ref(`${this.props.uaid}/Supporting Documents/${event.target.id}`) ;
      var length = event.target.id.toString().length;
      var id = event.target.id.toString();
      var number = id.substring(length-1, length);
      console.log(number);

      const metadata = {
        name : false
      }

      console.log(metadata);
      event.persist();
      ref.put(file, metadata).on('state_changed', (snapshot:Object) => {
        var progress = Math.round(100 * snapshot.bytesTransferred / snapshot.totalBytes);
        console.log(progress);
        this.setState({
          [`${event.target.id}now`]: progress

        })
      }, () => {
        console.log("There was an error uploading your file, please try again.");
      }, (file) => {
        firebase.storage().ref(`${this.props.uaid}/Supporting Documents/${event.target.id}`).getDownloadURL().then((url) =>{
          this.props.updateFormData(url, event.target.id, "SupportingDocuments");

          this.setState({
            [`${event.target.id}now`] : "Successfully Uploaded"
          })
        })
      })
    }





  render() {
      return (
            <Panel header="Supporting Documents" >
            <FormGroup>
              <Well>
                <InputGroup className="signup-item">
                  <ControlLabel>W-9 Document</ControlLabel>

                    <ProgressBar striped label={this.state.w9now} now={this.state.w9now} max={100} id="w9Doc" bsStyle={this.state.w9Style}/>

                  <FormControl type="file" id="w9" name="w9" onChange={this.uploadHandler}/>
                </InputGroup>
              </Well>
              <Well>
                <InputGroup className="signup-item">
                  <ControlLabel>Resume</ControlLabel>

                  <ProgressBar striped label={this.state.resumenow} now={this.state.resumenow} max={100} id="resumeDoc" bsStyle={this.state.resumeStyle}/>

                  <FormControl type="file" id="resume" name="resume" onChange={this.uploadHandler}/>
                </InputGroup>
              </Well>
              <Well>
                <InputGroup className="signup-item">
                {/* 1004, 1025
                  */}
                  <ControlLabel>Sample Appraisal 1</ControlLabel>

                  <ProgressBar striped label={this.state.sanow} now={this.state.sanow} max={100} id="saDoc" bsStyle={this.state.saStyle}/>

                  <FormControl type="file" id="sa" name="sa" onChange={this.uploadHandler}/>
                </InputGroup>
              </Well>
              <Well>
                <InputGroup className="signup-item">
                  <ControlLabel>Sample Appraisal 2</ControlLabel>

                  <ProgressBar striped label={this.state.sa2now} now={this.state.sa2now} max={100} id="sa2Doc" bsStyle={this.state.saStyle}/>

                  <FormControl type="file" id="sa2" name="sa2" onChange={this.uploadHandler}/>
                </InputGroup>
              </Well>
              <Well>
                <InputGroup className="signup-item">
                  <ControlLabel>References</ControlLabel>

                  <ProgressBar striped abel={this.state.refnow} now={this.state.refnow} max={100} id="refDoc" bsStyle={this.state.refStyle}/>

                  <FormControl type="file" id="ref" name="ref" onChange={this.uploadHandler}/>
                </InputGroup>
              </Well>
              <Well>
                <InputGroup className="signup-item">
                  <ControlLabel>Background Check</ControlLabel>

                  <ProgressBar striped label={this.state.bcnow} now={this.state.bcnow} max={100} id="bcDoc" bsStyle={this.state.bcStyle}/>

                  <FormControl type="file" id="bc" name="bc" onChange={this.uploadHandler}/>
                </InputGroup>
                <InputGroup>
                  <ControlLabel>Issue Date</ControlLabel>
                  <FormControl type="date" id="bcdate" name="bcdate" placeholder="Issue Date"/>
                </InputGroup>
              </Well>
            </FormGroup>
          </Panel>
        );
      }
}

export default SupportingDocuments;
