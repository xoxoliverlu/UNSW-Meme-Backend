import {
  requestAuthLogin,
  requestAuthRegister,
  requestChannelDetails,
  requestChannelInvite,
  requestChannelLeave,
  requestChannelsCreate,
  requestClear,
} from '../requests';
require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

test('success channel leave', () => {
  requestAuthRegister('olivrewlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('olivrewluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes1 = requestAuthLogin('olivrewlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');

  const { token: token1 } = loginRes1;
  const { authUserId: authUserId2, token: token2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'testing', true);

  const { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);
  requestChannelLeave(token1, channelId);
  const channelDetailRes = requestChannelDetails(token2, channelId);
  const { allMembers } = channelDetailRes;
  expect(allMembers.length).toEqual(1);
});

test('error invalid channelId', () => {
  requestAuthRegister('olivrewlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('olivrewluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');
  const loginRes1 = requestAuthLogin('olivrewlu@gmail.com', 'cl3cl3vul4');
  requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');
  const { token: token1 } = loginRes1;

  const channelCreateRes = requestChannelsCreate(token1, 'testing', true);
  const { channelId } = channelCreateRes;

  const err = requestChannelLeave(token1, channelId + 1);

  expect(err).toEqual(400);
});

test('error authUser not a part of channel', () => {
  requestAuthRegister('olivrewlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('olivrewluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes1 = requestAuthLogin('olivrewlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');
  const { token: token1 } = loginRes1;
  const { token: token2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'testing', true);
  const { channelId } = channelCreateRes;

  const err = requestChannelLeave(token2, channelId);

  expect(err).toEqual(403);
});

test('error invalid token', () => {
  requestAuthRegister('olivrewlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('olivrewluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');
  const loginRes1 = requestAuthLogin('olivrewlu@gmail.com', 'cl3cl3vul4');
  requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');
  const { token: token1 } = loginRes1;
  const channelCreateRes = requestChannelsCreate(token1, 'testing', true);
  const { channelId } = channelCreateRes;

  const err = requestChannelLeave(token1 + 'error', channelId);

  expect(err).toEqual(403);
});
