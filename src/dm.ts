
import { dbGetData } from './dataStore';
import { Message } from './interfaces';
import { countUserDms, memberObject } from './helper';
import HTTPError from 'http-errors';
/**
 * Creates a Dm channel
 * @param token - user identifier
 * @param uIds - array of users dm is directed to
 * @returns Object containing dmId
 */
const dmCreateV1 = async (token: string, uIds: number[]) => {
  const data = await dbGetData();

  // Check for invalid and duplicate user IDs in uIds
  const uniqueUserIds = new Set<number>();
  uIds.forEach((id) => {
    const user = data.users.find((element) => element.uId === id);
    if (!user) throw HTTPError(400, 'Invalid uId in uIds');
    if (uniqueUserIds.has(id)) throw HTTPError(400, "Duplicate uId's in uIds");
    uniqueUserIds.add(id);
  });

  // Invalid token
  const auth = data.tokens.find((item) => item.token === token);
  if (!auth) throw HTTPError(403, 'Invalid token');

  // Increment lastDmId and create a new DM
  const newId = ++data.lastDmId;

  // Create name of dm
  // Create an array with ownerId and all uIds
  const allUserIds = [...uIds, auth.uId];

  // Create the name by sorting and joining user handles
  const name = allUserIds
    .map((id) => data.users.find((user) => user.uId === id).handleStr)
    .sort()
    .join(', ');

  const dm = {
    dmId: newId,
    name: name,
    ownerId: auth.uId,
    uIds: uIds,
    messages: [] as Message[]
  };

  data.dms.push(dm);
  await data.save();
  // set Stat Data
  const statIndex = data.dmStats.findIndex(item => item.uId === auth.uId);
  data.dmStats[statIndex].stat.push({ numDmsJoined: countUserDms(auth.uId), timeStamp: Date.now() });
  data.dmsExistStat.push({ numDmsExist: data.dms.length, timeStamp: Date.now() });
  await data.save();

  return {
    dmId: newId,
  };
};
/**
 * For a valid token, returns information about all
 * the dms the user is in
 * @param {token} - the user making the call
 * @returns {dms} - array of objects with dms the user is in
*/
const dmListV1 = async (token: string) => {
  // check if token passed in is valid
  // Invalid token
  const data = await dbGetData();

  const auth = data.tokens.find((item) => item.token === token);
  if (!auth) throw HTTPError(403, 'Invalid token');
  console.log(data.dms);
  const dms = data.dms
    .filter((dm) => auth.uId === dm.ownerId || dm.uIds.includes(auth.uId))
    .map(({ dmId, name }) => ({ dmId, name }));

  return { dms };
};
/**
 * For a valid token and valid dmId, removes user from
 * given dm
 * @param {string} token - the user making the call
 * @param {number} dmId- dmId to be removed from
 * @returns {void}
*/
const dmRemoveV1 = async (token: string, dmId: number) => {
  // Error check
  // Valid token
  const data = await dbGetData();
  // check if token passed in is valid
  const auth = data.tokens.find((item) => item.token === token);
  if (!auth) throw HTTPError(403, 'Invalid Token');

  // check if dmId passed in is valid
  const validDmId = data.dms.find((item) => item.dmId === dmId);
  if (!validDmId) throw HTTPError(400, 'Invalid dmId');
  // Check if user is original creator
  if (validDmId.ownerId !== auth.uId) throw HTTPError(403, 'User is not the original creator or is no longer in the channel');
  data.dms = data.dms.filter((dm) => dm.dmId !== dmId);
  await data.save();

  data.dmsExistStat.push({ numDmsExist: data.dms.length, timeStamp: Date.now() });
  await data.save();
  return {};
};

/**
 * Given a dm with dmID that the authorised user is a member of
 * return detail of that dm
 * @param {token}  - token of current user
 * @param {dmId} number - chanel being inspected
 * ...
 *
 * @returns {name, member} - object with name and member properties
 * @returns {error: String} - error if token and dmId are invalid
 */
const dmDetailsV2 = async (token: string, dmId: number) => {
  const data = await dbGetData();
  const user = data.tokens.find((item) => item.token === token);
  if (!user) {
    throw HTTPError(403, 'Invalid Token.');
  }
  const uId = user.uId;

  const dm = data.dms.find(item => item.dmId === dmId);
  if (!dm) {
    throw HTTPError(400, 'Invalid DM.');
  }

  if (!dm.uIds.includes(uId) && dm.ownerId !== uId) {
    throw HTTPError(403, 'This user is not a part of the dm');
  }

  const membersUIds = dm.uIds.slice();
  membersUIds.push(dm.ownerId);
  const membersInfo = await memberObject(token, membersUIds);

  return {
    name: dm.name,
    members: membersInfo
  };
};

/**
 * Given a valid token and dmId, removes the user from the dm.
 *
 * @param {string} token - token of current user.
 * @param {number} dmId - unique Id of the dm.
 * ...
 *
 * @returns {object}  - error if token is invalid,
 *                    - error if dmId is invalid,
 *                    - error if the dmId is valid but the user is not a member.
 *
 * @returns {} - no return if no errors.
 */
const dmLeaveV2 = async(token: string, dmId: number) => {
  const data = await dbGetData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (!auth) {
    throw HTTPError(403, 'Invalid Token.');
  }
  // Checks if the dmId is valid.
  const dm = data.dms.find((element) => element.dmId === dmId);
  if (!dm) {
    throw HTTPError(400, 'Invalid dmId.');
  }
  // Checks if user is the owner.
  if (auth.uId === dm.ownerId) {
    // Since the owner isn't in the members array, setting
    // the id to -1 indicates that the owner has left.
    dm.ownerId = -1;
    await data.save();
    return {};
  }
  // Checks if the user is a member of the dm.
  const user = data.users.find((element) => element.uId === auth.uId);
  if (!dm.uIds.includes(user.uId)) {
    throw HTTPError(403, 'User is already not a member');
  }
  // Removes the user from the members array.
  const index = dm.uIds.indexOf(user.uId);
  if (index > -1) { dm.uIds.splice(index, 1); }

  await data.save();
  return {};
};
/**
 * Given a DM with ID dmId that the authorised user is a member of,
 * return up to 50 messages between index "start" and "start + 50".
 * Message with *index 0 is the most recent message in the DM.
 * This function returns a new index "end" which is the value of "start + 50", or,
 * if this function has *returned the least recent messages in the DM,
 * returns -1 in "end" to indicate there are no more messages to load after this return.
 * @param { token } string - Id of the person calling the function
 * @param {dmId} number - Id of the dm
 * @param {start} number - the start index of the messages to be listed
 * @returns { }
 */

const dmMessagesV1 = async (token: string, dmId: number, start: number) => {
  const data = await dbGetData();
  const dm = data.dms.find((d) => d.dmId === dmId);
  // searches for dm with the Id
  if (!dm) return { error: 'invalid dmId' };
  // checks if the token is valid
  const user = data.tokens.find((u) => u.token === token);
  if (!user) return { error: 'token is invalid' };
  const { uId } = user;
  // checks whether authenticated user is member of the DM
  // user is not a member of the DM
  if (dm.ownerId !== uId && !dm.uIds.includes(uId)) return { error: 'user is not a member of the DM' };

  const numberOfMessages = dm.messages.length;
  // calculates number of messages in the DM and checks if starting index
  // parameter is valid - if not, returns error
  if (start > numberOfMessages) {
    return {
      error: 'start parameter is greater than number of messages in DM'
    };
  }
  let end;
  // more than 50 messages after starting index, function returns the next
  // 50 messages
  // if there are fewer than 50 - returns all messages after the starting index
  // no new messages: returns -1 as end value
  if (numberOfMessages > start + 50) {
    end = start + 50;
  } else if (numberOfMessages === 0 || numberOfMessages <= start + 50) {
    end = -1;
  }
  // creates array of message objects containing messageId, senderId, message
  // content and time for each message
  // they are returned in reverse chronological order (newest first)
  const reversed = dm.messages.slice().reverse();
  const messages =
    reversed.slice(start, start + 50)
      .map(m => ({
        messageId: m.messageId,
        uId: m.uId,
        message: m.message,
        timeSent: m.timeSent
      }));
  await data.save();
  return { messages, end, start };
};

export { dmCreateV1, dmRemoveV1, dmListV1, dmDetailsV2, dmLeaveV2, dmMessagesV1 };
