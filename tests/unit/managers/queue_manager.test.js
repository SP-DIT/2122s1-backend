const { it, run, makeRevertFunction } = require('../../test_driver');
const dbManager = require('../../../managers/db_manager');
const queueManager = require('../../../managers/queue_manager');

const revertDbManagerDequeue = makeRevertFunction(dbManager, 'dequeue');

// use `it` to add tests.
it('should resolve dequeue correctly', function () {
    dbManager.dequeue = function () {
        return Promise.resolve(12);
    };
    // Important: Return the promise
    return queueManager
        .dequeue()
        .then(
            (result) =>
                JSON.stringify(result) ==
                JSON.stringify({
                    customer_id: 12,
                }),
        )
        .then(revertDbManagerDequeue);
});

it('Should reject dequeue correctly', function () {
    dbManager.dequeue = function () {
        return Promise.reject('ERROR!');
    };
    return queueManager
        .dequeue()
        .then(() => false)
        .catch((error) => error === 'ERROR!')
        .then(revertDbManagerDequeue);
});

// Run the tests
// Important: Keep this as the last line
run();
