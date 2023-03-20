import request from "sync-request";
import { port, url} from "./config.json";

export const requestAuthLogin = (email: string, password: string) {
    const res = request(
        'POST',
        '${url}:${port}' + '/auth/login/v2',
        {
            json: {
                email,
                password
            }
        }
    );
    if (res.statusCode === 200) {
        return JSON.parse(res.getBody() as string);
    }
    return res.statusCode;
}