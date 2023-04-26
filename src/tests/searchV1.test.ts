import { Message } from '../interfaces';
import { requestClear, requestAuthRegister, requestChannelsCreate, requestMessageSend, requestSearch, requestDmCreate, requestMessageSendDm } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

test('search channel messages', () => {
  const { token } = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
  const { authUserId } = requestAuthRegister('oliverlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');

  const { channelId } = requestChannelsCreate(token, 'channelNew', true);
  const { dmId } = requestDmCreate(token, [authUserId]);
  requestMessageSend(token, channelId, 'test1');
  requestMessageSend(token, channelId, 'test2');
  requestMessageSend(token, channelId, 'test3');
  requestMessageSend(token, channelId, 'test4');
  requestMessageSendDm(token, dmId, 'testDm1');
  requestMessageSendDm(token, dmId, 'testDm2');
  requestMessageSendDm(token, dmId, 'testDm3');
  const { result: res } = requestSearch(token, 'test');
  const messages = res.map((item: Message) => item.message).sort();
  expect(messages).toEqual(['test1', 'test2', 'test3', 'test4', 'testDm1', 'testDm2', 'testDm3'].sort());
});

test('token error', () => {
  const { token } = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
  const { authUserId } = requestAuthRegister('oliverlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');

  const { channelId } = requestChannelsCreate(token, 'channelNew', true);
  requestDmCreate(token, [authUserId]);
  requestMessageSend(token, channelId, 'test1');

  const res = requestSearch(token + 'error', 'test');
  expect(res).toEqual(403);
});

test('error Query Length', () => {
  const { token } = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
  const { authUserId } = requestAuthRegister('oliverlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');

  const { channelId } = requestChannelsCreate(token, 'channelNew', true);
  requestDmCreate(token, [authUserId]);
  requestMessageSend(token, channelId, 'test1');

  const res = requestSearch(token, '');
  expect(res).toEqual(400);
});
