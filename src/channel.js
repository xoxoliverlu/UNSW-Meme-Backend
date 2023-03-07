import { getData,setData } from "./dataStore.js";

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
    if (!validChannelId){
        return {error: 'error'};
    }
    // checks if the auth is a member of the channel
    let validAuthId = true;
    for (let channel of data.channels){
        if (channel.channelId === channelId) {
            if (!channel.allMembers.includes(authUserId)) {
                validAuthId = false;
            }
        }
    }
    if (!validAuthId){
        return {error: 'error'};
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
            validAuthId = true
        }
    }
    if (!validAuthId) {
        return {error: 'error'};
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
        return {error: 'error'};
    }
    if (!authIsMem) {
        return {error: 'error'};
    }

    for (let channel of data.channels) {
        if (channel.channelId === channelId) {
            channel.allMembers.push(authUserId);
        }
    }
    setData(data);

    return {
        
    }
}

export function channelInviteV1(authUserId, channelId, uId){
  const data = getData();
<<<<<<< src/channel.js
  let validChannel = false;
  let userInfo = ''; 
  let channelInfo; 

  // Check that channelId refers to a valid channel
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      validChannel = true;
      channelInfo = channel; 
=======
  let valid = false;
  let userInfo = "";
  const channelKeys = data.channels;
  const userKeys = data.users;

  // Check that channelId refers to a valid channel
  for (const channel in data.channels) {
    if (data.channels[channel].channelId === channelId) {
      valid = true;
>>>>>>> src/channel.js
    }
  }
  if (valid === false) {
    return {
      error: 'error'
    }
  }

<<<<<<< src/channel.js
  // Check that uId and authUserId refers to a valid user
  let validUser = false; 
  let validAuthUser = false;
  for (const user of data.users) {
    if (user.uId === uId) {
      validUser = true;
=======
  // Check that uId refers to a valid user
  valid = false;
  for (const user in userKeys) {
    if (data.users[user].uId === uId) {
      valid = true;
>>>>>>> src/channel.js
      userInfo = user;

    }
  }
  if (valid === false) {
    return {
      error: 'error'
    }
  }
<<<<<<< src/channel.js

  // checking if uId is a member
  for(const member of channelInfo.allMembers){
    if(member === uId){
      return {
        error: 'error'
=======
  for (const channel of data.channels) {
    if (channel.channelId === channelId) {
      for (const member of channel.allMembers) {
        if (member === uId) {
          return {
            error: "error",
          };
        }
>>>>>>> src/channel.js
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
<<<<<<< src/channel.js
      error: 'error',
    }
  }

  // Add invited user to the channel
  channelInfo.allMembers.push(uId); 
  setData(data);
  return {
=======
      error: "error",
    };
  }
>>>>>>> src/channel.js

  }
}

<<<<<<< src/channel.js
export function channelMessagesV1(authUserId, channelId, start){
const data = getData();
let validChannel = false;   
const channelKeys = data.channels;
let channelInfo;

// ERROR CHECKING
// Check if channelId refers to a valid channel
for (const channel of data.channels) {  
  if (channel.channelId === channelId) {
    validChannel = true;
    channelInfo = channel;
  }      
}
=======
  // Add invited user to the channel
  for (const channel in channelKeys) {
    if (data.channels[channel].channelId === channelId) {
      data.channels[channel].allMembers.push(uId);
    }
  }
>>>>>>> src/channel.js

if (validChannel === false) {
return {
    error: 'error'
}
}

// Check if authUserId refers to a valid user
let validAuthuserId = false;
for (const user of data.users) {
  if (user.uId === authUserId) {
    validAuthuserId = true;
  }  
}

if (validAuthuserId === false) {
  return {
    error: 'error'
  }
}
// Checking if authuserId is a member of the given channel 
let isMember = false;
for (const member of channelInfo.allMembers) {
  if (member === authUserId) {
    isMember = true;
  }
}
if (isMember === false) {
  return {
    error: 'error'
}
}
  
// Check if starting index is not greater than the total number
// of messages in the channel
if (start > channelInfo.messages.length) { 
  return {
      error: 'error'
  }
}


// checks if start is at the end 
if (start === channelInfo.messages.length) {
  return {
    messages:[],
    start: start,
    end: -1,
  }
<<<<<<< src/channel.js
}
let messagesArray = [];
let newEnd; 
// if (start + 50 > channelInfo.messages.length) {
//   return {
//     messages: [],
//     start: start,
//     end: start + 50,
//   }
// }
for (let i = start; i < start + 50; i++) {
  if(channelInfo.messages.length === 50) {
    newEnd = -1;
    break;
  } 
  messagesArray.push(channelInfo.messages[i])
}
if (newEnd !== -1) {
  newEnd = start + 50;
}
return {
  messages: messagesArray,
  start: start,
  end: newEnd,
}
 
=======

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
>>>>>>> src/channel.js
}
