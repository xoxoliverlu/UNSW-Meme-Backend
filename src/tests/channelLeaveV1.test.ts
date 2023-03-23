import { channel } from "diagnostics_channel";
import {
  requestAuthLogin,
  requestAuthRegister,
  requestChannelDetails,
  requestChannelInvite,
  requestChannelLeave,
  requestChannelsCreate,
  requestClear,
} from "../requests";
import { port, url } from "./config.json";
const request = require("sync-request");

beforeEach(() => {
  requestClear();
});

test("success channel leave", () => {
  requestAuthRegister("olivrewlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("olivrewluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes1 = requestAuthLogin("olivrewlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");

  let { token: token1 } = loginRes1;
  let { authUserId: authUserId2, token: token2 } = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "testing", true);

  let { channelId } = channelCreateRes;
  requestChannelInvite(token1, channelId, authUserId2);
  requestChannelLeave(token1, channelId);
  let channelDetailRes = requestChannelDetails(token2, channelId);
  let { allMembers } = channelDetailRes;
  expect(allMembers.length).toEqual(1);
});

test("error invalid channelId", () => {
  requestAuthRegister("olivrewlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("olivrewluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");
  let loginRes1 = requestAuthLogin("olivrewlu@gmail.com", "cl3cl3vul4");
  requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1 } = loginRes1;

  let channelCreateRes = requestChannelsCreate(token1, "testing", true);
  let { channelId } = channelCreateRes;

  let channelLeaveRes = requestChannelLeave(token1, channelId + 1);

  let { error } = channelLeaveRes;
  expect(error).toEqual(expect.any(String));
});

test("error authUser not a part of channel", () => {
  requestAuthRegister("olivrewlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("olivrewluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");

  let loginRes1 = requestAuthLogin("olivrewlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1 } = loginRes1;
  let { token: token2 } = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "testing", true);
  let { channelId } = channelCreateRes;

  let channelRemoveRes = requestChannelLeave(token2, channelId);

  let { error } = channelRemoveRes;
  expect(error).toEqual(expect.any(String));
});

test("error invalid token", () => {
  requestAuthRegister("olivrewlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  requestAuthRegister("olivrewluu@gmail.com", "cl3cl3vul44", "Oliver", "Lu");
  let loginRes1 = requestAuthLogin("olivrewlu@gmail.com", "cl3cl3vul4");
  let loginRes2 = requestAuthLogin("olivrewluu@gmail.com", "cl3cl3vul44");
  let { token: token1 } = loginRes1;
  let { token: token2 } = loginRes2;
  let channelCreateRes = requestChannelsCreate(token1, "testing", true);
  let { channelId } = channelCreateRes;

  let channelLeaveRes = requestChannelLeave(token1 + "error", channelId);

  let { error } = channelLeaveRes;
  expect(error).toEqual(expect.any(String));
});
