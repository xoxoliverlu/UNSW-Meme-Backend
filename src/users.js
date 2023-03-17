import { getData, setData } from "./dataStore.js";

export function userProfileV1(authUserId, uId) {
  const data = getData();
  // Checks if authUserId and userId is valid
  let validAuthId = false;
  let validUserId = false;
  let userInfo;
  for (let user of data.users) {
    if (user.uId === authUserId) {
      validAuthId = true;
    }
    if (user.uId === uId) {
      validUserId = true;
      userInfo = user;
    }
  }

  if (!validAuthId || !validUserId) {
    return { error: "Invalid Id" };
  }

  return {
    user: {
      uId: userInfo.uId,
      nameFirst: userInfo.nameFirst,
      nameLast: userInfo.nameLast,
      email: userInfo.email,
      handleStr: userInfo.handleStr,
    }
  };
}
