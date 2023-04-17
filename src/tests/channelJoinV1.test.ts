import { requestAuthRegister, requestChannelsCreate, requestClear, requestChannelDetails, requestChannelJoin } from '../requests';

require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Failed Tests.', () => {
  test('Invalid channelId.', () => {
    const register1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const register2 = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const newChannel = requestChannelsCreate(register1.token, 'Channel1', true);
    const res = requestChannelJoin(register2.token, newChannel.channelId + 1);
    expect(res).toEqual(400);
  });
  test('User is already a member.', () => {
    const register = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const newChannel = requestChannelsCreate(register.token, 'Channel1', true);
    const res = requestChannelJoin(register.token, newChannel.channelId);
    expect(res).toEqual(400);
  });
  test('Channel is private and user is not a global member', () => {
    const register1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const register2 = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const newChannel = requestChannelsCreate(register1.token, 'Channel1', false);
    const res = requestChannelJoin(register2.token, newChannel.channelId);
    expect(res).toEqual(403);
  });
  test('User to join has invalid id.', () => {
    const register1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const register2 = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const newChannel = requestChannelsCreate(register1.token, 'Channel1', true);
    const res = requestChannelJoin(register2.token + 10, newChannel.channelId);
    expect(res).toEqual(403);
  });
});

test('Successful requestChannelJoin test.', () => {
  const register1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const register2 = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
  const newChannel = requestChannelsCreate(register1.token, 'Channel1', true);
  const channelJoin = requestChannelJoin(register2.token, newChannel.channelId);
  expect(channelJoin).toEqual({});
  const channelDetails = requestChannelDetails(register1.token, newChannel.channelId);
  expect(channelDetails).toEqual({
    allMembers: [
      {
        uId: register1.authUserId,
        nameFirst: 'Fady',
        nameLast: 'Sadek',
        email: 'fadys@gmail.com',
        handleStr: 'fadysadek',
      },
      {
        uId: register2.authUserId,
        nameFirst: 'Akanksha',
        nameLast: 'Sood',
        email: 'akankshas@gmail.com',
        handleStr: 'akankshasood',
      },
    ],
    isPublic: true,
    name: 'Channel1',
    ownerMembers: [
      {
        uId: register1.authUserId,
        nameFirst: 'Fady',
        nameLast: 'Sadek',
        email: 'fadys@gmail.com',
        handleStr: 'fadysadek',
      },
    ],
  });
});

test('Successful requestChannelJoin test where user is a global member', () => {
  const register1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const register2 = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
  const newChannel = requestChannelsCreate(register2.token, 'Channel1', false);
  const channelJoin = requestChannelJoin(register1.token, newChannel.channelId);
  expect(channelJoin).toEqual({});
  const channelDetails = requestChannelDetails(register1.token, newChannel.channelId);
  expect(channelDetails).toEqual({
    allMembers: [
      {
        uId: register2.authUserId,
        nameFirst: 'Akanksha',
        nameLast: 'Sood',
        email: 'akankshas@gmail.com',
        handleStr: 'akankshasood',
      },
      {
        uId: register1.authUserId,
        nameFirst: 'Fady',
        nameLast: 'Sadek',
        email: 'fadys@gmail.com',
        handleStr: 'fadysadek',
      }
    ],
    isPublic: false,
    name: 'Channel1',
    ownerMembers: [
      {
        uId: register2.authUserId,
        nameFirst: 'Akanksha',
        nameLast: 'Sood',
        email: 'akankshas@gmail.com',
        handleStr: 'akankshasood',
      },
    ],
  });
});
