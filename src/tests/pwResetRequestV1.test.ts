import { requestClear, requestAuthRegister, reqeustPwReset, requestChannelsCreate } from "../requests";

beforeEach(() => {
    requestClear();
});
  
afterAll(() => {
    requestClear();
});


test("successful reset request", () => {
    const {token} = requestAuthRegister('otonnokoo713@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
    reqeustPwReset('otonnokoo713@gmail.com');
    const res = requestChannelsCreate(token, "errorToken", true)
    expect(res).toBe(403);
})