const AWS = require('aws-sdk-mock');
const { saveToDynamoDB } = require('../dynamoDbService');

describe('DynamoDB Service', () => {
    beforeEach(() => {
        AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(null, {});
        });
    });

    afterEach(() => {
        AWS.restore('DynamoDB.DocumentClient');
    });

    it('should save data to DynamoDB', async () => {
        const data = {
            cnpj: '12.345.678/0001-90',
            totalValue: 1000,
            issueDate: '14/10/2024',
            items: [{ description: 'Item 1', quantity: 2, price: 50 }]
        };

        await saveToDynamoDB(data);

        expect(AWS.spy('DynamoDB.DocumentClient', 'put')).toHaveBeenCalled();
    });

    it('should throw an error if DynamoDB fails', async () => {
        AWS.remock('DynamoDB.DocumentClient', 'put', (params, callback) => {
            callback(new Error('DynamoDB save failed'), null);
        });

        const data = {
            cnpj: '12.345.678/0001-90',
            totalValue: 1000,
            issueDate: '14/10/2024',
            items: [{ description: 'Item 1', quantity: 2, price: 50 }]
        };

        await expect(saveToDynamoDB(data)).rejects.toThrow('DynamoDB save failed');
    });
});
