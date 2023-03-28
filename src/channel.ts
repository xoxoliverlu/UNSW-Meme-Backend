import { getData, setData } from "./dataStore";
import { userProfileV2 } from "./users";

/**
 * Given an uId and a channelId, the function
 * prints out basic information about the channel.
 *
 * @param {token} string - token of current user.
 * @param {number} channelId - Unique identifier for a valid channel.
 * ...
 *
 * @returns {object} - error if channelId or uId is invalid,
 *                     error if the user is not a member of the channel.
 *
 * @returns {string} - name of the channel.
 * @returns {boolean} - whether the channel is public or private.
 * @returns {array} - List of owner members of the channel.
 * @returns {array} - List of all members of the channel.
 */
export function channelDetailsV2(token: string, channelId: number) {
  const data = getData();
  // Checks if the token and userId is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };
  let authUserId = auth.uId;
  // checks if the channelId is valid
  const channel = data.channels.find(element => element.channelId === channelId);
  if (channel === undefined) return {error: "Invalid channelId"}; 

  if (!channel.allMembers.includes(authUserId)) return {error: "User is not a member of the channel"};

  const owners = memberObject(token, channel.ownerMembers);
  const members = memberObject(token, channel.allMembers);

  return {
    name: channel.name,
    isPublic: channel.isPublic,
    ownerMembers: owners,
    allMembers: members,
  };
}


// Helper function
function memberObject(token: string, users: number[]) {
  const result = [];
  for (const userId of users) {
    const user = userProfileV2(token, userId);
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
/**
 * Given an uId and a channelId, the function
 * adds the user to the channel if it is public.
 *
 * @param {token} string - token of current user.
 * @param {number} channelId - Unique identifier for a valid channel.
 * ...
 *
 * @returns {object} - error if channelId or uId is invalid,
 *                     error if the user is already a member of the channel.
 *                     error if the channel is private.
 *
 * @returns {} - returns nothing if there is no errors.
 */
export function channelJoinV2(token: string, channelId: number) {
  const data = getData();
  // Checks if the token and userId is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };
  let authUserId = auth.uId;
  const userDetail = data.users.find((element) => element.uId === authUserId);
  // checks if the channelId is valid
  const channel = data.channels.find(element => element.channelId === channelId);
  if (channel === undefined) return {error: "Invalid channelId"};
  // checks if the channel is public
  if (channel.isPublic === false) {
    // check authuser permissions
    if (userDetail.globalPerm === 2) {
      return { error: "Channel is private and authUser is not a global owner" };
    }
  }
  // checks if the user is already a member of the channel
  if (channel.allMembers.includes(authUserId)) return { error: "User is already a member" };
  // Add member to channel
  channel.allMembers.push(authUserId);
  setData(data);

  return {};
}
/**
 * Invites a user with ID UId to join a channel with Id channelId
 * Once they are invited, the user is added to the channel immediately
 * Both public and private channels - all members are able to invite users
 * @param {token} string - token of current user
 * @param {channelId} number - name of the channel
 * @param {uId} number - Id of the person being invited to channel
 * ...
 *
 * @returns {}
 * @returns {object} - error if any of the Id's are invalid
 */
export function channelInviteV1(token: string, channelId: number, uId:number) {
  const data = getData();
  const authUser = data.tokens.find(item => item.token === token);
  if (authUser === undefined) return { error: 'token is invalid' };
  let authuserId = authUser.uId;

  const channelIndex = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) return { error: 'channelId is not valid' };

  const uIdIndex = data.users.findIndex((u) => u.uId === uId);
  if (uIdIndex < 0) return { error: 'uId is not valid' };

  const UIdInChannel = data.channels[channelIndex].allMembers.includes(uId);
  if (UIdInChannel) return { error: 'uId is already in channel' };

  const authInChannel = data.channels[channelIndex].allMembers.includes(authuserId);
  if (!authInChannel) return { error: 'authUserId is not in the channel' };


  data.channels[channelIndex].allMembers.push(uId);
  setData(data);
  return {};
}
/**
 * For a valid user and channel, returns up to 50 messages from a given start point
 * - if there are more messages after start + 50, will return end index
 * - no messages: end equals to -1 to indicate no new messages to load
 * @param {token} string - token of current user
 * @param {channelId} number - chanel being inspected
 * @param {start} number - starting message index, inclusive
 * ...
 *
 * @returns {messages: Array<messages>} - array of messages
 * @returns {start: number} - start message index
 * @returns {end: number} - end message index
 * @returns {object} - error if user id and channelid are invalid or start index is > 50
 */
export function channelMessagesV1(token: string, channelId: number, start: number) {
  const data = getData();
  const authUser = data.tokens.find(item => item.token === token);
  if (authUser === undefined) return { error: 'token is invalid' };
 let authUserId = authUser.uId;

  const channelIndex = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) return { error: 'channelId is not valid' };

  const inChannel = data.channels[channelIndex].allMembers.some((m) => m.uId === authUserId);
  if (!inChannel) return { error: 'user is not a member in the channel' };

  const numberOfMessages = data.channels[channelIndex].messages.length;

  if (start > numberOfMessages) {
    return {
      error: 'start parameter is greater than the total number of messages'
    };
  }

  let end: number;
  if (numberOfMessages > start + 50) {
    end = start + 50;
  } else if (numberOfMessages === 0 || numberOfMessages <= start + 50) {
    end = -1;
  }
  const reversed = data.channels[channelIndex].messages.slice().reverse();
  const messages =
  reversed.slice(start, start + 50)
    .map((m) => ({
      messageId: m.messageId,
      uId: m.uId,
      message: m.message,
      timeSent: m.timeSent
    }));
  setData(data);
  return { messages, end, start };
}


export function channelAddOwnerV1(
  token: String,
  channelId: number,
  uId: number
) {
  const data = getData();
  let user = data.tokens.find((item) => item.token == token);

  if (user === undefined) {
    return { error: "invalid token" };
  }

  let channel = data.channels.find((item) => item.channelId === channelId);
  if (channel === undefined) {
    return { error: "no channel found" };
  }

  let ownerAddedData = data.users.find((item) => item.uId === uId);
  if (ownerAddedData === undefined) {
    return { error: "invalid uId" };
  }

  let { uId: ownerAdded } = ownerAddedData;

  if (!channel.allMembers.includes(ownerAdded)) {
    return { error: "user to be added is not a member of the channel" };
  }

  if (channel.ownerMembers.includes(ownerAdded)) {
    return { error: "user is already an owner" };
  }

  if (!channel.ownerMembers.includes(user.uId)) {
    return { error: "This user does not have permission to add owners." };
  }

  channel.ownerMembers.push(uId);
  return {};
}

export function channelRemoveOwnerV1(
  token: String,
  channelId: number,
  uId: number
) {
  const data = getData();
  let user = data.tokens.find((item) => item.token === token);

  if (user === undefined) {
    return { error: "invalid token" };
  }
  let { uId: userId } = user;

  let channel = data.channels.find((item) => item.channelId === channelId);
  if (channel === undefined) {
    return { error: "no channel found" };
  }

  let ownerRemovedData = data.users.find((item) => item.uId === uId);
  if (ownerRemovedData === undefined) {
    return { error: "invalid uId" };
  }
  let { uId: ownerRemoved } = ownerRemovedData;

  if (!channel.allMembers.includes(ownerRemoved)) {
    return { error: "user to be added is not a member of the channel" };
  }

  if (!channel.ownerMembers.includes(ownerRemoved)) {
    return { error: "user is not an owner of this channel." };
  }

  if (
    channel.ownerMembers.includes(ownerRemoved) &&
    channel.ownerMembers.length === 1
  ) {
    return { error: "user is the only owner of this channel." };
  }

  if (!channel.ownerMembers.includes(userId)) {
    return { error: "This user does not have permission to add owners." };
  }

  const index = channel.ownerMembers.indexOf(userId);
  channel.ownerMembers.splice(index, 1);
  
  setData(data);
  return {};
}

export function channelLeaveV1(token: String, channelId: number) {
  const data = getData();
  let user = data.tokens.find((item) => item.token === token);

  if (user === undefined) {
    return { error: "invalid token" };
  }
  let { uId: userId } = user;

  let channel = data.channels.find((item) => item.channelId === channelId);
  if (channel === undefined) {
    return { error: "no channel found" };
  }

  if (!channel.allMembers.includes(userId)) {
    return { error: "user to be remove is not a member of the channel" };
  }

  let index = channel.ownerMembers.indexOf(userId);
  channel.allMembers.splice(index, 1);
  

  if (channel.ownerMembers.includes(userId)) {
    const index = channel.ownerMembers.indexOf(userId);
    channel.ownerMembers.splice(index, 1); 
  }

  setData(data);
  return {};
}
