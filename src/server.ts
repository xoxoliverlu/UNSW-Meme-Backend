import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

import { authRegisterV2, authLoginV2, authLogoutV1 } from './auth';
import { clearV1 } from './other';
import { channelsCreateV2, channelsListAllV2, channelsListV2 } from './channels';
import { channelDetailsV2, channelJoinV2, channelAddOwnerV1, channelInviteV1, channelLeaveV1, channelRemoveOwnerV1 } from './channel';
import { userProfileV2, usersAllV1, userProfileSetNameV1, userProfileSetEmailV1, userProfileSetHandleV1 } from './users';
import { dmCreateV1, dmListV1 } from './dm'
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

// start server
const server = app.listen(PORT, HOST, () => {
  // DO NOT CHANGE THIS LINE
  console.log(`⚡️ Server started on port ${PORT} at ${HOST}`);
});

/****************
*  Auth Routes  *
****************/
app.post('/auth/register/v2', (req: Request, res: Response, next) => {
  const {email, password, nameFirst, nameLast} = req.body;
  res.json(authRegisterV2(email, password, nameFirst, nameLast));
});

app.post('/auth/login/v2', (req: Request, res: Response, next) => {
  const { email, password} = req.body;
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
  const {token, name, isPublic} = req.body;
  res.json(channelsCreateV2(token, name, isPublic));
});

app.get('/channels/list/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string
  res.json(channelsListV2(token));
});

app.get('/channels/listall/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string
  res.json(channelsListAllV2(token))
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
  const token = req.query.token as string
  const uId = parseInt(req.query.uId);
  res.json(userProfileV2(token, uId));
});

app.get('/users/all/v1', (req: Request, res: Response, next) => {
  const token = req.query.token as string
  res.json(usersAllV1(token));
});

app.put('/user/profile/setname/v1', (req: Request, res: Response, next) => {
  const {token, nameFirst, nameLast} = req.body;
  res.json(userProfileSetNameV1(token, nameFirst, nameLast));
});

app.put('/user/profile/setemail/v1', (req: Request, res: Response, next) => {
  const {token, email} = req.body;
  res.json(userProfileSetEmailV1(token, email));
});

app.put('/user/profile/sethandle/v1', (req: Request, res: Response, next) => {
  const {token, handleStr} = req.body;
  res.json(userProfileSetHandleV1(token, handleStr));
});
/*****************
* Channel Routes *
*****************/
app.get('/channel/details/v2', (req: Request, res: Response, next) => {
  const token = req.query.token as string
  const channelId = parseInt(req.query.channelId);
  res.json(channelDetailsV2(token, channelId));
});

app.post('/channel/join/v2', (req: Request, res: Response, next) => {
  const {token, channelId} = req.body;
  res.json(channelJoinV2(token, channelId));
});

app.post('/channel/invite/v2', (req: Request, res: Response, next) => {
  const {token, channelId, uId} = req.body;
  res.json(channelInviteV1(token,channelId, uId));
});

app.post('/channel/addowner/v1',(req: Request, res: Response, next) => {
  const {token, channelId, uId} = req.body;
  res.json(channelAddOwnerV1(token,channelId,uId))
});

app.post('/channel/removeowner/v1',(req: Request, res: Response, next) => {
  const {token, channelId, uId} = req.body;
  res.json(channelRemoveOwnerV1(token, channelId, uId));
});

app.post('/channel/leave/v1',(req: Request, res: Response, next) => {
  const {token, channelId} = req.body;
  res.json(channelLeaveV1(token, channelId));
});
/****************
*  DM Routes  *
****************/
app.post('/dm/create/v1', (req: Request, res: Responde, next) => {
  const {token, uIds} = req.body;
  res.json(dmCreateV1(token, uIds));
});

app.get('/dm/list/v1', (req: Request, res: Response, next) => {
  const token = req.query.token;
  res.json(dmListV1(token));
});