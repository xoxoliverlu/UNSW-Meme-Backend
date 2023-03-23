import { channel } from "diagnostics_channel";
import { port, url } from "./config.json";
const request = require("sync-request");

beforeEach(() => {
  request("DELETE", `${url}:${port}/clear/v1`);
});

test("success channels List", () => {
  let regRes = request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwlu@gmail.com",
      password: "cl3cl3vul4",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  let loginRes = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let { token } = JSON.parse(loginRes.body as string);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    json: { token: token, name: "sampleChannel", isPublic: true },
  });

  let { channelId } = JSON.parse(channelCreateRes.body as string);
  let channelListRes = request("GET", `${url}:${port}/channels/list/v2`, {
    qs: {token: token}
  })

  let { channels } = JSON.parse(channelListRes.body as string);
  expect(channels).toStrictEqual([{channelId:1, name: "sampleChannel"}]);
});

test("error token", () => {
  let regRes = request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwlu@gmail.com",
      password: "cl3cl3vul4",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  let loginRes = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let { token, authUserId } = JSON.parse(loginRes.body as string);
  token += "errorToken";

  let channelsListRes = request("GET", `${url}:${port}/channels/list/v2`, {
    qs:{token: token,}
  });
  let { error } = JSON.parse(channelsListRes.body as string);
  expect(error).toEqual(expect.any(String));
});
