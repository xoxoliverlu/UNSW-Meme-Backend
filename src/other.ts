import { getData, setData } from './dataStore';
import { User, Channel, TokenPair, DM } from './interfaces';
type clearReturn = {};

const clearV1 = (): clearReturn => {
  const data = {
    users: [] as User[],
    channels: [] as Channel[],
    lastAuthUserId: 0,
    lastChannelId: 0,
    lastMessageId: 0,
    lastToken: 0,
    tokens: [] as TokenPair[],
    dms: [] as DM[],
    lastDmId: 0,
  };
  setData(data);
  return {};
};

export { clearV1 };
