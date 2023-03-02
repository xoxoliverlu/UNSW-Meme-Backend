import { authRegisterV1 } from '../auth.js';
import { channelsCreateV1, channelsListV1 } from '../channels.js';
import { clearV1 } from '../other.js';

beforeEach(() => {
    clearV1();
});

describe('Valid channelId produced', () => {
    test('Channel creation success for a public channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'jaydensChannel', true);
        expect(channelCreationValid).toHaveProperty('channelId');
    });
    test('Channel creation success for a private channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'jaydensChannel', false);
        expect(channelCreationValid).toHaveProperty('channelId');
    });
    // Edge cases
    test('Valid channel name - exactly one character - public channel', () => {
        clearV1();
        const user1 = authRegisterV1('Akanksha.sood@gmail.com', '12345678', 'Akanksha', 'Sood');
        const channelId1 = channelsCreateV1(user1, 'C', true);
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'jaydensChannel', false);
        expect(channelCreationValid).toHaveProperty('channelId');
    });
    test('Valid channel name - exactly twenty characters - private channel', () => {
        clearV1();
        const user2 = authRegisterV1('hayden.smith@gmail.com', 'haydensmith', 'hayden', 'smith');
        const channelCreationValid = channelsCreateV1(user2.authUserId, 'This is a pr channel', false);
        expect(channelCreationValid).toHaveProperty('channelId');
    });
});

describe('Invalid inputs', () => {
    test('Invalid authUserId', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId + 1, 'jaydensGang', true);
        expect(channelCreationValid).toMatchObject({error: 'error'});
    });
    test('Channel name too short - public channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, '', true);
        expect(channelCreationValid).toMatchObject({error: 'error'});
    });
    test('Channel name too short - private channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, '', false);
        expect(channelCreationValid).toMatchObject({error: 'error'});
    })
    test('Channel name too long - public channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'hellomynameisDIMPIGARNEPUDI28', true);
        expect(channelCreationValid).toMatchObject({error: 'error'});
    });
    test('Channel name too long - private channel', () => {
        const user1 = authRegisterV1('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
        const channelCreationValid = channelsCreateV1(user1.authUserId, 'hellomynameisDIMPIGARNEPUDI28', false);
        expect(channelCreationValid).toMatchObject({error: 'error'});
    });
});