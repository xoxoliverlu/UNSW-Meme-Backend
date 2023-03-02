import {channelsListV1} from '../channels';

test('invalid user id', () => {
    expect(channelsListV1(135)).toStrictEqual({error: error})
})

test('channels list all', () => {
    expect(channelsListV1(1)).toStrictEqual({channels:[{channelId:1, name:Hayden}, {channelId:2, name:Oli}]})
})