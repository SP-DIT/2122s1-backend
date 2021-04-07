const { INV_REQUEST_TYPE, REQUEST_TYPE } = require('../../../commons');
const { InvalidDurationError, InvalidFromError } = require('../../../errors');
const databaseManager = require('../../../managers/db_manager');
const statsManager = require('../../../managers/stats_manager');

jest.mock('../../../managers/db_manager');
jest.useFakeTimers();

describe('Error Logging', function () {
    it('Should reject non serializable payload - circular dependency', function () {
        const statusCode = 123;
        const payload = {};
        payload.payload = payload;
        return expect(() => statsManager.logErrors(statusCode, payload)).toThrowError();
    });
    it('Should reject with rejected value', function () {
        const rejectedValue = { hello: 'world' };
        databaseManager.logError.mockRejectedValue(rejectedValue);
        const statusCode = 123;
        const payload = {};
        return expect(statsManager.logErrors(statusCode, payload)).rejects.toStrictEqual(rejectedValue);
    });
});

describe('getErrors', function () {
    function testGetErrorsSuccess(description, databaseResponseValue) {
        it(description, function () {
            const output = databaseResponseValue.map(({ payload, ...values }) => ({
                ...values,
                payload: JSON.parse(payload),
            }));
            databaseManager.getErrorLogs.mockResolvedValue(databaseResponseValue);
            return expect(statsManager.getErrors('2021-03-28T18:30:00', 1)).resolves.toStrictEqual(output);
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
        databaseManager.getErrorLogs.mockRejectedValue(databaseResponseValue);
        return expect(statsManager.getErrors('2021-03-28T18:30:00', 1)).rejects.toStrictEqual(databaseResponseValue);
    });
});
