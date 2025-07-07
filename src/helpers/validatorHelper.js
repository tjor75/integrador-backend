function getIntegerOrDefault(value, defaultValue) {
    return Number.isInteger(value) ? parseInt(value) : defaultValue;
}

function getSerialOrDefault(value, defaultValue) {
    const serial = getIntegerOrDefault(value, null);
    return serial !== null && number > 0 ? value : defaultValue;
}

function getDateOrDefault(value, defaultValue) {
    let date;
    try {
        date = new Date(value);

        if (/^\d{4}-\d{2}-\d{2}/.test(value))
            date.setDate(date.getDate() + 1);
    } catch (e) {
        date = defaultValue;
    } finally {
        return date;
    }
};

export { getSerialOrDefault, getDateOrDefault };