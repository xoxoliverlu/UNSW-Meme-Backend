import { port, url } from "./config.json";
const request = require("sync-request");

const OK = 200;

beforeEach(() => {
  request("DELETE", `${url}:${port}/clear/v1`);
});

test("success channel leave", () => {
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwlu@gmail.com",
      password: "cl3cl3vul4",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwluu@gmail.com",
      password: "cl3cl3vul44",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  let loginRes = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let loginRes2 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwluu@gmail.com", password: "cl3cl3vul44" },
  });
  let { token: token1 } = JSON.parse(loginRes.body);
  let channelCreateRes = request("POST",`${url}:${port}/channels/create/v2`, {
    json:{
      token: token1,
      name: "testing",
      isPublic: true
    }
  });
  let {channelId} = JSON.parse(channelCreateRes);
  let channelRemoveRes = request("POST", `${url}:${port}/channel/leave/v1`, {
    json: { token: token1, channelId: channelId}
  })
  expect(channelRemoveRes.statusCode).toBe(OK);
});

test("error invalid channelId", () => {
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwlu@gmail.com",
      password: "cl3cl3vul4",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwluu@gmail.com",
      password: "cl3cl3vul44",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  let loginRes = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let loginRes2 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwluu@gmail.com", password: "cl3cl3vul44" },
  });
  let { token: token1 } = JSON.parse(loginRes.body);
  let channelCreateRes = request("POST",`${url}:${port}/channels/create/v2`, {
    json:{
      token: token1,
      name: "testing",
      isPublic: true
    }
  });
  let {channelId} = JSON.parse(channelCreateRes);
  let channelRemoveRes = request("POST", `${url}:${port}/channel/leave/v1`, {
    json: { token: token1, channelId: channelId+1}
  }) 
  expect(channelRemoveRes.statusCode).toBe(400);
  let {error} = JSON.parse(channelRemoveRes);
  expect(error).toEqual(expect.any(String));
});

test("error authUser not a part of channel", () => {
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwlu@gmail.com",
      password: "cl3cl3vul4",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwluu@gmail.com",
      password: "cl3cl3vul44",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  let loginRes = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let loginRes2 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwluu@gmail.com", password: "cl3cl3vul44" },
  });
  let { token: token1 } = JSON.parse(loginRes.body);
  let { token: token2 } = JSON.parse(loginRes2.body);
  let channelCreateRes = request("POST",`${url}:${port}/channels/create/v2`, {
    json:{
      token: token1,
      name: "testing",
      isPublic: true
    }
  });
  let {channelId} = JSON.parse(channelCreateRes);
  let channelRemoveRes = request("POST", `${url}:${port}/channel/leave/v1`, {
    json: { token: token2, channelId: channelId}
  }) 
  expect(channelRemoveRes.statusCode).toBe(400);
  let {error} = JSON.parse(channelRemoveRes);
  expect(error).toEqual(expect.any(String));
});

test("error invalid token", () => {
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwlu@gmail.com",
      password: "cl3cl3vul4",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwluu@gmail.com",
      password: "cl3cl3vul44",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  let loginRes = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let loginRes2 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwluu@gmail.com", password: "cl3cl3vul44" },
  });
  let { token: token1 } = JSON.parse(loginRes.body);
  let channelCreateRes = request("POST",`${url}:${port}/channels/create/v2`, {
    json:{
      token: token1,
      name: "testing",
      isPublic: true
    }
  });
  let {channelId} = JSON.parse(channelCreateRes);
  let channelRemoveRes = request("POST", `${url}:${port}/channel/leave/v1`, {
    json: { token: token1+"error", channelId: channelId}
  })
  expect(channelRemoveRes.statusCode).toBe(400);
  let {error} = JSON.parse(channelRemoveRes);
  expect(error).toEqual(expect.any(String));
})
