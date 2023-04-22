import { getData } from "./dataStore";
import HTTPError from "http-errors";

export function userStatsV1(token: string) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (!auth) {
    throw HTTPError(403, "Invalid Token.");
  }
  const { uId } = auth;

  const totalChannels = data.channels.length;
  const totalDms = data.dms.length;
  let totalMsgs = 0;

  data.channels.forEach((channel) => {
    totalMsgs += channel.messages.length;
  });
  data.dms.forEach((dm) => {
    totalMsgs += dm.messages.length;
  });

  const channelsUserJoined = data.channels.filter((channel) =>
    channel.allMembers.includes(uId)
  ).length;
  const dmsUserJoined = data.dms.filter(
    (dm) => dm.uIds.includes(uId) || dm.ownerId === uId
  ).length;

  let totalMsgSent = 0;
  data.channels.forEach((channel) => {
    channel.messages.forEach((message) => {
      if (message.uId === uId) {
        totalMsgSent++;
      }
    });
  });
  data.dms.forEach((dm) => {
    dm.messages.forEach((message) => {
      if (message.uId === uId) {
        totalMsgSent++;
      }
    });
  });

  let involvementRate =
    (channelsUserJoined + dmsUserJoined + totalMsgSent) /
    (totalChannels + totalDms + totalMsgs);
  if (involvementRate > 1) {
    involvementRate = 1;
  }
  return {
    userStats: {
      channelsJoined: data.channelStats.find((user) => user.uId === uId).stat,
      dmsJoined: data.dmStats.find((user) => user.uId === uId).stat,
      messagesSent: data.messageStats.find((user) => user.uId === uId).stat,
      involvementRate,
    },
  };
}

export function usersStatsV1(token: string) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (!auth) {
    throw HTTPError(403, "Invalid Token.");
  }
  const { uId } = auth;

  const totalUsers = data.users.length;
  let numUsersActive = 0;
  data.users.forEach((user) => {
    if (
      data.channels.find((channel) => channel.allMembers.includes(uId)) ||
      data.dms.find((dm) => dm.ownerId === uId) ||
      data.dms.find((dm) => dm.uIds.includes(uId))
    ) {
      numUsersActive++;
    }
  });

  let utilizationRate = numUsersActive / totalUsers;
  if (utilizationRate > 1) {
    utilizationRate = 1;
  }
  return {
    workspaceStats: {
      channelsExist: data.channelsExistStat,
      dmsExist: data.dmsExistStat,
      messagesExist: data.msgsExistStat,
      utilizationRate,
    },
  };
}
