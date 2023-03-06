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

function channelJoinV1(authUserId, channelId) {
    return {
        
    }
}

function channelInviteV1(authUserId, channelId, uId){
    return {

    }
}

function channelMessagesV1(authUserId, channelId, start){
    return {
        
            messages: [
              {
                messageId: 1,
                uId: 1,
                message: 'Hello world',
                timeSent: 1582426789,
              }
            ],
            start: 0,
            end: 50,
        
    }
}