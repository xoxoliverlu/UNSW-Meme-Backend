import { dbGetData } from './dataStore';
import { memberObject } from './helper';
import { countUserChannels } from './helper';
import HTTPError from 'http-errors';
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
export async function channelDetailsV3(token: string, channelId: number) {
  const data = await dbGetData();
  // Checks if the token is valid.
  const auth = data.tokens.find(item => item.token === token);
  if (!auth) {
    throw HTTPError(403, 'Invalid Token.');
  }
  const authUserId = auth.uId;
  // checks if the channelId is valid
  const channel = data.channels.find(element => element.channelId === channelId);
  console.log(channel);
  if (!channel) {
    throw HTTPError(400, 'Invalid channelId.');
  }
  // Checks if the user is a member of the channel.
  if (!channel.allMembers.includes(authUserId)) {
    throw HTTPError(403, 'User is not a member of the channel.');
  }
  // Creates arrays using the helper function.
  const owners = await memberObject(token, channel.ownerMembers);
  const members = await memberObject(token, channel.allMembers);

  return {
    name: channel.name,
    isPublic: channel.isPublic,
    ownerMembers: owners,
    allMembers: members,
  };
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
 *                     error if the channel is private and the user is not a global owner.
 *
 * @returns {} - returns nothing if there is no errors.
 */
export async function channelJoinV3(token: string, channelId: number) {
  const data = await dbGetData();
  // Checks if the token and userId is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (!auth) {
    throw HTTPError(403, 'Invalid Token.');
  }
  const authUserId = auth.uId;
  const userDetail = data.users.find((element) => element.uId === authUserId);
  // checks if the channelId is valid
  const channel = data.channels.find(element => element.channelId === channelId);
  if (!channel) {
    throw HTTPError(400, 'Invalid channelId.');
  }
  // checks if the channel is public
  if (channel.isPublic === false) {
    // check authuser permissions
    if (userDetail.globalPerm === 2) {
      throw HTTPError(403, 'Channel is private and authUser is not a global owner');
    }
  }
  // checks if the user is already a member of the channel
  if (channel.allMembers.includes(authUserId)) {
    throw HTTPError(400, 'User is already a member');
  }
  // Add member to channel
  channel.allMembers.push(authUserId);
  await data.save();
  const statIndex = data.channelStats.findIndex(item => item.uId === authUserId);
  data.channelStats[statIndex].stat.push({ numChannelsJoined: countUserChannels(authUserId), timeStamp: Date.now() });
  await data.save();
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
export async function channelInviteV1(token: string, channelId: number, uId: number) {
  const data = await dbGetData();
  // Check for valid token
  const authUser = data.tokens.find(item => item.token === token);
  if (authUser === undefined) return { error: 'token is invalid' };
  const authuserId = authUser.uId;

  // Valid channelId
  const channelIndex = data.channels.findIndex((c) => c.channelId === channelId);
  if (channelIndex < 0) return { error: 'channelId is not valid' };

  // uId valid check
  const uIdIndex = data.users.findIndex((u) => u.uId === uId);
  if (uIdIndex < 0) return { error: 'uId is not valid' };

  // Check if user is already in the channel
  const UIdInChannel = data.channels[channelIndex].allMembers.includes(uId);
  if (UIdInChannel) return { error: 'uId is already in channel' };

  // Check for authUser in channel
  const authInChannel = data.channels[channelIndex].allMembers.includes(authuserId);
  if (!authInChannel) return { error: 'authUserId is not in the channel' };

  data.channels[channelIndex].allMembers.push(uId);
  data.save();
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
export async function channelMessagesV1(token: string, channelId: number, start: number) {
  const data = await dbGetData();
  // Check for valid token
  const authUser = data.tokens.find(item => item.token === token);
  if (!authUser) {
    throw HTTPError(403, 'Invalid Token');
  }
  const authUserId = authUser.uId;
  // Check for valid channelId
  const channel = data.channels.find((c) => c.channelId === channelId);
  if (!channel) {
    throw HTTPError(400, 'Invalid Channel Id');
  }

  if (!channel.allMembers.includes(authUserId)) {
    throw HTTPError(403, 'User is not a member of the channel');
  }

  const numberOfMessages = channel.messages.length;

  if (start > numberOfMessages) {
    throw HTTPError(400, 'Start is invalid');
  }

  let end: number;
  if (numberOfMessages > start + 50) {
    end = start + 50;
  } else if (numberOfMessages === 0 || numberOfMessages <= start + 50) {
    end = -1;
  }
  const reversed = channel.messages.slice().reverse();
  const messages =
    reversed.slice(start, start + 50)
      .map((m) => ({
        messageId: m.messageId,
        uId: m.uId,
        message: m.message,
        timeSent: m.timeSent
      }));
  await data.save();
  return { messages, end, start };
}

/**
 * Make user with user id uId an owner of the channel.
 * @param {token}  - token of current user
 * @param {channelId} number - chanel being inspected
 * @param {uId} number - owner to be added
 * ...
 *
 * @returns {} - empty object on success
 * @returns {error: String} - error if user id and channelid are invalid
 */
export async function channelAddOwnerV2(
  token: string,
  channelId: number,
  uId: number
) {
  // Check for valid token
  const data = await dbGetData();
  const user = data.tokens.find((item) => item.token === token);

  if (!user) {
    throw HTTPError(403, 'Email does not exist.');
  }

  const userInfo = data.users.find((element) => element.uId === user.uId);
  // check for channel
  const channel = data.channels.find((item) => item.channelId === channelId);
  if (!channel) {
    throw HTTPError(400, 'Channel does not exist.');
  }

  // Valid uId
  const ownerAddedData = data.users.find((item) => item.uId === uId);
  if (!ownerAddedData) {
    throw HTTPError(400, 'user to be added does not exist.');
  }

  const { uId: ownerAdded } = ownerAddedData;

  if (!channel.allMembers.includes(ownerAdded)) {
    throw HTTPError(400, 'This user is not in this channel.');
  }

  if (channel.ownerMembers.includes(ownerAdded)) {
    throw HTTPError(400, 'This user is already an owner');
  }

  if (!channel.ownerMembers.includes(user.uId)) {
    if (userInfo.globalPerm === 2) {
      throw HTTPError(403, 'This user does not have permission.');
    }
  }

  channel.ownerMembers.push(uId);

  await data.save();
  return {};
}

/**
 * Remove user with uId from the owners of the channel.
 * @param {token}  - token of current user
 * @param {channelId} number - chanel being inspected
 * @param {uId} number - owner to be removed
 * ...
 *
 * @returns {} - empty object on success
 * @returns {error: String} - error if user id and channelid are invalid
 */
export async function channelRemoveOwnerV2(
  token: string,
  channelId: number,
  uId: number
) {
  // Valid token
  const data = await dbGetData();
  const user = data.tokens.find((item) => item.token === token);

  if (!user) {
    throw HTTPError(403, 'Email does not exist.');
  }

  const userInfo = data.users.find((element) => element.uId === user.uId);
  // Channel error check
  const channel = data.channels.find((item) => item.channelId === channelId);
  if (!channel) {
    throw HTTPError(400, 'Channel does not exist.');
  }

  // Error checking
  const ownerRemovedData = data.users.find((item) => item.uId === uId);
  if (!ownerRemovedData) {
    throw HTTPError(400, 'owner to be removed does not exist');
  }
  const { uId: ownerRemoved } = ownerRemovedData;

  if (!channel.allMembers.includes(ownerRemoved)) {
    throw HTTPError(400, 'owner to be removed does not exist');
  }

  if (!channel.ownerMembers.includes(ownerRemoved)) {
    throw HTTPError(400, 'owner is not part of channel');
  }

  if (
    channel.ownerMembers.includes(ownerRemoved) &&
    channel.ownerMembers.length === 1
  ) {
    throw HTTPError(400, 'user is the only owner');
  }

  if (!channel.ownerMembers.includes(uId)) {
    if (userInfo.globalPerm === 2) {
      throw HTTPError(403, 'user no permission');
    }
  }

  const index = channel.ownerMembers.indexOf(uId);
  channel.ownerMembers.splice(index, 1);

  await data.save();
  return {};
}

/**
 * Given a channel with ID channelId that the authorised user is a member of
 * remove them as a member of the channel.
 * @param {token}  - token of current user
 * @param {channelId} number - chanel being inspected
 * ...
 *
 * @returns {} - empty object on success
 * @returns {error: String} - error if token and channelid are invalid
 */
export async function channelLeaveV2(token: string, channelId: number) {
  const data = await dbGetData();
  const user = data.tokens.find((item) => item.token === token);

  // valid token
  if (!user) {
    throw HTTPError(403, 'Error token');
  }
  const { uId: userId } = user;
  // valid channel
  const channel = data.channels.find((item) => item.channelId === channelId);
  if (!channel) {
    throw HTTPError(400, 'no channel found');
  }

  if (!channel.allMembers.includes(userId)) {
    throw HTTPError(403, 'user not part of channel');
  }

  const index = channel.ownerMembers.indexOf(userId);
  channel.allMembers.splice(index, 1);

  if (channel.ownerMembers.includes(userId)) {
    const index = channel.ownerMembers.indexOf(userId);
    channel.ownerMembers.splice(index, 1);
  }

  await data.save();
  return {};
}
