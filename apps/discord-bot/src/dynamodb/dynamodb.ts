import { ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./doc-client";
import { config } from "../configuration/config";

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
  return await handleError(async () => {
    return (await ddbDocClient.send(new PutCommand(params)));
  });
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
  return await handleError(async () => {
    return await ddbDocClient.send(new UpdateCommand(params));
  });
};

export const deleteItem = async (selector, key) => {
  const params = {
    TableName: tableList[selector],
    Key: key,
  };
  return await handleError(async () => {
    await ddbDocClient.send(new DeleteCommand(params));
    return null;
  });
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