import { requestClear, requestAuthRegister, requestDmRemove, requestDmCreate, requestDmList, requestDmLeave } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Invalid inputs for dmRemove', () => {
  test('Invalid token', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const dm = requestDmCreate(user.token, []);

    const invalid = requestDmRemove('Invalid token', dm.dmId);
    expect(invalid).toStrictEqual(403);
  });

  test('Invalid dmId', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    requestDmCreate(user.token, []);

    const invalid = requestDmRemove(user.token, -4);
    expect(invalid).toStrictEqual(400);
  });

  test('User is not owner of DM or member of DM', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const user1 = requestAuthRegister('akanksha.sood816@gmail.com', 'samplePass', 'akanksha', 'sood');
    const user2 = requestAuthRegister('alex@gmail.com', 'samplePass', 'Alex', 'Smith');
    const user3 = requestAuthRegister('theo@gmail.com', 'theoPassword', 'Theo', 'Theo');
    const dm = requestDmCreate(user.token, [user1.authUserId, user3.authUserId]);

    const invalid = requestDmRemove(user1.token, dm.dmId);
    expect(invalid).toStrictEqual(403);
    const invalid2 = requestDmRemove(user2.token, dm.dmId);
    expect(invalid2).toStrictEqual(403);
    // User no longer member of dm
    requestDmLeave(user3.token, dm.dmId);
    const invalid3 = requestDmRemove(user3.token, dm.dmId);
    expect(invalid3).toStrictEqual(403);
  });
});


describe('Valid inputs for dmRemove', () => {
  test('Correct return', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const user1 = requestAuthRegister('akanksha.sood816@gmail.com', 'samplePass', 'akanksha', 'sood');
    const dm = requestDmCreate(user.token, [user1.authUserId]);
    const dm1 = requestDmCreate(user1.token, []);
    const remove = requestDmRemove(user.token, dm.dmId);
    expect(remove).toStrictEqual({});
    // AFTER
    expect(requestDmList(user.token)).toStrictEqual({ dms: [] });
    expect(requestDmList(user1.token)).toStrictEqual({
      dms: [
        {
          dmId: dm1.dmId,
          name: 'akankshasood',
        },
      ]
    });
  });
});
