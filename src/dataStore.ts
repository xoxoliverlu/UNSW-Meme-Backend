// YOU SHOULD MODIFY THIS OBJECT BELOW
type Message = {
  messageId: number;
  uId: number;
  message: string;
  timeSent: number;
}
type User = {
  uId: number;
  nameFirst: string;
  nameLast: string;
  email: string;
  password: string;
  handleStr: string;
  globalPerm: number;
};

type Channel = {
  channelId: number;
  name: string;
  ownerMembers: number[];
  allMembers: number[];
  messages: Message[];
  isPublic: boolean;
};

type TokenPair = {
  token: string;
  authUserId: number;
}
const data = {
  users: [] as User[],
  channels: [] as Channel[],
  lastAuthUserId: 0,
  lastChannelId: 0,
  lastToken: 0,
  tokens: [] as TokenPair[],
};

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
