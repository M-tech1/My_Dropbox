// FileUploader.js

import React from 'react';
import FileUploadForm from './FileUploader';

// Function to handle the click event for the "Upload a new file" button
const handleUploadClick = () => {
    console.log("Upload button clicked");
    // Here you would add the logic for uploading a new file
}

const FileUploader = () => {
    return (
        <div>
        <button 
            onClick={handleUploadClick} 
            style={{
                backgroundColor: 'green', 
                color: 'white', 
                padding: '10px', 
                borderRadius: '5px',
                border: 'none',
                marginRight: '10px' 
            }}>
            Upload a new file
        </button>
        <FileUploadForm />
        </div>
    );
}

export default FileUploader;