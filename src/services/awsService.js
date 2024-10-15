const AWS = require('aws-sdk');
const S3 = new AWS.S3();

const uploadToS3 = async (file) => {
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `${Date.now()}_${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
    };

    try {
        return await S3.upload(params).promise();
    } catch (error) {
        throw new Error('S3 upload failed');
    }
};

module.exports = { uploadToS3 };
