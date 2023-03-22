import { clearV1 } from '../other';
import { authRegisterV2, authLoginV2 } from '../auth';

describe('Test for a clear dataObject', () => {
  test('Registering users in a clear dataObject', () => {
    const user1 = authRegisterV2('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const user2 = authRegisterV2('bob.langford@gmail.com', '123456', 'Bob', 'Langford');
    clearV1();
    const user3 = authRegisterV2('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const user4 = authRegisterV2('bob.langford@gmail.com', '123456', 'Bob', 'Langford');
    expect(user3).toHaveProperty('authUserId');
    expect(user4).toHaveProperty('authUserId');
  });
  test('User deleted after clear', () => {
    const user1 = authRegisterV2('alice.smith@gmail.com', 'password', 'Alice', 'Smith');
    const user2 = authRegisterV2('bob.langford@gmail.com', '123456', 'Bob', 'Langford');
    clearV1();
    const user1Id = authLoginV1('alice.smith@gmail.com', 'password');
    const user2Id = authLoginV1('bob.langford@gmail.com', '123456');
    expect(user1Id.authUserId).toEqual(undefined);
    expect(user2Id.authUserId).toEqual(undefined);
  })
});