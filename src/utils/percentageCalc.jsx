export const calculatePercentageDiff = (estimated, actual) => {
    // Remove currency symbols or commas if present
    const cleanNumber = (val) => {
        if (typeof val === 'string') {
            return parseFloat(val.replace(/[^0-9.-]+/g, ''));
        }
        return val;
    };

    const est = cleanNumber(estimated);
    const act = cleanNumber(actual);

    if (isNaN(est) || isNaN(act) || est === 0) return null;

    // difference from estimated.
    // If actual is higher than estimated, it's +%
    const diff = ((act - est) / est) * 100;
    return diff.toFixed(2);
};
