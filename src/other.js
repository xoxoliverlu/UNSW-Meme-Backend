import { getData, setData } from './dataStore.js';



function clearV1() {
  const data = getData();
  data.users = [];
  data.channels = [];
  setData(data);
}

export {clearV1};