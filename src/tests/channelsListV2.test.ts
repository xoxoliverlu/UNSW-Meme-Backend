import { port, url } from "./config.json";
const request = require("sync-request");

beforeEach(() => {
  request("DELETE",'/clear/v1')
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
  let { token, authUserId } = JSON.parse(loginRes.body);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    token: token,
    name: "sampleChannel",
    isPublic: true,
  });
  let { channelId } = JSON.parse(channelCreateRes);
  let channelsListRes = request("POST", `${url}:${port}/channels/list/v2`, {
    token: token,
  });

  let { channels } = JSON.parse(channelsListRes);
  expect(channels).toStrictEqual([channelId]);
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
  let { token, authUserId } = JSON.parse(loginRes.body);
  token += "errorToken";

  let channelsListRes = request("POST", `${url}:${port}/channels/list/v2`, {
    token: token,
  });

  let { error } = JSON.parse(channelsListRes);
  expect(error).toEqual(expect.any(String));
});
