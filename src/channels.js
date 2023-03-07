import { getData,setData } from "./dataStore";

export function channelsCreateV1(authUserId, name, isPublic){
  const data = getData();
  let validUser = false;
  
  // Check that the length of name is more than 1 or less than 20 characters
  for (const user of data.users) {  
    if (user.uId === authUserId) {
      validUser = true;
    }
  }
  if (validUser === false) {
    return {
      error: 'error'
    }
  }
  if (name.length < 1) {
    return {
      error: 'error'
    }
  }  
  if (name.length > 20) {
    return {
      error: 'error'
    }

    // Assign information to the new channel
    data.channels.push({
      channelId: Id, 
      name: name,
      isPublic: isPublic,
      allMembers: [authUserId],
      ownerMembers: [authUserId],
      messages:[],
    })

  }

  
  // Check for any duplicate names
  for (const channel of data.channels) {
    if (name === channel.name) {
      return {
        error: 'error'
      }
    }
  }

  let Id = 0;
  if (data.channels.length === 0) {
      Id = 0;
  } else {
      Id = data.channels[data.channels.length - 1] + 1;
  }
  // Assign information to the new channel
  data.channels.push({
    channelId: Id, 
    name: name,
    isPublic: isPublic,
    allMembers: [authUserId],
    ownerMembers: [authUserId]
  })

  setData(data);
  return {
    channelId: Id
  }
}  


export function channelsListV1(authUserId){
  const data = getData();
  let validId = false;

  for (let user of data.users){
    if (user.uId === authUserId){
      validId = true
    }
  }
  
  if (!validId){
    return {error: 'error'};
  }

  let associatedChannels = [];
  
  for (let channel of data.channels){
    if (channel.allMembers.includes(authUserId)){
      associatedChannels.push({channelId:channel.channelId, name:channel.name})
    }
  }

  return {channels: associatedChannels};
      
}

export function channelsListAllV1(authUserId){
  const data = getData();
  let validId = false;

  for (let user of data.users){
    if (user.uId === authUserId){
      validId = true
    }
  }
  
  if (!validId){
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


