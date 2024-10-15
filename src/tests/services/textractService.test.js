const { processExtractedData } = require('../textractService');

describe('Textract Service', () => {
    it('should correctly extract CNPJ, total value, and issue date from Textract data', () => {
        const textractData = {
            Blocks: [
                { Text: "CNPJ: 12.345.678/0001-90" },
                { Text: "Total: 1000,00" },
                { Text: "Date: 14/10/2024" }
            ]
        };

        const result = processExtractedData(textractData);

        expect(result.cnpj).toBe('12.345.678/0001-90');
        expect(result.totalValue).toBe(1000);
        expect(result.issueDate).toBe('14/10/2024');
    });

    it('should return default values if Textract data is missing', () => {
        const textractData = { Blocks: [] };

        const result = processExtractedData(textractData);

        expect(result.cnpj).toBe('CNPJ not found');
        expect(result.totalValue).toBe(0);
        expect(result.issueDate).toBe('Date not found');
    });
});
