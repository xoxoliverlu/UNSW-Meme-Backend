import { authRegisterV1 } from '../auth';
import { channelDetailsV1, channelJoinV1 } from '../channel.js'
import { channelsCreateV1 } from '../channels.js';
import { clearV1 } from '../other';

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
    expect(channelJoin).toEqual({error: expect.any(String)});
  });
  test('User is already a member.', () => {
    const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = register.authUserId;
    const newChannel = channelsCreateV1(authId, 'Channel1', true);
    const channelId = newChannel.channelId;
    const channelJoin = channelJoinV1(authId, channelId);
    expect(channelJoin).toEqual({error: expect.any(String)});
  });
  test('Channel is private and user is not a global member', () => {
    const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const auth1 = register1.authUserId;
    const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const auth2 = register2.authUserId;
    const newChannel = channelsCreateV1(auth1, 'Channel1', false);
    const channelId = newChannel.channelId;
    const channelJoin = channelJoinV1(auth2, channelId);
    expect(channelJoin).toEqual({error: expect.any(String)});
  });
  test('User to join has invalid id.', () => {
    const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const auth1 = register1.authUserId;
    const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const auth2 = register2.authUserId;
    const newChannel = channelsCreateV1(auth1, 'Channel1', true);
    const channelId = newChannel.channelId;
    const channelJoin = channelJoinV1(auth2 + 10, channelId);
    expect(channelJoin).toEqual({error: expect.any(String)});
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
      {
        uId: auth1,
        nameFirst: "Fady",
        nameLast: "Sadek",
        email: "fadys@gmail.com",
        handleStr: "fadysadek",
      },
      {
        uId: auth2,
        nameFirst: "Akanksha",
        nameLast: "Sood",
        email: "akankshas@gmail.com",
        handleStr: "akankshasood",
      },
    ],
    isPublic: true,
    name: 'Channel1',
    ownerMembers: [
      {
        uId: auth1,
        nameFirst: "Fady",
        nameLast: "Sadek",
        email: "fadys@gmail.com",
        handleStr: "fadysadek",
      },
    ],
  });
  expect(channelJoin).toEqual({});
});

test('Successful channelJoinV1 test where user is a global member', () => {
  const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const auth1 = register1.authUserId;
  const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
  const auth2 = register2.authUserId;
  const newChannel = channelsCreateV1(auth2, 'Channel1', false);
  const channelId = newChannel.channelId;
  const channelJoin = channelJoinV1(auth1, channelId);
  const channelDetails = channelDetailsV1(auth1, channelId);
  expect(channelDetails).toEqual({
    allMembers: [
      {
        uId: auth2,
        nameFirst: "Akanksha",
        nameLast: "Sood",
        email: "akankshas@gmail.com",
        handleStr: "akankshasood",
      },
      {
        uId: auth1,
        nameFirst: "Fady",
        nameLast: "Sadek",
        email: "fadys@gmail.com",
        handleStr: "fadysadek",
      }
    ],
    isPublic: false,
    name: 'Channel1',
    ownerMembers: [
      {
        uId: auth2,
        nameFirst: "Akanksha",
        nameLast: "Sood",
        email: "akankshas@gmail.com",
        handleStr: "akankshasood",
      },
    ],
  });
  expect(channelJoin).toEqual({});
});
test('Successful channelJoinV1 test where user is a global member', () => {
  const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const auth1 = register1.authUserId;
  const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
  const auth2 = register2.authUserId;
  const newChannel = channelsCreateV1(auth2, 'Channel1', false);
  const channelId = newChannel.channelId;
  const channelJoin = channelJoinV1(auth1, channelId);
  const channelDetails = channelDetailsV1(auth1, channelId);
  expect(channelDetails).toEqual({
    allMembers: [
      {
        uId: auth2,
        nameFirst: "Akanksha",
        nameLast: "Sood",
        email: "akankshas@gmail.com",
        handleStr: "akankshasood",
      },
      {
        uId: auth1,
        nameFirst: "Fady",
        nameLast: "Sadek",
        email: "fadys@gmail.com",
        handleStr: "fadysadek",
      }
    ],
    isPublic: false,
    name: 'Channel1',
    ownerMembers: [
      {
        uId: auth2,
        nameFirst: "Akanksha",
        nameLast: "Sood",
        email: "akankshas@gmail.com",
        handleStr: "akankshasood",
      },
    ],
  });
  expect(channelJoin).toEqual({});
});