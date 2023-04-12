

import { requestChannelInvite, requestChannelsCreate, requestAuthRegister, requestChannelDetails, requestClear } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Testing channelInvite for it-2', () => {
  test('Inviting to a Public channel', () => {
    requestAuthRegister('dimpi@ad.unsw.edu.au', 'dimpi123', 'dimpi', 'garnepudi');
    const user2 = requestAuthRegister('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = requestAuthRegister('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const channel = requestChannelsCreate(user2.token, 'jayjaychannel', true);
    requestChannelInvite(user2.token, channel.channelId, user3.authUserId);
    const details = requestChannelDetails(user2.token, channel.channelId);
    const allmems = details.allMembers.map((mem: any) => mem.uId);
    expect(allmems).toContain(2);
  });
  test('Inviting a global owner', () => {
    const user1 = requestAuthRegister('dimpi@ad.unsw.edu.au', 'dimpi123', 'dimpi', 'garnepudi');
    const user2 = requestAuthRegister('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const channel = requestChannelsCreate(user2.token, 'jayjaychannel', true);
    requestChannelInvite(user2.token, channel.channelId, user1.authUserId);
    const details = requestChannelDetails(user2.token, channel.channelId);
    const owners = details.ownerMembers.map((mem: any) => mem.uId);
    const allmems = details.allMembers.map((mem: any) => mem.uId);
    expect(owners).toEqual([user2.authUserId]);
    expect(allmems).toEqual([user2.authUserId, user1.authUserId]);
  });
  test('Invalid Token', () => {
    const user2 = requestAuthRegister('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = requestAuthRegister('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const channel = requestChannelsCreate(user2.token, 'jayjaychannel', false);
    const invite = requestChannelInvite('DHAJSHDKHAKD', channel.channelId, user3.authUserId);
    expect(invite).toStrictEqual({ error: 'token is invalid' });
  });
  test('Inviting to an Invalid Channel', () => {
    const user2 = requestAuthRegister('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = requestAuthRegister('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const invite = requestChannelInvite(user2.token, -1, user3.authUserId);
    expect(invite).toStrictEqual({ error: 'channelId is not valid' });
  });
  test('authUserId is not in the channel', () => {
    const user1 = requestAuthRegister('dimpi@ad.unsw.edu.au', 'dimpi123', 'dimpi', 'garnepudi');
    const user2 = requestAuthRegister('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = requestAuthRegister('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const channel = requestChannelsCreate(user2.token, 'jayjaychannel', false);
    requestChannelsCreate(user3.token, 'channel3', true);
    const invite = requestChannelInvite(user3.token, channel.channelId, user1.authUserId);
    expect(invite).toStrictEqual({ error: 'authUserId is not in the channel' });
  });
  test('user is already in channel', () => {
    const user2 = requestAuthRegister('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = requestAuthRegister('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const channel = requestChannelsCreate(user2.token, 'jayjaychannel', false);
    requestChannelInvite(user2.token, channel.channelId, user3.authUserId);
    const invite1 = requestChannelInvite(user2.token, channel.channelId, user3.authUserId);
    expect(invite1).toStrictEqual({ error: 'uId is already in channel' });
  });
});
