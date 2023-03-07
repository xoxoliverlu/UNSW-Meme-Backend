import { authRegisterV1 } from '../auth.js';
import { channelDetailsV1, channelJoinV1 } from '../channel.js'
import { channelsCreateV1 } from '../channels.js';
import { clearV1 } from '../other.js';

beforeEach(() => {
  clearV1();
});

describe('Failed Tests.', () => {
  test('Invalid channelId.', () => {
    const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const auth1 = register1.authUserId;
    const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const auth2 = register2.authUserId;
    const newChannel = channelsCreateV1(auth1, 'Channel1', true);
    const channelId = newChannel.channelId + 1;
    const channelJoin = channelJoinV1(auth2, channelId);
    expect(channelJoin).toEqual({error: 'error'});
  });
  test('User is already a member.', () => {
    const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.authUserId;
    const newChannel = channelsCreateV1(authId, 'Channel1', true);
    const channelId = newChannel.channelId;
    const channelJoin = channelJoinV1(authId, channelId);
    expect(channelJoin).toEqual({error: 'error'});
  });
  test('Channel is private.', () => {
    const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const auth1 = register1.authUserId;
    const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const auth2 = register2.authUserId;
    const newChannel = channelsCreateV1(auth1, 'Channel1', false);
    const channelId = newChannel.channelId;
    const channelJoin = channelJoinV1(auth2, channelId);
    expect(channelJoin).toEqual({error: 'error'});
  });
  test('User to join has invalid id.', () => {
    const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const auth1 = register1.authUserId;
    const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const auth2 = register2.authUserId;
    const newChannel = channelsCreateV1(auth1, 'Channel1', true);
    const channelId = newChannel.channelId;
    const channelJoin = channelJoinV1(auth2 + 10, channelId);
    expect(channelJoin).toEqual({error: 'error'});
  });
});

test('Successful channelJoinV1 test.', () => {
  const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const auth1 = register1.authUserId;
  const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
  const auth2 = register2.authUserId;
  const newChannel = channelsCreateV1(auth1, 'Channel1', true);
  const channelId = newChannel.channelId;
  const channelJoin = channelJoinV1(auth2, channelId);
  const channelDetails = channelDetailsV1(auth1, channelId);
  expect(channelDetails).toEqual({
    allMembers: [
      auth1,
      auth2,
    ],
    isPublic: true,
    name: 'Channel1',
    ownerMembers: [
      auth1,
    ],
  });
  expect(channelJoin).toEqual({});
});