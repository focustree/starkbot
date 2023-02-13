const express = require('express');
const router = express.Router();

const dynamoCtrl = require('../controllers/dynamoController');

router.get('/item', dynamoCtrl.getItem);
router.post('/item', dynamoCtrl.putItem);
router.put('/item', dynamoCtrl.updateItem);
router.delete('/item', dynamoCtrl.deleteItem);
router.get('/table', dynamoCtrl.getTable);
router.get('/query', dynamoCtrl.queryTable);

module.exports = router;