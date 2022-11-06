import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./dynamodb-libs/doc-client.js";

const tableList = {
    "guild": "ClusterStack-starkbotguilds347E893A-55FD1HOET68K",
    "starknet-id": "ClusterStack-starkbotstarknetidsE6BB77F6-1TSIGBN0NH3JE",
};

export const putItem = async (item, table) => {
    const params = {
        TableName: tableList[table],
        Item: item,
    };
    try {
        const data = await ddbDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
    } catch (err: any) {
        console.log("Error", err.stack);
    }
};

export const getItem = async (key, table) => {
    const params = {
        TableName: tableList[table],
        Key: key,
    };
    try {
        const data = await ddbDocClient.send(new GetCommand(params));
        console.log("Success :", data.Item);
    } catch (err) {
        console.log("Error", err);
    }
};


export const updateItem = async (key, table, payload) => {
    const params = {
        TableName: tableList[table],
        Key: key,
        payload,
    };
    try {
        const data = await ddbDocClient.send(new UpdateCommand(params));
        console.log("Success - item added or updated", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

export const deleteItem = async (key, table) => {
    const params = {
        TableName: tableList[table],
        Key: key,
    };
    try {
        await ddbDocClient.send(new DeleteCommand(params));
        console.log("Success - item deleted");
    } catch (err) {
        console.log("Error", err);
    }
};