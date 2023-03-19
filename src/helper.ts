import { getData, setData } from "./dataStore"

export function validUserId(id: number){
    const data = getData();
    let found = data.users.find(item => item.uId === id)
    if (found){
        return {
            user: found,
            validUserId: true,
        };
    }
    return {
        validUserId: false
    };
}