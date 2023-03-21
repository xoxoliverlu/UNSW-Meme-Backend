import { port, url } from "./config.json";
const request = require("sync-request");

beforeEach(() => {
  request("DELETE", `${url}:${port}/clear/v1`);
});

test("success removeOwner", () => {
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
  let { token: token1, authUserId: authUserId1 } = JSON.parse(loginRes.body);
  let { token: token2, authUserId: authUserId2 } = JSON.parse(loginRes2.body);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    token: token1,
    name: "sampleChannel",
    isPublic: true,
  });
  let { channelId } = JSON.parse(channelCreateRes);
  request("POST", `${url}:${port}/channel/invite/v2`, {
    token: token1,
    channlId: channelId,
    uId: authUserId2,
  });
  request("POST", `${url}:${port}/channel/addowner/v1`, {
    token: token1,
    channelID: channelId,
    uId: authUserId2,
  });

  let channelDetailsRes = request("POST", `${url}:${port}/channel/details/v2`, {
    token: token2,
    channelID: channelId,
    uId: authUserId2,
  });

  let { ownerMembers } = JSON.parse(channelDetailsRes);
  expect(ownerMembers).toStrictEqual([authUserId1, authUserId2]);
  request("POST", `${url}:${port}/channel/removeowner/v1`, {
    token: token2,
    channelID: channelId,
    uId: authUserId1,
  });
  expect(ownerMembers).toStrictEqual([authUserId2]);
});

test("error token", () => {
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
  let { authUserId: authUserId2 } = JSON.parse(loginRes2.body);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    token: token1,
    name: "sampleChannel",
    isPublic: true,
  });
  let { channelId } = JSON.parse(channelCreateRes);
  request("POST", `${url}:${port}/channel/invite/v2`, {
    token: token1,
    channlId: channelId,
    uId: authUserId2,
  });
  request(
    "POST",
    `${url}:${port}/channel/addowner/v1`,
    {
      token: token1,
      channelID: channelId,
      uId: authUserId2,
    }
  );
  token2 += "error"
  let removeRes = request("POST", `${url}:${port}/channel/removeowner/v1`, {
    token: token2,
    channelID: channelId,
    uId: authUserId1,
  });
  let {error} = JSON.parse(removeRes);
  expect(error).toEqual(expect.any(String))
});


test("error userID", () => {
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
      email: "oliverwlu@gmail.com",
      password: "cl3cl3vul4",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  let loginRes = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let loginRes2 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let { token: token1, authUserId: authUserId1 } = JSON.parse(loginRes.body);
  let { token: token2, authUserId: authUserId2 } = JSON.parse(loginRes2.body);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    token: token1,
    name: "sampleChannel",
    isPublic: true,
  });
  let { channelId } = JSON.parse(channelCreateRes);
  request("POST", `${url}:${port}/channel/invite/v2`, {
    token: token1,
    channlId: channelId,
    uId: authUserId2,
  });
  request(
    "POST",
    `${url}:${port}/channel/addowner/v1`,
    {
      token: token1,
      channelID: channelId,
      uId: authUserId2,
    }
  );
  let removeRes = request("POST", `${url}:${port}/channel/removeowner/v1`, {
    token: token2,
    channelID: channelId,
    uId: authUserId1 + 200,
  });
  let { error } = JSON.parse(removeRes);
  expect(error).toEqual(expect.any(String));
});

test("error invalid channelID", () => {
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
  let { token: token1} = JSON.parse(loginRes.body);
  let { authUserId: authUserId2 } = JSON.parse(loginRes2.body);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    token: token1,
    name: "sampleChannel",
    isPublic: true,
  });
  let { channelId } = JSON.parse(channelCreateRes);
  request("POST", `${url}:${port}/channel/invite/v2`, {
    token: token1,
    channlId: channelId,
    uId: authUserId2,
  });
  request(
    "POST",
    `${url}:${port}/channel/addowner/v1`,
    {
      token: token1,
      channelID: channelId+1,
      uId: authUserId2,
    }
  );
  let removeRes = request("POST", `${url}:${port}/channel/removeowner/v1`, {
    token: token2,
    channelID: channelId + 1,
    uId: authUserId1,
  });
  let { error } = JSON.parse(removeRes);
  expect(error).toEqual(expect.any(String));
});

test("error user not a part of channel ", () => {
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
  let { authUserId: authUserId2 } = JSON.parse(loginRes2.body);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    token: token1,
    name: "sampleChannel",
    isPublic: true,
  });
  let { channelId } = JSON.parse(channelCreateRes);

  let removeRes = request("POST", `${url}:${port}/channel/removeowner/v1`, {
    token: token1,
    channelID: channelId,
    uId: authUserId2,
  });

  let { error } = JSON.parse(removeRes);
  expect(error).toEqual(expect.any(String));
});


test("error uId is not an owner ", () => {
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

  let loginRes1 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let loginRes2 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });

  let { token: token1 } = JSON.parse(loginRes1.body);
  let { authUserId: authUserId2 } = JSON.parse(loginRes2.body);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    token: token1,
    name: "sampleChannel",
    isPublic: true,
  });
  let { channelId } = JSON.parse(channelCreateRes);
  request("POST", `${url}:${port}/channel/invite/v2`, {
    token: token1,
    channlId: channelId,
    uId: authUserId2,
  });
  let removeRes = request("POST", `${url}:${port}/channel/removeowner/v1`, {
    token: token1,
    channelID: channelId,
    uId: authUserId2,
  });
  let {error} = JSON.parse(removeRes);
  expect(error).toEqual(expect.any(String))
});

test("error user doesn't have owner permission ", () => {
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
      email: "oliverlu@gmail.com",
      password: "cl3cl3vul44",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwluu@gmail.com",
      password: "cl3cl3vul444",
      nameFirst: "Oliver",
      nameLast: "Lu",
    },
  });
  let loginRes = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
  });
  let loginRes2 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverlu@gmail.com", password: "cl3cl3vul44" },
  });
  let loginRes3 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: { email: "oliverwluu@gmail.com", password: "cl3cl3vul444" },
  });
  let { token: token1, authUserId: authUserId1 } = JSON.parse(loginRes.body);
  let { token: token2, authUserId: authUserId2 } = JSON.parse(loginRes2.body);
  let { token: token3, authUserId: authUserId3 } = JSON.parse(loginRes3.body);
  let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
    token: token1,
    name: "sampleChannel",
    isPublic: true,
  });
  let { channelId } = JSON.parse(channelCreateRes);
  request("POST", `${url}:${port}/channel/invite/v2`, {
    token: token1,
    channlId: channelId,
    uId: authUserId2,
  });

  request("POST", `${url}:${port}/channel/invite/v2`, {
    token: token1,
    channlId: channelId,
    uId: authUserId3,
  });

  request(
    "POST",
    `${url}:${port}/channel/addowner/v1`,
    {
      token: token1,
      channelID: channelId,
      uId: authUserId2,
    }
  );

  let removeRes = request("POST", `${url}:${port}/channel/removeowner/v1`, {
    token: token3,
    channelID: channelId,
    uId: authUserId1,
  });
  let {error} = JSON.parse(removeRes);
  expect(error).toEqual(expect.any(String))
});

test("error uId is the only owner ", () => {
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
  
    let loginRes1 = request("POST", `${url}:${port}/auth/login/v2`, {
      json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
    });
    let loginRes2 = request("POST", `${url}:${port}/auth/login/v2`, {
      json: { email: "oliverwlu@gmail.com", password: "cl3cl3vul4" },
    });
  
    let { token: token1 } = JSON.parse(loginRes1.body);
    let { authUserId: authUserId2 } = JSON.parse(loginRes2.body);
    let channelCreateRes = request("POST", `${url}:${port}/channels/create/v2`, {
      token: token1,
      name: "sampleChannel",
      isPublic: true,
    });
    let { channelId } = JSON.parse(channelCreateRes);
    request("POST", `${url}:${port}/channel/invite/v2`, {
      token: token1,
      channlId: channelId,
      uId: authUserId2,
    });
    let removeRes = request("POST", `${url}:${port}/channel/removeowner/v1`, {
      token: token1,
      channelID: channelId,
      uId: authUserId1,
    });
    let {error} = JSON.parse(removeRes);
    expect(error).toEqual(expect.any(String))
  });
  
