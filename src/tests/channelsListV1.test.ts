import {channelsListV2, channelsCreateV2} from '../channels';
import {authRegisterV2} from '../auth';
import {clearV1} from '../other';

beforeEach(() => {
  clearV1();
});

test('invalid user id', () => {
  const user1 = authRegisterV2('oliver@gmail.com','123456789','Oliver','Lu');
  expect(channelsListV2(user1.token + 1)).toStrictEqual({error: 'error'});
});

test('channelsList one channels ', () => {
  const user1 = authRegisterV2('oliver@gmail.com','123456789','Oliver','Lu');
  const channel1 = channelsCreateV2(user1.token,'test1',true);
  expect(channelsListV2(user1.token)).toStrictEqual({channels:[{channelId:channel1.channelId, name: 'test1' }]});
});

test('channelsList three channels ', () => {
  const user1 = authRegisterV2('oliver@gmail.com','123456789','Oliver','Lu');
  const channel1 = channelsCreateV2(user1.token,'test1',true);
  const channel2 = channelsCreateV2(user1.token,'test2',true);
  const channel3 = channelsCreateV2(user1.token,'test3',true);
  expect(channelsListV2(user1.token)).toStrictEqual({channels:[{channelId:channel1.channelId, name: 'test1'}, {channelId:channel2.channelId, name: 'test2'}, {channelId:channel3.channelId, name: 'test3'}]});
});