function buildResponse(statusCode, body) {
    return {
        statusCode: statusCode,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Origin',
            'Access-Control-Allow-Methods': 'OPTIONS,DELETE,GET,POST',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }
}

module.exports.buildResponse = buildResponse;