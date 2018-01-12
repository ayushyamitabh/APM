# APM
APM Project Source Code <br>
[Latest Build](https://apm-main.firebaseapp.com/) <br>

### Built Using
Facebook's ReacJS [Github](https://github.com/facebookincubator/create-react-app) [Website](https://facebook.github.io/react/) <br>
Google's Firebase [Github](https://github.com/firebase/) [Website](https://firebase.google.com) <br>
Material-UI [Github](https://github.com/callemall/material-ui) [Website](http://www.material-ui.com/#/) <br>

### Collaborators
[Ayushya](https://github.com/ayushyamitabh) | [Chuck](https://github.com/aghadiuno)

# Setting Up Firebase CLI
To serve to the Firebase hosting, follow these steps:
1. Login to our Firebase account `firebase login`, [account details here](https://trello.com/apm65)
2. Enter ./firebase-serve/ `cd firebase-serve`
3. Initialize Firebase `firebase init`<br>
It will warn you: "You are initializing in an existing Firebase project directory"
4. Choose only 'hosting' (use space bar to select)
5. Public directory should be 'public' <br> 'Yes' configure as a single page app <br> 'No', don't overwrite `index.html`
6. Use `firebase deploy` to upload the files, if it gives you a login error:
Do `firebase use --add` , from the given list select 'apm-main', then try to deploy again.

# Starting the project
1. Run `npm install` in the root depository to install dependecies. To add a new module use [this](#node-modules)
2. Run `npm start` to start local server, it will open ****localhost:3000**** in your default browser

### Folders
##### build
Contains optimized build files. To create an optimized build,<br>
use `npm run build`

##### firebase-serve
Put build files here to serve to the Firebase site<br>
[Deploying to Firebase](https://firebase.google.com/docs/hosting/deploying)<br>
use `firebase deploy`

##### functions
Put cloud functions here to serve to Firebase Cloud Functions<br>
use `firebase deploy --only functions`<br>

##### <a name="node-modules"></a>node_modules
Hold all dependencies. Add a dependency by,<br>
use `npm install <package-name> --save`<br>
Example: `npm install react-bootstrap --save`<br>

##### src/res
Put all images, videos, and any other resources in this folder<br>

# Completed
#### Appraiser Sign-Up
![Appraiser Root](/src/res/appraiser_tree.png)
![States Root](/src/res/states_tree.PNG)
![Users Root](/src/res/users_tree.PNG)
##### When an appraiser signs up:
1. `/Appraiser/{UAID}` is created and populated with form data
2. `/Users/{firebaseUser.uid}` is set to the users UAID value
3. `/States/{state-value}/Appraisers/{firebaseUser.uid}` is set to the users UAID value
4. In storage, a directory `/{uaid}` is created -
Sub-directories are `/{uaid}/Licenses`, & `/{uaid}/Supporting Documents`
The folder also contains `/{uaid}/pricings.xls`, & `/{uaid}/eoi.pdf`
5. E-mail is sent to the given admin email containing all users data *[function : adminApplicationNotification](/firebase-serve/functions/index.js)* **HTML version of E-mail done**
6. "Thank You for Applying" E-mail is sent to the applicant's /Appraisers/{uaid}/email *[function : applicationConfirmation](/firebase-serve/functions/index.js)* **Missing HTML version of E-mail**
7. When a new applicant is approved, a "Welcome To The Family" email is sent. *[function : applicationConfirmation](/firebase-serve/functions/index.js)* **Missing HTML version of E-mail**
