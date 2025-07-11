function getIntegerOrDefault(value, defaultValue) {
    const integer = Number(value)
    return Number.isInteger(integer) ? integer : defaultValue;
}

function getSerialOrDefault(value, defaultValue) {
    const serial = getIntegerOrDefault(value, null);
    return serial !== null && serial > 0 ? serial : defaultValue;
}

function getDateOrDefault(value, defaultValue) {
    const date = new Date(value);

    if (/^\d{4}-\d{2}-\d{2}/.test(value))
        date.setDate(date.getDate() + 1);
    
    return !isNaN(date.getTime()) ? date : defaultValue;
};

export { getSerialOrDefault, getDateOrDefault };