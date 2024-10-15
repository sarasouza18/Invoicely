const AWS = require('aws-sdk');
const Textract = new AWS.Textract();

const extractTextFromS3 = async (s3Key) => {
    const params = {
        Document: {
            S3Object: {
                Bucket: process.env.S3_BUCKET_NAME,
                Name: s3Key,
            },
        },
    };

    try {
        const textractData = await Textract.detectDocumentText(params).promise();
        return processExtractedData(textractData);
    } catch (error) {
        throw new Error('Textract processing failed');
    }
};

const processExtractedData = (textractData) => {
    const blocks = textractData.Blocks;

    return {
        cnpj: extractCNPJ(blocks),
        totalValue: extractTotalValue(blocks),
        issueDate: extractIssueDate(blocks),
        items: extractItems(blocks)
    };
};

const extractCNPJ = (blocks) => {
    const cnpjBlock = blocks.find(block => block.Text && block.Text.match(/\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}/));
    return cnpjBlock ? cnpjBlock.Text : 'CNPJ not found';
};

const extractTotalValue = (blocks) => {
    const valueBlock = blocks.find(block => block.Text && block.Text.includes('Total'));
    return valueBlock ? parseFloat(valueBlock.Text.replace(/[^\d.,]/g, '').replace(',', '.')) : 0;
};

const extractIssueDate = (blocks) => {
    const dateBlock = blocks.find(block => block.Text && block.Text.match(/\d{2}\/\d{2}\/\d{4}/));
    return dateBlock ? dateBlock.Text : 'Date not found';
};

const extractItems = (blocks) => {
    const items = [];
    let itemDescription = '';
    let itemQuantity = '';
    let itemPrice = '';

    blocks.forEach(block => {
        if (block.Text) {
            if (isDescription(block.Text)) {
                if (itemDescription) {
                    items.push({ description: itemDescription, quantity: itemQuantity, price: itemPrice });
                }
                itemDescription = block.Text;
                itemQuantity = '';
                itemPrice = '';
            } else if (isQuantity(block.Text)) {
                itemQuantity = block.Text;
            } else if (isPrice(block.Text)) {
                itemPrice = block.Text;
            }
        }
    });

    if (itemDescription) {
        items.push({ description: itemDescription, quantity: itemQuantity, price: itemPrice });
    }

    return items;
};

const isDescription = (text) => {
    return text.length > 5 && !isPrice(text) && !isQuantity(text);
};

const isQuantity = (text) => {
    return /^\d+$/.test(text);
};

const isPrice = (text) => {
    return /\d+([.,]\d{2})?$/.test(text);
};

module.exports = { extractTextFromS3, processExtractedData };
