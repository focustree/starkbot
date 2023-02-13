const express = require('express');
const router = express.Router();

import {
  getItemCtr,
  putItemCtr,
  updateItemCtr,
  deleteItemCtr,
  addSubItemCtr,
  getSubItemCtr,
  deleteSubItemCtr,
  getTableCtr,
  queryTableCtr,
} from '../controllers/dynamoController';

router.get('/item', getItemCtr);
router.post('/item', putItemCtr);
router.put('/item', updateItemCtr);
router.delete('/item', deleteItemCtr);
router.get('/subitem', getSubItemCtr);
router.post('/subitem', addSubItemCtr);
router.delete('/subitem', deleteSubItemCtr);
router.get('/table', getTableCtr);
router.get('/query', queryTableCtr);

module.exports = router;
