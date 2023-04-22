import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';
import { countUserChannels } from './helper';

/**
 * Creates a new channel object and appends it to the channels section of the dataStore
 * Returns error if inactive token passed in || 1 > name length || name length > 20
 * @param {string} token - valid token for a user
 * @param {string} name - name of channel
 * @param {boolean} isPublic - boolean for channel public
 *
 * @returns {object} - containing channelId
 * @returns {object} - error if name or token is invalid
 */
const channelsCreateV3 = (token: string, name: string, isPublic: boolean) => {
  const data = getData();
  const user = data.tokens.find(item => item.token === token);
  if (!user) {
    throw HTTPError(403, 'Token invalid.');
  }
  const { uId: authUserId } = user;
  // Check that the length of name is more than 1 or less than 20 characters
  name = name.trim();
  if (name.length < 1) {
    throw HTTPError(400, 'Length');
  }
  if (name.length > 20) {
    throw HTTPError(400, 'Length');
  }

  // Assign channelId
  const Id = data.lastChannelId + 1;
  data.lastChannelId++;

  // Assign information to the new channel
  data.channels.push({
    channelId: Id,
    name: name,
    isPublic: isPublic,
    allMembers: [authUserId],
    messages: [],
    ownerMembers: [authUserId],
  });


  setData(data);
  // add stat data
  let statIndex = data.channelStats.findIndex(item => item.uId === authUserId);
  data.channelStats[statIndex].stat.push({numChannelsJoined: countUserChannels(authUserId),timeStamp:Date.now()})
  setData(data);
  
  return {
    channelId: Id
  };
};

/**
 * Given a token, the function returns channels the user is a part of
 *
 * @param {string} token - Unique token for user.
 *
 * @returns {object} - error if token is invalid.
 * @returns {object} - list of all channels user is a part of.
 */
const channelsListV3 = (token: string) => {
  const data = getData();
  // Check for valid token
  const user = data.tokens.find(item => item.token === token);
  if (!user) {
    throw HTTPError(403, 'Email does not exist.');
  }
  const { uId: authUserId } = user;
  const associatedChannels = [];

  // Add channels the authUser is part of
  for (const channel of data.channels) {
    if (channel.allMembers.includes(authUserId)) {
      associatedChannels.push({ channelId: channel.channelId, name: channel.name });
    }
  }

  return { channels: associatedChannels };
};

/**
 * Given a token, the function
 * returns all channels.
 *
 * @param {string} token - Unique token for user.
 *
 * @returns {object} - error if token is invalid.
 * @returns {object} - list of all channels.
 */
const channelsListAllV3 = (token: string) => {
  const data = getData();
  // Invalid token
  const user = data.tokens.find(item => item.token === token);
  if (!user) {
    throw HTTPError(403, 'Email does not exist.');
  }

  const result = data.channels.map(channel => {
    return { channelId: channel.channelId, name: channel.name };
  });

  return {
    channels: result,
  };
};

export { channelsListAllV3, channelsListV3, channelsCreateV3 };
