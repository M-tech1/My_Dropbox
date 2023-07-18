import React, { Component } from 'react';
import axios from 'axios';
import { Auth } from 'aws-amplify';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class FileUploader extends Component {
    state = {
        selectedFile: null,
        fileUploadedSuccessfully: false,
        viewMode: 'default',
        files: [],
    }

    onFileChange = event => {
        this.setState({selectedFile: event.target.files[0]});
    }

    onFileUpload = async () => {
        const user = await Auth.currentAuthenticatedUser();
        const userId = user.username;
        const file = this.state.selectedFile;
    
        if (file instanceof File) {
            const reader = new FileReader();
    
            reader.onloadend = async () => {
                const base64data = reader.result.split(',')[1]; // remove the mime type
                const data = {
                    userId: userId,
                    fileName: file.name,
                    fileType: file.type,
                    fileContent: base64data
                };

                toast.info('Uploading file...');    
                axios.post("https://rjbw9ux3u9.execute-api.us-west-2.amazonaws.com/prod1/file-upload", data).then(() => {
                    this.setState({selectedFile: null, fileUploadedSuccessfully: true});
                })
                .catch(error => {
                    console.error(`Upload Error: ${error}`);
                    toast.error('Error occurred during file upload. Please try again.');
        });
        }

        reader.onerror = (error) => {
            console.error(`File Reading Error: ${error}`);
            toast.error('Error occurred while reading file. Details:' + error.message);
        }

            reader.readAsDataURL(file);
        } else {
            console.log('No file selected for upload');
        }
    }
    
    showUploadView = () => {
        this.setState({viewMode: 'upload'});
    }

    showFilesView = async() => {
        const user = await Auth.currentAuthenticatedUser();
        const userId = user.username;
        toast.info('Fetching your file list...');
        axios.get("https://rjbw9ux3u9.execute-api.us-west-2.amazonaws.com/prod1/file-list", { params: { userId: userId } }).then((response) => {
        const files = response.data;
        files.forEach(file => {
            file.size = (file.size / 1024).toFixed(2) + 'KB';
            file.lastModified = new Date(file.lastModified).toLocaleString();
        })
        this.setState({ viewMode: 'list', files: files});
    }).catch(error => console.error(`Error: ${error}`));
    }

    showDefaultView = () => {
        this.setState({viewMode: 'default'});
    }

    downloadFile = (fileName) => {
        Auth.currentAuthenticatedUser()
            .then(user => {
                const userId = user.username;
                axios.get("https://rjbw9ux3u9.execute-api.us-west-2.amazonaws.com/prod1/file-download", { params: { userId: userId, fileName: fileName } })
                .then(response => {
                    const url = response.data.url;
                    window.open(url, '_blank');
                })
                .catch(error => console.error(`Error: ${error}`));
            })
            .catch(error => console.error(`Error: ${error}`));
    }
    
 
    deleteFile = async (fileName) => {
        const user = await Auth.currentAuthenticatedUser();
        const userId = user.username;
        
        if(!window.confirm('Are you sure you want to delete this file?')) {
            return;
        }
        axios.delete(`https://rjbw9ux3u9.execute-api.us-west-2.amazonaws.com/prod1/file-delete?userId=${userId}&fileName=${fileName}`)
        .then(() => {
            toast.success('File successfully deleted.')
            this.showFilesView();  // Refresh the file list after delete
        }).catch(error => console.error(`Delete Error: ${error}`));
    }
    
    

    fileData = () => {
        if (this.state.selectedFile) {
            return(
                <div>
                    <h4>File Details:</h4>
                    <p>File Name: {this.state.selectedFile.name}</p>
                    <p>File Type: {this.state.selectedFile.type}</p>
                    <p>Last Modified: {""} {this.state.selectedFile.lastModifiedDate.toDateString()} </p>
                </div>
            );
        }
        else if (this.state.fileUploadedSuccessfully) {
            return (
                <div>
                    <br />
                    <h4>File uploaded successfully</h4>
                </div>
            );
        }
        else {
            return (
                <div>
                    <br />
                    <h4>Please choose a file to upload and click the "Upload File" button afterwards</h4>
                </div>
            );
        }
    }

    fileList = () => {
        return this.state.files.map((file, index) => (
            <li key = {index} style={{border: "1px solid green", borderRadius: "10px", marginBottom: "8px", listStyleType: "none", padding: "5px"}}>
                {this.getIconForFileType(file.type)}
                <p>{file.name}</p>
                <p>Size: {file.size}</p>
                <p>Last Modified: {file.lastModified}</p>
                <button onClick={() => this.downloadFile(file.name)}> <i className="fas fa-arrow-down"></i> Download</button>
                <button style={{backgroundColor: "red", color: "white"}} onClick={() => this.deleteFile(file.name)}> <i className="fas fa-trash"></i> Delete</button>
            </li>
        ));
    }

    getIconForFileType = (fileType) => {
        const lowerCaseFileType = fileType.toLowerCase();
        const type = lowerCaseFileType.split('/')[0];
        switch(type) {
            case 'text':
                return <i className="fas fa-file-alt"></i>;
            case 'audio':
                return <i className="fas fa-file-audio"></i>;
            case 'video':
                return <i className="fas fa-file-video"></i>;
            case 'image':
                return <i className="fas fa-file-image"></i>;
            case 'application':
                const subtype = lowerCaseFileType.split('/')[1];
                if (subtype === 'pdf') {
                    return <i className="fas fa-file-pdf"></i>;
                } else if (subtype === 'json') {
                    return <i className="fas fa-file-code"></i>;  // or any other icon you prefer for JSON files
                } else {
                    return <i className="fas fa-file"></i>;
                }
            default:
                return <i className="fas fa-file"></i>;
        }
    }
    

    render() {
        return (
            <div>
                <ToastContainer />
                {this.state.viewMode === 'upload' && (
                    <div>
                        <div>
                            <input type="file" onChange={this.onFileChange} />
                            <button className="btn btn-success me-3" onClick={this.onFileUpload}> Upload File</button>
                            <button className="btn btn-dark" onClick={this.showDefaultView}>Back</button>
                        </div>
                        {this.fileData()}
                    </div>
                )}
    
                {this.state.viewMode === 'list' && (
                    <div>
                        <h4>Here are all your uploaded files</h4>
                        <ul>
                            {this.fileList()}
                        </ul>
                        <button className="btn btn-dark" onClick={this.showDefaultView}>Back</button>
                    </div>
                )}
    
                {this.state.viewMode === 'default' && (
                    <div>
                        <button className="btn btn-success me-5" onClick={this.showUploadView}>Upload a new file</button>
                        <button className="btn btn-primary ms-5" onClick={this.showFilesView}>Show all my files</button>
                    </div>
                )}
            </div>
        );
    }
    
}
export default FileUploader;