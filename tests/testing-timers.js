const FakeTimers = require('@sinonjs/fake-timers'); // * Require the fake timer module
const { it, run } = require('./test_driver');

const clock = FakeTimers.install(); // * First install the fake timer

let count = 0;
function incrementEachSecond(duration) {
    const interval = setInterval(() => {
        count += 1;
    }, 1000);
    setTimeout(() => {
        clearInterval(interval);
    }, duration);
}
incrementEachSecond(5000);

it('Should increment after 1 second', () => {
    clock.next(); // * Use clock.next() advance to next timer
    return Promise.resolve(count === 1);
});
it('Should increment after 2 second', () => {
    clock.next(); // * Use clock.next() advance to next timer
    return Promise.resolve(count === 2);
});
it('Should eventually stop', () => {
    clock.runAll(); // * Use clock.runAll() to clear all timer (potential infinite loop)
    return Promise.resolve(count < 7);
});

run();
