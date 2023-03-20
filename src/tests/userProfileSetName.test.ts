import { authRegisterV1 } from "../auth.js";
import { clearV1 } from "../other.js";
import { userProfileSetNameV1 } from "../users.js";

beforeEach(() => {
  clearV1();
});
  
describe('Invalid userProfileSetNameV1 tests.', () => {
  test('Invalid nameFirst length', () => {
    const user1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName1 = userProfileSetNameV1('token', ' ', 'Paul');
    const user2 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName2 = userProfileSetNameV1('token', 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcv', 'Paul');
    expect(userSetName1).toEqual({error: expect.any(String)});
    expect(userSetName2).toEqual({error: expect.any(String)});
  });
  test('Invalid nameLast length', () => {
    const user1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName1 = userProfileSetNameV1('token', 'Alan', ' ');
    const user2 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName2 = userProfileSetNameV1('token', 'Alan', 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcv');
    expect(userSetName1).toEqual({error: expect.any(String)});
    expect(userSetName2).toEqual({error: expect.any(String)});
  });
});

test('Successful userProfileSetNameV1 Test.', () => {
  const user = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const userSetName = userProfileSetNameV1('token', 'Alan', 'Paul');
  expect(user.nameFirst).toEqual('Alan');
  expect(user.nameLast).toEqual('Paul');
});