const AWS = require('aws-sdk');
const buildResponse = require('./util.js').buildResponse;

const s3 = new AWS.S3();
const bucketName = 'ggdropbox-file-upload-storage';
const s3Subfolder = 'data';

async function deleteFile(userId, fileName) {
    const params = {
        Bucket: bucketName,
        Key: `${s3Subfolder}/${userId}/${fileName}`
    };

    await s3.deleteObject(params).promise();
    return buildResponse(200);
}

module.exports.deleteFile = deleteFile;