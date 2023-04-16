import { requestAuthLogin, requestAuthRegister, requestClear } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Auth Login Valid inputs', () => {
  test('Valid return type (object) with valid userId', () => {
    const register1 = requestAuthRegister('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const login1 = requestAuthLogin('alice.smith@gmail.com', '123456');
    expect(login1).toStrictEqual({
      token: expect.any(String),
      authUserId: register1.authUserId,
    });
    expect(register1.authUserId).toEqual(login1.authUserId);
  });
  test('Same user can create unique sessions', () => {
    const registered = requestAuthRegister('valid@gmail.com', 'password', 'Harry', 'Potter');
    const login1 = requestAuthLogin('valid@gmail.com', 'password');
    const login2 = requestAuthLogin('valid@gmail.com', 'password');
    expect(login1).toStrictEqual({
      token: expect.any(String),
      authUserId: registered.authUserId
    });
    expect(login2).toStrictEqual({
      token: expect.any(String),
      authUserId: registered.authUserId
    });
    expect(login1.token).not.toEqual(login2.token);
    expect(login1.authUserId).toEqual(login2.authUserId);
  });
});

describe('Invalid inputs', () => {
  test('Email does not belong to a user', () => {
    requestAuthRegister('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const login1 = requestAuthLogin('bob.langford@gmail.com', '123456')
    expect(login1).toStrictEqual(400);
  });
  test('Incorrect password', () => {
    requestAuthRegister('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const login1 = requestAuthLogin('alice.smith@gmail.com', 'password');
    expect(login1).toStrictEqual(400);
  });
});
