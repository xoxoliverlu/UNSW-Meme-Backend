import { channelRemoveOwnerV1 } from '../channel';
import { requestAuthRegister, requestAuthLogin, requestChannelsCreate, requestChannelInvite, requestChannelAddOwner, requestChannelRemoveOwner, requestChannelDetails, requestClear } from '../requests';
require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

test('success removeOwner', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');

  const { token: token1, authUserId: authUserId1 } = loginRes;
  const { token: token2, authUserId: authUserId2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);
  const { channelId } = channelCreateRes;

  requestChannelInvite(token1, channelId, authUserId2);

  requestChannelAddOwner(token1, channelId, authUserId2);

  let channelDeatilsRes = requestChannelDetails(token2, channelId);

  let { ownerMembers } = channelDeatilsRes;
  expect(ownerMembers.length).toStrictEqual(2);
  requestChannelRemoveOwner(token2, channelId, authUserId1);

  channelDeatilsRes = requestChannelDetails(token1, channelId);
  ownerMembers = channelDeatilsRes.ownerMembers;
  expect(ownerMembers.length).toStrictEqual(1);
});

test('error token', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');
  const { token: token1, authUserId: authUserId1 } = loginRes;
  let { authUserId: authUserId2, token: token2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  requestChannelAddOwner(token1, channelId, authUserId2);

  token2 += 'error';
  const res = requestChannelRemoveOwner(token2, channelId, authUserId1);

 
  expect(res).toEqual(403);
});

test('error userID', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');
  const { authUserId: authUserId1, token: token1 } = loginRes;
  const { authUserId: authUserId2, token: token2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  requestChannelInvite(token1, channelId, authUserId2);

  requestChannelAddOwner(token1, channelId, authUserId2);
  const res = requestChannelRemoveOwner(
    token2,
    channelId,
    authUserId1 + authUserId2
  );

  expect(res).toEqual(400);
});

test('error invalid channelID', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');
  const { token: token1, authUserId: authUserId1 } = loginRes;
  const { authUserId: authUserId2, token: token2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  requestChannelInvite(token1, channelId, authUserId2);

  requestChannelAddOwner(token1, channelId, authUserId2);
  const res = requestChannelRemoveOwner(
    token2,
    channelId + 1,
    authUserId1
  );
  
  expect(res).toEqual(400);
});

test('error user not a part of channel ', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');
  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;

  const res = requestChannelRemoveOwner(token1, channelId, authUserId2);

 
  expect(res).toEqual(400);
});

test('error uId is not an owner ', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');
  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');

  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;
  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);

  const res = requestChannelRemoveOwner(token1, channelId, authUserId2);
  
  expect(res).toEqual(400);
});

test("error user doesn't have owner permission ", () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluuu@gmail.com', 'cl3cl3vul444', 'Oliver', 'Lu');
  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');
  const loginRes3 = requestAuthLogin('olivrewluuu@gmail.com', 'cl3cl3vul444');

  const { token: token1, authUserId: authUserId1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;
  const { token: token3, authUserId: authUserId3 } = loginRes3;
  const { channelId } = requestChannelsCreate(token1, 'sampleChannel', true);

  requestChannelInvite(token1, channelId, authUserId2);
  requestChannelInvite(token1, channelId, authUserId3);

  requestChannelAddOwner(token1, channelId, authUserId2);
  const res = requestChannelRemoveOwner(token3, channelId, authUserId1);
 
  expect(res).toEqual(403);
});

test('error uId is the only owner ', () => {
  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('olivrewluu@gmail.com', 'cl3cl3vul44');

  const { token: token1, authUserId: authUserId1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const channelCreateRes = requestChannelsCreate(token1, 'sampleChannel', true);

  const { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);

  const res = channelRemoveOwnerV1(token1, channelId, authUserId1);

  expect(res).toEqual(400);
});
