import {authRegisterV1} from './auth'
import { clearV1 } from './other';

describe('Testing channelMessages Error Cases', () => {
    beforeEach(() => {
        clearV1();
        const registerAcc = authRegisterV1('hello@gmail.com', 'hello123', 'Hello', 'Asdfg');
        const channelCreationValid = channelsCreateV1(registerAcc.authUserId, 'HelloChannel', true);
        const registerAcc_2 = authRegisterV1('waterbottle@gmail.com', 'hello', 'Tree', 'House');
    });
    test('the channelId does not refer to a valid channel', () => {
        const channelMessagesInvalidId = channelMessagesV1(registerAcc.authUserId, -1, 0);
        expect(channelMessagesInvalidId).toMatchObject({error: 'invalid channel id'});
    })

    test('start is greater than the total number of messages in the channel', () => {
        const channelMessagesInvalidStart = channelMessagesV1(registerAcc.authUserId, channelCreationValid.channelId, 50);
        expect(channelMessagesInvalidStart).toMatchObject({error: 'start parameter is greater than the total number of messages'});
    })

    test('the user is not a member of the channel', () => {
        const channelMessagesUserNotMember = channelMessagesV1(registerAcc_2.authUserId, channelCreationValid.channelId, 0);
        expect(channelMessagesUserNotMember).toMatchObject({error: 'user is not a member of the channel'});
    })

    test('authUserId is invalid', () => {
        const channelMessagesInvalidUser = channelMessagesV1(-1, channelCreationValid.channelId, 0);
        expect(channelMessagesInvalidUser).toMatchObject({error: 'user is not valid'});
        
    })
});
describe('Testing channelMessages Success Cases', () => {
    beforeEach(() => {
        clearV1();
        const registerAcc = authRegisterV1('hello@gmail.com', 'hello123', 'Hello', 'Asdfg');
        const channelCreationValid = channelsCreateV1(registerAcc.authUserId, 'HelloChannel', true);
    });
    test('no messages', () => {
        const channelMessagesSuccess = channelMessagesV1(registerAcc.authUserId, channelCreationValid.channelId, 0);
        expect(channelMessagesSuccess).toStrictEqual({
            messages: [],
            start: 0,
            end: -1
        });

    });
});