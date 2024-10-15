const awsService = require('../services/awsService');
const textractService = require('../services/textractService');
const dynamoDbService = require('../services/dynamoDbService');
const eventBridge = require('../events/eventBridge');
const snsService = require('../services/snsService');

exports.uploadFile = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const s3Data = await awsService.uploadToS3(file);

        const eventPayload = {
            key: s3Data.Key,
            mimeType: file.mimetype
        };
        await eventBridge.dispatchUploadEvent(eventPayload);

        return res.status(200).json({
            message: 'File uploaded successfully',
            fileKey: s3Data.Key
        });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to upload file' });
    }
};

exports.processFile = async (event) => {
    try {
        const { key } = JSON.parse(event.detail);
        const extractedData = await textractService.extractTextFromS3(key);
        await dynamoDbService.saveToDynamoDB(extractedData);
        
        await snsService.publishNotification({
            status: 'success',
            message: `File ${key} processed successfully`,
            data: extractedData
        });
    } catch (error) {
        await snsService.publishNotification({
            status: 'failure',
            message: `Failed to process file ${key}`,
            error: error.message
        });
        throw error;
    }
};
