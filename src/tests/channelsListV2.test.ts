import { requestAuthRegister, requestAuthLogin, requestChannelsCreate, requestChannelsList, requestClear } from '../requests';

require('sync-request');

beforeEach(() => {
  requestClear();
});

test('success channels List', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const { token } = loginRes;
  const channelCreateRes = requestChannelsCreate(token, 'sampleChannel', true);

  const { channelId } = channelCreateRes;
  const channelListRes = requestChannelsList(token);

  const { channels } = channelListRes;
  expect(channels).toStrictEqual([{ channelId: channelId, name: 'sampleChannel' }]);
});

test('success channels List: no channel', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  const { token } = loginRes;

  const channelListRes = requestChannelsList(token);

  const { channels } = channelListRes;
  expect(channels).toStrictEqual([]);
});

test('error token', () => {
  requestAuthRegister('oliverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
  const loginRes = requestAuthLogin('oliverwlu@gmail.com', 'cl3cl3vul4');
  let { token } = loginRes;
  token += 'errorToken';

  const channelsListRes = requestChannelsList(token);
  const { error } = channelsListRes;
  expect(error).toEqual(expect.any(String));
});
