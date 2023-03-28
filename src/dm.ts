import { getData, setData } from './dataStore';
import { Message } from './interfaces';
import { authRegisterV2} from './auth'
const dmCreateV1 = (token: string, uIds: number[]) => {
  const data = getData();
	// Error check: invalid uId in uIds
	let userInfo;
	for (const id of uIds) {
		userInfo = data.users.find((element) => element.uId === id);
		if (userInfo === undefined) return { error: "Invalid uId" };
	}

	// Duplicate uId in uIds
	const unique = Array.from(new Set(uIds));
	if (uIds.length !== unique.length) {
		return {
			error: 'Duplicate uId in uIds'
		}
	}

	const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };

	// Create dmId
	const newId = data.lastDmId + 1;
	data.lastDmId = newId;
	// Create name of dm
	// Create an array with ownerId and all uIds
	const arrayAll = uIds.slice();
	arrayAll.push(auth.uId);

	// Convert to handelStr
	const handleStrArr = [];
	for (const id of arrayAll) {
		for (const user of data.users) {
			if (id === user.uId) {
				handleStrArr.push(user.handleStr);
			}
		}
	}
	handleStrArr.sort();
	// Add commas between all handle strings
	const name = handleStrArr.join(', ');
	const dm = {
		dmId: newId,
		name: name,
		ownerId: auth.uId,
		messages: [] as Message[]
	};

	data.dms.push(dm);
	setData(data);

	return {
		dmId: newId,
	}

}

const dmListV1 = (token: string) => {
  // check if token passed in is valid
  // Invalid token
	const data = getData();
  const dms = [];

	const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };



  for (const dm of data.dms) {
    // check if user is owner / member of a dm
    if (auth.uId === dm.ownerId || dm.uIds.includes(auth.uId)) {
      dms.push({
        dmId: dm.dmId,
        name: dm.name,
      });
    }
  }

  return { dms: dms };
}

const dmRemoveV1 = (token: string, dmId: number) => {
	// Error check
	// Valid token

  // check if token passed in is valid
  const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };

  // check if dmId passed in is valid
	const validDmId = data.dms.find((item) => item.dmId === dmId);
	if (validDmId === undefined) return {error: "Invalid dmId"};

  // check if user is a member of dm
	let isMember = false;
	let isOwner = false;
	for (const dm of data.dms) {
    // check if user is owner / member of a dm
    if (auth.uId === dm.ownerId) {
			isOwner = true;
		}
		if (dm.uIds.includes(auth.uId)) {
      isMember = true;
    }
  }
	if (isMember === false || isOwner === false) {
		return {error: 'User is not a member or ownere of the channel'}
	}

	// Remove Dm
  const data = getData();
  const toRemoveDm = data.dms.filter((dm) => dm.dmId === dmId)[0];

  // remove dm from dataStore
  data.dms = data.dms.filter((dm) => dm.dmId !== dmId);
  setData(data);

  return {};
}
export { dmCreateV1, dmListV1, dmRemoveV1 };
