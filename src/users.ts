import { getData, setData } from "./dataStore";
// import { Profile } from './interfaces';

export function userProfileV2(token : string, uId : number) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find(item => item.token === token);
  if (auth === undefined) return {error: "Invalid token"};
   // Checks if the uId is valid.
  const userInfo = data.users.find(element => element.uId === uId);
  if (userInfo === undefined) return {error: "Invalid uId"};

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

export function usersAllV1(token : string) {
  const data = getData();
  // Checks if the token and userId is valid.
  const auth = data.tokens.find(item => item.token === token);
  if (auth === undefined) return {error: "Invalid token"};
  // Create an array of user objects.
  const resultUsers = [];
  for (let user of data.users) {
    resultUsers.push({
      uId: user.uId, 
      email: user.email, 
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    });
  }

  return { users: { resultUsers } };
}