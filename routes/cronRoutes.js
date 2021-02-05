const { Router } = require('express');

const router = Router();
const cronController = require('../controllers/cronController');

router.get('/', cronController.cronHook);

module.exports = router;
