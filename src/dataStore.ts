// YOU SHOULD MODIFY THIS OBJECT BELOW
import { DataStoreM } from './db/models';
import { User, Channel, TokenPair, DataStore, DM, PwReset, ChannelStat, DmStat, MessageStat, ChannelsExistStat, DmsExistStat, msgsExistStat } from './interfaces';
import fs from 'fs';
let data = {
  users: [] as User[],
  channels: [] as Channel[],
  lastAuthUserId: 0,
  lastChannelId: 0,
  lastMessageId: 0,
  tokens: [] as TokenPair[],
  dms: [] as DM[],
  lastDmId: 0,
  pwReset: [] as PwReset[],
  channelStats: [] as ChannelStat[],
  dmStats: [] as DmStat[],
  messageStats: [] as MessageStat[],
  channelsExistStat: [] as ChannelsExistStat[],
  dmsExistStat: [] as DmsExistStat[],
  msgsExistStat: [] as msgsExistStat[],
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
export async function fileLoadData() {
  // Check that the file exists locally
  if (!fs.existsSync('data.json')) {
    fileSaveData();
  } else {
    // Read the file
    data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
    // Drop previous data()
    await DataStoreM.deleteMany({});
    // create new data
    const newData = new DataStoreM(data);
    await newData.save();
  }
}

export { getData, setData };
