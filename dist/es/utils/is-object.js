export default function isObject(val) {
    return (val !== null &&
        typeof val === 'object' &&
        !(val instanceof Date || val instanceof RegExp) &&
        !Array.isArray(val));
}
//# sourceMappingURL=is-object.js.map