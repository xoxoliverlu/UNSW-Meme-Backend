import { getData, setData } from './dataStore';
import validator from 'validator';

// Return types
type authUserId = {
    token?: string;
    authUserId?: number;
    error?: string;
};
type tokenReturn = string;
type handleReturn = string;
/**
  * Returns a unique authUserId value and token with a
  * given registerd user email and password
  *
  * @param {string} email - the email address the user is registered with
  * @param {string} password -  the password that they will use to login with once registered
  * ...
  *
  * @returns {number} -  a unique integer as the userId
  * @return {string} = a unique string as the token
  * @returns {object} - error if email or password is invalid
*/
const authLoginV2 = (email: string, password: string): authUserId => {
  // Iteration 1
  const login = authLoginV1(email, password);
  // Iteration 2
  if ('authUserId' in login) {
    const token = generateToken(login.authUserId);
    return {
      token: token,
      authUserId: login.authUserId
    };
  }
  // Return error
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
  const authUserId = data.users.find((item) => item.email === email && item.password === password);
  // Error check
  if (authUserId !== undefined) {
    return { authUserId: authUserId.uId };
  }
  return {
    error: 'Invalid email or password',
  };
};

/**
  * Register a user given their email, password, nameFirst and nameLast.
  * Also generate a unique handleStr and unique token for each user.
  *
  * @param {string} email - the email address the user is registering with
  * @param {string} password -  the password the user is registering with
  * @param {string} nameFirst - the first name of the user
  * @param {string} nameLast - the last name of the user
  * ...
  *
  * @returns {number} -  return a unique user ID for the user
	* @returns {string} - return a unique user token for the user
  * @returns {object} - Invalid parameters from authRegisterV1
*/

const authRegisterV2 = (email: string, password: string, nameFirst: string, nameLast: string): authUserId => {
  // Iteration 1
	const register = authRegisterV1(email, password, nameFirst, nameLast);
  if ('authUserId' in register) {
    const token = generateToken(register.authUserId);
    return {
      token: token,
      authUserId: register.authUserId,
    };
  }
	// Return error
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
  if (!validator.isEmail(email)) {
    return {
      error: 'Invalid email',
    };
  }

  // Email already in use
	const emailFound = data.users.find((item) => item.email === email);
	if (emailFound !== undefined) {
		return { error: 'Email already in use'};
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

/**
 * Helper function - Generate a unique token for user with a valid userId.
 * Convert this token to a string and return
 *
 * @param {number} - authUserId of user
 *
 * @returns {string} - token unique to the user
 */
const generateToken = (uId: number): tokenReturn => {
  const data = getData();
  // Generate unique token
	const tokenNumber = data.lastToken + 1;
	// Convert to string
  const tokenString = tokenNumber.toString();
	// Update last token
  data.lastToken = tokenNumber;
	// Add to dataset
  data.tokens.push(
    {
      token: tokenString,
      uId: uId
    }
  );
  setData(data);
  return tokenString;
};

/**
 * Generate a unique handle string for user by converting
 * their name to lowercase and appending a digit if necessarry
 *
 * @param {string} - first name of the user
 * @param {string} - last name of the user
 *
 * @returns {string} - handleString unique to the user
 */
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

/**
  * Given a valid token for a user, logs them out by deactivating their token
  *
  * @param {string} token - a string token unique to the user
  * ...
  *
  * @returns {object} - empty object when the token is successfully deleted
  * @returns {object} - error if the token is not valid
*/
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
// Export all functions
export { authRegisterV2, authLoginV2, authLogoutV1 };
