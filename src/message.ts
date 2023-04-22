import { getData, setData } from './dataStore';
import { countUserMessages } from './helper';
import { Message, Channel, DM } from './interfaces';
import HTTPError from 'http-errors';
/**
 * Send a message from the authorised user to the channel specified by channelId.
 * @param token - string: user identifier
 * @param channelId - number: channel identifier
 * @param message - string: message to send
 * @returns messageId - the message identifier
 */

export function messageSendV2(token: string, channelId: number, message: string) {
  const data = getData();

  const user = data.tokens.find((u) => u.token === token);
  if (!user) {
    throw HTTPError(403, 'Invalid Token');
  }
  const { uId } = user;

  const channel = data.channels.find((c) => c.channelId === channelId);
  if (!channel) {
    throw HTTPError(400, 'channelId is invalid');
  }


  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'message length is invalid');
  }
  if (channel !== undefined && !channel.allMembers.includes(uId)) {
    throw HTTPError(403, 'token is not a member of channel');
  }

  const messageId = data.lastMessageId + 1;
  data.lastMessageId++;
  // new Message output
  const newMessage: Message = {
    messageId: messageId as number,
    uId: uId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000)
  };
  channel.messages.push(newMessage);

  setData(data);
  let statIndex = data.messageStats.findIndex(item => item.uId === user.uId);
  data.messageStats[statIndex].stat.push({numMessagesSent: countUserMessages(user.uId),timeStamp:Date.now()})
  setData(data);
  
  return { messageId };
}

/**
 * Send a message from the authorised user to the dm specified by dmId.
 * @param token - user identifier
 * @param dmId - dm identifier
 * @param message - message to be sent
 * @returns messageId - message identifier
 */

export function messageSendDmV2(token: string, dmId: number, message: string) {
  const data = getData();
  const dm = data.dms.find(i => i.dmId === dmId);
  const user = data.tokens.find(i => i.token === token);


  if (!dm) {
    throw HTTPError(400, 'dmId is invalid');
  }
  if (!user) {
    throw HTTPError(403, 'Invalid Token');
  }
  if (message.length < 1 || message.length > 1000) {
    throw HTTPError(400, 'message length is invalid');
  }
  if (dm && !dm.uIds.includes(user.uId) && dm.ownerId !== user.uId) {
    throw HTTPError(403, 'dmId is valid but token is not in DM');
  }

  const messageId = data.lastMessageId + 1;
  data.lastMessageId++;

  // newMessage output
  const newMessage = {
    messageId: messageId,
    uId: user.uId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000)
  };
  dm.messages.push(newMessage);
  setData(data);
  let statIndex = data.messageStats.findIndex(item => item.uId === user.uId);
  data.messageStats[statIndex].stat.push({numMessagesSent: countUserMessages(user.uId),timeStamp:Date.now()})
  setData(data);
  return { messageId };
}
/**
 * Given a message, update its text with new text.
 * If the new message is an empty string, the message is deleted.
 * @param token - user identifier
 * @param messageId - the message to be edited
 * @param message - the updated message
 * @returns
 */

export function messageEditV1 (token: string, messageId: number, message: string) {
  const data = getData();
  // Check for valid token
  const authUser = data.tokens.find((u) => u.token === token);
  if (authUser === undefined) return { error: 'token is invalid' };
  const authPerm = data.users.find((item) => item.uId === authUser.uId);
  // checks message length
  if (message.length > 1000) return { error: 'Message is greater than 1000 characters' };

  // Create variables
  let chosenMessage: Message;
  let channelIndex: Channel;
  let dmIndex: DM;

  // looking for the channel that contains the message the message with the messageId
  for (const channel of data.channels) {
    chosenMessage = channel.messages.find((m) => m.messageId === messageId);
    if (chosenMessage) {
      channelIndex = channel;
    }
  }
  // if message is found = sets dmIndex to corresponding dm object
  // if not found - dmIndex remains undefined
  for (const dm of data.dms) {
    chosenMessage = dm.messages.find(m => m.messageId === messageId);
    if (chosenMessage) {
      dmIndex = dm;
    }
  }

  if (!chosenMessage) return { error: 'message id is invalid' };

  // checks whether authenticated user is either the sender of the message
  // or a member of the conversation's owner memver
  // if either of them are true - validtoEdit is true
  let validToEdit = false;

  // checks if message exists in the channels using messageId
  // it it does -> checks if the user who sent edit rquest is the same as the
  // one who sent the message or if they are one of the channel owners
  // if either one of these conditions is true - validToEdit: set to true
  // meaning it can be edited
  if (channelIndex !== undefined) {
    if (channelIndex.ownerMembers.find((o) => o === authUser.uId || authPerm.globalPerm === 1 || chosenMessage.uId === authUser.uId)) {
      validToEdit = true;
    }
  }
  if (dmIndex !== undefined) {
    if (chosenMessage.uId === authUser.uId) {
      validToEdit = true;
    } else if (dmIndex.ownerId === authUser.uId) {
      validToEdit = true;
    }
  }

  if (!validToEdit) {
    return { error: 'message was not sent by this user, and user does not have owner permissions' };
  }

  // checking if the messages to be edited exists in a DM
  // if it does exist - checks if new message is empty or not
  // if empty - removes existing message from DM
  // not empty - updates message with new message text

  // Change message
  if (message === '') {
    messageRemoveV1(token, messageId);
  } else {
    chosenMessage.message = message;
    setData(data);
  }
  return {};
}
/**
 * Given a messageId for a message, this message is removed from the channel/DM
 *
 * @param {token} string - random string used to identify specific user session
 * @param {messageId} number - number associated to the specific message in dm or channel
 *
 * @returns {}
 */

export function messageRemoveV1(token: string, messageId: number) {
  const data = getData();
  const user = data.tokens.find((u) => u.token === token);
  // checks if provided token is valid - checks if the user object exists
  if (!user) {
    return { error: 'token is invalid' };
  }

  const { uId } = user;
  let channelMsg;
  let dmMsg;
  // filters the channels that the user is a member of
  // checks if message with the messageId exists
  // if it exists - checks if the user if the user is the author of the msg
  // if not - returns an error message
  // also checks if user has permission to delete the msg (user is either owner
  // or member with delete permissions)
  // user has permission = deletes message
  data.channels.filter(channel => channel.allMembers.includes(uId)).forEach((channel) => {
    channelMsg = channel.messages.findIndex((message) => message.messageId === messageId);
    if (channelMsg !== -1) {
      if (channel.messages[channelMsg].uId !== uId) {
        return { error: 'This user did not send this message.' };
      }
    }

    const channelPermission = channel.ownerMembers.includes(uId);
    if (!channelPermission) {
      return { error: 'This user does not have permission to delete this message.' };
    }
    if (channelMsg && channelPermission) {
      channel.messages.splice(channelMsg, 1);
    }
  });

  // filters the dms that the user is a member of
  // checks if the message with the messageId exists
  // if it exists - checks if the user is author
  // if not - returns error
  // also checks if the user is the owner of the DM - as owner can only delete
  // messages - message deletes if user is the owner.
  data.dms.filter(dm => dm.uIds.includes(uId) || dm.ownerId === uId).forEach((dm) => {
    dmMsg = dm.messages.findIndex(message => message.messageId === messageId);
    const dmPermission = dm.ownerId === uId;
    if (dmMsg !== -1) {
      if (dm.messages[dmMsg].uId !== uId) {
        return { error: 'This user did not send this message.' };
      }
    }
    // if channelMsg and dMsg variables are still null - messageId does not refer
    // to a valid message within a channel/DM
    if (!dmPermission) {
      return { error: 'This user does not have permission to delete this message.' };
    }
    if (dmMsg && dmPermission) {
      dm.messages.splice(dmMsg, 1);
    }
  });
  if (!dmMsg || !channelMsg) {
    return { error: 'messageId does not refer to a valid message within a channel/DM that the authorised user has joined' };
  }

  setData(data);
  return {};
}
