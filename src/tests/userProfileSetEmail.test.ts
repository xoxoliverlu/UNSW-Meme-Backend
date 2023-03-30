import { requestAuthRegister, requestClear, requestUserProfileSetEmail, requestUserProfile } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Invalid requestUserProfileSetEmail tests.', () => {
  test('Invalid token.', () => {
    const user = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetEmail = requestUserProfileSetEmail(user.token + 1, 'fady.s04@gmail.com');
    expect(userSetEmail).toEqual({ error: expect.any(String) });
  });
  test('Invalid email', () => {
    const user = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetEmail = requestUserProfileSetEmail(user.token, 'invalid.email');
    expect(userSetEmail).toEqual({ error: expect.any(String) });
  });
  test('email already in use.', () => {
    const user1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const user2 = requestAuthRegister('fady.s04@gmail.com', '123456', 'Fady', 'Sadek');
    const userSetEmail = requestUserProfileSetEmail(user1.token, 'fady.s04@gmail.com');
    expect(userSetEmail).toEqual({ error: expect.any(String) });
  });
});

test('Successful requestUserProfileSetEmail Test.', () => {
  const user = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const userSetEmail = requestUserProfileSetEmail(user.token, 'fady.s04@gmail.com');
  const userProfile = requestUserProfile(user.token, user.authUserId);
  expect(userSetEmail).toEqual({});
  expect(userProfile.user.email).toEqual('fady.s04@gmail.com');
});

test('Setting to the same email', () => {
  const user = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const userSetEmail = requestUserProfileSetEmail(user.token, 'fadyS@gmail.com');
  expect(userSetEmail).toEqual({});
});
