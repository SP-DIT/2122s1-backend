/* eslint-disable max-classes-per-file */

module.exports.ERROR_CODE = {
    URL_NOT_FOUND: 'URL_NOT_FOUND',
    UNEXPECTED_ERROR: 'UNEXPECTED_ERROR',
    INVALID_QUERY_PARAMETER: 'INVALID_QUERY_PARAMETER',
};

module.exports.InvalidDurationError = class InvalidDurationError extends Error {};
module.exports.InvalidFromError = class InvalidFromError extends Error {};
module.exports.UrlNotFoundError = class UrlNotFoundError extends Error {};
