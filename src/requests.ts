
const request = require('sync-request');
import { port, url } from './config.json';

export const requestAuthLogin = (email: string, password: string) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/auth/login/v3',
        {
          json: {
            email,
            password
          }
        }
  );
    // expect status code to be OK
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestAuthRegister = (email: string, password: string, nameFirst: string, nameLast: string) => {
  const res1 = request(
    'POST',
        `${url}:${port}` + '/auth/register/v3',
        {
          json: {
            email,
            password,
            nameFirst,
            nameLast
          }
        }
  );
  if (res1.statusCode === 200) {
    return JSON.parse(res1.getBody() as string);
  }
  return res1.statusCode;
};

export const requestAuthLogout = (token: string) => {
  const res3 = request(
    'POST',
        `${url}:${port}` + '/auth/logout/v2',
        {
          headers: {
            token
          }
        }
  );
  if (res3.statusCode === 200) {
    return JSON.parse(res3.getBody() as string);
  }
  return res3.statusCode;
};

export const requestClear = () => {
  const res4 = request(
    'DELETE',
        `${url}:${port}` + '/clear/v1',
        {}
  );
  return JSON.parse(res4.getBody() as string);
};

export const requestDmCreate = (token: string, uIds: number[]) => {
  const res5 = request(
    'POST',
        `${url}:${port}` + '/dm/create/v2',
        {
          headers: {
            token: token
          },
          json: {
            uIds
          }
        }
  );
  if (res5.statusCode === 200) {
    return JSON.parse(res5.getBody() as string);
  }
  return res5.statusCode;
};

export const requestChannelsCreate = (token: string, name: string, isPublic: boolean) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/channels/create/v3',
        {
          json: {
            name: name,
            isPublic: isPublic
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelsList = (token: string) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/channels/list/v3',
        {
          headers: {
            token: token,
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelsListAll = (token: string) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/channels/listall/v3',
        {
          headers: {
            token: token,
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelDetails = (token: string, channelId: number) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/channel/details/v3',
        {
          qs: {
            channelId: channelId
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelJoin = (token: string, channelId: number) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/channel/join/v3',
        {
          json: {
            channelId: channelId
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestUserProfile = (token: string, uId: number) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/user/profile/v3',
        {
          qs: {
            uId: uId
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestUsersAll = (token: string) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/users/all/v2',
        {
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestUserProfileSetName = (token: string, nameFirst: string, nameLast: string) => {
  const res = request(
    'PUT',
        `${url}:${port}` + '/user/profile/setname/v2',
        {
          json: {
            nameFirst: nameFirst,
            nameLast: nameLast,
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestUserProfileSetEmail = (token: string, email: string) => {
  const res = request(
    'PUT',
        `${url}:${port}` + '/user/profile/setemail/v2',
        {
          json: {
            email: email,
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestUserProfileSetHandle = (token: string, handleStr: string) => {
  const res = request(
    'PUT',
        `${url}:${port}` + '/user/profile/sethandle/v2',
        {
          json: {
            handleStr: handleStr,
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelAddOwner = (token: string, channelId: number, uId: number) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/channel/addowner/v2',
        {
          json: {
            channelId: channelId,
            uId: uId
          },
          headers:{
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelInvite = (token: string, channelId: number, uId: number) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/channel/invite/v2',
        {
          json: {
            token: token,
            channelId: channelId,
            uId: uId
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelRemoveOwner = (token: string, channelId: number, uId: number) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/channel/removeowner/v2',
        {
          json: {
            channelId: channelId,
            uId: uId
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelLeave = (token: string, channelId: number) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/channel/leave/v2',
        {
          json: {
            channelId: channelId,
          },
          headers: {
            token: token,
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestDmList = (token: string) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/dm/list/v2',
        {
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestDmRemove = (token: string, dmId: number) => {
  const res = request(
    'DELETE',
    `${url}:${port}` + '/dm/remove/v2',
    {
      qs: {
        dmId,
      },
      headers: {
        token: token
      }
    }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.body as string);
  }
  return res.statusCode;
};

export const requestDmDetails = (token: string, dmId: number) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/dm/details/v2',
        {
          qs: {
            dmId: dmId
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestDmLeave = (token: string, dmId: number) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/dm/leave/v2',
        {
          json: {
            dmId: dmId,
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestChannelMessages = (token: string, channelId: number, start: number) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/channel/messages/v3',
        {
          qs: {
            token: token,
            channelId: channelId,
            start: start
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestMessageSend = (token: string, channelId: number, message: string) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/message/send/v2',
        {
          json: {
            channelId: channelId,
            message: message
          },
          headers: {
            token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestDmMessages = (token: string, dmId: number, start: number) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/dm/messages/v1',
        {
          qs: {
            token: token,
            dmId: dmId,
            start: start
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestMessageSendDm = (token: string, dmId: number, message: string) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/message/senddm/v2',
        {
          json: {
            dmId: dmId,
            message: message
          },
          headers: {
            token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestMessageRemove = (token: string, messageId: number) => {
  const res = request(
    'DELETE',
        `${url}:${port}` + '/message/remove/v1',
        {
          qs: {
            token: token,
            messageId: messageId
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestMessageEdit = (token: string, messageId: number, message: string) => {
  const res = request(
    'PUT',
        `${url}:${port}` + '/message/edit/v1',
        {
          json: {
            token: token,
            messageId: messageId,
            message: message
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
};

export const requestSearch = (token: string, queryStr: string) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/search/v1',
        {
          qs: {
            queryStr: queryStr
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
}

export const requestPwResetRequest = (email: string) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/auth/passwordreset/request/v1',
        {
          json: {
            email: email
          },
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
}

export const requestPwReset = (resetCode:string, newPassword: string) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/auth/passwordreset/reset/v1',
        {
          json: {
            resetCode,
            newPassword,
          },
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
}

export const requestAdminUserPermissionChange = (token: string, uId: number, permissionId: number) => {
  const res = request(
    'POST',
        `${url}:${port}` + '/admin/userpermission/change/v1',
        {
          json: {
            uId: uId,
            permissionId: permissionId
          },
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
}; 

export const requestUserStats = (token: string) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/user/stats/v1',
        {
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
}; 


export const requestUsersStats = (token: string) => {
  const res = request(
    'GET',
        `${url}:${port}` + '/users/stats/v1',
        {
          headers: {
            token: token
          }
        }
  );
  if (res.statusCode === 200) {
    return JSON.parse(res.getBody() as string);
  }
  return res.statusCode;
}; 