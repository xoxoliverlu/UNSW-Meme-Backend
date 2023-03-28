import { getData, setData } from "./dataStore";
import validator from "validator";
import { Profile } from "./interface";

/**
 * Given a valid token and a uId, displays basic information about the user.
 *
 * @param {string} token - token of current user.
 * @param {number} uId - Unique identifier for a valid user.
 * ...
 *
 * @returns {object} - error if token or uId is invalid,
 *
 * @returns {number} - the uId of the user
 * @returns {string} - first name of the user.
 * @returns {string} - last name of the user.
 * @returns {string} - email of the user.
 * @returns {string} - handle string of the user.
 */
export function userProfileV2(token: string, uId: number) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };
  // Checks if the uId is valid.
  const userInfo = data.users.find((element) => element.uId === uId);
  if (userInfo === undefined) return { error: "Invalid uId" };

  return {
    user:  {
      uId: userInfo.uId,
      nameFirst: userInfo.nameFirst,
      nameLast: userInfo.nameLast,
      email: userInfo.email,
      handleStr: userInfo.handleStr,
    } as Profile,
  };
}

/**
 * Given a valid token, displays basic information about every user.
 *
 * @param {string} token - token of current user.
 * ...
 *
 * @returns {object} - error if token is invalid,
 *
 * @returns {array} users - returns array of user objects
 */
export function usersAllV1(token: string) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };
  // Create an array of user objects.
  const resultUsers = [];
  for (let user of data.users) {
    resultUsers.push({
      uId: user.uId,
      email: user.email,
      nameFirst: user.nameFirst,
      nameLast: user.nameLast,
      handleStr: user.handleStr,
    });
  }

  return { users: { resultUsers } as Profile[] };
}

/**
 * Given a valid token and first name and last name, changes
 * the users first and last name in the system.
 *
 * @param {string} token - token of current user.
 * @param {string} nameFirst - new first name of the user.
 * @param {string} nameLast - new last name of the user.
 * ...
 *
 * @returns {object}  - error if token is invalid,
 *                    - error if nameFirst is not between 1 and 50,
 *                    - error if nameLast is not between 1 and 50.
 *
 * @returns {} - no return if no errors.
 */
export function userProfileSetNameV1(
  token: string,
  nameFirst: string,
  nameLast: string
) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };

  const userInfo = data.users.find((element) => element.uId === auth.uId);
  // Checks the length of nameFirst and nameLast.
  nameFirst = nameFirst.trim();
  nameLast = nameLast.trim();

  if (nameFirst.length < 1 || nameLast.length < 1) {
    return {
      error: "First name or last name is too short",
    };
  }
  if (nameFirst.length > 50 || nameLast.length > 50) {
    return {
      error: "First name or last name is too long",
    };
  }

  userInfo.nameFirst = nameFirst;
  userInfo.nameLast = nameLast;
  setData(data);

  return {};
}

/**
 * Given a valid token and email, changes the users email in the system.
 *
 * @param {string} token - token of current user.
 * @param {string} email - new first email of the user.
 * ...
 *
 * @returns {object}  - error if token is invalid,
 *                    - error if email is not valid,
 *                    - error if email is already in use.
 *
 * @returns {} - no return if no errors.
 */
export function userProfileSetEmailV1(token: string, email: string) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };

  const userInfo = data.users.find((element) => element.uId === auth.uId);
  // Checks if the email is valid using validator.
  email = email.toLowerCase();
  if (!validator.isEmail(email)) return { error: "Invalid email" };
  // checks if the email is already in use.
  for (let user of data.users) {
    if (user.email === email) return { error: "Email already in use" };
  }

  userInfo.email = email;
  setData(data);

  return {};
}

/**
 * Given a valid token and handleStr, changes the users handleStr in the system.
 *
 * @param {string} token - token of current user.
 * @param {string} handleStr - new first handle string of the user.
 * ...
 *
 * @returns {object}  - error if token is invalid,
 *                    - error if handleStr is not valid,
 *                    - error if handleStr is already in use.
 *
 * @returns {} - no return if no errors.
 */
export function userProfileSetHandleV1(token: string, handleStr: string) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };

  const userInfo = data.users.find((element) => element.uId === auth.uId);

  handleStr = handleStr.trim();
  if (handleStr.length < 3 || handleStr.length > 20) {
    return { error: "Length must be between 3 and 20 characters" };
  }

  const isAlphaNumeric = (str: string) => /^[a-z0-9]+$/gi.test(str);
  if (!isAlphaNumeric(handleStr)) {
    return { error: "handleStr must only contain alphanumeric values" };
  }

  // Checks if the handleStr is already in use.
  for (let user of data.users) {
    if (user.handleStr === handleStr) {
      return { error: "handleStr already in use." };
    }
  }

  userInfo.handleStr = handleStr;
  setData(data);

  return {};
}
