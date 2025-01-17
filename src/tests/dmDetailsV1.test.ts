import {
  requestClear,
  requestAuthRegister,
  requestAuthLogin,
  requestDmDetails,
  requestDmCreate,
} from '../requests';
require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

test('success channel details', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');

  const dm = requestDmCreate(loginRes.token, [loginRes2.authUserId]);
  const dmDetailsRes = requestDmDetails(loginRes.token, dm.dmId);

  expect(dmDetailsRes.name).toEqual(expect.any(String));
  expect(dmDetailsRes.members).toEqual(
    [
      {
        uId: loginRes2.authUserId,
        email: 'oliverwluu@gmail.com',
        handleStr: 'oliverlu0',
        nameFirst: 'Oliver',
        nameLast: 'Lu',
      },
      {
        uId: loginRes.authUserId,
        email: 'oliverwlu@gmail.com',
        handleStr: 'oliverlu',
        nameFirst: 'Oliver',
        nameLast: 'Lu',
      },
    ]
  );
});

test('error invalid dm id', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');

  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const { dmId } = requestDmCreate(token1, [authUserId2]);

  const dmDetailsRes = requestDmDetails(token1, dmId + 1);
  expect(dmDetailsRes).toEqual(400);
});

test('error auth user not member of dm', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluuu@gmail.com', 'cl3cl3vul444', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');
  const loginRes3 = requestAuthLogin('oliverwluuu@gmail.com', 'cl3cl3vul444');

  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;
  const { token: token3 } = loginRes3;

  const { dmId } = requestDmCreate(token1, [authUserId2]);

  const dmDetailsRes = requestDmDetails(token3, dmId);
  expect(dmDetailsRes).toEqual(403);
});

test('error invalid token', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');

  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const { dmId } = requestDmCreate(token1, [authUserId2]);

  const dmDetailsRes = requestDmDetails(token1 + 'error', dmId);
  expect(dmDetailsRes).toEqual(403);
});
