import { requestAuthRegister, requestDmCreate, requestDmList, requestClear } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});
describe('Valid inputs fordm/list/v1', () => {
  test('Valid return', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const user1 = requestAuthRegister('akanksha.Sood816@gmail.com', 'samplePass', 'akanksha', 'Sood');
    const user2 = requestAuthRegister('alex@gmail.com', 'samplePass', 'Alex', 'Smith');
    const user3 = requestAuthRegister('bill@gmail.com', 'samplePass', 'Bill', 'Bill');

    const uIds = [user1.authUserId, user2.authUserId];
    const dm = requestDmCreate(user.token, uIds);
    const dm1 = requestDmCreate(user1.token, []);

    // owner only
    const list = requestDmList(user.token);
    expect(list).toStrictEqual({
      dms: [
        {
          dmId: dm.dmId,
          name: 'akankshasood, alexsmith, jakerenzella',
        }
      ]
    });

    // owner and member
    const list1 = requestDmList(user1.token);
    expect(list1).toStrictEqual({
      dms: [
        {
          dmId: dm.dmId,
          name: 'akankshasood, alexsmith, jakerenzella',
        },
        {
          dmId: dm1.dmId,
          name: 'akankshasood',
        },
      ]
    });

    // member only
    const list2 = requestDmList(user2.token);
    expect(list2).toStrictEqual({
      dms: [
        {
          dmId: dm.dmId,
          name: 'akankshasood, alexsmith, jakerenzella',
        }
      ]
    });

    // none
    const list3 = requestDmList(user3.token);
    expect(list3).toStrictEqual({ dms: [] });
  });
});

describe('Invalid inputs', () => {
  test('Invalid token', () => {
    const invalid = requestDmList('invalid token');
    expect(invalid).toStrictEqual({ error: expect.any(String) });
  });
});
