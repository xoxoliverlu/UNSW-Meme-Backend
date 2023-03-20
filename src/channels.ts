import { getData,setData } from "./dataStore";
import {authRegisterV1 } from "./auth";
/**
 * Given an authUserId and a channelId, the function
 * prints out basic information about the channel.
 *
 * @param {number} authUserId - Unique identifier for a valid user.
 * @param {number} channelId - Unique name for a valid channel.
 * ...
 *
 * @returns {object} - error if authUserId is invalid.
 *
 *
 * @returns {number} - unique id of the channel.
 */
export function channelsCreateV1(token: string, authUserId: number, name: string, isPublic: boolean){
  const data = getData();
  let validUser = false;

  // Check that the length of name is more than 1 or less than 20 characters
  for (const user of data.users) {
    if (user.uId === authUserId) {
      validUser = true;
    }
  }
  if (validUser === false) {
    return {
      error: 'error'
    }
  }
  name = name.trim();
  if (name.length < 1) {
    return {
      error: 'error'
    }
  }
  if (name.length > 20) {
    return {
      error: 'error'
    }
  }


  // Assign channelId
  let Id = data.lastChannelId + 1;
  data.lastChannelId++;

  // Assign information to the new channel
  data.channels.push({
    channelId: Id,
    name: name,
    isPublic: isPublic,
    allMembers: [authUserId],
    messages:[],
    ownerMembers: [authUserId],
  })

  setData(data);
  return {
    channelId: Id
  }
}

/**
 * Given an authUserId and a channelId, the function
 * prints out basic information about the channel.
 *
 * @param {number} authUserId - Unique identifier for a valid user.
 * ...
 *
 * @returns {object} - error if authUserId is invalid.
 *
 *
 * @returns {number} - unique id of the channel.
 * @returns {string} - unique name of the channel.
 */
export function channelsListV1(token: string, authUserId: number){
  const data = getData();
  let validId = false;

  for (let user of data.users){
    if (user.uId === authUserId){
      validId = true
    }
  }

  if (!validId){
    return {error: 'error'};
  }

  let associatedChannels = [];

  for (let channel of data.channels){
    if (channel.allMembers.includes(authUserId)){
      associatedChannels.push({channelId:channel.channelId, name:channel.name})
    }
  }

  return {channels: associatedChannels};

}

/**
 * Given an authUserId and a channelId, the function
 * prints out basic information about the channel.
 *
 * @param {number} authUserId - Unique identifier for a valid user.
 * ...
 *
 * @returns {object} - error if authUserId is invalid.
 *
 *
 * @returns {number} - unique id of the channel.
 * @returns {string} - unique name of the channel.
 */
export function channelsListAllV1(token:string, authUserId: number){
  const data = getData();
  let validId = false;

  for (let user of data.users){
    if (user.uId === authUserId){
      validId = true
    }
  }

  if (!validId){
    return {error: 'error'};
  }

  let result = [];

  for (let channel of data.channels){
    result.push({channelId: channel.channelId, name: channel.name})
  }

  return {
    channels: result,
  };
}


