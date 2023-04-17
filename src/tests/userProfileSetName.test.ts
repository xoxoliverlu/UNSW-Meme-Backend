import { requestAuthRegister, requestClear, requestUserProfileSetName, requestUserProfile } from '../requests';

require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Invalid requestUserProfileSetName tests.', () => {
  test('Invalid token.', () => {
    const user = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName = requestUserProfileSetName(user.token + 1, 'Alan', 'Paul');
    expect(userSetName).toEqual(403);
  });
  test('Invalid nameFirst length', () => {
    const user1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName1 = requestUserProfileSetName(user1.token, '  ', 'Paul');
    const user2 = requestAuthRegister('sadekF@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName2 = requestUserProfileSetName(user2.token, 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwer', 'Paul');
    expect(userSetName1).toEqual(400);
    expect(userSetName2).toEqual(400);
  });
  test('Invalid nameLast length', () => {
    const user1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName1 = requestUserProfileSetName(user1.token, 'Alan', '  ');
    const user2 = requestAuthRegister('sadekF@gmail.com', 'password', 'Fady', 'Sadek');
    const userSetName2 = requestUserProfileSetName(user2.token, 'Alan', 'qwertyuiopasdfghjklzxcvbnmqwertyuiopasdfghjklzxcvbnmqwer');
    expect(userSetName1).toEqual(400);
    expect(userSetName2).toEqual(400);
  });
});

test('Successful userProfileSetNameV1 Test.', () => {
  const user = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  requestUserProfileSetName(user.token, 'Alan', 'Paul');
  const userProfile = requestUserProfile(user.token, user.authUserId);
  expect(userProfile.user.nameFirst).toEqual('Alan');
  expect(userProfile.user.nameLast).toEqual('Paul');
});
