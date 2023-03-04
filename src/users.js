import { getData,setData } from "./dataStore.js";

export function userProfileV1(authUserId, uId) {

    const data = getData();
    // Checks if authUserId is valid
    let validAuthId = false;
    for (let user of data.users) {
        if (user.uId === authUserId) {
            validAuthId = true
        }
    }
    
    if (!validAuthId){
        return {error: 'error'};
    }
    // Checks if uId is valid
    let validUserId = false;
    for (let user of data.users) {
        if (user.uId === uId) {
            validUserId = true
        }
    }
    
    if (!validUserId){
        return {error: 'error'};
    }
    // Finds the uId and prints relevant data
    for (let user of data.users) {
        if (user.uId === uId) {
            return {
                uId: user.uId,
                nameFirst: user.nameFirst,
                nameLast: user.nameLast,
                email: user.email,
                handleStr: user.handleStr,
            }
        }
    }
}