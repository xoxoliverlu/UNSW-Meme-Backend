import express, { json, Request, Response } from 'express';
import { echo } from './echo';
import morgan from 'morgan';
import config from './config.json';
import cors from 'cors';

import { authRegisterV2 } from './auth';
import { clearV1 } from './other';

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

/*****************
*
*  Other Routes
*
*****************/
app.delete('/clear/v1', (req: Request, res: Response, next) => {
  clearV1();
  res.json({});
});
// For coverage, handle Ctrl+C gracefully
process.on('SIGINT', () => {
  server.close(() => console.log('Shutting down server gracefully.'));
});
