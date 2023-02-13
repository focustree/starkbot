import { Mutex } from 'async-mutex';
const dynamo = require("./dynamodb");

const work_on_item = new Mutex();


export const getSubItem = async (selector: string, key, subItem: string, itemId: string) => {
    
    const itemlist = await dynamo.getItem(selector, key);
    if(!itemlist.response) {
        return dynamo.dynamoGenerateResponse(false, itemlist.response);
    }

    for(const item of itemlist.data[subItem]) {
        if(item.id == itemId) {
            return dynamo.dynamoGenerateResponse(true, item);
        }
    }

    return dynamo.dynamoGenerateResponse(false, "No data with this id");

};

export const addSubItem = async (selector: string, key, subItem: string, uniqueTootlSubItem: string, uniqueToolValue: string, data) => {
    
    const responseUpdate = await work_on_item.acquire().then(async function(release) {
        
        const responseUpdate = await dynamo.updateItem(selector, key, {
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
        await dynamo.updateItem(selector, key, {
            UpdateExpression: "add " + uniqueTootlSubItem + " :r",
            ExpressionAttributeValues: { ":r": new Set<string>([uniqueToolValue]) },
        });
        release();
        return responseUpdate;
    });

    return responseUpdate;
};

export const deleteSubItem = async (selector: string, key, subItem: string,
    uniqueTootlSubItem: string, uniqueToolValue: string) => {
    
    let idLookFor = 0;
    let compt = 0;

    const responseUpdate = await work_on_item.acquire().then(async function(release) {
    
        const itemlist = (await dynamo.getItem(selector, key)).data[subItem];
        for(const item of itemlist) {
            if(item['id'] == uniqueToolValue) {
                idLookFor = compt;
            }
            compt ++;
        }

        const responseUpdate = await dynamo.updateItem(selector, key, {
            ExpressionAttributeNames: {
                "#r": subItem,
            },
            UpdateExpression: "remove #r[" + idLookFor.toString() + "]",
        });
        await dynamo.updateItem(selector, key, {
            UpdateExpression: "delete " + uniqueTootlSubItem + " :r",
            ExpressionAttributeValues: { ":r": new Set<string>([uniqueToolValue]) },
        });

        if(responseUpdate.response) {
            responseUpdate.data = itemlist[idLookFor];
        }
        release();
        return responseUpdate;
    });

    return responseUpdate;
};