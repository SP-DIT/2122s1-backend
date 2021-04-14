const { it, run, makeRevertFunction } = require('../../test_driver');
const databaseManager = require('../../../managers/db_manager');
const statsManager = require('../../../managers/stats_manager');

const revertStatsManagerLogErrors = makeRevertFunction(databaseManager, 'logErrors');

console.log('Error Logging');
it('Should reject non serializable payload - circular dependency', function () {
    const statusCode = 123;
    const payload = {};
    payload.payload = payload;
    return statsManager
        .logErrors(statusCode, payload)
        .then(() => false)
        .catch(() => true)
        .then(revertStatsManagerLogErrors);
});
it('Should reject with rejected value', function () {
    const rejectedValue = { hello: 'world' };
    databaseManager.logError = function () {
        return Promise.reject(rejectedValue);
    };
    const statusCode = 123;
    const payload = {};
    return statsManager
        .logErrors(statusCode, payload)
        .then(() => false)
        .catch((error) => error === rejectedValue)
        .then(revertStatsManagerLogErrors);
});

console.log('Getting Logged Errors');
const revertStatsManagerGetErrorLogs = makeRevertFunction(databaseManager, 'getErrorLogs');
function testGetErrorsSuccess(description, databaseResponseValue) {
    it(description, function () {
        const output = databaseResponseValue.map(({ payload, ...values }) => ({
            ...values,
            payload: JSON.parse(payload),
        }));
        databaseManager.getErrorLogs = function () {
            return Promise.resolve(databaseResponseValue);
        };
        return statsManager
            .getErrors('2021-03-28T18:30:00', 1)
            .then((result) => JSON.stringify(result) == JSON.stringify(output))
            .then(revertStatsManagerGetErrorLogs);
    });
}
testGetErrorsSuccess('Should return empty array correctly', []);
testGetErrorsSuccess('Should return array with 1 entry correctly', [
    { timestamp: 123, status_code: 123, payload: '{}' },
]);
testGetErrorsSuccess('Should return array with multiple entry correctly', [
    { timestamp: 123, status_code: 123, payload: '{}' },
    { timestamp: 234, status_code: 234, payload: '{}' },
    { timestamp: 345, status_code: 345, payload: '{}' },
]);
it('Should reject with rejected value', function () {
    const databaseResponseValue = { error: 'hello' };
    databaseManager.getErrorLogs = function () {
        return Promise.reject(databaseResponseValue);
    };
    return statsManager
        .getErrors('2021-03-28T18:30:00', 1)
        .then(() => false)
        .catch((error) => error == databaseResponseValue)
        .then(revertStatsManagerGetErrorLogs);
});

run();
