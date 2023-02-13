import {} from '../db-types'
const dynamo = require("dynamodb")

exports.putItem = (req, res, next) => {
  
  dynamo.putItem.then(
    () => {
      res.status(201).json({
        message: 'Item saved successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getItem = (req, res, next) => {
  
  dynamo.getItem.then(
    (thing) => {
      res.status(200).json(thing);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

exports.updateItem = (req, res, next) => {
  
  dynamo.updateItem.then(
    () => {
      res.status(201).json({
        message: 'Thing updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.deleteItem = (req, res, next) => {
  dynamo.deleteItem.then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getTable = (req, res, next) => {
  dynamo.getTable.then(
    (things) => {
      res.status(200).json(things);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.queryTable = (req, res, next) => {
    dynamo.queryTable.then(
      (things) => {
        res.status(200).json(things);
      }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
    );
  };

