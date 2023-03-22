import { authRegisterV2 } from '../auth';
import { channelsCreateV2} from '../channels';
import { clearV1 } from '../other';

beforeEach(() => {
  clearV1();
});

describe('Valid channelId produced', () => {
  test('Channel creation success for a public channel', () => {
    const user1 = authRegisterV2('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV2(user1.token, 'jaydensChannel', true);
    expect(channelCreationValid).toHaveProperty('channelId');
  });
  test('Channel creation success for a private channel', () => {
    const user1 = authRegisterV2('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV2(user1.token, 'jaydensChannel', false);
    expect(channelCreationValid).toHaveProperty('channelId');
  });
  // Edge cases
  test('Valid channel name - exactly one character - public channel', () => {
    clearV1();
    const user1 = authRegisterV2('Akanksha.sood@gmail.com', '12345678', 'Akanksha', 'Sood');
    const channelId1 = channelsCreateV2(user1.token, 'C', true);
    const channelCreationValid = channelsCreateV2(user1.token, 'jaydensChannel', false);
    expect(channelCreationValid).toHaveProperty('channelId');
  });
  test('Valid channel name - exactly twenty characters - private channel', () => {
    clearV1();
    const user2 = authRegisterV2('hayden.smith@gmail.com', 'haydensmith', 'hayden', 'smith');
    const channelCreationValid = channelsCreateV2(user2.token, 'This is a pr channel', false);
    expect(channelCreationValid).toHaveProperty('channelId');
  });
});

describe('Invalid inputs', () => {
  test('Invalid token', () => {
    const user1 = authRegisterV2('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV2(user1.token + 1, 'jaydensGang', true);
    expect(channelCreationValid).toMatchObject({error: expect.any(String)});
  });
  test('Channel name too short - public channel', () => {
    const user1 = authRegisterV2('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV2(user1.token, '', true);
    expect(channelCreationValid).toMatchObject({error: expect.any(String)});
  });
  test('Channel name too short - private channel', () => {
    const user1 = authRegisterV2('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV2(user1.token, '', false);
    expect(channelCreationValid).toMatchObject({error: expect.any(String)});
  })
  test('Channel name too long - public channel', () => {
    const user1 = authRegisterV2('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV2(user1.token, 'hellomynameisDIMPIGARNEPUDI28', true);
    expect(channelCreationValid).toMatchObject({error: expect.any(String)});
  });
  test('Channel name too long - private channel', () => {
    const user1 = authRegisterV2('laylay123@gmail.com','laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = channelsCreateV2(user1.token, 'hellomynameisDIMPIGARNEPUDI28', false);
    expect(channelCreationValid).toMatchObject({error: expect.any(String)});
  });
});