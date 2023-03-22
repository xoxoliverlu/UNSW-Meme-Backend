import { getData,setData } from "./dataStore";
import {userProfileV2} from "./users.js";

/**
 * Given an authUserId and a channelId, the function
 * prints out basic information about the channel.
 *
 * @param {token} string - token of current user.
 * @param {number} channelId - Unique identifier for a valid channel.
 * ...
 *
 * @returns {object} - error if channelId or authUserId is invalid,
 *                     error if the user is not a member of the channel.
 *
 * @returns {string} - name of the channel.
 * @returns {boolean} - whether the channel is public or private.
 * @returns {array} - List of owner members of the channel.
 * @returns {array} - List of all members of the channel.
 */
export function channelDetailsV1(token : string, channelId : number) {
  const data = getData();
  // check if authUserId is valid
  let authIsValid = false;
  for (const user of data.users) {
    if (user.uId === authUserId) {
      authIsValid = true;
    }
  }
  if (!authIsValid) {
    return {error: "AuthUser is not valid"}
  }
  // checks if the channelId is valid
  let validChannelId = false;
  for (let channel of data.channels) {
    if (channelId === channel.channelId) {
      let isMember = false;
      for (const user of channel.allMembers) {
        if (user === authUserId) {
          isMember = true;
        }
      }
      if (!isMember) {
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
  }
  return {
    error: "Invalid channelId"
  }
}
// Helper function
function memberObject(array) {
  const result = [];
  for (const userId of array) {
    const user = userProfileV1(userId, userId);
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
 * Given an authUserId and a channelId, the function
 * adds the user to the channel if it is public.
 *
 * @param {token} string - token of current user.
 * @param {number} channelId - Unique identifier for a valid channel.
 * ...
 *
 * @returns {object} - error if channelId or authUserId is invalid,
 *                     error if the user is already a member of the channel.
 *                     error if the channel is private.
 *
 * @returns {} - returns nothing if there is no errors.
 */
export function channelJoinV1(token : string, channelId : number) {
    const data = getData();
    let validUser = false;
    let userDetail;
    for (const user of data.users) {
      if (user.uId === authUserId) {
        userDetail = user;
      }
    }
    if (userDetail === undefined) {
      return {error: 'Invalid authUserId'};
    }
    // checks if the channelId is valid
    let channelDetail;
    for (let channel of data.channels) {
      if (channel.channelId === channelId) {
        channelDetail = channel;
      }
    }
    if (channelDetail === undefined) {
      return {error: 'Channel does not exist'};
    }
    // checks if the channel is public
    if (channelDetail.isPublic === false) {
        // check authuser permissions
        if (userDetail.globalPerm === 2) {
          return {error: 'Channel is private and authUser is not a global owner'};
        }
    }

    // checks if the user is already a member of the channel
    if (channelDetail.allMembers.includes(authUserId)) {
        return {error: 'User is already a member'}
    }

    // Add member to channe
    channelDetail.allMembers.push(authUserId);
    setData(data);

    return {

    }
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
export function channelInviteV1(token : string, channelId : number, uId : number){
  const data = getData();
  let validChannel = false;
  let userInfo;
  let channelInfo;

  // Check that channelId refers to a valid channel
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      validChannel = true;
      channelInfo = channel;
    }
  }
  if (validChannel === false) {
    return {
      error: 'Not a valid channel'
    }
  }

  // Check that uId and authUserId refers to a valid user
  let validUser = false;
  let validAuthUser = false;
  for (const user of data.users) {
    if (user.uId === uId) {
      validUser = true;
      userInfo = user;

    }
    if (user.uId === authUserId) {
      validAuthUser = true;
    }
  }
  if (validUser === false || validAuthUser === false) {
    return {
      error: 'Not a valid userId or authUserId'
    }
  }

  // checking if uId is a member
  for(const member of channelInfo.allMembers){
    if(member === uId){
      return {
        error: 'User is already a member'
      }
    }
  }

  // Check if authUserId is a member
  let isMember = false
  for(const member of channelInfo.allMembers){
    if(member === authUserId){
      isMember = true;
    }
  }
  if (isMember === false) {
    return {
      error: 'AuthUser is not a member',
    }
  }

  // Add invited user to the channel
  channelInfo.allMembers.push(uId);
  setData(data);
  return {

  }
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
export function channelMessagesV1(token : string, channelId : string, start : string){
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
      error: 'error'
  }
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
      error: 'error'
    }
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
      error: 'error'
  }
  }

  // Check if starting index is not greater than the total number
  // of messages in the channel
  if (start > channelInfo.messages.length) {
    return {
        error: 'error'
    }
  }

  if (start === 0 && channelInfo.messages.length === 0) {
    return {
      messages: [],
      start: 0,
      end: -1,
    }
  }

  // checks if start is at the end
  if (start === channelInfo.messages.length) {
    return {
      messages:channelInfo.messages[channelInfo.messages.length-1],
      start: start,
      end: -1,
    }
  }
  let messagesArray = [];
  let newEnd;

  for (let i = start; i < start + 50; i++) {
    if(i === channelInfo.messages.length - 1) {
      newEnd = -1;
      messagesArray.push(channelInfo.messages[i])
      break;
    }
    messagesArray.push(channelInfo.messages[i])
  }

  if (newEnd !== -1) {
    newEnd = start + 50;
  }
  return {
    messages: messagesArray,
    start: start,
    end: newEnd,
  }

}


