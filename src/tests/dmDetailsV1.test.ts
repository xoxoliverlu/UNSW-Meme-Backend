import { dmCreateV1 } from "../dm";
import {
  requestChannelAddOwner,
  requestClear,
  requestAuthRegister,
  requestAuthLogin,
  requestDmDetails,
  requestDmCreate,
} from "../requests";
const request = require("sync-request");

const OK = 200;

beforeEach(() => {
  requestClear();
});

test("success channel details", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("oliverwluu@gmail.com", "cl3cl3vul44");

  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { token: token2, authUserId: authUserId2 } = loginRes2;

  const { dmId } = requestDmCreate(token1, [authUserId2]);


  const dmDetailsRes = requestDmDetails(token1, dmId);

  let { name, members } = dmDetailsRes;
  
  expect(name).toEqual(expect.any(String));
  expect(members).toEqual([authUserId2,authUserId1]);
});

test("error invalid dm id", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("oliverwluu@gmail.com", "cl3cl3vul44");

  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { token: token2, authUserId: authUserId2 } = loginRes2;

  const { dmId } = dmCreateV1(token1, [authUserId2]);

  const dmDetailsRes = requestDmDetails(token1, dmId + 1);
  let { error } = dmDetailsRes;
  expect(error).toEqual(expect.any(String));
});

test("error auth user not member of dm", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");
  requestAuthRegister("oliverwluuu@gmail.com", "cl3cl3vul444", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("oliverwluu@gmail.com", "cl3cl3vul44");
  let loginRes3 = requestAuthLogin("oliverwluuu@gmail.com", "cl3cl3vul444");

  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { token: token2, authUserId: authUserId2 } = loginRes2;
  let { token: token3, authUserId: authUserId3 } = loginRes3;

  const { dmId } = requestDmCreate(token1, [authUserId2]);

  const dmDetailsRes = requestDmDetails(token3, dmId);
  let { error } = dmDetailsRes;
  expect(error).toEqual(expect.any(String));
});

test("error invalid token", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("oliverwluu@gmail.com", "cl3cl3vul44");

  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { token: token2, authUserId: authUserId2 } = loginRes2;

  const { dmId } = requestDmCreate(token1, [authUserId2]);

  const dmDetailsRes = requestDmDetails(token1 + "error", dmId);

  let { name, members } = dmDetailsRes;
  let { error } = dmDetailsRes;
  expect(error).toEqual(expect.any(String));
});
