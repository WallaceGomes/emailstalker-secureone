const express = require('express');
const router = express();

const userRoutes = require('./usersRoutes');
const auth = require('./authRoutes');
const cron = require('./cronRoutes');

router.use('/api/users', userRoutes);
router.use('/api/auth', auth);
router.use('/api/cron', cron);

module.exports = router;
