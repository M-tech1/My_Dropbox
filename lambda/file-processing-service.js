const AWS = require('aws-sdk');
const buildResponse = require('./util.js').buildResponse;

const s3 = new AWS.S3();
const bucketName = 'ggdropbox-file-upload-storage';
const s3Subfolder = 'data';

async function process(requestBody) {
    const requestData = JSON.parse(requestBody);
    const now = new Date();
    //const timestamp = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + '-' + now.getHours() + '-' + now.getMinutes() + '-' + now.getSeconds();
    const timestamp = now.toISOString();
    const lastDot = requestData.fileName.lastIndexOf('.');
    const name = requestData.fileName.substring(0, lastDot);
    const extension = requestData.fileName.substring(lastDot + 1);
    const fileName = name + "-" + timestamp + "." + extension;
    const fileContent = requestData.fileContent;
    const userId = requestData.userId; 
    const fileType = requestData.fileType;
    
    const params = {
        Bucket: bucketName,
        Key: `${s3Subfolder}/${userId}/${fileName}`,
        Body: Buffer.from(fileContent, 'base64'),
        Metadata: {
            "content-type": fileType
        }
    };
    
    await s3.putObject(params).promise();
    return buildResponse(200);
}

module.exports.process = process;