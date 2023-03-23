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
  const auth = data.tokens.find(item => item.token === token);
  if (auth === undefined) {
    return {error: "Invalid token"}; 
  }
  let authUserId = auth.uId;
  // checks if the channelId is valid
  const channel = data.channels.find(element => element.channelId === channelId);
  if (channel === undefined) {
    return {error: "Invalid channelId"}; 
  }
  if (!channel.allMembers.includes(authUserId)) {
    return {error: "User is not a member of the channel"};
  }

  const owners = memberObject(channel.ownerMembers);
  const members = memberObject(channel.allMembers);
  return {
    name: channel.name,
    isPublic: channel.isPublic,
    ownerMembers: owners,
    allMembers: members,
  };
}
// Helper function
function memberObject(array: number[]) {
  const result = [];
  for (const userId of array) {
    const token = String(userId);
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
  // Checks if the token is valid.
  let validToken = false;
  let uId;
  for (let tokenId of data.tokens) {
    if (token === tokenId.token) {
      validToken = true;
      uId = tokenId.uId;
    }
  }

  if (!validToken) {
    return { error: "Invalid Id" };
  }

  let userDetail;
  for (const user of data.users) {
    if (user.uId === uId) {
      userDetail = user;
    }
  }

  // checks if the channelId is valid
  let channelDetail;
  for (let channel of data.channels) {
    if (channel.channelId === channelId) {
      channelDetail = channel;
    }
  }
  if (channelDetail === undefined) {
    return { error: "Channel does not exist" };
  }
  // checks if the channel is public
  if (channelDetail.isPublic === false) {
    // check authuser permissions
    if (userDetail.globalPerm === 2) {
      return { error: "Channel is private and authUser is not a global owner" };
    }
  }

  // checks if the user is already a member of the channel
  if (channelDetail.allMembers.includes(uId)) {
    return { error: "User is already a member" };
  }

  // Add member to channe
  channelDetail.allMembers.push(uId);
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
export function channelMessagesV1(
  authUserId: number,
  channelId: number,
  start: number
) {
  const data = getData();
  let validChannel = false;
  let channelInfo;

  // ERROR CHECKING
  // Check if channelId refers to a valid channel
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      validChannel = true;
      channelInfo = channel;
    }
  }

  if (validChannel === false) {
    return {
      error: "error",
    };
  }

  // Check if authUserId refers to a valid user
  let validAuthuserId = false;
  for (const user of data.users) {
    if (user.uId === authUserId) {
      validAuthuserId = true;
    }
  }

  if (validAuthuserId === false) {
    return {
      error: "error",
    };
  }
  // Checking if authuserId is a member of the given channel
  let isMember = false;
  for (const member of channelInfo.allMembers) {
    if (member === authUserId) {
      isMember = true;
    }
  }
  if (isMember === false) {
    return {
      error: "error",
    };
  }

  // Check if starting index is not greater than the total number
  // of messages in the channel
  if (start > channelInfo.messages.length) {
    return {
      error: "error",
    };
  }

  if (start === 0 && channelInfo.messages.length === 0) {
    return {
      messages: [],
      start: 0,
      end: -1,
    };
  }

  // checks if start is at the end
  if (start === channelInfo.messages.length) {
    return {
      messages: channelInfo.messages[channelInfo.messages.length - 1],
      start: start,
      end: -1,
    };
  }
  let messagesArray = [];
  let newEnd;

  for (let i = start; i < start + 50; i++) {
    if (i === channelInfo.messages.length - 1) {
      newEnd = -1;
      messagesArray.push(channelInfo.messages[i]);
      break;
    }
    messagesArray.push(channelInfo.messages[i]);
  }

  if (newEnd !== -1) {
    newEnd = start + 50;
  }
  return {
    messages: messagesArray,
    start: start,
    end: newEnd,
  };
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

  if (!channel.ownerMembers.includes(ownerAdded)) {
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
  if (index > -1) {
    channel.ownerMembers.splice(index, 1);
  }

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
  if (index > -1) {
    channel.allMembers.splice(index, 1);
  }

  if (channel.ownerMembers.includes(userId)) {
    const index = channel.ownerMembers.indexOf(userId);
    if (index > -1) {
      channel.ownerMembers.splice(index, 1);
    }
  }

  setData(data);
  return {};
}
