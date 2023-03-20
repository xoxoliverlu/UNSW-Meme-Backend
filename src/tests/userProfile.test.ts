import { authRegisterV1 } from '../auth.js';
import { clearV1 } from '../other.js';
import { userProfileV2 } from '../users.js';

beforeEach(() => {
  clearV1(); 
});

describe('Failed tests.', () => {
  test('Invalid userId', () => {
    const registerAuth = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = registerAuth.authUserId;
    const registerUser = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const userId = registerUser.authUserId;
    const userProfile = userProfileV2('token', authId, userId + 10);
    expect(userProfile).toStrictEqual({error: expect.any(String)});
  });
  test('Invalid authId', () => {
    const registerAuth = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authId = registerAuth.authUserId;
    const registerUser = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const userId = registerUser.authUserId;
    const userProfile = userProfileV2('token', authId + 10, userId);
    expect(userProfile).toStrictEqual({error: expect.any(String)});
  });
});

test('Successful userProfileV2 Test. ', () => {
  const registerAuth = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const authId = registerAuth.authUserId;
  const registerUser = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
  const userId = registerUser.authUserId;
  const userProfile = userProfileV2('token', authId, userId);
  expect(userProfile).toStrictEqual({
    user: {
      uId: userId,
      nameFirst: 'Akanksha',
      nameLast: 'Sood',
      email: 'akankshas@gmail.com',
      handleStr: 'akankshasood',
    }
  });
});

test('Testing unique handleStr.', () => {
  const registerAuth = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const authId = registerAuth.authUserId;
  const registerUser = authRegisterV1('SadekF@gmail.com', 'password', 'Fady', 'Sadek');
  const userId = registerUser.authUserId;
  const userProfileUser = userProfileV2('token', authId, userId);
  const userProfileAuth = userProfileV2('token', authId, authId);
  expect(userProfileAuth.user.handleStr).not.toEqual(userProfileUser.user.handleStr);
});