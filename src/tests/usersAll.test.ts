import { authRegisterV1 } from "../auth.js";
import { clearV1 } from "../other.js";
import { usersAllV1 } from "../users.js";

beforeEach(() => {
  clearV1();
});

test('Successful usersAllV1 Test.', () => {
  const user1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
  const user2 = authRegisterV1('JohnP@gmail.com', '123456', 'John', 'Paul');
  const user3 = authRegisterV1('SimonM@gmail.com', 'pass123', 'Simon', 'Minter');
  const usersAll = usersAllV1('token');
  expect(usersAll).toEqual({
    user: {
      uId: user1.uId,
      email: user1.email,
      nameFirst: user1.nameFirst,
      nameLast: user1.nameLast,
      handleStr: user1.handleStr,
    },
    user :{
      uId: user2.uId,
      email: user2.email,
      nameFirst: user2.nameFirst,
      nameLast: user2.nameLast,
      handleStr: user2.handleStr,
    },
    user :{
      uId: user3.uId,
      email: user3.email,
      nameFirst: user3.nameFirst,
      nameLast: user3.nameLast,
      handleStr: user3.handleStr,
    },
  });
});
