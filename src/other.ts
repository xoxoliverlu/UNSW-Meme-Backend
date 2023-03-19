import { getData, setData } from './dataStore.js';

type clearReturn = {};


const clearV1 = (): clearReturn => {
  const data = {
    users: [],
    channels: [],
    lastAuthUserId: 0,
    lastChannelId: 0,
  };
  setData(data);
  return {};
}

export {clearV1};