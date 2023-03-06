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