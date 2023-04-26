import {
  requestAuthRegister,
  requestAdminUserPermissionChange,
  requestChannelsCreate,
  requestChannelJoin,
  requestClear
} from '../requests';

require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Failed tests.', () => {
  test('Invalid token.', () => {
    const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const permChange = requestAdminUserPermissionChange(registerAuth.token + 10, registerUser.authUserId, 1);
    expect(permChange).toEqual(403);
  });
  test('Invalid uId.', () => {
    const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const permChange = requestAdminUserPermissionChange(registerAuth.token, registerUser.authUserId + 10, 1);
    expect(permChange).toEqual(400);
  });
  test('Invalid permissionId.', () => {
    const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const permChange = requestAdminUserPermissionChange(registerAuth.token, registerUser.authUserId, 0);
    expect(permChange).toEqual(400);
  });
  test('Demoting last global owner to a user.', () => {
    const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const permChange = requestAdminUserPermissionChange(registerAuth.token, registerAuth.authUserId, 2);
    expect(permChange).toEqual(400);
  });
  test('User already has the permissions level of permissionId.', () => {
    const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const permChange = requestAdminUserPermissionChange(registerAuth.token, registerUser.authUserId, 2);
    expect(permChange).toEqual(400);
  });
  test('Authorised user is not a global owner.', () => {
    const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const permChange = requestAdminUserPermissionChange(registerUser.token, registerAuth.authUserId, 2);
    expect(permChange).toEqual(403);
  });
});

test('Successful permission change.', () => {
  const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
  const permChange = requestAdminUserPermissionChange(registerAuth.token, registerUser.authUserId, 1);
  expect(permChange).toEqual({});
  const channel = requestChannelsCreate(registerAuth.token, 'channel', false);
  const channelJoin = requestChannelJoin(registerUser.token, channel.channelId);
  expect(channelJoin).toEqual({});
});
