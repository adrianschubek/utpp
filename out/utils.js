"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceBetween = void 0;
const replaceBetween = (str, start, end, what) => {
    return str.substring(0, start) + what + str.substring(end);
};
exports.replaceBetween = replaceBetween;
