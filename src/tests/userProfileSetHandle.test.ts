import { authRegisterV1 } from "../auth";
import { clearV1 } from "../other";
import { userProfileSetHandleV1 } from "../users";

beforeEach(() => {
  clearV1();
});

describe("Invalid userProfileSetHandleV1 tests.", () => {
  test("Invalid handleStr length.", () => {
    const user1 = authRegisterV1("fadyS@gmail.com", "password", "Fady", "Sadek");
    const userSetHandle1 = userProfileSetHandleV1("token", "  ");
    const user2 = authRegisterV1("fadyS@gmail.com", "password", "Fady", "Sadek");
    const userSetHandle2 = userProfileSetHandleV1("token", "qwertyuiopasdfghjklzx");
    expect(userSetHandle1).toEqual({ error: expect.any(String) });
    expect(userSetHandle2).toEqual({ error: expect.any(String) });
  });
  test("Invalid handleStr.", () => {
    const user = authRegisterV1("fadyS@gmail.com", "password", "Fady", "Sadek");
    const userSetHandle = userProfileSetHandleV1("token", "Fady!@#");
    expect(userSetHandle).toEqual({ error: expect.any(String) });
  });
  test("handleStr already in use.", () => {
    const user1 = authRegisterV1("fadyS@gmail.com", "password", "Fady", "Sadek");
    const user2 = authRegisterV1('SimonM@gmail.com', 'pass123', 'Simon', 'Minter');
    const userSetHandle = userProfileSetHandleV1("token", "simonminter");
    expect(userSetEmail).toEqual({ error: expect.any(String) });
  });
});

test("Successful userProfileSetHandleV1 Test.", () => {
  const user = authRegisterV1("fadyS@gmail.com", "password", "Fady", "Sadek");
  const userSetHandle = userProfileSetHandleV1("token", "FadyS");
  expect(user.handleStr).toEqual("FadyS");
});
