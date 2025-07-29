function getIntegerOrDefault(value, defaultValue) {
    const integer = Number(value)
    return Number.isInteger(integer) ? integer : defaultValue;
}

function getFloatOrDefault(value, defaultValue) {
    const float = Number(value)
    return !isNaN(float) ? float : defaultValue;
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
}

function getEmailOrDefault(value, defaultValue) {
    const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const formatedEmail = value?.trim().toLowerCase();
    return typeof formatedEmail !== "undefined" && formatedEmail.length <= 125 && EMAIL_PATTERN.test(formatedEmail) ? formatedEmail : defaultValue;
}

function getRegisterStringOrDefault(value, defaultValue) {
    const formatedString = value?.trim();
    return typeof formatedString !== "undefined" && formatedString.length >= 3 ? formatedString : defaultValue;
}


export { getIntegerOrDefault, getFloatOrDefault, getSerialOrDefault, getDateOrDefault, getEmailOrDefault, getRegisterStringOrDefault };