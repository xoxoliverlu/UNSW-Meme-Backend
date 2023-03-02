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
    ],
    channels: [
        {
            isPublic: true
            name: 'Hayden'
            channelId: 1
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
            noOfMembers: 1
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
}
```

[Optional] short description: 