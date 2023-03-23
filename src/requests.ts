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