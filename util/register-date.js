export function registerDate(object) {
    const now = new Date();
    object = now.toISOString();
    return object
}