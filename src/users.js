import { getData,setData } from "./dataStore.js";

export function userProfileV1(authUserId, uId) {

    const data = getData();
    // Checks if authUserId is valid
    if (!data.users.includes(authUserId)) {
        return {error: 'error'}
    }
    // Checks if uId is valid
    if (!data.users.includes(uId)) {
        return {error: 'error'}
    }
    // Finds the uId and prints relevant data
    for (const user of data.users) {
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