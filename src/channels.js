function channelsCreateV1(authUserId, name, isPublic){
    return {
         channelId: 1 
    };
}

function channelsListV1(authUserId){
    return {
        channels: [
          {
            channelId: 1,
            name: 'My Channel',
          }
        ],
      };
      
}
function channelsListAllV1(authUserId){
  const data = getData();
  let validId = false;

  for (user of data.users){
    if (user.uid == authUserId){
      validId = true
    }
  }
  
  if (!validId){
    return {error: 'error'};
  }
  
  let result = [];

  for (channel of data.channels){
    result.push({channelId: channel.channelId, name: channel.name})  
  }
  
    return {
        channels: result,
    };
}


