import { getData, setData } from './dataStore';
import { User, Channel, TokenPair } from './interfaces';
type clearReturn = {};

const clearV1 = (): clearReturn => {
  const data = {
    users: [] as User[],
    channels: [] as Channel[],
    lastAuthUserId: 0,
    lastChannelId: 0,
    lastToken: 0,
    tokens: [] as TokenPair[],
  };
  setData(data);
  return {};
}

export {clearV1};