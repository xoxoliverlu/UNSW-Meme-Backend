import { requestAuthRegister, requestClear , requestUserProfileSetHandle, requestUserProfile } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe("Invalid userProfileSetHandleV1 tests.", () => {
  test("Invalid token.", () => {
    const user = requestAuthRegister("fadyS@gmail.com", "password", "Fady", "Sadek");
    const userSetHandle = requestUserProfileSetHandle(user.token + 1, "FadyS");
    expect(userSetHandle).toEqual({ error: expect.any(String) });
  });
  test("Invalid handleStr length.", () => {
    const user1 = requestAuthRegister("fadyS@gmail.com", "password", "Fady", "Sadek");
    const userSetHandle1 = requestUserProfileSetHandle(user1.token, "    ");
    const user2 = requestAuthRegister("f.s@gmail.com", "password", "Fady", "Sadek");
    const userSetHandle2 = requestUserProfileSetHandle(user2.token, "qwertyuiopasdfghjklzxcvbnm");
    expect(userSetHandle1).toEqual({ error: expect.any(String) });
    expect(userSetHandle2).toEqual({ error: expect.any(String) });
  });
  test("Invalid handleStr.", () => {
    const user = requestAuthRegister("fadyS@gmail.com", "password", "Fady", "Sadek");
    const userSetHandle = requestUserProfileSetHandle(user.token, "Fady!@#");
    expect(userSetHandle).toEqual({ error: expect.any(String) });
  });
  test("handleStr already in use.", () => {
    const user1 = requestAuthRegister("fadyS@gmail.com", "password", "Fady", "Sadek");
    const user2 = requestAuthRegister('SimonM@gmail.com', 'pass123', 'Simon', 'Minter');
    const userSetHandle = requestUserProfileSetHandle(user1.token, "simonminter");
    expect(userSetHandle).toEqual({ error: expect.any(String) });
  });
});

test("Successful requestUserProfileSetHandle Test.", () => {
  const user = requestAuthRegister("fadyS@gmail.com", "password", "Fady", "Sadek");
  const userSetHandle = requestUserProfileSetHandle(user.token, "FadyS");
  const userProfile = requestUserProfile(user.token, user.authUserId);
  expect(userSetHandle).toEqual({});
  expect(userProfile.user.handleStr).toEqual("FadyS");
});

test("Setting to the same handleStr.", () => {
  const user = requestAuthRegister("fadyS@gmail.com", "password", "Fady", "Sadek");
  const userSetHandle = requestUserProfileSetHandle(user.token, "fadysadek");
  expect(userSetHandle).toEqual({});
});