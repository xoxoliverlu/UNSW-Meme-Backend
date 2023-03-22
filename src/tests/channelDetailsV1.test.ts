import { authRegisterV2 } from '../auth';
import { channelDetailsV1 } from '../channel'
import { channelsCreateV2 } from '../channels';
import { clearV1 } from '../other';

beforeEach(() => {
  clearV1();
});

describe('Invalid input tests.', () => {
  test('Invalid channelId.', () => {
    const register = authRegisterV2('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.authUserId;
    const newChannel = channelsCreateV2(register.token, 'Channel1', false);
    const channelId = newChannel.channelId + 1;
    const channelDetails = channelDetailsV1(authId, channelId);
    expect(channelDetails).toEqual({error: expect.any(String)});
  });
  test('Invalid authUserId.', () => {
    const register = authRegisterV2('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.authUserId;
    const newChannel = channelsCreateV2(register.token, 'Channel1', false);
    const channelId = newChannel.channelId;
    const channelDetails = channelDetailsV1(authId + 1, channelId);
    expect(channelDetails).toEqual({error: expect.any(String)});
  });
  test('Unauthorised authUserId.', () => {
    const registerValid = authRegisterV2('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authValid = registerValid.authUserId;
    const registerInvalid = authRegisterV2('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const authInvalid = registerInvalid.authUserId;
    const newChannel = channelsCreateV2(registerValid.token, 'Channel1', false);
    const channelId = newChannel.channelId;
    const channelDetails = channelDetailsV1(authInvalid, channelId);
    expect(channelDetails).toEqual({error: expect.any(String)});
  });
});

test('Succesful ChannelDetailsV1 test.', () => {
  const register = authRegisterV2('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const authId = register.authUserId;
  const newChannel = channelsCreateV2(register.token, 'Channel1', false);
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