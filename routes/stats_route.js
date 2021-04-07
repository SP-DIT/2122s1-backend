const express = require('express');
const statsManager = require('../managers/stats_manager');

const router = express.Router();

router.get('/errors', (req, res, next) => {
    const { from, duration, status_codes: statusCodes } = req.query;
    return statsManager
        .getErrors(from, duration, statusCodes)
        .then((response) => res.json(response))
        .catch(next);
});

module.exports = router;
