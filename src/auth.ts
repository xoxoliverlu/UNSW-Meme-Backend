import { getData, setData } from './dataStore';
import validator from 'validator';

type authUserId = {

    token?: string;
    authUserId?: number;
    error?: string;

};

type tokenReturn = string;
type handleReturn = string;

const authLoginV2 = (email: string, password: string): authUserId => {
  const login = authLoginV1(email, password);
  if ('authUserId' in login) {
    const token = generateToken(login.authUserId);
    return {
      token: token,
      authUserId: login.authUserId
    };
  }
  return login;
};
/**
  * Returns a unique authUserId value with a
  * given registerd user email and password
  *
  * @param {string} email - the email address the user is registered with
  * @param {string} password -  the password that they will use to login with once registered
  * ...
  *
  * @returns {number} -  a unique integer as the userId
  * @returns {object} - error if email or password is invalid
*/
const authLoginV1 = (email: string, password: string): authUserId => {
  const data = getData();
  // Error checking
  // change email to lowercase
  email = email.toLowerCase();
  for (const userObject of data.users) {
    if (userObject.email === email && userObject.password === password) {
      return {
        authUserId: userObject.uId,
      };
    }
  }
  return {
    error: 'Invalid email or password',
  };
};

const authRegisterV2 = (email: string, password: string, nameFirst: string, nameLast: string): authUserId => {
  const register = authRegisterV1(email, password, nameFirst, nameLast);
  if ('authUserId' in register) {
    const token = generateToken(register.authUserId);
    return {
      token: token,
      authUserId: register.authUserId,
    };
  }
  return register;
};
/**
  * Register a user given their email, password, nameFirst and nameLast.
  * Also generate a unique handleStr for each user.
  *
  * @param {string} email - the email address the user is registering with
  * @param {string} password -  the password the user is registering with
  * @param {string} nameFirst - the first name of the user
  * @param {string} nameLast - the last name of the user
  * ...
  *
  * @returns {number} -  return a unique user ID for the user
  * @returns {object} - error if email is invaid or already exists, password is too short,
  *                     or there is invalid length for firstName or lastName
*/
const authRegisterV1 = (email: string, password: string, nameFirst: string, nameLast: string): authUserId => {
  const data = getData();
  // Error checking
  // Invalid email using validator package
  email = email.toLowerCase();
  if (validator.isEmail(email) === false) {
    return {
      error: 'Invalid email',
    };
  }

  // Email already in use
  for (const userObject of data.users) {
    if (userObject.email === email) {
      return {
        error: 'Email already in use',
      };
    }
  }

  // Eliminate white spaces in parameters
  password = password.trim();
  nameFirst = nameFirst.trim();
  nameLast = nameLast.trim();

  // Password length
  if (password.length < 6) {
    return {
      error: 'Password length less than 6 characters',
    };
  }
  // Length of name
  if (nameFirst.length < 1 || nameLast.length < 1) {
    return {
      error: 'First name or last name is too short',
    };
  }
  if (nameFirst.length > 50 || nameLast.length > 50) {
    return {
      error: 'First name or last name is too long',
    };
  }

  // Generate handle
  const newHandle = generateHandle(nameFirst, nameLast);
  // Generate userID
  const newUserId = data.lastAuthUserId + 1;
  data.lastAuthUserId = newUserId;
  // Permissions !!!
  const permission = (newUserId === 1) ? 1 : 2;

  // Create new user Object
  const newUser = {
    uId: newUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: password,
    handleStr: newHandle,
    globalPerm: permission,
  };
  // Update data
  data.users.push(newUser);
  setData(data);
  return {
    authUserId: newUser.uId,
  };
};

const generateToken = (uId: number): tokenReturn => {
  const data = getData();
  const tokenNumber = data.lastToken + 1;
  const tokenString = tokenNumber.toString();
  data.lastToken = tokenNumber;
  data.tokens.push(
    {
      token: tokenString,
      uId: uId
    }
  );
  setData(data);
  return tokenString;
};

const generateHandle = (nameFirst: string, nameLast: string): handleReturn => {
  const data = getData();
  // Create unique handle
  const concatName = nameFirst.toLowerCase() + nameLast.toLowerCase();
  // Replace alpha numeric characters
  let alphaNumericStr = concatName.replace(/[^a-z0-9]/gi, '');
  alphaNumericStr = alphaNumericStr.slice(0, 20);

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
  return newHandle;
};

const authLogoutV1 = (token: string) => {
  const data = getData();
  // Check for a valid token
  const auth = data.tokens.find(item => item.token === token);
  if (auth === undefined) {
    return { error: 'Invalid token' };
  }
  // Delete token
  data.tokens = data.tokens.filter((pair) => pair.token !== token);
  setData(data);
  return {};
};
export { authRegisterV1, authRegisterV2, authLoginV2, authLogoutV1 };
