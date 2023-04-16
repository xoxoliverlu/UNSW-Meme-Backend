import {
  requestAuthLogin,
  requestAuthRegister,
  requestChannelAddOwner,
  requestChannelDetails,
  requestChannelInvite,
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

test('success addOwner', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');
  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);
  const { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);
  const addOwnerRes = requestChannelAddOwner(token1, channelId, authUserId2);
  const { error } = addOwnerRes;

  if (error) {
    console.log(error);
  }

  const channelDetailsRes = requestChannelDetails(token1, channelId);
  const { ownerMembers } = channelDetailsRes;

  if (error) {
    console.log(authUserId2);
    console.log(channelDetailsRes);
  }

  expect(ownerMembers.length).toStrictEqual(2);
});

test('error token', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');
  let { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  requestChannelInvite(token1, channelId, authUserId2);

  token1 += 'error';
  const res = requestChannelAddOwner(
    token1,
    channelId,
    authUserId2
  );

  expect(res).toEqual(403);
});

test('error userID', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');
  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  requestChannelInvite(token1, channelId, authUserId2);

  const res = requestChannelAddOwner(
    token1,
    channelId,
    authUserId2 + 200
  );

  expect(res).toEqual(400);
});

test('error invalid channelID', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');
  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  requestChannelInvite(token1, channelId, authUserId2);

  const res = requestChannelAddOwner(
    token1,
    channelId + 1,
    authUserId2
  );

  expect(res).toEqual(400);
});

test('error user not a part of channel ', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');
  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  const res = requestChannelAddOwner(
    token1,
    channelId,
    authUserId2
  );

  expect(res).toEqual(400);
});

test('error uId is already an owner ', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const { token: token1, authuserId: authUserId1 } = loginRes;

  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  const res = requestChannelAddOwner(
    token1,
    channelId,
    authUserId1
  );
  
  expect(res).toEqual(400);
});

test("error user doesn't have owner permission ", () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluuu@gmail.com', 'cl3cl3vul444', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');
  const loginRes3 = requestAuthLogin('oliverwluuu@gmail.com', 'cl3cl3vul444');

  const { token: token1 } = loginRes;
  const { token: token2, authUserId: authUserId2 } = loginRes2;
  const { authUserId: authUserId3 } = loginRes3;
  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);
  requestChannelInvite(token1, channelId, authUserId3);

  const res = requestChannelAddOwner(
    token2,
    channelId,
    authUserId3
  );


  expect(res).toEqual(403);
});
