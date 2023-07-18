// FileList.js

import React from 'react';

// Function to handle the click event for the "Show my files" button
const handleShowFilesClick = () => {
    console.log("Show files button clicked");
    // Here you would add the logic for showing the user's files
}

const FileList = () => {
    return (
        <button 
            onClick={handleShowFilesClick} 
            style={{
                backgroundColor: 'blue', 
                color: 'white', 
                padding: '10px', 
                borderRadius: '5px',
                border: 'none'
            }}>
            Show my files
        </button>
    );
}

export default FileList;