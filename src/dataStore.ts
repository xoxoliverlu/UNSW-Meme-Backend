// YOU SHOULD MODIFY THIS OBJECT BELOW
import { User, Channel, TokenPair, DataStore, DM, PwReset } from './interfaces';
import fs from 'fs';
let data = {
  users: [] as User[],
  channels: [] as Channel[],
  lastAuthUserId: 0,
  lastChannelId: 0,
  lastToken: 0,
  lastMessageId: 0,
  tokens: [] as TokenPair[],
  dms: [] as DM[],
  lastDmId: 0,
  pwReset: [] as PwReset[]
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
function getData(): DataStore {
  return data;
}

// Use set(newData) to pass in the entire data object, with modifications made
// - Only needs to be used if you replace the data store entirely
// - Javascript uses pass-by-reference for objects... read more here: https://stackoverflow.com/questions/13104494/does-javascript-pass-by-reference
// Hint: this function might be useful to edit in iteration 2
function setData(newData: DataStore) {
  data = newData;
  fileSaveData();
}

// Saves the data to a file dataStore.json
function fileSaveData() {
  fs.writeFileSync('data.json', JSON.stringify(data));
}

// Updates the data based on the contents of dataStore.json
export function fileLoadData() {
  // Check that the file exists locally
  if (!fs.existsSync('data.json')) {
    fileSaveData();
  } else {
    // Read the file
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
  }
}

export { getData, setData };
