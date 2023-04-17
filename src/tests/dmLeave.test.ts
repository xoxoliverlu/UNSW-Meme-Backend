import { requestAuthRegister, requestClear, requestDmCreate, requestDmLeave, requestDmDetails } from '../requests';

require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Invalid input tests', () => {
  test('Invalid token', () => {
    const user1 = requestAuthRegister('AKANKSHAS08@gmail.com', 'Password', 'Akanksha', 'Sood');
    const user2 = requestAuthRegister('HaydenS@gmail.com', 'Hayden', 'Hayden', 'Smith');
    const user3 = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const uIds = [user2.authUserId, user3.authUserId];
    const dm = requestDmCreate(user1.token, uIds);
    const dmLeave = requestDmLeave('badToken', dm.dmId);
    expect(dmLeave).toEqual(403);
  });
  test('Invalid dmId', () => {
    const user1 = requestAuthRegister('AKANKSHAS08@gmail.com', 'Password', 'Akanksha', 'Sood');
    const user2 = requestAuthRegister('HaydenS@gmail.com', 'Hayden', 'Hayden', 'Smith');
    const user3 = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const uIds = [user2.authUserId, user3.authUserId];
    const dm = requestDmCreate(user1.token, uIds);
    const dmLeave = requestDmLeave(user1.token, dm.dmId + 1);
    expect(dmLeave).toEqual(400);
  });
  test('User is not a member of the dm', () => {
    const user1 = requestAuthRegister('AKANKSHAS08@gmail.com', 'Password', 'Akanksha', 'Sood');
    const user2 = requestAuthRegister('HaydenS@gmail.com', 'Hayden', 'Hayden', 'Smith');
    const user3 = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
    const uIds = [user2.authUserId];
    const dm = requestDmCreate(user1.token, uIds);
    const dmLeave = requestDmLeave(user3.token, dm.dmId);
    expect(dmLeave).toEqual(403);
  });
});

test('Removing member from dm', () => {
  const user1 = requestAuthRegister('AKANKSHAS08@gmail.com', 'Password', 'Akanksha', 'Sood');
  const user2 = requestAuthRegister('HaydenS@gmail.com', 'Hayden', 'Hayden', 'Smith');
  const user3 = requestAuthRegister('validemail@gmail.com', '123abc!@#', 'Jake', 'Renzella');
  const uIds = [user2.authUserId, user3.authUserId];
  const dm = requestDmCreate(user1.token, uIds);
  requestDmLeave(user3.token, dm.dmId);
  const dmDetails = requestDmDetails(user1.token, dm.dmId);
  expect(dmDetails.members).not.toContain(user3.authUserId);
});
