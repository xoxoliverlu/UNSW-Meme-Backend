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
    const channel = channelsCreateV1(1, "testPublicChannel", true);
    
    let result = channelInviteV1(1, 0, 0);
    expect(result).toStrictEqual({});
});

test("Testing valid input with private channel", () => {
    const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
    const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");
    const channel = channelsCreateV1(1, "testPrivateChannel", false);
    
    let result = channelInviteV1(1, 0, 0);
    expect(result).toStrictEqual({});
});

test("Testing inviter who is not a member of the channel", () => {
    const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
    const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");
    const user3 = authRegisterV1("userthree@ad.unsw.edu.au", "testPassword", "user", "three");
    const channel = channelsCreateV1(0, "testPublicChannel", true);
    
    let result = channelInviteV1(1, 0, 2);
    expect(result).toStrictEqual({ error: "error" });
});

test("Testing inviter who is non-existent", () => {
    const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
    const channel = channelsCreateV1(0, "testPublicChannel", true);
    
    let result = channelInviteV1(1, 0, 0);
    expect(result).toStrictEqual({ error: "error" });
});

test("Testing channel which is non-existent", () => {
    const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
    const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");

    let result = channelInviteV1(0, 1, 1);
    expect(result).toStrictEqual({ error: "error" });
});

test("Testing invitee who is non-existent", () => {
    const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");
    const channel = channelsCreateV1(0, "testPublicChannel", true);
    
    let result = channelInviteV1(0, 0, 1);
    expect(result).toStrictEqual({ error: "error" });
});

test("Testing invitee already a member of channel", () => {
    const user1 = authRegisterV1("userone@ad.unsw.edu.au", "testPassword", "user", "one");  
    const user2 = authRegisterV1("usertwo@ad.unsw.edu.au", "testPassword", "user", "two");  
    const channel = channelsCreateV1(0, "testPublicChannel", true); 
    channelInviteV1(0, 0, 1); 

    let result = channelInviteV1(0, 0, 1);
    expect(result).toStrictEqual({ error: "error" });
}); 