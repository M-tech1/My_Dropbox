const process = require('./file-processing-service.js').process;
const fetchFiles = require('./file-list-service.js').fetchFiles;
const getFileDownloadLink = require('./file-download-service.js').getFileDownloadLink;
const deleteFile = require('./file-delete-service.js').deleteFile;
const buildResponse = require('./util.js').buildResponse;

const fileUploadPath = '/file-upload';
const fileListPath = '/file-list';
const fileDownloadPath = '/file-download';
const fileDeletePath = '/file-delete';

exports.handler = async(event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true) {
        case event.httpMethod === 'POST' && event.path === fileUploadPath:
            response = await process(event.body);
            break;
        case event.httpMethod === 'GET' && event.path === fileListPath:
            const userId = event.queryStringParameters.userId;
            response = await fetchFiles(userId);
            break;
            case event.httpMethod === 'GET' && event.path === fileDownloadPath:
                const downloadUserId = event.queryStringParameters.userId;
                const fileName = event.queryStringParameters.fileName;
                response = await getFileDownloadLink(fileName, downloadUserId);
                break;
            case event.httpMethod === 'DELETE' && event.path === fileDeletePath:
                const deleteUserId = event.queryStringParameters.userId;
                const deleteFileName = event.queryStringParameters.fileName;
                response = await deleteFile(deleteUserId, deleteFileName);
                break;
        default:
            response = buildResponse(404);
    }
    return response;
};