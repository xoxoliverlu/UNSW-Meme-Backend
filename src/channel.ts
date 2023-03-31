import { getData, setData } from './dataStore';
import { userProfileV2 } from './users';

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
    return { error: 'Invalid token' };
  }
  const authUserId = auth.uId;
  // checks if the channelId is valid
  const channel = data.channels.find(element => element.channelId === channelId);
  if (channel === undefined) return { error: 'Invalid channelId' };
  // Checks if the user is a member of the channel.
  if (!channel.allMembers.includes(authUserId)) return { error: 'User is not a member of the channel' };
  // Creates arrays using the helper function.
  const owners = memberObject(token, channel.ownerMembers);
  const members = memberObject(token, channel.allMembers);

  return {
    name: channel.name,
    isPublic: channel.isPublic,
    ownerMembers: owners,
    allMembers: members,
  };
}

/* Helper function
* This function creates an array of objects of all the users
* that are in the members/owners array. It takes each uId and
* returns basic information about the user.
*/
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
 *                     error if the channel is private and the user is not a global owner.
 *
 * @returns {} - returns nothing if there is no errors.
 */
export function channelJoinV2(token: string, channelId: number) {
  const data = getData();
  // Checks if the token and userId is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: 'Invalid token' };
  const authUserId = auth.uId;
  const userDetail = data.users.find((element) => element.uId === authUserId);
  // checks if the channelId is valid
  const channel = data.channels.find(element => element.channelId === channelId);
  if (channel === undefined) return { error: 'Invalid channelId' };
  // checks if the channel is public
  if (channel.isPublic === false) {
    // check authuser permissions
    if (userDetail.globalPerm === 2) {
      return { error: 'Channel is private and authUser is not a global owner' };
    }
  }
  // checks if the user is already a member of the channel
  if (channel.allMembers.includes(authUserId)) return { error: 'User is already a member' };
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
export function channelInviteV1(token: string, channelId: number, uId: number) {
  const data = getData();
  const authUser = data.tokens.find(item => item.token === token);
  if (authUser === undefined) return { error: 'token is invalid' };
  const authuserId = authUser.uId;

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
  const authUserId = authUser.uId;

  const channel = data.channels.find((c) => c.channelId === channelId);
  if (!channel) return { error: 'channelId is not valid' };

  if (!channel.allMembers.includes(authUserId)) return { error: 'user is not a member in the channel' };

  const numberOfMessages = channel.messages.length;

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
  const reversed = channel.messages.slice().reverse();
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
export function channelAddOwnerV1(
  token: string,
  channelId: number,
  uId: number
) {
  const data = getData();
  const user = data.tokens.find((item) => item.token === token);

  if (user === undefined) {
    return { error: 'invalid token' };
  }

  const channel = data.channels.find((item) => item.channelId === channelId);
  if (channel === undefined) {
    return { error: 'no channel found' };
  }

  const ownerAddedData = data.users.find((item) => item.uId === uId);
  if (ownerAddedData === undefined) {
    return { error: 'invalid uId' };
  }

  const { uId: ownerAdded } = ownerAddedData;

  if (!channel.allMembers.includes(ownerAdded)) {
    return { error: 'user to be added is not a member of the channel' };
  }

  if (channel.ownerMembers.includes(ownerAdded)) {
    return { error: 'user is already an owner' };
  }

  if (!channel.ownerMembers.includes(user.uId)) {
    return { error: 'This user does not have permission to add owners.' };
  }

  channel.ownerMembers.push(uId);
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
export function channelRemoveOwnerV1(
  token: string,
  channelId: number,
  uId: number
) {
  const data = getData();
  const user = data.tokens.find((item) => item.token === token);

  if (user === undefined) {
    return { error: 'invalid token' };
  }
  const { uId: userId } = user;

  const channel = data.channels.find((item) => item.channelId === channelId);
  if (channel === undefined) {
    return { error: 'no channel found' };
  }

  const ownerRemovedData = data.users.find((item) => item.uId === uId);
  if (ownerRemovedData === undefined) {
    return { error: 'invalid uId' };
  }
  const { uId: ownerRemoved } = ownerRemovedData;

  if (!channel.allMembers.includes(ownerRemoved)) {
    return { error: 'user to be added is not a member of the channel' };
  }

  if (!channel.ownerMembers.includes(ownerRemoved)) {
    return { error: 'user is not an owner of this channel.' };
  }

  if (
    channel.ownerMembers.includes(ownerRemoved) &&
    channel.ownerMembers.length === 1
  ) {
    return { error: 'user is the only owner of this channel.' };
  }

  if (!channel.ownerMembers.includes(userId)) {
    return { error: 'This user does not have permission to add owners.' };
  }

  const index = channel.ownerMembers.indexOf(userId);
  channel.ownerMembers.splice(index, 1);

  setData(data);
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
export function channelLeaveV1(token: string, channelId: number) {
  const data = getData();
  const user = data.tokens.find((item) => item.token === token);

  if (user === undefined) {
    return { error: 'invalid token' };
  }
  const { uId: userId } = user;

  const channel = data.channels.find((item) => item.channelId === channelId);
  if (channel === undefined) {
    return { error: 'no channel found' };
  }

  if (!channel.allMembers.includes(userId)) {
    return { error: 'user to be remove is not a member of the channel' };
  }

  const index = channel.ownerMembers.indexOf(userId);
  channel.allMembers.splice(index, 1);

  if (channel.ownerMembers.includes(userId)) {
    const index = channel.ownerMembers.indexOf(userId);
    channel.ownerMembers.splice(index, 1);
  }

  setData(data);
  return {};
}
