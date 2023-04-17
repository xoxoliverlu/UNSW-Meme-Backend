import { getData  } from './dataStore';
import { userProfileV3 } from './users';

export function validUserId(id: number) {
  const data = getData();
  const found = data.users.find(item => item.uId === id);
  if (found) {
    return {
      user: found,
      validUserId: true,
    };
  }
  return {
    user: found,
    validUserId: false
  };
}
/*
* This function creates an array of objects of all the users
* that are in the members/owners array. It takes each uId and
* returns basic information about the user.
*/
export function memberObject(token: string, users: number[]) {
  const result = [];
  for (const userId of users) {
    const user = userProfileV3(token, userId);
    result.push({
      uId: user.user.uId,
      nameFirst: user.user.nameFirst,
      nameLast: user.user.nameLast,
      email: user.user.email,
      handleStr: user.user.handleStr,
    });
  }
  return result;
}


