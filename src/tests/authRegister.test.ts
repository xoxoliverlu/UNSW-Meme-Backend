import { authRegisterV1 } from '../auth';
import { clearV1 } from '../other';

beforeEach(() => {
  clearV1();
});

describe ('Testing Valid Registration', () => {
  test('Valid Return Type (object)', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    expect(register1).toHaveProperty('authUserId');
  });
  test('Valid return of integer', () => {
    const user = authRegisterV1('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    expect(user.authUserId).toStrictEqual(expect.any(Number));
  });
  test('A unique user ID', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const register2 = authRegisterV1('bob.langford@gmail.com', 'password', 'Bob', 'Langford');
    expect(register2.authUserId).not.toEqual(register1.authUserId);
  });
  test('Same name', () => {
    const register1 = authRegisterV1('alice.langford@gmail.com', '123456', 'Alice', 'Smith');
    const register2 = authRegisterV1('bob.smith@gmail.com', 'password', 'Alice', 'Smith');
    expect(register2.authUserId).not.toEqual(register1.authUserId);
  });
});

describe('Invalid inputs', () => {
  test('Invalid email', () => {
    const register1 = authRegisterV1('alice.smithgmail.com', 'password', 'Alice', 'Smith');
    expect(register1).toEqual({error: expect.any(String)});
  });
  test('Already in use email', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const register2 = authRegisterV1('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const register3 = authRegisterV1('alice.smith@gmail.com', '123456', 'Bob', 'Langford');
    const register4 = authRegisterV1('Alice.Smith@gmail.com', '123456', 'Alice', 'Smith');
    expect(register2).toEqual({error: expect.any(String)});
    expect(register3).toEqual({error: expect.any(String)});
    expect(register4).toEqual({error: expect.any(String)});
  });
  test('Password less than 6 characters', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', 'Pass', 'Alice', 'Smith');
    const register2 = authRegisterV1('bob.langford@gmail.com', '12$>p', 'Bob', 'Langford');
    const register3 = authRegisterV1('john.paul@gmail.com', '        ', 'John', 'Paul');
    expect(register1).toEqual({error: expect.any(String)});
    expect(register2).toEqual({error: expect.any(String)});
    expect(register3).toEqual({error: expect.any(String)});
  });
  test('nameFirst is empty or > 50 characters', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', 'password', ' ', 'Smith');
    const register2 = authRegisterV1('bob.langford@gmail.com', '123456', 'ABCDEFGhijklmnopqrstuvwxyzABCDEFGhijklmnopqrstuvwxyzABCDEFGhijklmnopqrstuvwxyz', 'Langford');
    expect(register1).toEqual({error: expect.any(String)});
    expect(register2).toEqual({error: expect.any(String)});
  });
  test('nameLast is empty or > 50 characters', () => {
    const register1 = authRegisterV1('alice.smith@gmail.com', 'password', 'Alice', ' ');
    const register2 = authRegisterV1('bob.langford@gmail.com', '123456', 'Bob', 'ABCDEFGhijklmnopqrstuvwxyzABCDEFGhijklmnopqrstuvwxyzABCDEFGhijklmnopqrstuvwxyz');
    expect(register1).toEqual({error: expect.any(String)});
    expect(register2).toEqual({error: expect.any(String)});
  });
});