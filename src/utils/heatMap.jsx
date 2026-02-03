export const getHeatMapColor = (value, min, max) => {
    if (value === undefined || value === null || min === undefined || max === undefined || isNaN(value) || isNaN(min) || isNaN(max)) {
        return 'transparent';
    }

    if (min === max) {
        // If all values are the same, maybe return a neutral color or the "min" color?
        // Let's go with a neutral light green/yellow.
        return 'hsl(60, 85%, 85%)';
    }

    // Normalize value between 0 and 1
    // min -> 0
    // max -> 1
    const ratio = (value - min) / (max - min);

    // Hue Calculation:
    // 0 (Min) => 120 (Green)
    // 1 (Max) => 0 (Red)
    // We want to go from 120 down to 0.
    // However, sometimes we might want to cap it. A full red (0) can be intense.
    // The prompt says "red" and "green".
    // Let's use 130 (Greenish) to 0 (Red).

    const hue = (1 - ratio) * 130;

    // Using HSL for better control.
    // Saturation 60-90% gives a vibrant look.
    // Lightness 85-95% keeps it as a background color, readable with dark text.
    return `hsl(${hue}, 85%, 80%)`;
};

export const getRowStats = (row) => {
    // Extract rate keys. Based on prompt: "Supplier 1 (Rate)", etc.
    // Ideally this should be dynamic, but the prompt gave specific headers.
    // "Supplier 1 (Rate)" to "Supplier 5 (Rate)".
    // But wait, what if there are more? "Given a csv file which contains ... quoted by multiple suppliers".
    // The prompt shows a list a-i. "Supplier 1...5".
    // But strictly, we should look for columns that match the pattern or "Supplier".
    // Let's look for keys starting with "Supplier" and ending with "(Rate)"?
    // Or just "Supplier" keys?
    // Use regex /Supplier \d+ \(Rate\)/

    const supplierKeys = Object.keys(row).filter(k => /Supplier \d+ \(Rate\)/.test(k));

    const values = supplierKeys.map(k => {
        const val = parseFloat(row[k]?.replace(/[^0-9.-]+/g, ''));
        return { key: k, value: isNaN(val) ? 0 : val }; // Treat NaN as 0 or ignore?
    }).filter(v => v.value > 0); // Ignore 0 or invalid for Min calculation? Usually yes.

    if (values.length === 0) return { min: 0, max: 0, values: {} };

    const rawValues = values.map(v => v.value);
    const min = Math.min(...rawValues);
    const max = Math.max(...rawValues);

    return { min, max, supplierKeys };
};