
function isStringEmptyOrNull(value) {
    return value === null || value === undefined || value.trim() === '';
}
function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const currentYear = now.getFullYear();

    // 올해인지 확인
    if (year === currentYear) {
        return `${month}/${day}`;
    } else {
        return `${year}/${month}/${day}`;
    }
}
export default { isStringEmptyOrNull, formatDate };
