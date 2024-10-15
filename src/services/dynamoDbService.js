const AWS = require('aws-sdk');
const DynamoDB = new AWS.DynamoDB.DocumentClient();

const saveFileStatus = async (fileKey, status, details) => {
    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
            id: Date.now().toString(),
            fileKey: fileKey,
            status: status,
            details: details || {},
            timestamp: new Date().toISOString(),
        },
    };

    try {
        await DynamoDB.put(params).promise();
        console.log('Status saved to DynamoDB');
    } catch (error) {
        console.error('Error saving status to DynamoDB:', error);
        throw new Error('DynamoDB save failed');
    }
};

module.exports = { saveFileStatus };
