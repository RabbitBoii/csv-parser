export const getHeatMapColor = (value, min, max) => {
    if (value === undefined || value === null || min === undefined || max === undefined || isNaN(value) || isNaN(min) || isNaN(max)) {
        return 'transparent';
    }

    if (min === max) {
        return 'hsl(60, 85%, 85%)';
    }

    const ratio = (value - min) / (max - min);

    const hue = (1 - ratio) * 130;


    return `hsl(${hue}, 85%, 80%)`;
};

export const getRowStats = (row) => {

    const supplierKeys = Object.keys(row).filter(k => /Supplier \d+ \(Rate\)/.test(k));

    const values = supplierKeys.map(k => {
        const val = parseFloat(row[k]?.replace(/[^0-9.-]+/g, ''));
        return { key: k, value: isNaN(val) ? 0 : val };
    }).filter(v => v.value > 0);

    if (values.length === 0) return { min: 0, max: 0, values: {} };

    const rawValues = values.map(v => v.value);
    const min = Math.min(...rawValues);
    const max = Math.max(...rawValues);

    return { min, max, supplierKeys };
};