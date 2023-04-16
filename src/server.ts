import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV2, channelsListAllV2, channelsListV2 } from './channels';
import { channelDetailsV2, channelJoinV2, channelAddOwnerV1, channelInviteV1, channelLeaveV1, channelRemoveOwnerV1, channelMessagesV1 } from './channel';
import { userProfileV2, usersAllV1, userProfileSetNameV1, userProfileSetEmailV1, userProfileSetHandleV1 } from './users';
import { messageSendV1, messageSendDmV1, messageEditV1, messageRemoveV1 } from './message';
import { dmCreateV1, dmListV1, dmRemoveV1, dmDetailsV1, dmLeaveV1, dmMessagesV1 } from './dm';
import { fileLoadData } from './dataStore';
// Set up web app
const app = express();
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware that allows for access from other domains
app.use(cors());
// for logging errors (print to terminal)
app.use(morgan('dev'));

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
app.post('/auth/register/v2', (req: Request, res: Response, next) => {
  const { email, password, nameFirst, nameLast } = req.body;
  res.json(authRegisterV2(email, password, nameFirst, nameLast));
});

app.post('/auth/login/v2', (req: Request, res: Response, next) => {
  const { email, password } = req.body;
  res.json(authLoginV2(email, password));
});

app.post('/auth/logout/v1', (req: Request, res: Response, next) => {
  const { token } = req.body;
  res.json(authLogoutV1(token));
});

/****************
*  Channels Routes  *
****************/
app.post('/channels/create/v2', (req: Request, res: Response, next) => {
  const { token, name, isPublic } = req.body;
  res.json(channelsCreateV2(token, name, isPublic));
});

app.get('/channels/list/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  res.json(channelsListV2(token));
});

app.get('/channels/listall/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  res.json(channelsListAllV2(token));
});
/*****************
*  Other Routes
*****************/
app.delete('/clear/v1', (req: Request, res: Response, next) => {
  clearV1();
  res.json({});
});
// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
/****************
*  User Routes  *
****************/
app.get('/user/profile/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const uId = parseInt(req.query.uId);
  res.json(userProfileV2(token, uId));
});

app.get('/users/all/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  res.json(usersAllV1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response, next) => {
  const { token, nameFirst, nameLast } = req.body;
  res.json(userProfileSetNameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response, next) => {
  const { token, email } = req.body;
  res.json(userProfileSetEmailV1(token, email));
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response, next) => {
  const { token, handleStr } = req.body;
  res.json(userProfileSetHandleV1(token, handleStr));
});
/*****************
* Channel Routes *
*****************/
app.get('/channel/details/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  res.json(channelDetailsV2(token, channelId));
});

app.post('/channel/join/v2', (req: Request, res: Response, next) => {
  const { token, channelId } = req.body;
  res.json(channelJoinV2(token, channelId));
});

app.post('/channel/invite/v2', (req: Request, res: Response, next) => {
  const { channelId, uId } = req.body;
  const token = req.header('token');
  const result = channelInviteV1(token, channelId, uId);
  const {error} = result;
  if (error === 'token' || error === 'authUserId is not in the channel') {
    res.statusCode = 403;
  }
  if (
    error === 'channelId is not valid' ||
    error === 'uId is not valid' ||
    error === 'uId is already in channel'
    
  )
  {
    res.statusCode = 400;
  }
  res.json(result);
});

app.get('/channel/messages/v2', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  const result = channelMessagesV1(token, channelId, start);
  const {error} = result;
  if (error === 'token' || 'the user is not a member of the channel'
  || error === 'channelId does not refer to a valid channel' ) {
    res.statusCode = 403;
  }
  if (error === 'start parameter is greater than the total number of messages' ) {
    res.statusCode = 400;
  }
  res.json(result);
});

app.post('/channel/addowner/v1', (req: Request, res: Response, next) => {
  const { token, channelId, uId } = req.body;
  res.json(channelAddOwnerV1(token, channelId, uId));
});

app.post('/channel/removeowner/v1', (req: Request, res: Response, next) => {
  const { token, channelId, uId } = req.body;
  res.json(channelRemoveOwnerV1(token, channelId, uId));
});

app.post('/channel/leave/v1', (req: Request, res: Response, next) => {
  const { token, channelId } = req.body;
  res.json(channelLeaveV1(token, channelId));
});


/****************
*  DM Routes  *
****************/
app.post('/dm/create/v1', (req: Request, res: Response, next) => {
  const { token, uIds } = req.body;
  res.json(dmCreateV1(token, uIds));
});

app.get('/dm/list/v1', (req: Request, res: Response, next) => {
  const token = req.query.token;
  res.json(dmListV1(token));
});

app.delete('/dm/remove/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = parseInt(req.query.dmId as string);
  res.json(dmRemoveV1(token, dmId));
});
app.get('/dm/details/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = parseInt(req.query.dmId as string);
  res.json(dmDetailsV1(token, dmId));
});

app.post('/dm/leave/v1', (req: Request, res: Response, next) => {
  const { token, dmId } = req.body;
  res.json(dmLeaveV1(token, dmId));
});

app.get('/dm/messages/v1', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const dmId = parseInt(req.query.dmId as string);
  const start = parseInt(req.query.start as string);
  const result = dmMessagesV1(token, dmId, start);
  const {error} = result; 
  if(error === 'token' || 'user is not a member of the DM') {
    res.statusCode = 403;
  }
  if (error === 'invalid dmId' || 'dmId in dmmessages') {
    res.statusCode = 400;
  }
  res.json(result);

});

/****************
*  Messages Routes  *
****************/
app.post('/message/send/v1', (req: Request, res: Response, next) => {
  const { channelId, message } = req.body;
  const token = req.header('token');
  const result = messageSendV1(token, channelId, message);
  res.json(messageSendV1(token, channelId, message));
  const {error} = result;
  if (error === 'token' || 'User is not part of the channel') {
    res.statusCode = 403;
  }
  if (error === 'Message cannot be empty' 
  || 'Message is greater than 1000 characters') {
    res.statusCode = 400;
  }
});

app.post('/message/senddm/v1', (req: Request, res: Response, next) => {
  const { token, dmId, message } = req.body;
  res.json(messageSendDmV1(token, dmId, message));
});

app.put('/message/edit/v1', (req: Request, res: Response, next) => {
  const { messageId, message } = req.body;
  const token = req.header('token');
  const result = messageEditV1(token, messageId, message);
  const {error} = result;
  if ( error ===  'message was not sent by this user, and user does not have owner permissions') {
    res.statusCode = 403;
  } 
  if (error === 'token' || 'message id is invalid' || 'Message is greater than 1000 characters') {
    res.statusCode = 400;
  }
  res.json(result);
});
app.post('/message/share/v1', (req: Request, res: Response, next) => {
  const { ogmessageId, message, channelId, dmId } = req.body;
  const token = req.header('token');
  const result = messageShareV1(token, messageId, message);
  const {error} = result;
  if ( error ===  'message was not sent by this user, and user does not have owner permissions') {
    res.statusCode = 403;
  } 
  if (error === 'token' || 'message id is invalid' || 'Message is greater than 1000 characters') {
    res.statusCode = 400;
  }
  res.json(result);
});
app.delete('/message/remove/v1', (req: Request, res: Response, next) => {
  const token = req.header('token');
  const messageId = parseInt(req.query.messageId as string);
  const result = messageRemoveV1(token, messageId);
  const {error} = result;
  if (error === 'token' || 'user did not send this message' ) {
    res.statusCode = 403;
  }
  if (error === 'messageId does not refer to a valid message within a channel/DM that the authorised user has joined' ||
  'This user does not have permission to delete this message.' || 'This user does not have permission to delete this message.') {
    res.statusCode = 400;
  }
  res.json(result);
});


