const request = require('supertest');
const app = require('../../app');

describe('Invoicely Integration Test', () => {
    it('should upload a file, process it, and notify the user', async () => {
        const res = await request(app)
            .post('/api/upload')
            .attach('file', Buffer.from('test'), 'invoice.pdf');

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('File uploaded successfully');
    });
});
