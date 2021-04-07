const { InvalidFromError, InvalidDurationError } = require('../../errors');
const utils = require('../../utils');

const from = '2021-03-28T18:30:00';
const fromTimestamp = 1616956200;

describe('getFromAndToTimestamp', function () {
    it('Should add 1 minute', function () {
        expect(utils.getFromAndToTimestamp(from, 1)).toStrictEqual([fromTimestamp, fromTimestamp + 60]);
    });
    it('Should add 2 minute', function () {
        expect(utils.getFromAndToTimestamp(from, 2)).toStrictEqual([fromTimestamp, fromTimestamp + 120]);
    });
    it('Should add 1440 minute', function () {
        expect(utils.getFromAndToTimestamp(from, 1440)).toStrictEqual([fromTimestamp, fromTimestamp + 1440 * 60]);
    });
    it('Should add even when duration is a numerical string', function () {
        expect(utils.getFromAndToTimestamp(from, '3')).toStrictEqual([fromTimestamp, fromTimestamp + 180]);
    });
    it('Should reject when the year is of wrong format', function () {
        expect(() => utils.getFromAndToTimestamp('202-02-01T18:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when the year contains invalid character', function () {
        expect(() => utils.getFromAndToTimestamp('202A-02-01T18:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when the month is wrong format', function () {
        expect(() => utils.getFromAndToTimestamp('2020-2-01T18:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when the month contains invalid character', function () {
        expect(() => utils.getFromAndToTimestamp('2020--2-01T18:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when the day is wrong format', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-1T18:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when the day is not in calendar (e.g. 31st Feb)', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-31T18:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when the "T" character is missing', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-01 18:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when hour format is wrong', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-01T8:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when hour is greater than 24', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-01T99:30:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when minute format is wrong', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-01T18:3:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when minute contains invalid character', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-01T18:3B:00', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when seconds format is wrong', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-01T18:03:0', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when seconds contains invalid character', function () {
        expect(() => utils.getFromAndToTimestamp('2020-02-01T18:03:0A', 1)).toThrowError(InvalidFromError);
    });
    it('Should reject when duration is not numerical', function () {
        expect(() => utils.getFromAndToTimestamp(from, 'apple')).toThrowError(InvalidDurationError);
    });
    it('Should reject with InvalidDurationError with duration is lesser than 1', function () {
        expect(() => utils.getFromAndToTimestamp('2021-03-28T18:30:00', 0)).toThrowError(InvalidDurationError);
    });
    it('Should reject with InvalidDurationError with duration is greater than 1440', function () {
        expect(() => utils.getFromAndToTimestamp('2021-03-28T18:30:00', 1441)).toThrowError(InvalidDurationError);
    });
});
