const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
const utc = require('dayjs/plugin/utc');
const commons = require('./commons');
const { InvalidDurationError, InvalidFromError } = require('./errors');

dayjs.extend(utc);
dayjs.extend(customParseFormat);

module.exports.now = function (isUtc = true) {
    if (isUtc) return dayjs().utc();
    return dayjs();
};

module.exports.toUnix = function (isoDateTime, format = commons.DATE_FORMAT) {
    return dayjs.utc(isoDateTime, format, true).unix();
};

module.exports.getFromAndToTimestamp = function (from, duration) {
    if (duration < 1 || duration > 1440) {
        throw new InvalidDurationError(`Duration (${duration}) is not within [1, 1440]`);
    }
    if (Number.isNaN(Number(duration))) throw new InvalidDurationError(`Duration ${duration} is NaN`);
    const fromTimestamp = module.exports.toUnix(from);
    if (Number.isNaN(Number(fromTimestamp))) throw new InvalidFromError(`From (${from}) is NaN`);
    const toTimestamp = fromTimestamp + duration * commons.SECONDS_PER_MINUTE;
    return [fromTimestamp, toTimestamp];
};

module.exports.getFromAndToTimestampInErrorObject = function (from, duration) {
    let fromTimestamp;
    let toTimestamp;
    let result;
    try {
        [fromTimestamp, toTimestamp] = this.getFromAndToTimestamp(from, duration);
        result = { fromTimestamp, toTimestamp };
    } catch (error) {
        result = { error };
    }
    return result;
};
