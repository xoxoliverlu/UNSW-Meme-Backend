import { getData, setData } from './dataStore.js';

type clearReturn = {};
type Message = {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
}
type User = {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  handleStr: string;
  globalPerm: number;
};

type Channel = {
  channelId: number;
  name: string;
  ownerMembers: number[];
  allMembers: number[];
  messages: Message[];
  isPublic: boolean;
};


const clearV1 = (): clearReturn => {
  const data = {
    users: [] as User[],
    channels: [] as Channel[],
    lastAuthUserId: 0,
    lastChannelId: 0,
  };
  setData(data);
  return {};
}

export {clearV1};