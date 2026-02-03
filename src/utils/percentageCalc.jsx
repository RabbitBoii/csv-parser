export const calculatePercentageDiff = (estimated, actual) => {
    const cleanNumber = (val) => {
        if (typeof val === 'string') {
            return parseFloat(val.replace(/[^0-9.-]+/g, ''));
        }
        return val;
    };

    const est = cleanNumber(estimated);
    const act = cleanNumber(actual);

    if (isNaN(est) || isNaN(act) || est === 0) return null;


    const diff = ((act - est) / est) * 100;
    return diff.toFixed(2);
};
