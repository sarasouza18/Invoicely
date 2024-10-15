const { extractTextFromS3 } = require('../services/textractService');
const { saveToDynamoDB, saveFileStatus } = require('../services/dynamoDbService');
const { publishNotification } = require('../services/snsService');

exports.handler = async (event) => {
    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        const { s3Key } = messageBody;

        try {
            await saveFileStatus(s3Key, 'processing', {});

            const extractedData = await extractTextFromS3(s3Key);

            await saveToDynamoDB(extractedData);

            await saveFileStatus(s3Key, 'completed', extractedData);

            await publishNotification({
                status: 'success',
                message: `File ${s3Key} processed successfully`,
                data: extractedData
            });

        } catch (error) {
            console.error('Error processing file:', error);

            await saveFileStatus(s3Key, 'failed', { error: error.message });

            throw error;
        }
    }
};
