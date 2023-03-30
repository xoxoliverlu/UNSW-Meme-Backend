import { requestAuthRegister, requestAuthLogin, requestClear } from '../requests';

describe('Test for a clear dataObject', () => {
  test('Registering users in a clear dataObject', () => {
    const user1 = requestAuthRegister('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const user2 = requestAuthRegister('bob.langford@gmail.com', '123456', 'Bob', 'Langford');
    requestClear();
    const user3 = requestAuthRegister('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const user4 = requestAuthRegister('bob.langford@gmail.com', '123456', 'Bob', 'Langford');
    expect(user3).toHaveProperty('authUserId');
    expect(user4).toHaveProperty('authUserId');
  });
  test('User deleted after clear', () => {
    const user1 = requestAuthRegister('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const user2 = requestAuthRegister('bob.langford@gmail.com', '123456', 'Bob', 'Langford');
    requestClear();
    const user1Id = requestAuthLogin('alice.smith@gmail.com', 'password');
    const user2Id = requestAuthLogin('bob.langford@gmail.com', '123456');
    expect(user1Id.authUserId).toEqual(undefined);
    expect(user2Id.authUserId).toEqual(undefined);
  });
});
