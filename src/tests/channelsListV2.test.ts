import { port, url } from "./config.json";
import { requestAuthRegister, requestAuthLogin, requestChannelsCreate, requestChannelsList} from "../requests";

const request = require("sync-request");

beforeEach(() => {
  request("DELETE", `${url}:${port}/clear/v1`);
});

test("success channels List", () => {
   requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu",)
  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4")
  let { token } = loginRes;
  let channelCreateRes = requestChannelsCreate(token, "sampleChannel", true)

  let { channelId } = channelCreateRes;
  let channelListRes = requestChannelsList(token)

  let { channels } = channelListRes;
  expect(channels).toStrictEqual([{channelId: channelId, name: "sampleChannel"}]);
});

test("error token", () => {
  requestAuthRegister("oliverwlu@gmail.com", "cl3cl3vul4", "Oliver", "Lu");
  let loginRes = requestAuthLogin("oliverwlu@gmail.com", "cl3cl3vul4");
  let { token, authUserId } = loginRes;
  token += "errorToken";

  let channelsListRes = requestChannelsList(token);
  let { error } = channelsListRes
  expect(error).toEqual(expect.any(String));
});