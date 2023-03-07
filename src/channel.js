import { getData, setData } from "./dataStore.js";

export function channelDetailsV1(authUserId, channelId) {
  const data = getData();
  let channelToFind;
  let ownerMemArr = [];
  let allMemArr = [];
  // checks if the channelId is valid
  let validChannelId = false;
  for (let channel of data.channels) {
    if (channelId === channel.channelId) {
      validChannelId = true;
      channelToFind = channel;
      ownerMemArr = channel.ownerMembers;
      allMemArr = channel.allMembers;
    }
  }
  if (!validChannelId) {
    return { error: "error" };
  }
  // checks if the auth is a member of the channel
  let validAuthId = true;
  for (let channel of data.channels) {
    if (channel.channelId === channelId) {
      if (!channel.allMembers.includes(authUserId)) {
        validAuthId = false;
      }
    }
  }
  if (!validAuthId) {
    return { error: "error" };
  }

  return {
    name: channelToFind.name,
    isPublic: channelToFind.isPublic,
    ownerMembers: ownerMemArr,
    allMembers: allMemArr,
  };
}

export function channelJoinV1(authUserId, channelId) {
  const data = getData();
  // checks if the user is valid
  let validAuthId = false;
  for (let user of data.users) {
    if (user.uId === authUserId) {
      validAuthId = true;
    }
  }
  if (!validAuthId) {
    return { error: "error" };
  }
  // checks if the channelId is valid
  let validChannelId = false;
  let authIsMem = false;
  for (let channel of data.channels) {
    if (channel.channelId === channelId) {
      // checks if the channel is public
      if (channel.isPublic === true) {
        validChannelId = true;
      }
      // checks if the user is already a member of the channel
      if (!channel.allMembers.includes(authUserId)) {
        authIsMem = true;
      }
    }
  }
  if (!validChannelId) {
    return { error: "error" };
  }
  if (!authIsMem) {
    return { error: "error" };
  }

  for (let channel of data.channels) {
    if (channel.channelId === channelId) {
      channel.allMembers.push(authUserId);
    }
  }
  setData(data);

  return {};
}

export function channelInviteV1(authUserId, channelId, uId) {
  const data = getData();
  let valid = false;
  let userInfo = "";
  const channelKeys = data.channels;
  const userKeys = data.users;

  // Check that channelId refers to a valid channel
  for (const channel in data.channels) {
    if (data.channels[channel].channelId === channelId) {
      valid = true;
    }
  }
  if (valid === false) {
    return {
      error: "error",
    };
  }

  // Check that uId refers to a valid user
  valid = false;
  for (const user in userKeys) {
    if (data.users[user].uId === uId) {
      valid = true;
      userInfo = user;
    }
  }
  if (valid === false) {
    return {
      error: "error",
    };
  }
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      for (const member of channel.allMembers) {
        if (member === uId) {
          return {
            error: "error",
          };
        }
      }
    }
  }

  // Check that authUserId is valid
  valid = false;
  for (const user in userKeys) {
    if (data.users[user].uId === authUserId) {
      valid = true;
    }
  }
  if (valid === false) {
    return {
      error: "error",
    };
  }

  // Check that user is not already a member of the channel
  for (const channel in channelKeys) {
    for (const id of data.channels[channel].allMembers) {
      if (id === uId) {
        return {
          error: "error",
        };
      }
    }
  }

  // check that the authorised user is a member of the channel
  valid = false;
  for (const channel in channelKeys) {
    for (const aId of data.channels[channel].ownerMembers) {
      if (
        aId === authUserId &&
        channelId === data.channels[channel].channelId
      ) {
        valid = true;
      }
      if (authUserId === 0) {
        valid = true;
      }
    }
  }
  if (!valid) {
    return {
      error: "error",
    };
  }

  // Add invited user to the channel
  for (const channel in channelKeys) {
    if (data.channels[channel].channelId === channelId) {
      data.channels[channel].allMembers.push(uId);
    }
  }

  setData(data);
  return {};
}

export function channelMessagesV1(authUserId, channelId, start) {
  const data = getData();
  let valid = false;
  let channelPosition;
  const channelKeys = data.channels;

  // ERROR CHECKING
  // Check if channelId refers to a valid channel
  for (const channel in channelKeys) {
    if (data.channels[channel].channelId === channelId) {
      valid = true;
      channelPosition = channel;
    }
  }
  const userKeys = data.users;

  if (valid === false) {
    return {
      error: "error",
    };
  }

  // Check if authUserId refers to a valid user
  valid = false;
  for (const user in userKeys) {
    if (data.users[user].uId === authUserId) {
      valid = true;
    }
  }

  if (valid === false) {
    return {
      error: "error",
    };
  }
  // Check if the user is a member of the given channel
  valid = false;
  for (const channel in channelKeys) {
    for (const aId of data.channels[channel].allMembers) {
      if (
        aId === authUserId &&
        channelId === data.channels[channel].channelId
      ) {
        valid = true;
      }
    }
  }
  if (!valid) {
    return {
      error: "error",
    };
  }

  // See how many messages there are in the channel
  let endIndex;
  const channelMessages = {
    messages: [],
    start: start,
    end: endIndex,
  };

  let numberOfMessages;

  if (typeof data.channels[channelPosition].messages === "undefined") {
    numberOfMessages = 0;
  } else {
    numberOfMessages = data.channels[channelPosition].messages.length();
  }

  // Check if starting index is not greater than the total number
  // of messages in the channel
  if (start > numberOfMessages) {
    return {
      error: "error",
    };
  }

  // Loop through start + 50 messages and return details of each message
  if (numberOfMessages === 0) {
    channelMessages.end = -1;
    return channelMessages;
  } else {
    if (numberOfMessages > start + 50) {
      for (let i = start; i < start + 50; i++) {
        const newMessage = {
          messageId: data.channels[channelPosition].messages[i].messageId,
          uId: data.channels[channelPosition].messages[i].uId,
          message: data.channels[channelPosition].messages[i].message,
          timeSent: data.channels[channelPosition].messages[i].timeSent,
        };
      }
      channelMessages.messages.push(newMessage);
      channelMessages.end = i;
    } else {
      for (let i = start; i < numberOfMessages - start; i++) {
        const newMessage = {
          messageId: data.channels[channelPosition].messages[i].messageId,
          uId: data.channels[channelPosition].messages[i].uId,
          message: data.channels[channelPosition].messages[i].message,
          timeSent: data.channels[channelPosition].messages[i].timeSent,
        };
      }
      channelMessages.messages.push(newMessage);
      channelMessages.end = i;
    }
  }

  return channelMessages;
}
