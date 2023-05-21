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
  })) as unknown as dynamoQueryResponse;
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
  })) as unknown as dynamoQueryResponse;
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
  })) as unknown as dynamoQueryResponse; // may be a mess
}

export async function getSubItem(
  selector: string,
  key,
  subItem: string,
  id: string
) {
  return (await axios({
    method: 'get',
    url: 'https://dynamodb/subitem',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      selector,
      key,
      subItem,
      id
    }),
  })) as unknown as dynamoQueryResponse; // may be a mess
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
  })) as unknown as dynamoQueryResponse; // may be a mess
}

export async function deleteSubItem(
  selector: string,
  key,
  subItem: string,
  uniqueTootlSubItem: string,
  uniqueToolValue: string
) {
  return (await axios({
    method: 'delete',
    url: 'https://dynamodb/subitem',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      selector,
      key,
      subItem,
      uniqueTootlSubItem,
      uniqueToolValue
    }),
  })) as unknown as dynamoQueryResponse; // may be a mess
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
  })) as unknown as dynamoQueryResponse;
}
