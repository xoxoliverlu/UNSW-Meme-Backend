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


export function countUserChannels(uId: number): number{
  const data = getData();
  return data.channels.filter((channel) =>
    channel.allMembers.includes(uId)
  ).length;
}

export function countUserDms(uId: number): number{
  const data = getData();
  return data.dms.filter(
    (dm) => dm.uIds.includes(uId) || dm.ownerId === uId
  ).length;
}

export function countUserMessages(uId: number): number{
  const data = getData();
  let totalMsgSent = 0;
  data.channels.forEach((channel) => {
    channel.messages.forEach(message => {
      if (message.uId === uId){
        totalMsgSent++;
      }
    })
  })
  data.dms.forEach((dm) => {
    dm.messages.forEach(message => {
      if (message.uId === uId){
        totalMsgSent++;
      }
    })
  })
  return totalMsgSent;
}

export function countMessages(): number{
  const data = getData();
  let totalMsg = 0;
  data.channels.forEach((channel) => {
    channel.messages.forEach(message => {
      totalMsg++;
    })
  })
  data.dms.forEach((dm) => {
    dm.messages.forEach(message => {
      totalMsg++;
    })
  })
  return totalMsg;
}