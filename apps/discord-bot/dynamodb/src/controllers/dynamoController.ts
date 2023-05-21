import { addSubItem, getSubItem, deleteSubItem } from '../dynamo/dynamo-item';
import {
  putItem,
  getItem,
  updateItem,
  deleteItem,
  getTable,
  queryTable,
} from '../dynamo/dynamodb';

async function print_test(message) {
  console.log(message);
}

export async function putItemCtr(req, res, next) {
  //putItem(req.selector, req.item)
  print_test("PutItem")
    .then(() => {
      res.status(201).json({
        message: 'Item saved successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}

export async function getItemCtr(req, res, next) {
  //getItem(req.selector, req.key)
  print_test("GetItem")
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
}

export async function updateItemCtr(req, res, next) {
  //updateItem(req.selector, req.key, req.payload)
  print_test("UpdateItem")
    .then(() => {
      res.status(201).json({
        message: 'Item updated successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}

export async function deleteItemCtr(req, res, next) {
  //deleteItem(req.selector, req.key)
  print_test("DeleteItem")
    .then(() => {
      res.status(200).json({
        message: 'Item deleted successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}

export async function addSubItemCtr(req, res, next) {
  /*addSubItem(
    req.selector,
    req.key,
    req.subItem,
    req.uniqueTootlSubItem,
    req.uniqueToolValue,
    req.data
  )*/
  print_test("AddSubItem")
    .then(() => {
      res.status(201).json({
        message: 'Item saved successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}

export async function getSubItemCtr(req, res, next) {
  //getSubItem(req.selector, req.key, req.subItem, req.itemId)
  print_test("GetSubItem")
    .then((item) => {
      res.status(200).json(item);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
}

export async function deleteSubItemCtr(req, res, next) {
  /*deleteSubItem(
    req.selector,
    req.key,
    req.subItem,
    req.uniqueTootlSubItem,
    req.uniqueToolValue
  )*/
  print_test("DeleteSubItem")
    .then(() => {
      res.status(200).json({
        message: 'Item deleted successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
}

export async function getTableCtr(req, res, next) {
  //getTable(req.selector, req.payload)
  print_test("GetTable")
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
}

export async function queryTableCtr(req, res, next) {
  //queryTable(req.selector, req.payload)
  print_test("QueryTable")
    .then((items) => {
      res.status(200).json(items);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
}
