const request = require("sync-request");
import { port, url} from "./config.json";

export const requestAuthLogin = (email: string, password: string) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/auth/login/v2',
        {
            json: {
                email,
                password
            }
        }
    );
    // expect status code to be OK
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
    const res1 = request(
        'POST',
        `${url}:${port}` + '/auth/register/v2',
        {
            json: {
                email,
                password,
                nameFirst,
                nameLast
            }
        }
    );
    if (res1.statusCode === 200) {
        return JSON.parse(res1.getBody() as string);
    }
    return res1.statusCode;
}

export const requestAuthLogout = (token: string) => {
    const res3 = request(
        'POST',
        `${url}:${port}` + '/auth/logout/v1',
        {
            json:{
                token
            }
        }
    );
    return JSON.parse(res3.getBody() as string);
}

export const requestClear = () => {
    const res4 = request(
        'DELETE',
        `${url}:${port}` + '/clear/v1',
        {}
    );
    return JSON.parse(res4.getBody() as string);
}

export const requestDmCreate = (token: string, uIds: number[]) => {
    const res5 = request(
        'POST',
        `${url}:${port}` + '/dm/create/v1',
        {
            json: {
                token,
                uIds
            }
        }
    );
    if (res5.statusCode === 200) {
        return JSON.parse(res5.getBody() as string);
    }
    return res5.statusCode;
}

export const requestChannelsCreate = (token: string, name: String, isPublic: boolean) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/channels/create/v2',
        {
            json: {
                token: token,
                name: name,
                isPublic: isPublic
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestChannelsList = (token: string) => {
    const res = request(
        'GET',
        `${url}:${port}` + '/channels/list/v2',
        {
            qs: {
                token: token,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestChannelsListAll = (token: string) => {
    const res = request(
        'GET',
        `${url}:${port}` + '/channels/listall/v2',
        {
            qs: {
                token: token,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestChannelDetails = (token: string, channelId: number) => {
    const res = request(
        'GET',
        `${url}:${port}` + '/channel/details/v2',
        {
            qs: {
                token: token,
                channelId: channelId,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestChannelJoin = (token: string, channelId: number) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/channel/join/v2',
        {
            json: {
                token: token,
                channelId: channelId,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestUserProfile = (token: string, uId: number) => {
    const res = request(
        'GET',
        `${url}:${port}` + '/user/profile/v2',
        {
            qs: {
                token: token,
                uId: uId,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestUsersAll = (token: string) => {
    const res = request(
        'GET',
        `${url}:${port}` + '/users/all/v1',
        {
            qs: {
                token: token,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestUserProfileSetName = (token: string, nameFirst: string, nameLast: string) => {
    const res = request(
        'PUT',
        `${url}:${port}` + '/user/profile/setname/v1',
        {
            json: {
                token: token,
                nameFirst: nameFirst,
                nameLast: nameLast,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestUserProfileSetEmail = (token: string, email: string) => {
    const res = request(
        'PUT',
        `${url}:${port}` + '/user/profile/setemail/v1',
        {
            json: {
                token: token,
                email: email,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestUserProfileSetHandle = (token: string, handleStr: string) => {
    const res = request(
        'PUT',
        `${url}:${port}` + '/user/profile/sethandle/v1',
        {
            json: {
                token: token,
                handleStr: handleStr,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestChannelAddOwner = (token: String, channelId: number, uId: number) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/channel/addowner/v1',
        {
            json: {
                token: token,
                channelId: channelId,
                uId: uId
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestChannelInvite = (token: String, channelId: number, uId: number) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/channel/invite/v2',
        {
            json: {
                token: token,
                channelId: channelId,
                uId: uId
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestChannelRemoveOwner = (token: String, channelId: number, uId: number) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/channel/removeowner/v1',
        {
            json: {
                token: token,
                channelId: channelId,
                uId: uId
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestChannelLeave = (token: String, channelId: number) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/channel/leave/v1',
        {
            json: {
                token: token,
                channelId: channelId,
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestDmList = (token: String) => {
    const res = request(
        'GET',
        `${url}:${port}` + '/dm/list/v1',
        {
          qs: {
            token
          }
        }
      );
      if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
      }
      return res.statusCode;
}

export const requestDmRemove = (token: string, dmId: number) => {
	const res = request(
		'DELETE',
		`${url}:${port}` + '/dm/remove/v1',
		{
		qs: {
				token,
				dmId,
		}
		}
	);
	if (res.statusCode === 200) {
		return JSON.parse(res.body as string);
	}
	return res.statusCode;
}