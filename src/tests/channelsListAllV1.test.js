import {channelsListAllV1} from './channels';


test('Invalid users', () => {
    clearV1();
    const user1 = authRegisterV1('oliver@gmail.com','123456','oliver','lu')
    expect(channelsListAllV1(12389)).toStrictEqual({error: 'error'});
})

test('multiple channels', () => {
    clearV1();
    const user1 = authRegisterV1('oliver@gmail.com','123456','oliver','lu')
    const channel1 = channelsCreateV1(user1,"test1",true);
    const channel2 = channelsCreateV1(user1,"test2",true);
    const channel3 = channelsCreateV1(user1,"test3",true);
    expect(channelsListAllV1).toStrictEqual({channels: [
        {channelId: channel1, name: 'test1'},
        {channelId: channel2, name: 'test2'},
        {channelId: channel3, name: 'test3'},
    ]})
})

