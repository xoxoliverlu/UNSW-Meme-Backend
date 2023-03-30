import { requestAuthRegister, requestUserProfile, requestClear } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Failed tests.', () => {
  test('Invalid userId.', () => {
    const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const authToken = registerAuth.token;
    const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const userId = registerUser.authUserId;
    const userProfile = requestUserProfile(authToken, userId + 10);
    expect(userProfile).toStrictEqual({ error: expect.any(String) });
  });
  test('Invalid token.', () => {
    requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const userId = registerUser.authUserId;
    const userProfile = requestUserProfile('badtoken', userId);
    expect(userProfile).toStrictEqual({ error: expect.any(String) });
  });
});

test('Successful UserProfileV2 Test. ', () => {
  const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const authToken = registerAuth.token;
  const registerUser = requestAuthRegister('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
  const userId = registerUser.authUserId;
  const userProfile = requestUserProfile(authToken, userId);
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
  const registerAuth = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const authId = registerAuth.authUserId;
  const authToken = registerAuth.token;
  const registerUser = requestAuthRegister('SadekF@gmail.com', 'password', 'Fady', 'Sadek');
  const userId = registerUser.authUserId;
  const userProfileUser = requestUserProfile(authToken, userId);
  const userProfileAuth = requestUserProfile(authToken, authId);
  expect(userProfileAuth.user.handleStr).not.toEqual(userProfileUser.user.handleStr);
});
