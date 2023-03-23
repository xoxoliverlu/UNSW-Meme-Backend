import { requestAuthLogin, requestAuthRegister, requestChannelsCreate, requestChannelsListAll, requestClear } from "../requests";
import { port, url } from "./config.json";
const request = require("sync-request");

beforeEach(() => {
  requestClear();
});

test("success channels List All", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu")
  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4")
  let { token } = loginRes;
  let channelCreateRes = requestChannelsCreate(token, "sampleChannel", true)
  let { channelId } = channelCreateRes;
  let channelsListRes = requestChannelsListAll(token);
  let { channels } = channelsListRes
  expect(channels).toStrictEqual([{channelId: channelId, name: "sampleChannel"}]);
});

test("error token", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu")
  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4")
  let { token } = loginRes;
  requestChannelsCreate(token, "sampleChannel", true)
  token += "errorToken";
  let channelsListRes = requestChannelsListAll(token);
  let { error } = channelsListRes;
  expect(error).toEqual(expect.any(String));
});
