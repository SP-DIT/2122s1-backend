require('dotenv').config();
const request = require('supertest');
const pg = require('pg');
const database = require('../../database/database');
const { DB_CONFIG, DATE_FORMAT } = require('../../commons');
const { ERROR_CODE } = require('../../errors');
const { now } = require('../../utils');

// Use fake timer
jest.useFakeTimers();

// Mock database connection
jest.mock('../../database/database');
const client = new pg.Client({ ...DB_CONFIG, port: process.env.DB_TEST_PORT });
client.connect();
database.getPool.mockReturnValue(client);

const { app } = require('../../app');
require('../../router');

beforeAll(function () {
    return client.query(`
        truncate queue_tab RESTART IDENTITY; 
        truncate error_tab RESTART IDENTITY;
    `);
});

afterAll(function () {
    return client.end();
});

describe('Enqueue', function () {
    it('Should return success with customer_id: 1 for first customer', async () => {
        const response = await request(app).post('/queue');
        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({ customer_id: 1 });
    });
    it('Should return success with customer_id: 2 for second customer', async () => {
        const response = await request(app).post('/queue');
        expect(response.statusCode).toBe(201);
        expect(response.body).toStrictEqual({ customer_id: 2 });
    });
});

describe('Dequeue', function () {
    it('Should return success with first customer id, 1', async () => {
        const response = await request(app).delete('/queue');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ customer_id: 1 });
    });
    it('Should return success with second customer id, 2', async () => {
        const response = await request(app).delete('/queue');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ customer_id: 2 });
    });
    it('Should return success with no more customer id, 0', async () => {
        const response = await request(app).delete('/queue');
        expect(response.statusCode).toBe(200);
        expect(response.body).toStrictEqual({ customer_id: 0 });
    });
});

describe('Error rate', function () {
    const notFoundUrl = '/some-random-url';
    beforeEach(function () {
        return client.query('truncate error_tab RESTART IDENTITY;');
    });

    it('Should not log any error when response is success', async () => {
        const from = encodeURIComponent(now().subtract(1, 'minute').format(DATE_FORMAT));
        const errorLogsResponse = await request(app).get(`/stats/errors?from=${from}&duration=3`);
        const errorLogs = errorLogsResponse.body;
        expect(errorLogs.length).toBe(0);
    });

    it('Should record error when an error occurred, 404 not found', async () => {
        const response = await request(app).get(notFoundUrl);
        expect(response.statusCode).toBe(404);

        const from = encodeURIComponent(now().subtract(1, 'minute').format(DATE_FORMAT));
        const errorLogsResponse = await request(app).get(`/stats/errors?from=${from}&duration=2`);
        const errorLogs = errorLogsResponse.body;

        expect(errorLogs.length).toBe(1);
        expect(errorLogs[0].status_code).toEqual(404);
        expect(errorLogs[0].payload.code).toEqual(ERROR_CODE.URL_NOT_FOUND);
    });

    it('Should be able to record multiple errors', async () => {
        const requestCount = 5;
        for (let i = 0; i < requestCount; i++) {
            const response = await request(app).get(`${notFoundUrl}-${i}`);
            expect(response.statusCode).toBe(404);
        }

        const from = encodeURIComponent(now().subtract(1, 'minute').format(DATE_FORMAT));
        const errorLogsResponse = await request(app).get(`/stats/errors?from=${from}&duration=2&status_codes=404`);
        const errorLogs = errorLogsResponse.body;

        expect(errorLogs.length).toBe(requestCount);
        for (let i = 0; i < requestCount; i++) {
            expect(errorLogs[i].timestamp).not.toBeNaN();
            expect(errorLogs[i].timestamp).toBeTruthy();
            expect(errorLogs[i].status_code).toEqual(404);
            expect(errorLogs[i].payload.code).toEqual(ERROR_CODE.URL_NOT_FOUND);
        }
    });
});
