import { ScanCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, GetCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { ddbDocClient } from "./dynamodb-libs/doc-client";

const tableList = {
    "guild": "ClusterStack-starkbotguilds347E893A-55FD1HOET68K",
    "starknet-id": "ClusterStack-starkbotstarknetidsE6BB77F6-1TSIGBN0NH3JE",
};

const conditionList = {
    "guild": "Name",
    "starknet-id": "accountAddress",
}

export interface dynamoQueryResponse {
    response: boolean,
    data: any,
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

export const getSubItem = async (selector: string, key, subItem: string, itemId: string) => {
    
    const itemlist = await getItem(selector, key);
    if(itemlist.response) {
        return dynamoGenerateResponse(false, itemlist.response);
    }

    for(const [_id, item] of itemlist.data[subItem]) {
        if(item['id'] == itemId) {
            return dynamoGenerateResponse(true, item);
        }
    }
    return dynamoGenerateResponse(false, "No data with this id");

};

export const addSubItem = async (selector: string, key, subItem: string, uniqueTootlSubItem: string, uniqueToolValue: string, data) => {
    const responseUpdate = await updateItem(selector, key, {
        ExpressionAttributeNames: {
            "#r": subItem,
            "#s": uniqueTootlSubItem,
        },
        ConditionExpression: "not contains(#s, :uid)",
        UpdateExpression: "set #r = list_append(#r, :v)",
        ExpressionAttributeValues: {
            ":v": [data],
            ":uid": uniqueToolValue
        },
    });
    await updateItem(selector, key, {
        UpdateExpression: "add " + uniqueTootlSubItem + " :r",
        ExpressionAttributeValues: { ":r": new Set<string>([uniqueToolValue]) },
    });
    return responseUpdate;
};

export const deleteSubItem = async (selector: string, key, subItem: string,
    uniqueTootlSubItem: string, uniqueToolValue: string) => {
    
    let idLookFor = 0;
    
    const itemlist = (await getItem(selector, key)).data[subItem];
    for(const [id, item] of itemlist) {
        console.log(id, item);
        if(item['id'] == uniqueToolValue) {
            idLookFor = id;
        }
    }

    const responseUpdate = await updateItem(selector, key, {
        ExpressionAttributeNames: {
            "#r": subItem,
            "#s": uniqueTootlSubItem,
            "#id": idLookFor,
        },
        UpdateExpression: "remove #r[#id]",
    });
    await updateItem(selector, key, {
        UpdateExpression: "delete " + uniqueTootlSubItem + " :r",
        ExpressionAttributeValues: { ":r": new Set<string>([uniqueToolValue]) },
    });
    return responseUpdate;
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

const dynamoGenerateResponse = (response: boolean, data: any) => {
    return {
        response,
        data,
    }
};