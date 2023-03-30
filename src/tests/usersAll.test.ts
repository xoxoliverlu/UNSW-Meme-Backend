import { requestAuthRegister, requestUsersAll, requestClear } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

test('Invalid token.', () => {
  const user1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const usersAll = requestUsersAll(user1.token + 1);
  expect(usersAll).toEqual({ error: expect.any(String) });
});

test('Successful UsersAllV1 Test.', () => {
  const user1 = requestAuthRegister('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const user2 = requestAuthRegister('JohnP@gmail.com', '123456', 'John', 'Paul');
  const user3 = requestAuthRegister('SimonM@gmail.com', 'pass123', 'Simon', 'Minter');
  const usersAll = requestUsersAll(user1.token);
  expect(usersAll).toEqual({
    users: {
      resultUsers: [
        {
          uId: user1.authUserId,
          email: 'fadys@gmail.com',
          nameFirst: 'Fady',
          nameLast: 'Sadek',
          handleStr: 'fadysadek',
        },
        {
          uId: user2.authUserId,
          email: 'johnp@gmail.com',
          nameFirst: 'John',
          nameLast: 'Paul',
          handleStr: 'johnpaul',
        },
        {
          uId: user3.authUserId,
          email: 'simonm@gmail.com',
          nameFirst: 'Simon',
          nameLast: 'Minter',
          handleStr: 'simonminter',
        },
      ]
    }
  });
});
