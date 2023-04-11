import { requestClear, requestAuthRegister, requestDmRemove, requestDmCreate, requestDmList } from '../requests';

beforeEach(() => {
  requestClear();
});

describe('Invalid inputs for dmRemove', () => {
  test('Invalid token', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const dm = requestDmCreate(user.token, []);

    const invalid = requestDmRemove('Invalid token', dm.dmId);
    expect(invalid).toStrictEqual({ error: expect.any(String) });
  });

  test('Invalid dmId', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    requestDmCreate(user.token, []);

    const invalid = requestDmRemove(user.token, undefined);
    expect(invalid).toStrictEqual({ error: expect.any(String) });
  });

  test('User is not owner of DM', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const user1 = requestAuthRegister('akanksha.sood816@gmail.com', 'samplePass', 'akanksha', 'sood');
    requestAuthRegister('alex@gmail.com', 'samplePass', 'Alex', 'Smith');
    const dm = requestDmCreate(user.token, [user1.authUserId]);

    const invalid = requestDmRemove(user1.token, dm.dmId);
    expect(invalid).toStrictEqual({ error: expect.any(String) });
  });

  test('User not a member of DM', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const user1 = requestAuthRegister('akanksha.sood816@gmail.com', 'samplePass', 'akanksha', 'sood');
    const user2 = requestAuthRegister('alex@gmail.com', 'samplePass', 'Alex', 'Smith');
    const dm = requestDmCreate(user.token, [user1.authUserId]);

    const invalid = requestDmRemove(user2.token, dm.dmId);
    expect(invalid).toStrictEqual({ error: expect.any(String) });
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
