import { requestAuthRegister, requestClear, requestDmCreate, requestDmList } from '../requests';
beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('dm Create valid inputs', () => {
  test('Correct return - one user', () => {
    const user1 = requestAuthRegister('akanksha.sood@gmail.com', 'samplePass', 'Akanksha', 'Sood');
    const user2 = requestAuthRegister('HaydenS@gmail.com', 'samplePass', 'Hayden', 'Smith');
    const uIds = [user1.authUserId];
    const dm = requestDmCreate(user2.token, uIds);
    expect(dm.dmId).toEqual(expect.any(Number));
    expect(requestDmList(user1.token)).toMatchObject({
      dms: [
        {
          dmId: dm.dmId,
          name: 'akankshasood, haydensmith',
        },
      ]
    });
  });
  test('Correct return - multiple user', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const user1 = requestAuthRegister('akanksha.sood@gmail.com', 'samplePass', 'Akanksha', 'Sood');
    const user2 = requestAuthRegister('alex@gmail.com', 'samplePass', 'Alex', 'Smith');
    const uIds = [user1.authUserId, user2.authUserId];
    // User creates dm
    const dm = requestDmCreate(user.token, uIds);
    expect(dm.dmId).toEqual(expect.any(Number));
    expect(requestDmList(user1.token)).toMatchObject({
      dms: [
        {
          dmId: dm.dmId,
          name: 'akankshasood, alexsmith, jakerenzella',
        },
      ]
    });
  });
  test('Unique dmIds created and valid format of Dms', () => {
    const user = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const user1 = requestAuthRegister('akanksha.sood@gmail.com', 'samplePass', 'Akanksha', 'Sood');
    const user2 = requestAuthRegister('alex@gmail.com', 'samplePass', 'Alex', 'Smith');
    const uIds = [user1.authUserId, user2.authUserId];
    // User creates dm
    const dm = requestDmCreate(user.token, uIds);
    const user3 = requestAuthRegister('HaydenS@gmail.com', 'samplePass', 'Hayden', 'Smith');
    const uIds2 = [user1.authUserId];
    const dm2 = requestDmCreate(user3.token, uIds2);
    expect(dm.dmId).not.toEqual(dm2.dmId);
    expect(requestDmList(user1.token)).toMatchObject({
      dms: [
        {
          dmId: dm.dmId,
          name: 'akankshasood, alexsmith, jakerenzella',
        },
        {
          dmId: dm2.dmId,
          name: 'akankshasood, haydensmith',
        },
      ]
    });
  });
});

describe('Invalid inputs for dmCreate', () => {
  const user = requestAuthRegister('AKANKSHAS08@gmail.com', 'Password', 'Akanksha', 'Sood');
  const user2 = requestAuthRegister('HaydenS@gmail.com', 'Hayden', 'Hayden', 'Smith');
  const user3 = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
  describe('Testing inputs', () => {
    test('Invalid uId in uIds', () => {
      const uIds = [user2.authUserId + 4, user3.authUserId];
      const dm = requestDmCreate(user.token, uIds);
      expect(dm).toStrictEqual(400);
    });
    test('Duplicate uId in uIds', () => {
      const uIds = [user2.authUserId, user2.authUserId, user3.authUserId];
      const dm = requestDmCreate(user.token, uIds);
      expect(dm).toStrictEqual(400);
    });
    test('Invalid token', () => {
      const uIds = [user2.authUserId, user3.authUserId];
      console.log(uIds);
      const dm = requestDmCreate(user.token + 'Invalid', uIds);
      console.log(dm);
      expect(dm).toStrictEqual(403);
    });
  });
});
