const AWS = require('aws-sdk-mock');
const { uploadToS3 } = require('../awsService');

describe('AWS S3 Service', () => {
    beforeEach(() => {
        AWS.mock('S3', 'upload', (params, callback) => {
            callback(null, { Key: params.Key });
        });
    });

    afterEach(() => {
        AWS.restore('S3');
    });

    it('should upload file to S3 and return the key', async () => {
        const file = { originalname: 'invoice.pdf', buffer: Buffer.from('test') };

        const result = await uploadToS3(file);

        expect(result.Key).toMatch(/\d{13}_invoice\.pdf/); // Verifica se a chave tem o formato correto
    });

    it('should throw error if S3 upload fails', async () => {
        AWS.remock('S3', 'upload', (params, callback) => {
            callback(new Error('S3 upload failed'), null);
        });

        const file = { originalname: 'invoice.pdf', buffer: Buffer.from('test') };

        await expect(uploadToS3(file)).rejects.toThrow('S3 upload failed');
    });
});
