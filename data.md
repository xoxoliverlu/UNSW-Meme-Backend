```javascript
let data = {
    users: [
        {
            uId: 1,
            nameFirst: 'Akanksha'
            nameLast: 'Sood'
            email: 'akanksha.sood@gmail.com',
            password: '123456',
            handleStr: 'akankshasood',
        },
        {
            uId: 2,
            nameFirst: 'Fady'
            nameLast: 'Sadek'
            email: 'fady.sadek@gmail.com',
            password: 'password',
            handleStr: 'fadysadek',
        },
    ],
    channels: [
        {
            isPublic: true
            name: 'Hayden'
            channelId: 1
            ownerMembers: [ 1 ],
            allMembers: [ 1, 2],
            noOfMembers: 2
            maxMembers: 50
            messages: [
                {
                    messageId: 1,
                    uId: 1,
                    message: 'Hello world',
                    timeSent: 1582426789,
                }
            ]
            start: 0
            end: 50
        },
    ],
    lastAuthUserId: 0,
    lastChannelId: 0,
    lastToken: 0,
    tokens: [
        {
            token: 0,
            uId: 1,
        },
        {
            token: 1,
            uId: 2,
        }
    ],
    dms: [
        dmId: newId,
        name: name,
        ownerId: auth.uId,
        uIds: uIds,
        messages: [],
    ],
    lastDmId: 0,
}
```

[Optional] short description: