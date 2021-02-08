const express = require('express');
const router = express();

const cron = require('./cronRoutes');

router.use('/api/cron', cron);

module.exports = router;
