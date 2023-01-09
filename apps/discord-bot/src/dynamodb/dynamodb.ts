import { ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./doc-client";
import { config } from "../configuration/config";
import { Mutex } from 'async-mutex';

const dbsafe = new Mutex();
const RANGE_ID = 1000000000000000000;


const tableList = {
  "guild": config.dynamodbTableGuild,
  "starknet-id": config.dynamodbTableStarknetId,
};

const conditionList = {
  "guild": "Name",
  "starknet-id": "accountAddress",
}

export const putItem = async (selector, item) => {
  let params = {
    TableName: tableList[selector],
    Item: item,
    ConditionExpression: "attribute_not_exists(#id)",
    ExpressionAttributeNames: {
      "#id": conditionList[selector],
    },
  };

  let pid : number = Math.floor(Math.random() * RANGE_ID);
  //console.log(pid.toString());
  let resp;

  await dbsafe.acquire().then(async function(release) {
    //console.log("pid " + pid.toString() + " acquired");

    resp = await handleError(async () => {
      return await ddbDocClient.send(new PutCommand(params));
    });

    //console.log("pid " + pid.toString() + " released");
    release();
  });

  return resp
};

export const getItem = async (selector, key) => {
  const params = {
    TableName: tableList[selector],
    Key: key,
  };
  return await handleError(async () => {
    return (await ddbDocClient.send(new GetCommand(params))).Item;
  });
};

export const getTable = async (selector, payload) => {
  const params = {
    TableName: tableList[selector],
    ...payload
  };
  return await handleError(async () => {
    return (await ddbDocClient.send(new ScanCommand(params))).Items
  });
};

export const updateItem = async (selector, key, payload) => {
  const params = {
    TableName: tableList[selector],
    Key: key,
    ...payload,
  };

  //console.log(params);

  let resp;
  let pid : number = Math.floor(Math.random() * RANGE_ID);
  //console.log(pid);

  await dbsafe.acquire().then(async function(release) {
    //console.log("pid " + pid.toString() + " acquired");

    resp = await handleError(async () => {
      return await ddbDocClient.send(new UpdateCommand(params));
    });

    //console.log("pid " + pid.toString() + " released");
    release();
  });
    
  return resp;
};

export const deleteItem = async (selector, key) => {
  const params = {
    TableName: tableList[selector],
    Key: key,
  };

  let pid : number = Math.floor(Math.random() * RANGE_ID);

  await dbsafe.acquire().then(async function(release) {
    //console.log("pid " + pid.toString() + " acquired");

    await handleError(async () => {
      return await ddbDocClient.send(new DeleteCommand(params));
    });
    
    //console.log("pid " + pid.toString() + " released");
    release();
  });

  return null
};

export const queryTable = async (selector, payload) => {
  const params = {
    TableName: tableList[selector],
    ...payload
  };
  return await handleError(async () => {
    return await ddbDocClient.send(new QueryCommand(params));
  });
};

export const dynamoGenerateResponse = (response: boolean, data: any) => {
  return {
    response,
    data,
  }
};

async function handleError(fun: () => Promise<any>) {
  try {
    return dynamoGenerateResponse(true, await fun());
  } catch (err) {
    return dynamoGenerateResponse(false, err);
  }
}