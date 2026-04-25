const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controller/Settings.Controller');
// Note: In a real app, you'd add admin middleware here
// const { protect, admin } = require('../middleware/auth');

router.get('/', getSettings);
router.put('/', updateSettings);

module.exports = router;
