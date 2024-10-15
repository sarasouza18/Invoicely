const AWS = require('aws-sdk');
const eventBridge = new AWS.EventBridge();

const dispatchUploadEvent = async (eventPayload) => {
    const params = {
        Entries: [
            {
                Source: 'invoicely.fileUpload',
                DetailType: 'FileUpload',
                Detail: JSON.stringify(eventPayload),
                EventBusName: process.env.EVENT_BUS_NAME,
            },
        ],
    };

    try {
        await eventBridge.putEvents(params).promise();
    } catch (error) {
        throw new Error('Event dispatch failed');
    }
};

module.exports = { dispatchUploadEvent };
