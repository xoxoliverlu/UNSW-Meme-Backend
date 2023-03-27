import { channelInviteV1 } from '../channel'
import { channelsCreateV2 } from "../channels"
import { authRegisterV2 } from "../auth"
import { channelDetailsV2 } from '../channel'
import { clearV1 } from "../other"

beforeEach(clearV1);
afterAll(clearV1);

describe('Testing channelInvite for it-2', () => {
  test('Inviting to a Public channel', () => {
    authRegisterV2('dimpi@ad.unsw.edu.au', 'dimpi123', 'dimpi', 'garnepudi');
    const user2 = authRegisterV2('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = authRegisterV2('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const channel = channelsCreateV2(user2.token, 'jayjaychannel', true);
    channelInviteV1(user2.token, channel.channelId, user3.authUserId);
    const details = channelDetailsV2(user2.token, channel.channelId);
    const allmems = details.allMembers.map(mem => mem.uId);
    expect(allmems).toContain(2);
  });
  test('Inviting a global owner', () => {
    const user1 = authRegisterV2('dimpi@ad.unsw.edu.au', 'dimpi123', 'dimpi', 'garnepudi');
    const user2 = authRegisterV2('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const channel = channelsCreateV2(user2.token, 'jayjaychannel', true);
    channelInviteV1(user2.token, channel.channelId, user1.authUserId);
    const details = channelDetailsV2(user2.token, channel.channelId);
    const owners = details.ownerMembers.map(mem => mem.uId);
    const allmems = details.allMembers.map(mem  => mem.uId);
    expect(owners).toEqual([user2.authUserId]);
    expect(allmems).toEqual([user2.authUserId, user1.authUserId]);
  });
  test('Invalid Token', () => {
    const user2 = authRegisterV2('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = authRegisterV2('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const channel = channelsCreateV2(user2.token, 'jayjaychannel', false);
    const invite = channelInviteV1('DHAJSHDKHAKD', channel.channelId, user3.authUserId);
    expect(invite).toStrictEqual({ error: 'token is invalid' });
  });
  test('Inviting to an Invalid Channel', () => {
    const user2 = authRegisterV2('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = authRegisterV2('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const invite = channelInviteV1(user2.token, -1, user3.authUserId);
    expect(invite).toStrictEqual({ error: 'channelId is not valid' });
  });
  test('authUserId is not in the channel', () => {
    const user1 = authRegisterV2('dimpi@ad.unsw.edu.au', 'dimpi123', 'dimpi', 'garnepudi');
    const user2 = authRegisterV2('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = authRegisterV2('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const channel = channelsCreateV2(user2.token, 'jayjaychannel', false);
    channelsCreateV2(user3.token, 'channel3', true);
    const invite = channelInviteV1(user3.token, channel.channelId, user1.authUserId);
    expect(invite).toStrictEqual({ error: 'authUserId is not in the channel' });
  });
  test('user is already in channel', () => {
    const user2 = authRegisterV2('jay@ad.unsw.edu.au', 'jayjay123', 'jay', 'jay');
    const user3 = authRegisterV2('madhushrestha@gmail.com', 'madhu123', 'madhu', 'shrestha');
    const channel = channelsCreateV2(user2.token, 'jayjaychannel', false);
    channelInviteV1(user2.token, channel.channelId, user3.authUserId);
    const invite1 = channelInviteV1(user2.token, channel.channelId, user3.authUserId);
    expect(invite1).toStrictEqual({ error: 'uId is already in channel' });
  });
});

