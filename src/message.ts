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
  const user = data.users.find(i => i.token === token);
  const indexDm = data.dms.findIndex(u => u.dmId === dmId);
  const indexUser = data.users.findIndex(u => u.token === token);

  // Error checking
  if (!user) {
    return { error: 'Token invalid' };
  }
  if (!dm) {
    return { error: 'dmId does not refer to a valid DM' };
  }
  if (message.length > 1000) {
    return { error: 'length of mesage is greater than 1000 characters' };
  } else if (message.length < 1) {
    return { error: 'length of message is less than 1 character' };
  }

  let found = false;
  for (const elem of data.dms[indexDm].allMembers) {
    if (elem === data.users[indexUser].authUserId) {
      found = true;
    }
  }
  if (found === false) {
    return { error: 'User is not part of the DM' };
  }

  // Gemerate a random messageId
  let randomNum = '';
  const characters = '0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 10; i++) {
    randomNum += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  let messageId = parseInt(randomNum);

  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.messageId === messageId) {
        messageId += 1;
      }
    }
  }

  const newMessage = {
    messageId: messageId,
    uId: data.users[indexUser].authUserId,
    message: message,
    timeSent: Math.floor(Date.now() / 1000)
  };
  data.dms[indexDm].messages.push(newMessage);
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
    if (message === '') {
      channelIndex.messages = channelIndex.messages.filter(message => message.messageId !== messageId);
    }
    messageChannel.message = message;
  }
  setData(data);
  return {};

}
export function messageRemoveV1(token: string, messageId: number) {
  const data = getData();
  const indexUser = data.users.findIndex((u) => u.token === token);
  const userToken = data.users.find((u) => u.token === token);
  if (!userToken) {
    return { error: 'token is invalid' };
  }

  const userId = data.users[indexUser].authUserId;

  // If message is in channel
  let userSentMsg = false;
  let validmessageIdchannel = false;
  let channelNumber = 0;
  for (const channel of data.channels) {
    for (const message of channel.messages) {
      if (message.messageId === messageId) {
        validmessageIdchannel = true;
        if (message.uId === userId) {
          userSentMsg = true;
        }
      }
    }
    if (validmessageIdchannel === false) {
      channelNumber++;
    }
  }

  // If message is in dm
  let validmessageIddm = false;
  let dmNumber = 0;
  for (const dm of data.dms) {
    for (const message of dm.messages) {
      if (message.messageId === messageId) {
        validmessageIddm = true;
        if (message.uId === userId) {
          userSentMsg = true;
        }
      }
    }
    if (validmessageIddm === false) {
      dmNumber++;
    }
  }

  if (validmessageIdchannel === false && validmessageIddm === false) {
    return { error: 'Invalid messageId' };
  }

  // error checking for the message if in a channel
  if (validmessageIdchannel) {
    const findIfChannelMember = data.channels[channelNumber].allMembers.find((u) => u.uId === userId);
    if (findIfChannelMember === undefined) {
      return { error: 'user not member of channel' };
    }
    const findIfChannelOwner = data.channels[channelNumber].ownerMembers.find((u) => u.uId === userId);
    if (userSentMsg === false && findIfChannelOwner === undefined) {
      return { error: 'user did not send that message' };
    }

    const indexMessage = data.channels[channelNumber].messages.findIndex((u) => u.messageId === messageId);
    data.channels[channelNumber].messages.splice(indexMessage, 1);
  }

  // error checking for the message if in a dm
  if (validmessageIddm) {
    const findIfDmMember = data.dms[dmNumber].allMembers.find((u) => u === userId);
    if (findIfDmMember === undefined) {
      return { error: 'user not member of dm' };
    }
    const findIfDmOwner = data.dms[dmNumber].ownerMembers.find((u) => u === userId);
    if (userSentMsg === false && findIfDmOwner === undefined) {
      return { error: 'user did not send that message' };
    }
    const indexMessage = data.dms[dmNumber].messages.findIndex((u) => u.messageId === messageId);
    data.dms[dmNumber].messages.splice(indexMessage, 1);
  }
  setData(data);
  return {};

}