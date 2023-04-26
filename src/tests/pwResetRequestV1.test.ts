import { requestClear, requestAuthRegister, requestPwResetRequest, requestChannelsCreate } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

test('successful reset', () => {
  const { token } = requestAuthRegister('otonnokoo713@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  requestPwResetRequest('otonnokoo713@gmail.com');
  const res = requestChannelsCreate(token, 'errorToken', true);
  expect(res).toBe(403);
});
