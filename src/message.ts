import { channel } from 'diagnostics_channel';
import { getData, setData } from './dataStore';

export function messageSendV1(token: string, channelId: number, message: string) {
  const data = getData();
  console.log("Token passed in is: " + token);
  const user = data.tokens.find((u) => u.token === token);
  if (!user) return { error: 'Token invalid' };
  const {uId} = user;

  const channel = data.channels.find((c) => c.channelId === channelId);
  if (!channel) return { error: 'Invalid channelId' };

  if (message.length < 1) return { error: 'Message cannot be empty' };

  if (message.length > 1000) return { error: 'Message is greater than 1000 characters' };
  
  if (!channel.allMembers.includes(uId)) return { error: 'User is not part of the channel' };

  let messageId = data.lastMessageId + 1;
  data.lastMessageId++;

  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000)
  };
  channel.messages.push(newMessage);

  setData(data);

  return { messageId };
}


export function messageSendDmV1(token: string, dmId: number, message: string) {
  const data = getData();
  const dm = data.dms.find(i => i.dmId === dmId);
  const user = data.tokens.find(i => i.token === token);
  //const indexDm = data.dms.findIndex(u => u.dmId === dmId);
  //const indexUser = data.users.findIndex(u => u.token === token);

  console.log("Token passed in is: " + token);
  // Error checking
  if (!user) {
    return { error: 'Token invalid' };
  }
  const uId = user.uId;
  if (!dm) {
    return { error: 'dmId does not refer to a valid DM' };
  }
  if (message.length > 1000) {
    return { error: 'length of message is greater than 1000 characters' };
  } else if (message.length < 1) {
    return { error: 'length of message is less than 1 character' };
  }

  if (!dm.uIds.includes(uId) && dm.ownerId !== uId ) {
    return {error : 'this user is not part of the dm'};
  }
  // let found = false;
  // for (const elem of data.dms[indexDm].allMembers) {
  //   if (elem === data.users[indexUser].authUserId) {
  //     found = true;
  //   }
  // }
  // if (found === false) {
  //   return { error: 'User is not part of the DM' };
  // }

  // Gemerate a random messageId
  // let randomNum = '';
  // const characters = '0123456789';
  // const charactersLength = characters.length;
  // for (let i = 0; i < 10; i++) {
  //   randomNum += characters.charAt(Math.floor(Math.random() * charactersLength));
  // }

  // let messageId = parseInt(randomNum);
  let messageId = data.lastMessageId + 1;
  data.lastMessageId++;

  // for (const channel of data.channels) {
  //   for (const message of channel.messages) {
  //     if (message.messageId === messageId) {
  //       messageId += 1;
  //     }
  //   }
  // }

  const newMessage = {
    messageId: messageId,
    uId: uId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000)
  };
  dm.messages.push(newMessage);
  setData(data);

  return { messageId };

}
export function messageEditV1 (token: string, messageId: number, message: string) {
  const data = getData();
  const authUser = data.users.findIndex((u) => u.token === token);
  if (authUser < 0) return { error: 'token is invalid' };
  const authUserId = data.users[authUser].authUserId;

  if (message.length > 1000) return { error: 'Message is greater than 1000 characters' };

  let messageChannel: Message;
  let messageDm: Message;
  let channelIndex: Channel;
  let dmIndex: Dm;

  for (const channel of data.channels) {
    messageChannel = channel.messages.find((m) => m.messageId === messageId);
    if (messageChannel) {
      channelIndex = channel;
    }
  }

  for (const dm of data.dms) {
    messageDm = dm.messages.find(m => m.messageId === messageId);
    if (messageDm) {
      dmIndex = dm;
    }
  }

  if (!messageDm && !messageChannel) return { error: 'message id is invalid' };

  let validToEdit = false;
  if (messageDm) {
    if (messageDm.uId === authUserId ||
    (dmIndex.ownerMembers.includes(authUserId))) {
      validToEdit = true;
    }
  }
  if (messageChannel) {
    if (messageChannel.uId === authUserId ||
    (channelIndex.ownerMembers.find((o) => o.uId === authUserId))) {
      validToEdit = true;
    }
  }

  if (!validToEdit) {
    return { error: 'message was not sent by this user, and user does not have owner permissions' };
  }

  if (messageDm) {
    if (message === '') {
      dmIndex.messages = dmIndex.messages.filter(message => message.messageId !== messageId);
    }
    messageDm.message = message;
  }

  if (messageChannel) {
    if (Object.is(message, '')) {
      channelIndex.messages = channelIndex.messages.filter(message => message.messageId !== messageId);
    }
    messageChannel.message = message;
  }
  setData(data);
  return {};

}
export function messageRemoveV1(token: string, messageId: number) {
  const data = getData();
  const user = data.tokens.find((u) => u.token === token);
  if (!user) {
    return { error: 'token is invalid' };
  }

  const {uId} = user;
  let channelMsg = null;
  let dmMsg = null;
  
  data.channels.filter(channel => channel.allMembers.includes(uId)).forEach((channel) => {
    channelMsg = channel.messages.findIndex(message => message.messageId = messageId);
    if (channel.messages[channelMsg].uId !== uId) {
      return {error: "This user did not send this message."}
    }

    let channelPermission = channel.ownerMembers.includes(uId)
    if (!channelPermission){
      return {error: "This user does not have permission to delete this message."}
    }
    if (channelMsg && channelPermission){
      channel.messages.splice(channelMsg, 1)
    } 
  })
  data.dms.filter(dm => dm.uIds.includes(uId) || dm.ownerId == uId).forEach((dm) => {
    dmMsg = dm.messages.findIndex(message => message.messageId = messageId);
    let dmPermission = dm.ownerId == uId;
    if (dm.messages[dmMsg].uId !== uId) {
      return {error: "This user did not send this message."}
    }

    if (!dmPermission){
      return {error: "This user does not have permission to delete this message."}
    }
    if (dmMsg && dmPermission){
      dm.messages.splice(dmMsg, 1)
    } 
  })
  if (!dmMsg && !channelMsg){
    return {error: "messageId does not refer to a valid message within a channel/DM that the authorised user has joined"}
  }

  setData(data);
  return {};

}