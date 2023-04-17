import { requestAuthRegister, requestChannelsCreate, requestClear, requestChannelDetails } from '../requests';

require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Invalid input tests.', () => {
  test('Invalid channelId.', () => {
    const register = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.token;
    const newChannel = requestChannelsCreate(authId, 'Channel1', false);
    const channelId = newChannel.channelId;
    const res = requestChannelDetails(authId, channelId + 1);
    expect(res).toEqual(400);
  });
  test('Invalid Token.', () => {
    const register = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.token;
    const newChannel = requestChannelsCreate(authId, 'Channel1', false);
    const channelId = newChannel.channelId;
    const res = requestChannelDetails(authId + 1, channelId);
    expect(res).toEqual(403);
  });
  test('Unauthorised authUserId.', () => {
    const registerValid = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authValid = registerValid.token;
    const registerInvalid = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const authInvalid = registerInvalid.token;
    const newChannel = requestChannelsCreate(authValid, 'Channel1', false);
    const channelId = newChannel.channelId;
    const res = requestChannelDetails(authInvalid, channelId);
    expect(res).toEqual(403);
  });
});

test('Succesful ChannelDetailsV2 test.', () => {
  const register = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const authId = register.token;
  const newChannel = requestChannelsCreate(authId, 'Channel1', false);
  const channelId = newChannel.channelId;
  const channelDetails = requestChannelDetails(authId, channelId);
  expect(channelDetails).toEqual({
    allMembers: [
      {
        uId: register.authUserId,
        email: 'fadys@gmail.com',
        handleStr: 'fadysadek',
        nameFirst: 'Fady',
        nameLast: 'Sadek',
      },
    ],
    isPublic: false,
    name: 'Channel1',
    ownerMembers: [
      {
        uId: register.authUserId,
        email: 'fadys@gmail.com',
        handleStr: 'fadysadek',
        nameFirst: 'Fady',
        nameLast: 'Sadek',
      },
    ],
  });
});
