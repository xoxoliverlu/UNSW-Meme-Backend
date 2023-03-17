import { getData, setData } from "./dataStore"

export function validUserId(id: number){
    const data = getData();
    if (data.users.find(item => item.uId === id)){
        return true;
    }
    return false;
}