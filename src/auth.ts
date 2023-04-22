import { getData, setData } from './dataStore';
import { Notif } from './interfaces';
import config from './config.json';
import validator from 'validator';
import HTTPError from 'http-errors';
const bcrypt = require('bcrypt');
import { v4 as uuidv4 } from 'uuid';

const saltRounds = 10;

// Return type(s)
type authUserId = {
  token?: string;
  authUserId?: number;
  error?: string;
};

/**
 * Generates a unique token for the given user ID and stores it in the data object.
 *
 * @param {number} uId - The user ID for which the token should be generated.
 * @returns {string} - The generated unique token.
 */
const generateToken = (uId: number): string => {
  const data = getData();
  // Generate unique token
  const tokenString = uuidv4().toString();
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
 * Generates a unique handle for the given first and last name by converting
 * the names to lowercase, removing non-alphanumeric characters, and appending
 * a number if necessary.
 *
 * @param {string} - first name of the user
 * @param {string} - last name of the user
 *
 * @param {string} nameFirst - The first name of the user.
 * @param {string} nameLast - The last name of the user.
 * @returns {string} - The generated unique handle.
 */
const generateHandle = (nameFirst: string, nameLast: string): string => {
  const data = getData();
  const baseHandle = (nameFirst + nameLast).toLowerCase().replace(/[^a-z0-9]/gi, '').slice(0, 20);

  let newHandle = baseHandle;
  let appendNumber = 0;

  while (data.users.some(user => user.handleStr === newHandle)) {
    newHandle = baseHandle + appendNumber;
    appendNumber++;
  }

  return newHandle;
};

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
  // Iteration 2 + 3
  const token = generateToken(login.authUserId);
  return {
    token: token,
    authUserId: login.authUserId
  };
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
  // Check if email exists
  const user = data.users.find((item) => item.email === email);
  if (!user) { throw HTTPError(400, 'Email does not exist.'); }
  // Compare provided password with stored hashed password
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);
  if (!isPasswordCorrect) { throw HTTPError(400, 'Incorrect password.'); }

  return { authUserId: user.uId };
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
  const token = generateToken(register.authUserId);
  return {
    token: token,
    authUserId: register.authUserId,
  };
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
  // Conver email to lowercase
  email = email.toLowerCase();
  // Eliminate white spaces in parameters
  password = password.trim();
  nameFirst = nameFirst.trim();
  nameLast = nameLast.trim();

  // Error checking
  // Invalid email using validator package
  if (!validator.isEmail(email)) { throw HTTPError(400, 'Invalid Email'); }
  // Email already in use
  if (data.users.find(item => item.email === email)) { throw HTTPError(400, 'Email already in use.'); }
  // Password length
  if (password.length < 6) { throw HTTPError(400, 'Password length less than 6 characters'); }
  // Length of name
  if (nameFirst.length < 1 || nameLast.length < 1) { throw HTTPError(400, 'First name or last name is too short'); }
  if (nameFirst.length > 50 || nameLast.length > 50) { throw HTTPError(400, 'First name or last name is too long'); }

  // Generate handle
  const newHandle = generateHandle(nameFirst, nameLast);
  // Generate userID
  const newUserId = data.lastAuthUserId + 1;
  data.lastAuthUserId = newUserId;
  // Permissions !!!
  const permission = (newUserId === 1) ? 1 : 2;

  // Hash password
  const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));

  // Profile image
  const PORT: number = parseInt(process.env.PORT || config.port);
  const HOST: string = process.env.IP || 'localhost';

  // Create new user Object
  const newUser = {
    uId: newUserId,
    nameFirst: nameFirst,
    nameLast: nameLast,
    email: email,
    password: passwordHash,
    handleStr: newHandle,
    globalPerm: permission,
    notification: [] as Notif[],
    profileImgUrl: `http://${HOST}:${PORT}/img/default.jpg`,
  };
  // Update data
  data.users.push(newUser);
  data.channelStats.push({uId: newUserId, stat:[{numChannelsJoined: 0, timeStamp: Date.now()}]});
  data.dmStats.push({uId: newUserId, stat:[{numDmsJoined: 0, timeStamp: Date.now()}]});
  data.messageStats.push({uId: newUserId, stat:[{numMessagesSent: 0, timeStamp: Date.now()}]});
  if(data.users.length === 1){
    data.channelsExistStat.push({numChannelsExist: 0, timeStamp: Date.now()});
    data.dmsExistStat.push({numDmsExist: 0, timeStamp: Date.now()});
    data.msgsExistStat.push({numMessagesExist: 0, timeStamp: Date.now()});
  }
  setData(data);
  return {
    authUserId: newUser.uId,
  };
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
  if (!auth) {
    throw HTTPError(403, 'Invalid Token. ');
  }
  // Delete token
  data.tokens = data.tokens.filter((pair) => pair.token !== auth.token);
  setData(data);
  return {};
};

// Export all functions
export { authRegisterV2, authLoginV2, authLogoutV1 };
