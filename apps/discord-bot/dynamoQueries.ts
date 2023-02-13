import axios from 'axios';
import { dynamoQueryResponse } from './types';

export async function getTable(selector: string, payload) {
  return (await axios({
    method: 'get',
    url: 'https://dynamodb/table',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      selector,
      payload,
    }),
  })) as undefined as dynamoQueryResponse;
}

export async function getItem(selector: string, key) {
  return (await axios({
    method: 'get',
    url: 'https://dynamodb/item',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      selector,
      key,
    }),
  })) as undefined as dynamoQueryResponse;
}

export async function putItem(selector: string, item) {
  return (await axios({
    method: 'post',
    url: 'https://dynamodb/item',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      selector,
      item,
    }),
  })) as undefined as dynamoQueryResponse; // may be a mess
}

export async function addSubItem(
  selector: string,
  key,
  subItem: string,
  uniqueTootlSubItem: string,
  uniqueToolValue: string,
  data
) {
  return (await axios({
    method: 'post',
    url: 'https://dynamodb/subitem',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      selector,
      key,
      subItem,
      uniqueTootlSubItem,
      uniqueToolValue,
      data,
    }),
  })) as undefined as dynamoQueryResponse; // may be a mess
}

export async function queryTable(selector: string, payload) {
  return (await axios({
    method: 'get',
    url: 'https://dynamodb/query',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      selector,
      payload,
    }),
  })) as undefined as dynamoQueryResponse;
}
