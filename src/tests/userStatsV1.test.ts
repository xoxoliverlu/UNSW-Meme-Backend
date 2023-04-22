import { requestChannelsCreate, requestAuthRegister, requestMessageSend, requestClear, requestUserStats } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Successful', () => {
  test('involvement Rate = 1', () => {
    const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
    const channel = requestChannelsCreate(register.token, 'channelNew', true);
    const message = requestMessageSend(register.token, channel.channelId, 'cat');
    const {userStats} = requestUserStats(register.token)
    expect(userStats).toHaveProperty('channelsJoined');
    expect(userStats).toHaveProperty('dmsJoined');
    expect(userStats).toHaveProperty('messagesSent');
    expect(userStats).toHaveProperty('involvementRate');
    expect(userStats.involvementRate).toBe(1);
  });
});
