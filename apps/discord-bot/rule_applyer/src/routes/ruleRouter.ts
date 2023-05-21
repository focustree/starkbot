const express = require('express');
const router = express.Router();

const ruleCtrl = require('../controllers/ruleController');

router.post('/rule', ruleCtrl.applyRulesForMember);

module.exports = router;