
import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV3, channelsListAllV3, channelsListV3 } from './channels';
import { channelDetailsV3, channelJoinV3, channelAddOwnerV2, channelInviteV1, channelLeaveV2, channelRemoveOwnerV2, channelMessagesV1 } from './channel';
import { userProfileV3, usersAllV2, userProfileSetNameV2, userProfileSetEmailV2, userProfileSetHandleV2 } from './users';
import { messageSendV2, messageSendDmV2, messageEditV1, messageRemoveV1 } from './message';
import { dmCreateV1, dmListV1, dmRemoveV1, dmDetailsV2, dmLeaveV2, dmMessagesV1 } from './dm';
import { fileLoadData } from './dataStore';
import { searchV1 } from './search';
import { pwResetReqeust, pwReset } from './password';
import { adminUserPermissionChangeV1 } from './admin';
import { usersStatsV1, userStatsV1 } from './stats';
// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

// connect app to mongodb
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://z5295931:comp1531.23t1@comp1531.e0jq4sr.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('mongodb successfully connected');
  })
  .catch((err: any) => {
    console.log(err);
  });

const PORT: number = parseInt(process.env.PORT || config.port);
const HOST: string = process.env.IP || 'localhost';

// Example get request
app.get('/echo', (req: Request, res: Response, next) => {
  const data = req.query.echo as string;
  return res.json(echo(data));
});

// Keep this BENEATH route definitions
// handles errors nicely
app.use(errorHandler());

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
  // auto-load saved data when server starts
  fileLoadData();
});

/****************
*  Auth Routes  *
****************/
app.post('/auth/register/v3', async (req: Request, res: Response, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    res.json(await authRegisterV2(email, password, nameFirst, nameLast));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/login/v3', async (req: Request, res: Response, next) => {
  try {
    const { email, password } = req.body;
    res.json(await authLoginV2(email, password));
  } catch (err) {
    next(err);
  }
});

app.post('/auth/logout/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.headers.token as string;
    res.json(await authLogoutV1(token));
  } catch (err) {
    next(err);
  }
});

/****************
*  Channels Routes  *
****************/
app.post('/channels/create/v3', async (req: Request, res: Response, next) => {
  try {
    const { name, isPublic } = req.body;
    const token = req.header('token');
    const result = await channelsCreateV3(token, name, isPublic);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.get('/channels/list/v3', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const result = await channelsListV3(token);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.get('/channels/listall/v3', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const result = await channelsListAllV3(token);
    res.json(result);
  } catch (e) {
    next(e);
  }
});
/*****************
*  Other Routes
*****************/
app.delete('/clear/v1', async (req: Request, res: Response, next) => {
  await clearV1();
  res.json({});
});
// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
/****************
*  User Routes  *
****************/
app.get('/user/profile/v3', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const uId = parseInt(req.query.uId as string);
    res.json(await userProfileV3(token, uId));
  } catch (e) {
    next(e);
  }
});

app.get('/users/all/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    res.json(await usersAllV2(token));
  } catch (e) {
    next(e);
  }
});

app.put('/user/profile/setname/v2', async (req: Request, res: Response, next) => {
  try {
    const { nameFirst, nameLast } = req.body;
    const token = req.header('token');
    res.json(await userProfileSetNameV2(token, nameFirst, nameLast));
  } catch (e) {
    next(e);
  }
});

app.put('/user/profile/setemail/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { email } = req.body;
    res.json(await userProfileSetEmailV2(token, email));
  } catch (e) {
    next(e);
  }
});

app.put('/user/profile/sethandle/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { handleStr } = req.body;
    res.json(await userProfileSetHandleV2(token, handleStr));
  } catch (e) {
    next(e);
  }
});
/*****************
* Channel Routes *
*****************/
app.get('/channel/details/v3', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = parseInt(req.query.channelId as string);
    res.json(await channelDetailsV3(token, channelId));
  } catch (e) {
    next(e);
  }
});

app.post('/channel/join/v3', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { channelId } = req.body;
    res.json(await channelJoinV3(token, channelId));
  } catch (e) {
    next(e);
  }
});

app.post('/channel/invite/v2', async (req: Request, res: Response, next) => {
  const { token, channelId, uId } = req.body;
  res.json(await channelInviteV1(token, channelId, uId));
});

app.post('/channel/addowner/v2', async (req: Request, res: Response, next) => {
  try {
    const { channelId, uId } = req.body;
    const token = req.header('token');
    res.json(await channelAddOwnerV2(token, channelId, uId));
  } catch (e) {
    next(e);
  }
});

app.post('/channel/removeowner/v2', async (req: Request, res: Response, next) => {
  try {
    const { channelId, uId } = req.body;
    const token = req.header('token');
    const result = await channelRemoveOwnerV2(token, channelId, uId);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.post('/channel/leave/v2', async (req: Request, res: Response, next) => {
  try {
    const { channelId } = req.body;
    const token = req.header('token');
    const result = await channelLeaveV2(token, channelId);
    res.json(result);
  } catch (e) {
    next(e);
  }
});
/****************
*  DM Routes  *
****************/
app.post('/dm/create/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.headers.token as string;
    const { uIds } = req.body;
    res.json(await dmCreateV1(token, uIds));
  } catch (err) {
    next(err);
  }
});

app.get('/dm/list/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.headers.token as string;
    res.json(await dmListV1(token));
  } catch (err) {
    next(err);
  }
});

app.delete('/dm/remove/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.headers.token as string;
    const dmId = parseInt(req.query.dmId as string);
    res.json(await dmRemoveV1(token, dmId));
  } catch (err) {
    next(err);
  }
});
app.get('/dm/details/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const dmId = parseInt(req.query.dmId as string);
    res.json(await dmDetailsV2(token, dmId));
  } catch (e) {
    next(e);
  }
});

app.post('/dm/leave/v2', async (req: Request, res: Response, next) => {
  try {
    const { dmId } = req.body;
    const token = req.header('token');
    res.json(await dmLeaveV2(token, dmId));
  } catch (e) {
    next(e);
  }
});
/****************
*  Messages Routes  *
****************/
app.post('/message/send/v2', async (req: Request, res: Response, next) => {
  try {
    const { channelId, message } = req.body;
    const token = req.header('token');
    res.json(await messageSendV2(token, channelId, message));
  } catch (error) {
    next(error);
  }
});
app.post('/message/senddm/v2', async (req: Request, res: Response, next) => {
  try {
    const { dmId, message } = req.body;
    const token = req.header('token');
    res.json(await messageSendDmV2(token, dmId, message));
  } catch (error) {
    next(error);
  }
});

app.put('/message/edit/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { messageId, message } = req.body;
    res.json(await messageEditV1(token, messageId, message));
  } catch (error) {
    next(error);
  }
});

app.delete('/message/remove/v2', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const messageId = parseInt(req.query.messageId as string);
    res.json(await messageRemoveV1(token, messageId));
  } catch (error) {
    console.log('catching: ' + error);
    next(error);
  }
});

app.get('/dm/messages/v1', async (req: Request, res: Response, next) => {
  try {
    const token = req.query.token as string;
    const dmId = parseInt(req.query.dmId as string);
    const start = parseInt(req.query.start as string);
    res.json(await dmMessagesV1(token, dmId, start));
  } catch (error) {
    next(error);
  }
});

app.get('/channel/messages/v3', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const channelId = parseInt(req.query.channelId as string);
    const start = parseInt(req.query.start as string);
    res.json(await channelMessagesV1(token, channelId, start));
  } catch (error) {
    next(error);
  }
});

app.get('/search/v1', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const queryStr = req.query.queryStr as string;
    const result = await searchV1(token, queryStr);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/****************
*  Password Routes  *
****************/
app.post('/auth/passwordreset/request/v1', async (req: Request, res: Response, next) => {
  try {
    const email = req.body.email as string;
    const result = await pwResetReqeust(email);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

app.post('/auth/passwordreset/reset/v1', async (req: Request, res: Response, next) => {
  try {
    const newPassword = req.body.newPassword as string;
    const resetCode = req.body.resetCode as string;
    const result = await pwReset(resetCode, newPassword);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/****************
* admin Routes  *
****************/

app.post('/admin/userpermission/change/v1', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    const { uId, permissionId } = req.body;
    res.json(await adminUserPermissionChangeV1(token, uId, permissionId));
  } catch (e) {
    next(e);
  }
});

/****************
* stat Routes  *
****************/

app.get('/user/stats/v1', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    res.json(await userStatsV1(token));
  } catch (e) {
    next(e);
  }
});

app.get('/users/stats/v1', async (req: Request, res: Response, next) => {
  try {
    const token = req.header('token');
    res.json(await usersStatsV1(token));
  } catch (e) {
    next(e);
  }
});
