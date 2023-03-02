import { authRegisterV1 } from '../auth.js';
import { channelJoinV1 } from '../channel.js'
import { channelsCreateV1 } from '../channels.js';
import { clearV1 } from '../other.js'

beforeEach(() => {
    clearV1();
});

describe('Failed Tests.', () => {
    test('Invalid channelId.', () => {
        const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const auth1 = register1.authUserId;
        const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
        const auth2 = register2.authUserId;
        const newChannel = channelsCreateV1(auth1, 'Channel1', true);
        const channelID = newChannel.channelId + 1;
        const channelJoin = channelJoinV1(auth2, channelID);
        expect(channelJoin).toEqual({error: 'error'});
    });
    test('User is already a member.', () => {
        const register = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const authId = register.authUserId;
        const newChannel = channelsCreateV1(authId, 'Channel1', true);
        const channelID = newChannel.channelID;
        const channelJoin = channelJoinV1(authId, channelID);
        expect(channelJoin).toEqual({error: 'error'});
    });
    test('Channel is private.', () => {
        const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const auth1 = register1.authUserId;
        const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
        const auth2 = register2.authUserId;
        const newChannel = channelsCreateV1(auth1, 'Channel1', false);
        const channelID = newChannel.channelID;
        const channelJoin = channelJoinV1(auth2, channelID);
        expect(channelJoin).toEqual({error: 'error'});
    });
    test('User to join has invalid id.', () => {
        const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
        const auth1 = register1.authUserId;
        const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
        const auth2 = 'xyz';
        const newChannel = channelsCreateV1(auth1, 'Channel1', true);
        const channelID = newChannel.channelID;
        const channelJoin = channelJoinV1(auth2, channelID);
        expect(channelJoin).toEqual({error: 'error'});
    });
});

test('Successful channelJoinV1 test.', () => {
    const register1 = authRegisterV1('fadyS@gmail.com', 'password', 'Fady', 'Sadek');
    const auth1 = register1.authUserId;
    const register2 = authRegisterV1('AkankshaS@gmail.com', 'password', 'Akanksha', 'Sood');
    const auth2 = register2.authUserId;
    const newChannel = channelsCreateV1(auth1, 'Channel1', true);
    const channelID = newChannel.channelID;
    const channelJoin = channelJoinV1(auth2, channelID);
    expect(channelJoin).toEqual({});
});