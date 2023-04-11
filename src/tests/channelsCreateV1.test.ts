
import { requestAuthRegister, requestChannelsCreate, requestClear } from '../requests';
beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Valid channelId produced', () => {
  test('Channel creation success for a public channel', () => {
    const user1 = requestAuthRegister('laylay123@gmail.com', 'laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = requestChannelsCreate(user1.token, 'jaydensChannel', true);
    expect(channelCreationValid).toHaveProperty('channelId');
  });
  test('Channel creation success for a private channel', () => {
    const user1 = requestAuthRegister('laylay123@gmail.com', 'laylay123', 'Jayden', 'Jacobs');
    const channelCreationValid = requestChannelsCreate(user1.token, 'jaydensChannel', false);
    expect(channelCreationValid).toHaveProperty('channelId');
  });
  // Edge cases
  test('Valid channel name - exactly one character - public channel', () => {
    const user1 = requestAuthRegister('Akanksha.sood@gmail.com', '12345678', 'Akanksha', 'Sood');
    requestChannelsCreate(user1.token, 'C', true);
    const channelCreationValid = requestChannelsCreate(user1.token, 'jaydensChannel', false);
    expect(channelCreationValid).toHaveProperty('channelId');
  });
  test('Valid channel name - exactly twenty characters - private channel', () => {
    const user2 = requestAuthRegister('hayden.smith@gmail.com', 'haydensmith', 'hayden', 'smith');
    const channelCreationValid = requestChannelsCreate(user2.token, 'This is a pr channel', false);
    expect(channelCreationValid).toHaveProperty('channelId');
  });
});

describe('Invalid inputs', () => {
  test('Invalid token', () => {
    const user1 = requestAuthRegister('laylay123@gmail.com', 'laylay123', 'Jayden', 'Jacobs');
    const res = requestChannelsCreate(user1.token + 1, 'jaydensGang', true);
    expect(res).toBe(403);
  });
  test('Channel name too short - public channel', () => {
    const user1 = requestAuthRegister('laylay123@gmail.com', 'laylay123', 'Jayden', 'Jacobs');
    const res = requestChannelsCreate(user1.token, '', true);
    expect(res).toBe(400);
  });
  test('Channel name too short - private channel', () => {
    const user1 = requestAuthRegister('laylay123@gmail.com', 'laylay123', 'Jayden', 'Jacobs');
    const res = requestChannelsCreate(user1.token, '', false);
    expect(res).toBe(400);
  });
  test('Channel name too long - public channel', () => {
    const user1 = requestAuthRegister('laylay123@gmail.com', 'laylay123', 'Jayden', 'Jacobs');
    const res = requestChannelsCreate(user1.token, 'hellomynameisDIMPIGARNEPUDI28', true);
    expect(res).toBe(400);
  });
  test('Channel name too long - private channel', () => {
    const user1 = requestAuthRegister('laylay123@gmail.com', 'laylay123', 'Jayden', 'Jacobs');
    const res = requestChannelsCreate(user1.token, 'hellomynameisDIMPIGARNEPUDI28', true);
    expect(res).toBe(400);
  });
});
