import { getData, setData } from './dataStore';
import { Message } from './interfaces';
const dmCreateV1 = (token: string, uIds: number[]) => {
  const data = getData();
	// Error check: invalid uId in uIds
	for (const id of uIds) {
		const userInfo = data.users.find((element) => element.uId === uId);
		if (userInfo === undefined) return { error: "Invalid uId" };
	}
	// Duplicate uId in uIds
	const unique = Array.from(new Set(uIds));
	if (uIds.length !== unique.length) {
		return {
			error: 'Duplicate uId in uIds'
		}
	}
	// Invalid token
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
		owner: auth.uId,
		uIds: uIds,
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
	const auth = data.tokens.find((item) => item.token === token);
  if (auth === undefined) return { error: "Invalid token" };

  const data = getData();
  const dms = [];

  for (const dm of data.dms) {
    // check if user is owner / member of a dm
    if (tokenId.uId === dm.ownerId || dm.uIds.includes(auth.uId)) {
      dms.push({
        dmId: dm.dmId,
        name: dm.name,
      });
    }
  }

  return { dms: dms };
}
