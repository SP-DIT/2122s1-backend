const { getPool } = require('../database/database');

const pool = getPool();

module.exports.enqueue = function () {
    return pool
        .query(
            `
            INSERT INTO queue_tab 
            (id, served) 
            VALUES 
            (
                DEFAULT, 
                DEFAULT
            ) 
            RETURNING *`,
        )
        .then((result) => result.rows[0].id);
};

module.exports.dequeue = function () {
    return pool
        .query(
            `UPDATE queue_tab 
            SET 
                served = true
            WHERE id = (SELECT id FROM queue_tab WHERE not served ORDER BY id LIMIT 1) 
            RETURNING *`,
        )
        .then((result) => (!result.rows.length ? 0 : result.rows[0].id));
};

module.exports.logError = function (statusCode, payload) {
    return pool.query(
        `INSERT INTO error_tab (timestamp, status_code, payload) 
        VALUES (cast(extract(epoch from CURRENT_TIMESTAMP(0)) as integer), $1, $2);`,
        [statusCode, payload],
    );
};

module.exports.getErrorLogs = function (fromTimestamp, toTimestamp) {
    const conditions = [`timestamp >= $1`, `timestamp < $2`];
    const params = [fromTimestamp, toTimestamp];
    const query = `SELECT * FROM error_tab WHERE ${conditions.join(' AND ')}`;
    return pool.query(query, params).then((result) => result.rows);
};
