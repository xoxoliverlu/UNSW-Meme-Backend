import { port, url } from "./config.json";
const request = require("sync-request");

const OK = 200;

beforeEach(() => {
  request("DELETE", `${url}:${port}/clear/v1`);
});

test("success channel details", () => {
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

  let { dmId } = request("POST", `${url}:${port}/dm/create/v1`, {
    json: { token: token1, authUserId2 },
  });

  let dmDetailsRes = request("GET", `${url}:${port}/dm/details/v1`, {
    qs: { token: token1, dmId: dmId },
  });
  expect(dmDetailsRes.statusCode).toBe(OK);
  let {name, members} = JSON.parse(dmDetailsRes);
  expect(name).toEqual(expect.any(String));
  expect(members).toEqual([authUserId2])
});

test("error invalid dm id", () => {
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

  let { dmId } = request("POST", `${url}:${port}/dm/create/v1`, {
    json: { token: token1, authUserId2 },
  });

  let dmDetailsRes = request("GET", `${url}:${port}/dm/details/v1`, {
    qs: { token: token1, dmId: dmId+1 },
  });
  expect(dmDetailsRes.statusCode).toBe(400);
  let {error} = JSON.parse(dmDetailsRes);
  expect(error).toEqual(expect.any(String));
})

test("error auth user not member of dm", () => {
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
  request("POST", `${url}:${port}/auth/register/v2`, {
    json: {
      email: "oliverwluuu@gmail.com",
      password: "cl3cl3vul444",
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
  let loginRes3 = request("POST", `${url}:${port}/auth/login/v2`, {
    json: {email: "oliverwluuu@gmail.com", passwrod: "cl3cl3vul444"}
  })

  let { token: token1, authUserId: authUserId1 } = JSON.parse(loginRes.body);
  let { token: token2, authUserId: authUserId2 } = JSON.parse(loginRes2.body);
  let { token: token3, authUserId: authUserId3 } = JSON.parse(loginRes3.body);

  let { dmId } = request("POST", `${url}:${port}/dm/create/v1`, {
    json: { token: token1, authUserId2 },
  });

  let dmDetailsRes = request("GET", `${url}:${port}/dm/details/v1`, {
    qs: { token: token3, dmId: dmId },
  });
  expect(dmDetailsRes.statusCode).toBe(400);
  let {error} = JSON.parse(dmDetailsRes);
  expect(error).toEqual(expect.any(String));
})

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

  let { token: token1, authUserId: authUserId1 } = JSON.parse(loginRes.body);
  let { token: token2, authUserId: authUserId2 } = JSON.parse(loginRes2.body);

  let { dmId } = request("POST", `${url}:${port}/dm/create/v1`, {
    json: { token: token1, authUserId2 },
  });

  let dmDetailsRes = request("GET", `${url}:${port}/dm/details/v1`, {
    qs: { token: token2 + "error", dmId: dmId },
  });

  expect(dmDetailsRes.statusCode).toBe(400);
  let {error} = JSON.parse(dmDetailsRes);
  expect(error).toEqual(expect.any(String));
})

