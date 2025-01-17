import { dbGetData } from './dataStore';
import { Message } from './interfaces';
import HTTPError from 'http-errors';
/**
 * Given a query substring, returns a collection of messages in all of the channels/DMs
 * that the user has joined that contain the query (case-insensitive). There is no expected order for these messages.
 * @param {token}  - token of current user
 * @param {channelId} number - chanel being inspected
 * ...
 *
 * @returns {} - empty object on success
 * @returns {error: String} - error if token and channelid are invalid
 */
export async function searchV1(token: string, queryStr: string) {
  const data = await dbGetData();
  const user = data.tokens.find((item) => item.token === token);

  // valid token
  if (!user) {
    throw HTTPError(403, 'Invalid Token');
  }
  const { uId } = user;
  // qreryStr Length
  if (queryStr.length < 1 || queryStr.length > 1000) {
    throw HTTPError(400, 'Invalid Length');
  }

  const result: Message[] = [];
  const channels = data.channels.filter(item => item.allMembers.includes(uId)).map(channel => channel.messages);
  channels.forEach(messages => {
    messages.forEach(message => {
      if (message.message.toLowerCase().includes(queryStr.toLowerCase())) {
        result.push(message);
      }
    });
  });

  const dms = data.dms.filter(item => item.uIds.includes(uId) || item.ownerId === (uId)).map(dm => dm.messages);
  dms.forEach(messages => {
    messages.forEach(message => {
      console.log(message.message);
      if (message.message.toLowerCase().includes(queryStr.toLowerCase())) {
        result.push(message);
      }
    });
  });
  return { result };
}
