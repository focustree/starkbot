const express = require('express');
const router = express.Router();

const memberCtrl = require('../controllers/memberController');

router.post('/member', memberCtrl.fetchMember);

module.exports = router;