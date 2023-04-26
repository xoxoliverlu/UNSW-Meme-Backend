import { dbGetData, getData, setData } from "./dataStore"
import { PwReset } from "./interfaces";
import HTTPError from 'http-errors';

export const pwResetReqeust = async (email: string) => {
  const data = await dbGetData();
  const nodemailer = require("nodemailer");

  const target = data.users.find(user => user.email === email);

  if (!target){
    return {};
  }

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 't13a.23t1@gmail.com',
      pass: 'vfmp zgqr sgfu iqpo'
    }
  });

  // ensure no repeated resetCode
  let resetCode: string = Math.floor(100000 + Math.random() * 900000).toString();
  while (data.pwReset.find((item: PwReset) => item.code === resetCode)){
    resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  }


  let mailOptions = {
    from: 't13a.23t1@gmail.com',
    to: `${email}`,
    subject: 'Password Reset Code',
    text: `Your password reset code is ${resetCode}.`
  };

  transporter.sendMail(mailOptions, function(error: any, info: { response: string; }){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  // remove all tokens for that users
  data.tokens.filter(item => item.uId === target.uId).forEach(item => data.tokens.splice(data.tokens.indexOf(item),1));
  data.pwReset.push({uId: target.uId, code: resetCode});

  await data.save();
  return {};
}

export const pwReset = async (resetCode: string, newPassword: string) => {
  const data = await dbGetData();
  let target = data.pwReset.find((item: PwReset) => item.code === resetCode);
  if (!target){
    throw HTTPError(400,"invalid reset code");
  }
  if (newPassword.length < 6){
    throw HTTPError(400,"Invalid Length");
  }
  console.log('finding user');
  let index = data.users.findIndex(item => item.uId == target.uId);
  const bcrypt = require('bcrypt');
  const saltRounds = 10;
  bcrypt.genSalt(saltRounds, function(err: any, salt: any) {
    bcrypt.hash(newPassword, salt, function(err:any , hash: any) {
      data.users[index].password = hash;
    });
  });
  data.save();
  return {};
}