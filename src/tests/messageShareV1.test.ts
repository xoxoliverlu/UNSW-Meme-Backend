import {
  requestChannelsCreate, requestAuthRegister, requestMessageSend,
  requestChannelInvite, requestMessageShare, requestChannelMessages,
  requestDmCreate, requestMessageSendDm, requestClear, requestDmMessages
} from '../requests';

beforeEach(() => {
  requestClear();
});

afterAll(() => {
  requestClear();
});

describe('Testing messageShare', () => {
  describe('errors', () => {
    test('both channelId and dmId are invalid', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const share = requestMessageShare(register.token, 1, '', -2, -2);
      expect(share).toEqual(400);
    });
    test('neither channelId nor dmId are -1', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const dm = requestDmCreate(register.token, []);
      const share = requestMessageShare(register.token, 1, '', channel.channelId, dm.dmId);
      expect(share).toEqual(400);
    });
    test('ogMessageId does not refer to a valid message within a channel/DM that the authorised user has joined', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = requestAuthRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const messageChannel = requestMessageSend(register.token, channel.channelId, 'this message will be shared');
      const notInChannel = requestMessageShare(register2.token, messageChannel.messageId, '', channel.channelId, -1);
      expect(notInChannel).toEqual(400);
      const messageChannelIdInvalid = requestMessageShare(register2.token, messageChannel.messageId + 100, '', channel.channelId, -1);
      expect(messageChannelIdInvalid).toEqual(400);
      const dm = requestDmCreate(register.token, []);
      const messageDm = requestMessageSendDm(register.token, dm.dmId, 'hello!!');
      const notInDm = requestMessageShare(register2.token, messageDm.messageId, '', -1, dm.dmId);
      expect(notInDm).toEqual(400);
      const messageDmIdInvalid = requestMessageShare(register2.token, messageDm.messageId + 100, '', -1, dm.dmId);
      expect(messageDmIdInvalid).toEqual(400);
    });
    test('length of optional message is more than 1000 characters', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const messageChannel = requestMessageSend(register.token, channel.channelId, 'this message will be shared');
      const over1000chars = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Na';
      const share = requestMessageShare(register.token, messageChannel.messageId, over1000chars, channel.channelId, -1);
      expect(share).toEqual(400);
    });
    test('token is invalid', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const channel = requestChannelsCreate(register.token, 'Birthday Party', true);
      const messageChannel = requestMessageSend(register.token, channel.channelId, 'this message will be shared');
      const share = requestMessageShare(register.token + '1', messageChannel.messageId, '', channel.channelId, -1);
      expect(share).toEqual(403);
    });
    test('authorised user has not joined the channel or DM they are trying to share the message to', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = requestAuthRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');

      const dm = requestDmCreate(register.token, []);
      requestMessageSendDm(register.token, dm.dmId, 'this message will be shared');

      const channel = requestChannelsCreate(register.token, 'Birthday Party', false);
      const channel2 = requestChannelsCreate(register2.token, 'My Party', false);
      const messageChannel = requestMessageSend(register2.token, channel2.channelId, 'this message will be shared');

      const shareDm = requestMessageShare(register2.token, messageChannel.messageId, '', -1, dm.dmId);
      expect(shareDm).toEqual(403);
      const shareCh = requestMessageShare(register2.token, messageChannel.messageId, '', channel.channelId, -1);
      expect(shareCh).toEqual(403);
    });
  });
  describe('success cases', () => {
    test('message is shared to another channel', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = requestAuthRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');

      const channel = requestChannelsCreate(register.token, 'Birthday Party', false);
      const channel2 = requestChannelsCreate(register2.token, 'My Party', false);
      requestChannelInvite(register.token, channel.channelId, register2.authUserId);

      const message1 = requestMessageSend(register2.token, channel2.channelId, 'first message!');
      requestMssageSend(register2.token, channel.channelId, 'information');
      const share = requestMessageShare(register2.token, message1.messageId, 'optional message', channel.channelId, -1);
      expect(share).toEqual({
        sharedMessageId: expect.any(Number)
      });
      const channelMessagesData = requestChannelMessages(register2.token, channel.channelId, 0);
      expect(channelMessagesData).toStrictEqual({
        messages: [
          {
            messageId: expect.any(Number),
            uId: register2.authUserId,
            message: 'first message! optional message',
            timeSent: expect.any(Number),
          },
          {
            messageId: expect.any(Number),
            uId: register2.authUserId,
            message: 'information',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
    });

    test('message is shared to dm', () => {
      const register = requestAuthRegister('eloise@gmail.com', 'pozzipozzipozzi', 'eloise', 'pozzi');
      const register2 = requestAuthRegister('eloisekelly@gmail.com', 'kellykellykelly', 'eloise', 'kelly');
      requestChannelsCreate(register.token, 'Birthday Party', true);
      const dm = requestDmCreate(register.token, [register2.authUserId]);
      const message = requestMessageSendDm(register2.token, dm.dmId, 'information');
      const share = requestMessageShare(register.token, message.messageId, 'optional message', -1, dm.dmId);
      expect(share).toEqual({
        sharedMessageId: expect.any(Number)
      });
      const dmMessagesData = requestDmMessages(register.token, dm.dmId, 0);
      expect(dmMessagesData).toStrictEqual({
        messages: [
          {
            messageId: expect.any(Number),
            uId: register.authUserId,
            message: 'information optional message',
            timeSent: expect.any(Number),
          },
          {
            messageId: expect.any(Number),
            uId: register2.authUserId,
            message: 'information',
            timeSent: expect.any(Number),
          }
        ],
        start: 0,
        end: -1
      });
    });
  });
});
