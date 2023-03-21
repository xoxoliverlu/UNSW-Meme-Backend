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
    const res = request(
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
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}

export const requestAuthLogout = (token: string) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/auth/logout/v1',
        {
            json:{
                token
            }
        }
    );
    return JSON.parse(res.getBody() as string);
}

export const requestClear = () => {
    const res = request(
        'DELETE',
        `${url}:${port}` + '/clear/v1',
        {}
    );
    return JSON.parse(res.getBody() as string);
}

export const requestDmCreate = (token: string, uIds: number[]) => {
    const res = request(
        'POST',
        `${url}:${port}` + '/dm/create/v1',
        {
            json: {
                token,
                uIds
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}