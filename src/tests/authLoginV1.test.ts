import { authLoginV1, authRegisterV1 } from '../auth.js';
import { clearV1 } from '../other.js';

beforeEach(() => {
  clearV1();
});

describe('Valid inputs', () => {
  test('Valid return type (object)', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const login1 = authLoginV1('alice.smith@gmail.com', '123456');
    expect(login1).toHaveProperty('authUserId');
  });
  test('Valid return type (number)', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const login1 = authLoginV1('alice.smith@gmail.com', '123456');
    expect(login1.authUserId).toStrictEqual(expect.any(Number));
  });
  test('Valid userId', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const login1 = authLoginV1('alice.smith@gmail.com', '123456');
    expect(register1.authUserId).toEqual(login1.authUserId);
  });
});

describe('Invalid inputs', () => {
  test('Email does not belong to a user', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const login1 = authLoginV1('bob.langford@gmail.com', '123456');
    expect(login1).toEqual({error: expect.any(String)});
  });
  test('Incorrect password', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const login1 = authLoginV1('alice.smith@gmail.com', 'password');
      expect(login1).toEqual({error: expect.any(String)});
  });
});