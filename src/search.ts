import { channel } from "diagnostics_channel";
import { getData } from "./dataStore";
import { Message } from "./interfaces";
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
export function searchV1(token: string, queryStr: string) {
  const data = getData();
  const user = data.tokens.find((item) => item.token === token);

  // valid token
  if (user === undefined) {
    return { error: "token" };
  }
  const {uId} = user;
  // qreryStr Length
  if (queryStr.length < 1 || queryStr.length > 1000){
    return { error: 'length'};
  }

  let result: Message[] = [];
  let channels = data.channels.filter(item => item.allMembers.includes(uId)).map(channel => channel.messages)
  channels.forEach(messages => {
    messages.forEach(message => {
      if (message.message.toLowerCase().includes(queryStr.toLowerCase())){
        result.push(message);
      }
    })
  })

  let dms = data.dms.filter(item => item.uIds.includes(uId) || item.ownerId === (uId)).map(dm => dm.messages)
  dms.forEach(messages => {
    messages.forEach(message => {
      console.log(message.message)
      if (message.message.toLowerCase().includes(queryStr.toLowerCase())){
        result.push(message);
      }
    })
  })
  return {result};
}
