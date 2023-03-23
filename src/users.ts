import { getData, setData } from "./dataStore";
// import { Profile } from './interfaces';

export function userProfileV2(token : string, uId : number) {
  const data = getData();
  // Checks if the token and userId is valid.
  let validToken = false;
  let uId;
  for (let tokenId of data.tokens) {
    if (token === tokenId.token) {
      validToken = true;
      uId = tokenId.uId;
    }
  }

  let validUserId = false;
  let userInfo;
  for (let user of data.users) {
    if (user.uId === uId) {
      validUserId = true;
      userInfo = user;
    }
  }

  if (!validToken || !validUserId) {
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