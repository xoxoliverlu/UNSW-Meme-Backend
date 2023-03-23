import { getData, setData } from "./dataStore";
// import { Profile } from './interfaces';

export function userProfileV2(token : string, uId : number) {
  const data = getData();
  // Checks if the token and userId is valid.
  const auth = data.tokens.find(item => item.token === token);
  if (auth === undefined) {
    return {error: "Invalid token"}; 
  }
  const userInfo = data.users.find(element => element.uId === uId);
  if (userInfo === undefined) {
    return {error: "Invalid uId"}; 
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