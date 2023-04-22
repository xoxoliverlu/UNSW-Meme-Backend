import { setData } from './dataStore';
import { User, Channel, TokenPair, DM, PwReset, ChannelStat, DmStat, MessageStat, ChannelsExistStat, DmsExistStat, msgsExistStat } from './interfaces';
type clearReturn = Record<string, never>;

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
    pwReset: [] as PwReset[],
    channelStats: [] as ChannelStat[],
    dmStats: [] as DmStat[],
    messageStats: [] as MessageStat[],
    channelsExistStat: [] as ChannelsExistStat[],
    dmsExistStat: [] as DmsExistStat[],
    msgsExistStat: [] as msgsExistStat[],
  };
  setData(data);
  return {};
};

export { clearV1 };
