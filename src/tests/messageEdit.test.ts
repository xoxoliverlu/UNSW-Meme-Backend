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
      const over1000chars = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Na';
      const data = requestMessageEdit(register.token, message.messageId, over1000chars);
      expect(data).toEqual(400);
    });
    test('messageId is invalid within a channel/DM that the authorised user has joined', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const message = requestMessageSend(register.token, channel.channelId, 'dog');
      const invalid = requestMessageEdit(register.token, message.messageId + 1, 'cat');
      expect(data).toEqual(400);
    });
    test('the message was not sent by the authorised user making this request and the user does not have owner permissions in the channel', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      requestChannelInvite(register.token, channel.channelId, register2.authUserId);
      const message = requestMessageSend(register.token, channel.channelId, 'dog');
      const data = requestMessageEdit(register2.token, message.messageId, 'cat');
      expect(data).toEqual(403);
    });
    test('the message was not sent by the authorised user making this request and the user does not have owner permissions in the dm', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
      const uIds = [register2.authUserId];
      const dm = requestDmCreate(register.token, uIds);
      requestMessageSendDm(register.token, dm.dmId, 'Hello World!');
      const invalid = requestMessageEdit(register2.token, dm.dmId, 'cat');
      expect(data).toEqual(403);
    });
    test('token is invalid', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const message = requestMessageSend(register.token, channel.channelId, 'dog');
      const data = requestMessageEdit('Invalid token', message.messageId, 'cat');
      expect(data).toEqual(403);
    });
  });
  describe('Valid inputs', () => {
    test('editing message should update message content', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('akanksha.sood@gmail.com', 'password123', 'Akanksha', 'Sood');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      requestChannelInvite(register.token, channel.channelId, register2.authUserId);
      const message = requestMessageSend(register2.token, channel.channelId, 'testmessage');
      const data = requestMessageEdit(register2.token, message.messageId, 'cat');
      const messages = requestChannelMessages(register.token, channel.channelId, 0);
      expect(data).toStrictEqual({});
      expect(messages).toStrictEqual({
        messages: [
          {
            message: 'cat',
            messageId: message.messageId,
            timeSent: expect.any(Number),
            uId: register2.authUserId,
          },
        ],
        start: 0,
        end: -1,
      });
    });
    test('user with owner perms in channel edits message', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpisgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      requestChannelInvite(register.token, channel.channelId, register2.authUserId);
      const message = requestMessageSend(register2.token, channel.channelId, 'dog');
      const data = requestMessageEdit(register.token, message.messageId, 'cat');
      const messages = requestChannelMessages(register.token, channel.channelId, 0);
      expect(data).toStrictEqual({});
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
    test('user with global perms in channel edits message', () => {
      const user = requestAuthRegister('akanksha.sood08@gmail.com', '123passwoRD', 'Akanksha', 'Sood');
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpisgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      requestChannelInvite(register.token, channel.channelId, register2.authUserId);
      requestChannelInvite(register.token, channel.channelId, user.authUserId);
      const message = requestMessageSend(register2.token, channel.channelId, 'dog');
      const data = requestMessageEdit(user.token, message.messageId, 'cat');
      const messages = requestChannelMessages(register.token, channel.channelId, 0);
      expect(data).toStrictEqual({});
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
      // Register two users
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');

      // Create a DM and send a message from register2
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const message = requestMessageSendDm(register2.token, dm.dmId, 'dog');

      // Edit the message using register's token
      const data = requestMessageEdit(register.token, message.messageId, 'cat');
      // Verify that the message was successfully edited
      expect(data).toStrictEqual({});

      // Get the messages in the DM and verify that the edited message is present
      const messages = requestDmMessages(register.token, dm.dmId, 0);
      expect(messages.messages.length).toBe(1);
      expect(messages.messages[0].message).toBe('cat');
    });
    test('user that sent message in DM, edits message', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const message = requestMessageSendDm(register2.token, dm.dmId, 'dog');
      const data = requestMessageEdit(register2.token, message.messageId, 'cat');
      expect(data).toStrictEqual({});
      const messages = requestDmMessages(register.token, dm.dmId, 0);
      expect(messages).toStrictEqual({
        messages: [
          {
            message: 'cat',
            messageId: message.messageId,
            timeSent: expect.any(Number),
            uId: register2.authUserId,
          }

        ],
        start: 0,
        end: -1,
      });
    });
    test('an empty string deletes the message', () => {
      const register = requestAuthRegister('dimpi@gmail.com', 'dimpidimpidimpi', 'dimpi', 'garnepudi');
      const register2 = requestAuthRegister('dimpsgarnepudi@gmail.com', 'dimpsgarnepudi', 'dimps', 'garnepudi');
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const message = requestMessageSendDm(register2.token, dm.dmId, 'dog');
      const data = requestMessageEdit(register2.token, message.messageId, '');
      expect(data).toStrictEqual({});
      const messages = requestDmMessages(register.token, dm.dmId, 0);
      expect(messages.messages.length).toStrictEqual(1);
      expect(messages.start).toStrictEqual(0);
      expect(messages.end).toStrictEqual(-1);
    });
  });
});
