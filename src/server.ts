import express, { json, query, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';
import errorHandler from 'middleware-http-errors';

import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV3, channelsListAllV3, channelsListV3 } from './channels';
import { channelDetailsV2, channelJoinV2, channelAddOwnerV2, channelInviteV1, channelLeaveV2, channelRemoveOwnerV2, channelMessagesV1 } from './channel';
import { userProfileV2, usersAllV1, userProfileSetNameV1, userProfileSetEmailV1, userProfileSetHandleV1 } from './users';
import { messageSendV1, messageSendDmV1, messageEditV1, messageRemoveV1 } from './message';
import { dmCreateV1, dmListV1, dmRemoveV1, dmDetailsV1, dmLeaveV1, dmMessagesV1 } from './dm';
import { fileLoadData } from './dataStore';
import { searchV1 } from './search';
import { pwResetReqeust, pwReset } from './password';
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
app.post('/auth/register/v3', (req: Request, res: Response, next) => {
  try {
    const { email, password, nameFirst, nameLast } = req.body;
    res.json(authRegisterV2(email, password, nameFirst, nameLast));
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

app.post('/auth/logout/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.headers.token as string;
    res.json(authLogoutV1(token));
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
    const result = channelsCreateV3(token, name, isPublic);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.get('/channels/list/v3', async (req: Request, res: Response, next) => {
  try{
    const token = req.header('token');
    const result = channelsListV3(token);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

app.get('/channels/listall/v3', async (req: Request, res: Response, next) => {
  try{
    const token = req.header('token');
    const result = channelsListAllV3(token);
    res.json(result);
  } catch (e){
    next(e)
  }
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
 
app.post('/channel/addowner/v2', (req: Request, res: Response, next) => {
  const { channelId, uId } = req.body;
  const token = req.header('token');
  const result = channelAddOwnerV2(token, channelId, uId);
  const {error} = result;
  if (error === 'token' || error === 'This user does not have permission to add owners.'){
    res.statusCode = 403;
  }
  if (
    error === 'no channel found' ||
    error === 'invalid uId' ||
    error === 'user to be added is not a member of the channel' ||
    error === 'user is already an owner'){
    res.statusCode = 400;
}
app.post('/channel/addowner/v2', async (req: Request, res: Response, next) => {
  try{
    const { channelId, uId } = req.body;
    const token = req.header('token');
    res.json(channelAddOwnerV2(token, channelId, uId));
  } catch(e){
    next(e); 
  }
});
 
app.post('/channel/removeowner/v2', (req: Request, res: Response, next) => {
  const { channelId, uId } = req.body;
  const token = req.header('token');
  const result = channelRemoveOwnerV2(token,channelId,uId);
  const {error} = result;
  if (error === 'token' || error === 'This user does not have permission to add owners.'){
    res.statusCode = 403;
  }
  if (
    error === 'no channel found' ||
    error === 'invalid uId' ||
    error === 'user to be removed is not a member of the channel' ||
    error === 'user is not an owner of this channel.' ||
    error === 'user is the only owner of this channel.'){
    res.statusCode = 400;
}
app.post('/channel/removeowner/v2', async (req: Request, res: Response, next) => {
  try {
    const { channelId, uId } = req.body;
    const token = req.header('token');
    const result = await channelRemoveOwnerV2(token,channelId,uId);
    res.json(result);
  } catch (e) {
    next(e); 
  }
});

app.post('/channel/leave/v2', async (req: Request, res: Response, next) => {
  try{
    const { channelId } = req.body;
    const token = req.header('token');
    const result = channelLeaveV2(token,channelId);
    res.json(result);
  } catch(e) {
    next(e);
  }
});


/****************
*  DM Routes  *
****************/
app.post('/dm/create/v2', (req: Request, res: Response, next) => {
  try {
    const token = req.headers.token as string;
    const { uIds } = req.body;
    res.json(dmCreateV1(token, uIds));
  } catch (err) {
    next(err);
  }
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

/****************
*  Messages Routes  *
****************/
app.post('/message/send/v1', (req: Request, res: Response, next) => {
  const { token, channelId, message } = req.body;
  res.json(messageSendV1(token, channelId, message));
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

app.get('/dm/messages/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const dmId = parseInt(req.query.dmId as string);
  const start = parseInt(req.query.start as string);
  res.json(dmMessagesV1(token, dmId, start));
});

app.get('/channel/messages/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string;
  const channelId = parseInt(req.query.channelId as string);
  const start = parseInt(req.query.start as string);
  res.json(channelMessagesV1(token, channelId, start));
});

app.get('/search/v1',(req: Request, res: Response, next) => {
  const token = req.header('token');
  const queryStr = req.query.queryStr as string;
  const result = searchV1(token,queryStr);
  const {error} = result;
  if (error === 'token'){
    res.statusCode = 403;
  }
  if (error === 'length'){
    res.statusCode = 400;
  }
  res.json(result);
})

/****************
*  Password Routes  *
****************/
app.post('/auth/passwordreset/request/v1',(req: Request, res: Response, next) => {
  const email = req.body.email as string;
  const result = pwResetReqeust(email);
  const {error} = result;
  if (error === 'token'){
    res.statusCode = 403;
  }

  res.json(result);
})

app.post('/auth/passwordreset/reset/v1',(req: Request, res: Response, next) => {
  const newPassword = req.body.newPassword as string;
  const resetCode = req.body.resetCode as string;
  const result = pwReset(resetCode, newPassword);
  console.log(result);
  const {error} = result;
  if (error){
    res.statusCode = 400;
  }

  res.json(result);
})
