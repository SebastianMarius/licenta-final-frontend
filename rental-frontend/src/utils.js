export function timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const hour = Math.floor(diff / 36e5);
    if (hour < 1) return '<1h';
    if (hour < 24) return `${hour}h`;
    return `${Math.floor(hour / 24)}d`;
}

export function formateDate(date) {
    return date
        ? new Date(date).toLocaleDateString("ro-RO", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })
        : null;


}