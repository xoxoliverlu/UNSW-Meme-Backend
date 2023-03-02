import { getData, setData } from './dataStore.js';



function clearV1() {
  const data = getData();
  data.channels = [];
  data.users = [];
  setData(data);

}

export {clearV1};