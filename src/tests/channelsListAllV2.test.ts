import { requestAuthLogin, requestAuthRegister, requestChannelsCreate, requestChannelsListAll, requestClear } from '../requests';
require('sync-request');

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});
test('success channels List All', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const { token } = loginRes;
  const channelCreateRes = requestChannelsCreate(token, 'sampleChannel', true);
  const { channelId } = channelCreateRes;
  const channelsListRes = requestChannelsListAll(token);
  const { channels } = channelsListRes;
  expect(channels).toStrictEqual([{ channelId: channelId, name: 'sampleChannel' }]);
});

test('error token', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  let { token } = loginRes;
  requestChannelsCreate(token, 'sampleChannel', true);
  token += 'errorToken';
  const channelsListRes = requestChannelsListAll(token);
  const { error } = channelsListRes;
  expect(error).toEqual(expect.any(String));
});
