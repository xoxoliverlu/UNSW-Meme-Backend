import { requestAuthRegister, requestClear } from '../requests';

beforeEach(() => {
  requestClear();
});

describe ('Testing Valid Registration', () => {
  test('Valid Return Type (object) with correct type values', () => {
    const register1 = requestAuthRegister('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    expect(register1).toStrictEqual({
      token: expect.any(String),
      authUserId: expect.any(Number),
    });
  });
  test('A unique user ID', () => {
    const register1 = requestAuthRegister('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const register2 = requestAuthRegister('bob.langford@gmail.com', 'password', 'Bob', 'Langford');
    expect(register2.authUserId).not.toEqual(register1.authUserId);
  });
  test('A unique token', () => {
    const register1 = requestAuthRegister('alice.smith@gmail.com', '123456', 'Alice', 'Smith');
    const register2 = requestAuthRegister('bob.langford@gmail.com', 'password', 'Bob', 'Langford');
    expect(register2.token).not.toEqual(register1.token);
  });
  test('Same name', () => {
    const register1 = requestAuthRegister('alice.langford@gmail.com', '123456', 'Alice', 'Smith');
    const register2 = requestAuthRegister('bob.smith@gmail.com', 'password', 'Alice', 'Smith');
    expect(register2.authUserId).not.toEqual(register1.authUserId);
  });
});

describe('Invalid inputs for /auth/register/v2', () => {
  test('Invalid email', () => {
    const register1 = requestAuthRegister('alice.smithgmail.com', 'password', 'Alice', 'Smith');
    expect(register1).toEqual({error: expect.any(String)});
  });

  test('Already in use email', () => {
    const register1 = requestAuthRegister('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const register2 = requestAuthRegister('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const register3 = requestAuthRegister('alice.smith@gmail.com', '123456', 'Bob', 'Langford');
    const register4 = requestAuthRegister('Alice.Smith@gmail.com', '123456', 'Alice', 'Smith');
    expect(register2).toEqual({error: expect.any(String)});
    expect(register3).toEqual({error: expect.any(String)});
    expect(register4).toEqual({error: expect.any(String)});
  });
  test('Password less than 6 characters', () => {
    const register1 = requestAuthRegister('alice.smith@gmail.com', 'Pass', 'Alice', 'Smith');
    const register2 = requestAuthRegister('bob.langford@gmail.com', '12$>p', 'Bob', 'Langford');
    const register3 = requestAuthRegister('john.paul@gmail.com', '        ', 'John', 'Paul');
    expect(register1).toEqual({error: expect.any(String)});
    expect(register2).toEqual({error: expect.any(String)});
    expect(register3).toEqual({error: expect.any(String)});
  });
  test('nameFirst is empty or > 50 characters', () => {
    const register1 = requestAuthRegister('alice.smith@gmail.com', 'password', ' ', 'Smith');
    const register2 = requestAuthRegister('bob.langford@gmail.com', '123456', 'ABCDEFGhijklmnopqrstuvwxyzABCDEFGhijklmnopqrstuvwxyzABCDEFGhijklmnopqrstuvwxyz', 'Langford');
    expect(register1).toEqual({error: expect.any(String)});
    expect(register2).toEqual({error: expect.any(String)});
  });
  test('nameLast is empty or > 50 characters', () => {
    const register1 = requestAuthRegister('alice.smith@gmail.com', 'password', 'Alice', ' ');
    const register2 = requestAuthRegister('bob.langford@gmail.com', '123456', 'Bob', 'ABCDEFGhijklmnopqrstuvwxyzABCDEFGhijklmnopqrstuvwxyzABCDEFGhijklmnopqrstuvwxyz');
    expect(register1).toEqual({error: expect.any(String)});
    expect(register2).toEqual({error: expect.any(String)});
  });
});