import { channelLeaveV1 } from "../channel";
import {
  requestAuthLogin,
  requestAuthRegister,
  requestChannelAddOwner,
  requestChannelDetails,
  requestChannelInvite,
  requestChannelsCreate,
  requestClear,
} from "../requests";
import { port, url } from "./config.json";
const request = require("sync-request");

beforeEach(() => {
  requestClear();
});

test("success addOwner", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("oliverwluu@gmail.com", "cl3cl3vul44");
  let { token: token1, authUserId: authUserId1 } = loginRes;
  let { token: token2, authUserId: authUserId2 } = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);
  let { channelId } = channelCreateRes;
  requestChannelInvite(token1,channelId,authUserId2);
  let addOwnerRes = requestChannelAddOwner(token1, channelId, authUserId2);
  let {error} = addOwnerRes;

  if (error){
    console.log(error);
  }

  let channelDetailsRes = requestChannelDetails(token1, channelId);
  let { ownerMembers} = channelDetailsRes;

  if (error) {
    console.log(authUserId2);
    console.log(channelDetailsRes);
  }

  expect(ownerMembers.length).toStrictEqual(2);
});

test("error token", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1 } = loginRes;
  let { authUserId: authUserId2 } = loginRes2;

  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;

  requestChannelInvite(token1,channelId,authUserId2);

  token1 += "error";
  let channelAddOwneRes = requestChannelAddOwner(
    token1,
    channelId,
    authUserId2
  );

  let { error } = channelAddOwneRes;
  expect(error).toEqual(expect.any(String));
});

test("error userID", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1 } = loginRes;
  let { authUserId: authUserId2 } = loginRes2;

  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;

  requestChannelInvite(token1,channelId, authUserId2);

  let channelAddOwneRes = requestChannelAddOwner(
    token1,
    channelId,
    authUserId2 + 200
  );
  let { error } = channelAddOwneRes;
  expect(error).toEqual(expect.any(String));
});

test("error invalid channelID", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("oliverwluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1 } = loginRes;
  let { authUserId: authUserId2 } = loginRes2;

  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;

  requestChannelInvite(token1,channelId, authUserId2);

  let channelAddOwneRes = requestChannelAddOwner(
    token1,
    channelId + 1,
    authUserId2
  );
  let { error } = channelAddOwneRes;
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

  let channelAddOwneRes = requestChannelAddOwner(
    token1,
    channelId,
    authUserId2
  );
  let { error } = channelAddOwneRes;
  expect(error).toEqual(expect.any(String));
});

test("error uId is already an owner ", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");

  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let { token: token1, authuserId: authUserId1 } = loginRes;

  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;

  let channelAddOwneRes = requestChannelAddOwner(
    token1,
    channelId,
    authUserId1
  );
  let { error } = channelAddOwneRes;
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
  let channelCreateRes = requestChannelsCreate(token1, "sampleChannel", true);

  let { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);
  requestChannelInvite(token1, channelId, authUserId3);

  let channelAddOwneRes = requestChannelAddOwner(
    token2,
    channelId,
    authUserId3
  );

  let { error } = channelAddOwneRes;
  expect(error).toEqual(expect.any(String));
});
