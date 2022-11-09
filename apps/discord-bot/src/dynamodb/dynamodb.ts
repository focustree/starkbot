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
    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        return dynamoGenerateResponse(true, data);
    } catch (err: any) {
        return dynamoGenerateResponse(false, err.stack);
    }
};

export const getItem = async (selector, key) => {
    const params = {
        TableName: tableList[selector],
        Key: key,
    };
    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        return dynamoGenerateResponse(true, data.Item);
    } catch (err) {
        return dynamoGenerateResponse(false, err);
    }
};

export const getTable = async (selector, payload) => {
    const params = {
        TableName: tableList[selector],
        ...payload
    };
    try {
        const data = await ddbDocClient.send(new ScanCommand(params));
        return dynamoGenerateResponse(true, data.Items);
    } catch (err) {
        return dynamoGenerateResponse(false, err);
    }
};

export const updateItem = async (selector, key, payload) => {
    const params = {
        TableName: tableList[selector],
        Key: key,
        ...payload,
    };
    try {
        const data = await ddbDocClient.send(new UpdateCommand(params));
        return dynamoGenerateResponse(true, data);
    } catch (err) {
        return dynamoGenerateResponse(false, err);
    }
};

export const deleteItem = async (selector, key) => {
    const params = {
        TableName: tableList[selector],
        Key: key,
    };
    try {
        await ddbDocClient.send(new DeleteCommand(params));
        return dynamoGenerateResponse(true, null);
    } catch (err) {
        return dynamoGenerateResponse(false, err);
    }
};
  
export const queryTable = async (selector, payload) => {
    const params = {
        TableName: tableList[selector],
        ...payload
    };

    try {
        const data = await ddbDocClient.send(new QueryCommand(params));
        return dynamoGenerateResponse(true, data);
    } catch (err) {
        return dynamoGenerateResponse(false, err);
    }
};

export const dynamoGenerateResponse = (response: boolean, data: any) => {
    return {
        response,
        data,
    }
};