import './App.css';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
//import React, {useEffect} from 'react';
//import { API } from 'aws-amplify'
import FileUploader from './components/FileUploader';

function App({ signOut, user }) {
    return (
    <div className="App">
    <Heading level={1}>Welcome {user.username}</Heading>
    <Button onClick={signOut}>Sign out</Button>
    <h3>Welcome to DropBox 2.0</h3>
    <FileUploader />
    </div>
  );
}

export default withAuthenticator(App);