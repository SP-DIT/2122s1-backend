const utils = require('../utils');
const databaseManager = require('./db_manager');

/**
 * Error Logging
 */
module.exports.logErrors = function (statusCode, payload) {
    return databaseManager.logError(statusCode, JSON.stringify(payload));
};

/**
 *
 * @param {String} from
 * @param {Number} duration Number of minutes
 */
module.exports.getErrors = function (from, duration) {
    const { error, fromTimestamp, toTimestamp } = utils.getFromAndToTimestampInErrorObject(from, duration);
    if (error) return Promise.reject(error);
    return databaseManager.getErrorLogs(fromTimestamp, toTimestamp).then((rows) =>
        rows.map(({ timestamp, status_code: statusCode, payload }) => ({
            timestamp,
            status_code: statusCode,
            payload: JSON.parse(payload),
        })),
    );
};
