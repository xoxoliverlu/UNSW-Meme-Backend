
export function dmCreateV1(token: string, uIds: Array<number>) {

}

export function dmListV1(token: string) {

}
export function dmDetailsV1(token: string, dmId: number) {

}

export function dmRemoveV1(token: string, dmId: number) {

}
export function dmLeaveV1(token: string, dmId: number) {

}
export function dmMessagesV1 (token: string, dmId: number, start: number) {
    const data = getData();
    const dmIndex = data.dms.findIndex((d) => d.dmId === dmId);

    if (dmIndex < 0) return { error: 'invalid dmId' };

    const userIndeX = data.users.findIndex((u) => u.token === token);
    if (userIndex < 0) return { error: 'token is invalid' };
    const authUserId  = data.users[userIndex].authUserId;

    const inDm  = data.dms[dmIndex].allMembers.includes(authUserId);
    if (!inDm) return { error: 'user is not a member of the DM' };

    const numberOfMessages = data.dms[dmIndex].messages.length;

    if (start > numberOfMessages) {
    return {
    error: 'start parameter is greater than number of messages in DM'
    };
    }
    let end: number;
    if (numberOfMessages > start + 50) {
    end = start + 50;
    } else if (numberOfMessages === 0 || numberOfMessages <= start + 50) {
    end = -1;
    }
    const reversed = data.dms[dmIndex].messages.slice().reverse();
    const messages =
    reversed.slice(start, start + 50)
    .map(m => ({
    messageId: m.messageId,
    uId: m.uId,
    message: m.message,
    timeSent: m.timeSent
    }));
    setData(data);
    return { messages, end, start };
}