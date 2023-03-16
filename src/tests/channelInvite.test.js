import { channelInviteV1 } from '../channel.js'
import { channelsCreateV1 } from "../channels.js"
import { authRegisterV1 } from "../auth.js"
import { clearV1 } from "../other.js"

beforeEach(() => {
  clearV1();
});

test("Testing valid input with public channel", () => {
  const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
  const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");
  const channel = channelsCreateV1(user1.authUserId, "testPublicChannel", true);
  let result = channelInviteV1(user1.authUserId, channel.channelId, user2.authUserId);
  expect(result).toStrictEqual({});
});

test("Testing valid input with private channel", () => {
  const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
  const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");
  const channel = channelsCreateV1(user1.authUserId, "testPrivateChannel", false);
  let result = channelInviteV1(user1.authUserId, channel.channelId, user2.authUserId);
  expect(result).toStrictEqual({});
});

test("Testing inviter who is not a member of the channel", () => {
  const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
  const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");
  const user3 = authRegisterV1("userthree@ad.unsw.edu.au", "testPassword", "user", "three");
  const channel = channelsCreateV1(user1.authUserId, "testPublicChannel", true);
  let result = channelInviteV1(user2.authUserId, channel.channelId, user3.authUserId);
  expect(result).toStrictEqual({ error: expect.any(String)});
});

test("Testing inviter who is non-existent", () => {
  const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
  const user2 = authRegisterV1("Hayden.smith@gmail.com", '1234567', "Hayden", "Smith");
  const channel = channelsCreateV1(user1.authUserId, "testPublicChannel", true);
  let result = channelInviteV1(user1.authUserId + 1, channel.channelId, user2.authUserId);
  expect(result).toStrictEqual({ error: expect.any(String)});
});

test("Testing channel which is non-existent", () => {
  const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
  const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");
  const channel = channelsCreateV1(user1.authUserId, "testPublicChannel", true);
  let result = channelInviteV1(user1.authUserId, channel.channelId + 1, user2.authUserId);
  expect(result).toStrictEqual({ error: expect.any(String) });
});

test("Testing invitee who is non-existent", () => {
  const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
  const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");
  const channel = channelsCreateV1(user1.authUserId, "testPublicChannel", true);
  let result = channelInviteV1(user1.authUserId, channel.channelId, user2.authUserId + 1);
  expect(result).toStrictEqual({ error: expect.any(String) });
});

test("Testing invitee already a member of channel", () => {
  const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
  const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");
  const channel = channelsCreateV1(user1.authUserId, "testPublicChannel", true);
  channelInviteV1(user1.authUserId, channel.channelId, user2.authUserId);
  let result = channelInviteV1(user1.authUserId, channel.channelId, user2.authUserId);
  expect(result).toStrictEqual({ error: expect.any(String) });
});