import {channelsListV1, channelsCreateV1} from '../channels';
import {authRegisterV1} from '../auth.js';
import {clearV1} from './other';

test('invalid user id', () => {
    clearV1();
    expect(channelsListV1(135)).toStrictEqual({error: error})
})

test('channelsList one channels ', () => {
    clearV1();
    const user1 = authRegisterV1('oliver@gmail.com','123456','Oliver','Lu');
    const channel1 = channelsCreateV1(user1.authUserId,'test1',true);
    expect(channelsListV1(user)).toStrictEqual({channels:[{channelId:channel1.channelId, name:test1}]})
})

test('channelsList three channels ', () => {
    clearV1();
    const user1 = authRegisterV1('oliver@gmail.com','123456','Oliver','Lu');
    const channel1 = channelsCreateV1(user1.authUserId,'test1',true);
    const channel2 = channelsCreateV1(user1.authUserId,'test2',true);
    const channel3 = channelsCreateV1(user1.authUserId,'test3',true);
    expect(channelsListV1(user1)).toStrictEqual({channels:[{channelId:channel1.channelId, name: 'test1'}, {channelId:channel2.channelId, name: 'test2'}, {channelId:channel3.channelId, name: 'test3'}]})
})