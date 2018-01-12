'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

// TODO: Configure the `gmail.email` and `gmail.password` Google Cloud environment variables.
// firebase functions:config:set gmail.email="myusername@gmail.com" gmail.password="secretpassword"

// TODO: Deploy only functions
// firebase deploy --only functions

const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

/*
  Functions we need:                          [Function Name]
  1.  a.  To Appraiser on Sign-Up             [appraiserWelcome]
      b.  To Admin on Sign-up                 [newAppraiser]
  2.  On Approval/Rejection to appraiser      [appraiserApproval]
  3.  On Order Created                        [newOrder]
  4.  a.  On order assigned to appraiser      [assignmentNotification]
      b.  On order assigned to client         [assignmentNotification]
      c.  On order assigned to admin ?        [assignmentNotification]
  5. Daily reminder for every assigned order  [assignmentReminder]
*/

/*-----------------------------------------------------------------------------------------------------------------------|
  EXAMPLE FUNCTION                                                                                                       |
  -----------------------------------------------------------------------------------------------------------------------|
  exports.sendEmailConfirmation = functions.database.ref('/users/{uid}').onWrite(event => {
    const snapshot = event.data;
    const val = snapshot.val();

    if (!snapshot.changed('subscribedToMailingList')) {
      return;
    }

    const mailOptions = {
      from: '"Spammy Corp." <noreply@firebase.com>',
      to: val.email
    };

    // The user just subscribed to our newsletter.
    if (val.subscribedToMailingList) {
      mailOptions.subject = 'Thanks and Welcome!';
      mailOptions.text = 'Thanks you for subscribing to our newsletter. You will receive our next weekly newsletter.';
      return mailTransport.sendMail(mailOptions).then(() => {
        console.log('New subscription confirmation email sent to:', val.email);
      }).catch(error => {
        console.error('There was an error while sending the email:', error);  
      });
    }

    // The user unsubscribed to the newsletter.
    mailOptions.subject = 'Sad to see you go :`(';
    mailOptions.text = 'I hereby confirm that I will stop sending you the newsletter.';
    return mailTransport.sendMail(mailOptions).then(() => {
      console.log('New unsubscription confirmation email sent to:', val.email);
    }).catch(error => {
      console.error('There was an error while sending the email:', error);  
    });
  });
*/
