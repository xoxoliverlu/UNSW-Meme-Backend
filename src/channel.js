function channelDetailsV1(authUserId, channelId) {
    return {
        name: 'Hayden',
        ownerMembers: [
            {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
            }
        ],
        allMembers: [
            {
            uId: 1,
            email: 'example@gmail.com',
            nameFirst: 'Hayden',
            nameLast: 'Jacobs',
            handleStr: 'haydenjacobs',
            }
        ],
    };
}

function ChannelJoinV1(authUserId, channelId) {
    return {

    }
}

function channelInviteV1(authUserId, channelId, uId){
    return {
        
    }
}