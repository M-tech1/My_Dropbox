const AWS = require('aws-sdk');
const buildResponse = require('./util.js').buildResponse;

const s3 = new AWS.S3();
const bucketName = 'ggdropbox-file-upload-storage';
const s3Subfolder = 'data';

async function getFileDownloadLink(fileName, userId) {
    const params = {
        Bucket: bucketName,
        Key: `${s3Subfolder}/${userId}/${fileName}`,
        Expires: 60 * 5 // Link expires after 5 minutes
    };
    
    const url = s3.getSignedUrl('getObject', params);
    return buildResponse(200, {url: url});
}

module.exports.getFileDownloadLink = getFileDownloadLink;