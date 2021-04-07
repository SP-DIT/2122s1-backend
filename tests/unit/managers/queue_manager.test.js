const databaseManager = require('../../../managers/db_manager');
const queueManager = require('../../../managers/queue_manager');

jest.mock('../../../managers/db_manager');

describe('Enqueue', function () {
    function testEnqueueSuccess(description, databaseResponseValue) {
        it(description, function () {
            databaseManager.enqueue.mockResolvedValue(databaseResponseValue);
            return expect(queueManager.enqueue()).resolves.toStrictEqual({ customer_id: databaseResponseValue });
        });
    }
    testEnqueueSuccess('Should return correct success format - min', 1);
    testEnqueueSuccess('Should return correct success format - mid', Math.round(Number.MAX_SAFE_INTEGER / 2));
    testEnqueueSuccess('Should return correct success format - max', Number.MAX_SAFE_INTEGER);

    it('Should reject with the rejected value', function () {
        const databaseResponseValue = 9999;
        const rejectedValue = new Error(databaseResponseValue);
        databaseManager.enqueue.mockRejectedValue(rejectedValue);
        return expect(queueManager.enqueue()).rejects.toBe(rejectedValue);
    });
});

describe('Dequeue', function () {
    function testDequeueSuccess(description, databaseResponseValue) {
        it(description, function () {
            databaseManager.dequeue.mockResolvedValue(databaseResponseValue);
            return expect(queueManager.dequeue()).resolves.toStrictEqual({ customer_id: databaseResponseValue });
        });
    }

    testDequeueSuccess('Should return correct success format - min', 0);
    testDequeueSuccess('Should return correct success format - mid', Math.round(Number.MAX_SAFE_INTEGER / 2));
    testDequeueSuccess('Should return correct success format - max', Number.MAX_SAFE_INTEGER);

    it('Should reject with rejected value', function () {
        const databaseResponseValue = 9999;
        const rejectedValue = new Error(databaseResponseValue);
        databaseManager.dequeue.mockRejectedValue(rejectedValue);
        return expect(queueManager.dequeue()).rejects.toBe(rejectedValue);
    });
});
