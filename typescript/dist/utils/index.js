"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.success = void 0;
function success(message, args = {} || null, statusCode) {
    return {
        status: 'success',
        statusCode: statusCode || 200,
        message: message,
        data: args,
    };
}
exports.success = success;
