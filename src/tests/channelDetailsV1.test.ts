import { authRegisterV1 } from '../auth';
import { channelDetailsV1 } from '../channel'
import { channelsCreateV1 } from '../channels';
import { clearV1 } from '../other';

beforeEach(() => {
  clearV1();
});

describe('Invalid input tests.', () => {
  test('Invalid channelId.', () => {
    const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.authUserId;
    const newChannel = channelsCreateV1(authId, 'Channel1', false);
    const channelId = newChannel.channelId + 1;
    const channelDetails = channelDetailsV1(authId, channelId);
    expect(channelDetails).toEqual({error: expect.any(String)});
  });
  test('Invalid authUserId.', () => {
    const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.authUserId;
    const newChannel = channelsCreateV1(authId, 'Channel1', false);
    const channelId = newChannel.channelId;
    const channelDetails = channelDetailsV1(authId + 1, channelId);
    expect(channelDetails).toEqual({error: expect.any(String)});
  });
  test('Unauthorised authUserId.', () => {
    const registerValid = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authValid = registerValid.authUserId;
    const registerInvalid = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const authInvalid = registerInvalid.authUserId;
    const newChannel = channelsCreateV1(authValid, 'Channel1', false);
    const channelId = newChannel.channelId;
    const channelDetails = channelDetailsV1(authInvalid, channelId);
    expect(channelDetails).toEqual({error: expect.any(String)});
  });
});

test('Succesful ChannelDetailsV1 test.', () => {
  const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const authId = register.authUserId;
  const newChannel = channelsCreateV1(authId, 'Channel1', false);
  const channelId = newChannel.channelId;
  const channelDetails = channelDetailsV1(authId, channelId);
  expect(channelDetails).toEqual({
    allMembers: [
      {
        uId: authId,
        email:"fadys@gmail.com",
        handleStr: 'fadysadek',
        nameFirst: "Fady",
        nameLast: "Sadek",
      },
    ],
    isPublic: false,
    name: 'Channel1',
    ownerMembers: [
      {
        uId: authId,
        email:"fadys@gmail.com",
        handleStr: 'fadysadek',
        nameFirst: "Fady",
        nameLast: "Sadek",
      },
    ],
  });
});