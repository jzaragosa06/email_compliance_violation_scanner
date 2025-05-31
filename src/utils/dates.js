exports.getIsoUTCNow = () => {
    return new Date().toISOString();
}

exports.getCreatedUpdatedIsoUTCNow = () => {
    const now = new Date().toISOString();
    const created_at = now;
    const updated_at = now;

    return { created_at, updated_at };
}

exports.isUtcDatetime = (str) => {
    const utcIso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
    return utcIso8601Regex.test(str);
};