import { requestChannelsCreate, requestAuthRegister, requestMessageSend, requestClear, requestUserStats, requestDmCreate, requestMessageSendDm } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Successful', () => {
  test('Successful Case', () => {
    const register = requestAuthRegister('dimpi.garnepudi@gmail.com', 'dimpi123', 'Dimpi', 'Garnepudi');
    const register2 = requestAuthRegister('oilverwlu@gmail.com', 'cl3cl3vul4', 'Oliver', 'Lu');
    const userStats1 =requestUserStats(register2.token);
    expect(userStats1).toHaveProperty('channelsJoined');
    expect(userStats1).toHaveProperty('dmsJoined');
    expect(userStats1).toHaveProperty('messagesSent');
    expect(userStats1).toHaveProperty('involvementRate');
    expect(userStats1.channelsJoined.length).toBe(1);
    expect(userStats1.dmsJoined.length).toBe(1);
    expect(userStats1.messagesSent.length).toBe(1);
    const channel = requestChannelsCreate(register.token, 'channelNew', true);
    const {dmId} = requestDmCreate(register.token,[register2.authUserId]);
    requestMessageSend(register.token, channel.channelId, 'cat');
    requestMessageSendDm(register2.token,dmId, "Hello");
    const userStats = requestUserStats(register.token);
    expect(userStats).toHaveProperty('channelsJoined');
    expect(userStats).toHaveProperty('dmsJoined');
    expect(userStats).toHaveProperty('messagesSent');
    expect(userStats).toHaveProperty('involvementRate');
    expect(userStats.involvementRate).toBe(((1+1+1)/(1+1+2)));
  });
});
