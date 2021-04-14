const chalk = require('chalk');

const testsFunctions = [];
function it(description, testFn) {
    testsFunctions.push([description, testFn]);
}

function testRunner(tests = testsFunctions, i = 0, successCount = 0) {
    if (i === tests.length) {
        const color = successCount === i ? chalk.bgGreenBright.black : chalk.bgYellow.black;
        // eslint-disable-next-line no-console
        return console.log(color(`Finished running all ${i} test, result: ${successCount}/${i}`));
    }
    const [description, testFn] = tests[i];
    return testFn()
        .then((isSuccess) => {
            let newSuccessCount = successCount;
            if (isSuccess) {
                newSuccessCount += 1;
                // eslint-disable-next-line no-console
                console.log(chalk.bgGreen.black(`✔️ ${description}`));
            } else {
                // eslint-disable-next-line no-console
                console.log(chalk.bgRed.black(`❌ ${description}`));
            }
            return testRunner(tests, i + 1, newSuccessCount);
        })
        .catch((error) => {
            // eslint-disable-next-line no-console
            console.log('Test failed to complete with error -', error);
        });
}

function makeRevertFunction(mod, methodName) {
    const oldMod = mod;
    const oldModMethod = mod[methodName];
    return function (result) {
        oldMod[mod] = oldModMethod;
        return result;
    };
}

module.exports = {
    it,
    run: testRunner,
    makeRevertFunction,
};
