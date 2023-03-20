import { authRegisterV1 } from "../auth.js";
import { clearV1 } from "../other.js";
import { userProfileSetEmailV1 } from "../users.js";

beforeEach(() => {
  clearV1();
});

describe("Invalid userProfileSetEmailV1 tests.", () => {
  test("Invalid email", () => {
    const user = authRegisterV1("fadyS@gmail.com", "password", "Fady", "Sadek");
    const userSetEmail = userProfileSetEmailV1("token", "invalid@email");
    expect(userSetEmail).toEqual({ error: expect.any(String) });
  });
  test("email already in use.", () => {
    const user1 = authRegisterV1("fadyS@gmail.com", "password", "Fady", "Sadek");
    const user2 = authRegisterV1("fady.s04@gmail.com", "123456", "Fady", "Sadek");
    const userSetEmail = userProfileSetEmailV1("token", "fady.s04@gmail.com");
    expect(userSetEmail).toEqual({ error: expect.any(String) });
  });
});

test("Successful userProfileSetEmailV1 Test.", () => {
  const user = authRegisterV1("fadyS@gmail.com", "password", "Fady", "Sadek");
  const userSetEmail = userProfileSetEmailV1("token", "fady.s04@gmail.com");
  expect(user.email).toEqual("fady.s04@gmail.com");
});
