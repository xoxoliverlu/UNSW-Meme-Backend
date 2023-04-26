import { setData } from './dataStore';
import { DataStoreM } from './db/models';
import { User, Channel, TokenPair, DM, PwReset, ChannelStat, DmStat, MessageStat, ChannelsExistStat, DmsExistStat, msgsExistStat } from './interfaces';

const clearV1 = async ()=> {
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
  await DataStoreM.deleteMany({});
  const newDataDb = new DataStoreM(data);
  await newDataDb.save();
  return {};
};

export { clearV1 };
