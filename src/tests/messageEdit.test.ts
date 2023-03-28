import {
    requestChannelsCreate, requestAuthRegister, requestMessageSend, requestMessageEdit,
    requestChannelInvite, requestChannelMessages, requestDmMessages,
    requestDmCreate, requestMessageSendDm, requestClear
  } from '../requests';
  
  beforeEach(() => {
    requestClear();
  });
  
  afterAll(() => {
    requestClear();
  });
  
  describe('Testing messageEdit', () => {
    describe('errors', () => {
      test('length of message is over 1000 characters', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
        const message = requestMessageSend(register.token, channel.channelId, 'dog');
        expect(message).toStrictEqual({ messageId: message.messageId });
        const over1000chars = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Na';
        const data = requestMessageEdit(register.token, message.messageId, over1000chars);
        expect(data).toStrictEqual({ error: 'Message is greater than 1000 characters' });
      });
      test('messageId does not refer to a valid message within a channel/DM that the authorised user has joined', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
        const message = requestMessageSend(register.token, channel.channelId, 'dog');
        expect(message).toStrictEqual({ messageId: message.messageId });
        const edit = 'cat';
        const data = requestMessageEdit(register.token, message.messageId + 1, edit);
        expect(data).toStrictEqual({ error: 'message id is invalid' });
      });
      test('the message was not sent by the authorised user making this request and the user does not have owner permissions in the channel/DM', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
        const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
        requestChannelInvite(register.token, channel.channelId, register2.authUserId);
        const message = requestMessageSend(register.token, channel.channelId, 'dog');
        expect(message).toStrictEqual({ messageId: message.messageId });
        const edit = 'cat';
        const data = requestMessageEdit(register2.token, message.messageId, edit);
        expect(data).toStrictEqual({ error: 'message was not sent by this user, and user does not have owner permissions' });
      });
      test('token is invalid', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
        const message = requestMessageSend(register.token, channel.channelId, 'dog');
        expect(message).toStrictEqual({ messageId: message.messageId });
        const edit = 'cat';
        const data = requestMessageEdit(register.token + 1, message.messageId, edit);
        expect(data).toStrictEqual({ error: 'token is invalid' });
      });
    });
    describe('errors', () => {
      test('user that sent message in channel, edits message', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
        const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
        requestChannelInvite(register.token, channel.channelId, register2.authUserId);
        const message = requestMessageSend(register2.token, channel.channelId, 'dog');
        expect(message).toStrictEqual({ messageId: message.messageId });
        const edit = 'cat';
        const data = requestMessageSend(register2.token, message.messageId, edit);
        expect(data).toStrictEqual({});
        const messages = requestChannelMessages(register.token, channel.channelId, 0);
        expect(messages).toStrictEqual({
          messages: [
            {
              messageId: message.messageId,
              uId: register2.authUserId,
              message: 'cat',
              timeSent: expect.any(Number),
            }
          ],
          start: 0,
          end: -1
        });
      });
      test('user with owner perms in channel edits message', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpisgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
        const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
        requestChannelInvite(register.token, channel.channelId, register2.authUserId);
        const message = requestMessageSend(register2.token, channel.channelId, 'dog');
        expect(message).toStrictEqual({ messageId: message.messageId });
        const edit = 'cat';
        const data = requestMessageEdit(register.token, message.messageId, edit);
        expect(data).toStrictEqual({});
        const messages = requestChannelMessages(register.token, channel.channelId, 0);
        expect(messages).toStrictEqual({
          messages: [
            {
              messageId: message.messageId,
              uId: register2.authUserId,
              message: 'cat',
              timeSent: expect.any(Number),
            }
          ],
          start: 0,
          end: -1
        });
      });
      test('user with owner perms in DM edits message', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
        const dm = requestDmCreate(register.token, [register2.authUserId]);
        const message = requestMessageSendDm(register2.token, dm.dmId, 'dog');
        expect(message).toStrictEqual({ messageId: expect.any(Number) });
        const edit = 'cat';
        const data = requestMessageEdit(register.token, message.messageId, edit);
        expect(data).toStrictEqual({});
        const messages = requestDmMessages(register.token, dm.dmId, 0);
        expect(messages).toStrictEqual({
          messages: [
            {
              messageId: message.messageId,
              uId: register2.authUserId,
              message: 'cat',
              timeSent: expect.any(Number),
            }
          ],
          start: 0,
          end: -1
        });
      });
      test('user that sent message in DM, edits message', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
        const dm = requestDmCreate(register.token, [register2.authUserId]);
        const message = requestMessageSendDm(register2.token, dm.dmId, 'dog');
        expect(message).toStrictEqual({ messageId: expect.any(Number) });
        const edit = 'cat';
        const data = requestMessageEdit(register2.token, message.messageId, edit);
        expect(data).toStrictEqual({});
        const messages = requestDmMessages(register.token, dm.dmId, 0);
        expect(messages).toStrictEqual({
          messages: [
            {
              messageId: message.messageId,
              uId: register2.authUserId,
              message: 'cat',
              timeSent: expect.any(Number),
            }
          ],
          start: 0,
          end: -1
        });
      });
      test('an empty string deletes the message', () => {
        const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
        const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
        const dm = requestDmCreate(register.token, [register2.authUserId]);
        const message = requestMessageSendDm(register2.token, dm.dmId, 'dog');
        expect(message).toStrictEqual({ messageId: expect.any(Number) });
        const edit = '';
        const data = requestMessageEdit(register2.token, message.messageId, edit);
        expect(data).toStrictEqual({});
        const messages = requestDmMessages(register.token, dm.dmId, 0);
        expect(messages).toStrictEqual({
          messages: [],
          start: 0,
          end: -1
        });
      });
    });
  });
  