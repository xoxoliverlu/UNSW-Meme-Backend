import { getData, setData } from './dataStore';
import HTTPError from 'http-errors';

/**
 * Given a valid token and uId and permissionId, changes
 * the users permissions in the system.
 *
 * @param {string} token - token of current user.
 * @param {number} uId - uId of the user to change.
 * @param {number} permissionId - 1 for owner 2 for user.
 * ...
 *
 * @returns {object}  - error if token is invalid,
 *                    - error if uId is invalid,
 *                    - error if permissionId is invalid,
 *                    - error if token is invalid,
 *                    - error if auth is not a global owner,
 *                    - error if the last owner is demoting himself,
 *                    - error if the user's permissionsId is the same as permissionId,
 *
 * @returns {} - nil return if no errors.
 */
export function adminUserPermissionChangeV1(token: string, uId: number, permissionId: number) {
  const data = getData();
  // Checks if the token is valid.
  const auth = data.tokens.find((item) => item.token === token);
  if (!auth) {
    throw HTTPError(403, 'Invalid Token.');
  }
  const authInfo = data.users.find((element) => element.uId === auth.uId);
  // Checks if the uId is valid.
  const userInfo = data.users.find((element) => element.uId === uId);
  if (!userInfo) {
    throw HTTPError(400, 'Invalid uId.');
  }
  // Checks if permissionId is valid.
  if (permissionId !== 1 && permissionId !== 2) {
    throw HTTPError(400, 'Invalid permissionId.');
  }
  // Checks if the authorised user is not a global owner.
  if (authInfo.globalPerm === 2) {
    throw HTTPError(403, 'Authorised user is not a global owner.');
  }
  // Checks if theres only one global owner and they're being demoted to a user.
  if (userInfo.globalPerm === 1) {
    const globalOwners = data.users.filter(item => item.globalPerm === 1);
    if (globalOwners.length === 1) {
      throw HTTPError(400, 'Cannot demote last global owner to a user.');
    }
  }
  // Checks if the user already has the permissions level of permissionId.
  if (userInfo.globalPerm === permissionId) {
    throw HTTPError(400, 'user already has the permissions level of permissionId.');
  }

  userInfo.globalPerm = permissionId;
  setData(data);

  return {};
}