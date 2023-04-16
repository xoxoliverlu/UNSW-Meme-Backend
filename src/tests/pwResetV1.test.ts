import { requestClear, requestAuthRegister, requestPwResetRequest, requestPwReset } from "../requests";

beforeEach(() => {
    requestClear();
});
  
afterAll(() => {
    requestClear();
});


test("invalid reset code", () => {
    const {token} = requestAuthRegister('otonnokoo713@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
    requestPwResetRequest('otonnokoo713@gmail.com');
    const res = requestPwReset('error','jdiosajio')
    expect(res).toBe(400);
})

test("newPassword Less than 6 characters long", () => {
    const {token} = requestAuthRegister('otonnokoo713@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
    requestPwResetRequest('otonnokoo713@gmail.com');
    const res = requestPwReset('error','jdio')
    expect(res).toBe(400);
})