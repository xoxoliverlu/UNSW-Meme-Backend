import { dmCreateV1 } from '../dm';
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

test('success channel details', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');

  const { token: token1, authUserId: authUserId1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const { dmId } = requestDmCreate(token1, [authUserId2]);
  const dmDetailsRes = requestDmDetails(token1, dmId);
  const { name, members } = dmDetailsRes;

  expect(name).toEqual(expect.any(String));
  expect(members).toEqual([authUserId2, authUserId1]);
});

test('error invalid dm id', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestAuthRegister('oliverwluu@gmail.com', 'cl3cl3vul44', 'Oliver', 'Lu');

  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const loginRes2 = requestAuthLogin('oliverwluu@gmail.com', 'cl3cl3vul44');

  const { token: token1 } = loginRes;
  const { authUserId: authUserId2 } = loginRes2;

  const { dmId } = dmCreateV1(token1, [authUserId2]);

  const dmDetailsRes = requestDmDetails(token1, dmId + 1);
  const { error } = dmDetailsRes;
  expect(error).toEqual(expect.any(String));
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
  const { error } = dmDetailsRes;
  expect(error).toEqual(expect.any(String));
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

  const { error } = dmDetailsRes;
  expect(error).toEqual(expect.any(String));
});
