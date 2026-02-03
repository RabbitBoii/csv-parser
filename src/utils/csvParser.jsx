import Papa from 'papaparse';

export const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                // Validate headers
                const expectedHeaders = [
                    'Item Code', 'Material', 'Quantity',
                    'Estimated Rate', 'Supplier 1 (Rate)',
                    'Supplier 2 (Rate)', 'Supplier 3 (Rate)',
                    'Supplier 4 (Rate)', 'Supplier 5 (Rate)'
                ];

                const headers = Object.keys(results.data[0]);
                const isValid = expectedHeaders.every(h => headers.includes(h));

                if (!isValid) {
                    reject(new Error('Invalid CSV format'));
                    return;
                }

                resolve(results.data);
            },
            error: (error) => reject(error)
        });
    });
};