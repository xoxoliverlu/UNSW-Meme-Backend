import {getData, setData} from './dataStore.js';
import validator from 'validator';
// Stub function for authLoginV1
function authLoginV1(email, password) {
    let data = getData();
    // Error checking
    // Email does not belong to a user
    let emailExist = false;
    let user;
    for (const userObject of data.users) {
        if (userObject.email === email) {
            emailExist = true;
            user = userObject;
        }
    }
    if (emailExist === false || user.password != password) {
        return {
            error: 'Invalid email or password',
        };
    }

    return {
        authUserId: user.uId,
    };
}


// Stub function for authRegisterV1
function authRegisterV1(email, password, nameFirst, nameLast) {
    const data = getData();
    // Error checking
    // Invalid email using validator package
    if (validator.isEmail(email) === false) {
        return {
            error: 'Invalid email',
        };
    }

    // Email already in use
     for (const userObject of data.users) {
        if (userObject.email === email.toLowerCase()) {
            return {
                error: 'Email already in use',
            };
        }
    }


    // Password length
    if (password.length < 6) {
        return {
            error: 'Password length less than 6 characters',
        };
    }
    // Length of name
    if (nameFirst.length < 1 || nameFirst.length > 50 || nameLast.length < 1 || nameLast.length > 50) {
        return {
            error: 'Invalid name length',
        };
    }

    // Create unique handle
    let concatName = nameFirst.toLowerCase() + nameLast.toLowerCase();
    // Replace alpha numeric characters
    let alphaNumericStr = concatName.replace(/[^a-z0-9]/gi, '');
    if (alphaNumericStr.length > 20) {
        alphaNumericStr = alphaNumericStr.slice(0, 20);
    }

    // Check if someone already has this handle
    let index = 0;
    let counter = 0;
    // the counter will increase every time the handlestr is different to an existing user's handlestr
    // if the handlestr is the same, it resets to 0
    // if loop is able to loop through all users with the handlestr being unique (counter = data.users.length), break loop
    // then the handlestr is good to go
    let appendNumber = -1;
    // The number to append

    let newHandle = alphaNumericStr;

    while (true) {
        // Check if looped through everything with no matches
        if (counter === data.users.length) {
            break;
        }

        // handleStr in use
        if (data.users[index].handleStr === newHandle) {
            counter = 0;
            index = 0;
            appendNumber++;
            newHandle = alphaNumericStr + appendNumber;
        } else {
            counter++;
            index++;
        }
    }
    // Generate userID
    let newUserId;
    // Find next available userID
    if (data.users.length === 0) {
        newUserId = 0;
    } else {
        newUserId = data.users[data.users.length - 1].uId + 1;
    }
    // Permissions !!!
    let permission = 2;
    if (data.users.length === 0) {
        // first user signing up
        permission = 1;
    }
    // Create new user Object
    let newUser = {
        uId: newUserId,
        nameFirst: nameFirst,
        nameLast: nameLast,
        email: email,
        password: password,
        handleStr: newHandle,
        globalPerm: permission,
    }
    // Update data
    data.users.push(newUser);
    setData(data);
    return {
        authUserId: newUser.uId,
    };
}

export {authRegisterV1, authLoginV1};