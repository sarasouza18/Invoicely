const AWS = require('aws-sdk');
const SNS = new AWS.SNS();

const publishNotification = async (message) => {
    const params = {
        Message: JSON.stringify(message),
        TopicArn: process.env.SNS_TOPIC_ARN,
    };

    try {
        await SNS.publish(params).promise();
        console.log('Notification sent');
    } catch (error) {
        throw new Error('SNS notification failed');
    }
};

module.exports = { publishNotification };
