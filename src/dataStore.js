// YOU SHOULD MODIFY THIS OBJECT BELOW
let data = { 
  users: [
      {
          uId: 1,
          nameFirst: 'Akanksha',
          nameLast: 'Sood',
          email: 'akanksha.sood@gmail.com',
          password: '123456',
          handleStr: 'akankshasood',
      }, 
      {
        uId: 2,
        nameFirst: 'Oliver',
        nameLast: 'lu',
        email: 'oliverwlu@gmail.com',
        password: '123456',
        handleStr: 'oliverwlu',
    }, 
  ],
  channels: [
      {
          isPublic: true,
          name: 'Hayden',
          channelId: 1,
          ownerMembers:[1],
          allMembers: [1],
          noOfMembers: 1,
          maxMembers: 50,
          messages: [
              {
                  messageId: 1,
                  uId: 1,
                  message: 'Hello world',
                  timeSent: 1582426789,
          }
          ],
          start: 0,
          end: 50
      },  
      {
        isPublic: true,
        name: 'Oli',
        channelId: 2,
        ownerMembers:[2],
        allMembers: [1,2],
        noOfMembers: 1,
        maxMembers: 50,
        messages: [
            {
                messageId: 1,
                uId: 1,
                message: 'Hello world',
                timeSent: 1582426789,
        }
        ],
        start: 0,
        end: 50
    }, 
  ], 
}

// YOU SHOULDNT NEED TO MODIFY THE FUNCTIONS BELOW IN ITERATION 1

/*
Example usage
    let store = getData()
    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Rando'] }

    names = store.names

    names.pop()
    names.push('Jake')

    console.log(store) # Prints { 'names': ['Hayden', 'Tam', 'Rani', 'Giuliana', 'Jake'] }
    setData(store)
*/

// Use get() to access the data
function getData() {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
// - Only needs to be used if you replace the data store entirely
// - Javascript uses pass-by-reference for objects... read more here: https://stackoverflow.com/questions/13104494/does-javascript-pass-by-reference
// Hint: this function might be useful to edit in iteration 2
function setData(newData) {
  data = newData;
}

export { getData, setData };
