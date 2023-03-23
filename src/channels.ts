import { getData,setData } from "./dataStore";
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
export function channelsCreateV2(token: string, name: string, isPublic: boolean){
  const data = getData();
  let user = data.tokens.find(item => item.token === token);
  if (user === undefined) {
    return {error: 'user not found'}; 
  }
  let {uId: authUserId} = user;
  // Check that the length of name is more than 1 or less than 20 characters
  name = name.trim();
  if (name.length < 1) {
    return {
      error: 'name length needs to be greater than 1'
    }
  }
  if (name.length > 20) {
    return {
      error: 'name length needs ot be greater than 20'
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
export function channelsListV2(token: String){
  const data = getData();
  let user = data.tokens.find(item => item.token === token);
  if (user === undefined) {
    return {error: 'user not found'}; 
  }
  let {uId: authUserId} = user;
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
export function channelsListAllV2(token: String){
  const data = getData();
  let user = data.tokens.find(item => item.token == token);
  if (user === undefined) {
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


