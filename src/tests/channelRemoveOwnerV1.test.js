import { channelRemoveOwnerV1 } from "../channel";
import { requestAuthRegister, requestAuthLogin, requestChannelsCreate, requestChannelInvite, requestChannelAddOwner, requestChannelRemoveOwner, requestChannelDetails } from "../requests";
import { port, url } from "./config.json";
const request = require("sync-request");

beforeEach(() => {
  request("DELETE", `${url}:${port}/clear/v1`);
});

test("success removeOwner", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("oliverwluu@gmail.com", "cl3cl3vul44");

  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { token: token2, authUserId: authUserId2 } = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);
  let { channelId } = channelCreateRes;

  requestChannelInvite(token1, channelId, authUserId2);

  requestChannelAddOwner(token1, channelId, authUserId2);

  let channelDeatilsRes = requestChannelDetails(token2, channelId, authUserId2);

  let { ownerMembers } = channelDeatilsRes;
  expect(ownerMembers.length).toStrictEqual(2);
  let {removeErr} = requestChannelRemoveOwner(token2, channelId, authUserId1);

  channelDeatilsRes = requestChannelDetails(token1, channelId, authUserId2);
  ownerMembers = channelDeatilsRes.ownerMembers;
  expect(ownerMembers.length).toStrictEqual(1);
});

test("error token", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { authUserId: authUserId2, token: token2} = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;

  requestChannelAddOwner(token1, channelId, authUserId2);

  token2 += "error";
  let removeRes = requestChannelRemoveOwner(token2, channelId, authUserId1);

  let { error } = removeRes;
  expect(error).toEqual(expect.any(String));
});

test("error userID", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { authUserId: authUserId1, token: token1 } = loginRes;
  let { authUserId: authUserId2, token: token2 } = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;

  requestChannelInvite(token1,channelId,authUserId2);

  requestChannelAddOwner(token1, channelId, authUserId2);
  let removeRes = requestChannelRemoveOwner(
    token2,
    channelId,
    authUserId1 + authUserId2
  );
  let { error } = removeRes;
  expect(error).toEqual(expect.any(String));
});

test("error invalid channelID", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { authUserId: authUserId2, token: token2} = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;

  requestChannelInvite(token1, channelId, authUserId2);

  requestChannelAddOwner(token1, channelId, authUserId2);
  let removeRes = requestChannelRemoveOwner(
    token2,
    channelId + 1,
    authUserId1,
  );
  let { error } = removeRes;
  expect(error).toEqual(expect.any(String));
});

test("error user not a part of channel ", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1 } = loginRes;
  let { authUserId: authUserId2 } = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;

  let removeRes = requestChannelRemoveOwner(token1, channelId, authUserId2);

  let { error } = removeRes;
  expect(error).toEqual(expect.any(String));
});

test("error uId is not an owner ", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");
  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");

  let { token: token1 } = loginRes;
  let { authUserId: authUserId2 } = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);

  let removeRes = requestChannelRemoveOwner(token1, channelId, authUserId2);
  let { error } = removeRes;
  expect(error).toEqual(expect.any(String));
});

test("error user doesn't have owner permission ", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");
  requestAuthRegister("oliverwluuu@gmail.com", "cl3cl3vul444", "Oliver", "Lu");
  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let loginRes3 = requestAuthLogin("olivrewluuu@gmail.com", "cl3cl3vul444");

  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { token: token2, authUserId: authUserId2 } = loginRes2;
  let { token: token3, authUserId: authUserId3 } = loginRes3;
  let {channelId} = requestChannelsCreate(token1, "sampleChannel", true);

  requestChannelInvite(token1, channelId, authUserId2);
  requestChannelInvite(token1, channelId, authUserId3);


  requestChannelAddOwner(token1, channelId, authUserId2);
  let removeRes = requestChannelRemoveOwner(token3, channelId, authUserId1);
  let { error } = removeRes;
  expect(error).toEqual(expect.any(String));
});

test("error uId is the only owner ", () => {
  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");

  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { token: token2, authUserId: authUserId2 } = loginRes2;

  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);

  let removeRes = channelRemoveOwnerV1(token1, channelId, authUserId1);
  let { error } = removeRes;
  expect(error).toEqual(expect.any(String));
});
