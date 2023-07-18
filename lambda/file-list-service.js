const AWS = require('aws-sdk');
const buildResponse = require('./util.js').buildResponse;

const s3 = new AWS.S3();
const bucketName = 'ggdropbox-file-upload-storage';
const s3Subfolder = 'data';

async function fetchFiles(userId) {
    const params = {
        Bucket: bucketName,
        Prefix: `${s3Subfolder}/${userId}/`
    };

const Objects = await s3.listObjectsV2(params).promise();
const files = await Promise.all(Objects.Contents.map(async object => {
    const headParams = {
        Bucket: bucketName,
        Key: object.Key
    };
    const metadata = await s3.headObject(headParams).promise(); 
    const fileName = object.Key.replace(`${s3Subfolder}/${userId}/`, '');
    return {
        name: fileName,
        type: metadata.Metadata["content-type"] || 'unknown',
        lastModified: object.LastModified,
        size: object.Size
    };
}));
return buildResponse(200, files);
}

module.exports.fetchFiles = fetchFiles;