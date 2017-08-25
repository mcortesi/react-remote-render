"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function fromPairs(arr) {
    return arr.reduce(function (acc, _a) {
        var key = _a[0], val = _a[1];
        acc[key] = val;
        return acc;
    }, {});
}
exports.fromPairs = fromPairs;
function mapObject(obj, mapper) {
    return fromPairs(Object.keys(obj).map(function (key) {
        return [key, mapper(obj[key], key)];
    }));
}
exports.mapObject = mapObject;
//# sourceMappingURL=utils.js.map