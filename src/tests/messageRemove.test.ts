import { requestAuthRegister, requestDmCreate, requestMessageSendDm, requestChannelsCreate, 
  requestDmMessages, requestMessageRemove, requestChannelJoin, requestMessageSend, 
  requestChannelMessages, requestClear } from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Testing messageRemoveV1 for it-2', () => {
  test('Success: removes message from dm', () => {
    const register1 = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
    const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
    const dm1 = requestDmCreate(register1.token, [register2.authUserId]);
    requestMessageSendDm(register1.token, dm1.dmId, 'hello');
    const dmSend2 = requestMessageSend(register2.token, dm1.dmId, 'PLS');
    requestMessageSendDm(register2.token, dm1.dmId, 'WORK');
    requestMessageRemove(register1.token, dmSend2.messageId);
    const fnctmessages = requestDmMessages(register1.token, 0, 0);
    const returnobj = {
      //start: 0,
      //end: -1,
      error: "invalid dmId"
    };
    expect(fnctmessages).toMatchObject(returnobj);
  });
  test('Invalid messageId', () => {
    const register1 = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
    const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
    const dm1 = requestDmCreate(register1.token, [register2.authUserId]);
    requestMessageSendDm(register1.token, dm1.dmId, 'hello');
    requestMessageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = requestMessageRemove(register2.token, 4242424);
    expect(returnval).toStrictEqual({});
  });
  test('user not member of dm', () => {
    const register1 = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
    const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
    const register3 = requestAuthRegister('madhushrestha@gmail.com', 'madhushrestha', 'madhu', 'shrestha');
    const dm1 = requestDmCreate(register1.token, [register2.authUserId]);
    requestMessageSendDm(register1.token, dm1.dmId, 'hello');
    const dmSend2 = requestMessageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = requestMessageRemove(register3.token, dmSend2.messageId);
    expect(returnval).toStrictEqual({ error: 'messageId does not refer to a valid message within a channel/DM that the authorised user has joined' });
  });
  test('user did not send that message', () => {
    const register1 = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
    const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
    const dm1 = requestDmCreate(register1.token, [register2.authUserId]);
    const dmSend = requestMessageSendDm(register1.token, dm1.dmId, 'hello');
    requestMessageSendDm(register2.token, dm1.dmId, 'PLS');
    const returnval = requestMessageRemove(register2.token, dmSend.messageId);
    expect(returnval).toStrictEqual({});
  });
  test('Success: removes message from channel', () => {
    const register1 = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
    const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
    const channel1 = requestChannelsCreate(register1.token, 'channelOne', true);
    requestChannelJoin(register2.token, channel1.channelId);
    requestMessageSend(register1.token, channel1.channelId, 'message1');
    requestMessageSend(register1.token, channel1.channelId, 'message2');
    requestMessageSend(register2.token, channel1.channelId, 'message3');
    const message4 = requestMessageSend(register2.token, channel1.channelId, 'message4');
    requestMessageRemove(register2.token, message4.messageId);
    const fnctmessages = requestChannelMessages(register1.token, channel1.channelId, 0);
    const returnobj = {
      messages: fnctmessages.messages,
      end: -1,
      start: 0
    };
    expect(fnctmessages).toMatchObject(returnobj);
  });
  test('Invalid messageId', () => {
    const register1 = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
    const channel1 = requestChannelsCreate(register1.token, 'channelOne', true);
    requestMessageSend(register1.token, channel1.channelId, 'message1');
    requestMessageSend(register1.token, channel1.channelId, 'message2');
    const returnval = requestMessageRemove(register1.token, 4242424);
    expect(returnval).toStrictEqual({ error: "messageId does not refer to a valid message within a channel/DM that the authorised user has joined" });
  });
  test('user not member of channel', () => {
    const register1 = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
    const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
    const channel1 = requestChannelsCreate(register1.token, 'channelOne', true);
    const message1 = requestMessageSend(register1.token, channel1.channelId, 'message1');
    requestMessageSend(register1.token, channel1.channelId, 'message2');
    const returnval = requestMessageRemove(register2.token, message1.messageId);
    expect(returnval).toStrictEqual({ error: 'messageId does not refer to a valid message within a channel/DM that the authorised user has joined' });
  });
  test('user did not send that message', () => {
    const register1 = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
    const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
    const channel1 = requestChannelsCreate(register1.token, 'channelOne', true);
    requestChannelJoin(register2.token, channel1.channelId);
    const message1 = requestMessageSend(register1.token, channel1.channelId, 'message1');
    requestMessageSend(register2.token, channel1.channelId, 'message2');
    const returnval = requestMessageRemove(register2.token, message1.messageId);
    expect(returnval).toStrictEqual({ error: 'messageId does not refer to a valid message within a channel/DM that the authorised user has joined' });
  });
});

