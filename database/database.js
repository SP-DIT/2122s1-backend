const pg = require('pg');
const { DB_CONFIG } = require('../commons');

let pool;
module.exports.getPool = function () {
    if (!pool) pool = new pg.Pool(DB_CONFIG);
    return pool;
};
module.exports.tearDown = function () {
    return module.exports.getPool().end();
};
