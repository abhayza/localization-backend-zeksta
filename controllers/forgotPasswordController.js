'use strict';
var db = require('../config/sequelize').db;
var Sequelize = require("sequelize");
var _ = require('lodash');
const AppError = require('./../utils/appError');
const catchAsync = require('../utils/catchAsync')
var generalConfig = require('../config/generalConfig');
var passport = require("../config/passport.js")(); 
const jwt = require('jsonwebtoken'); 
const jwt_decode = require('jwt-decode');
const sgMail = require('@sendgrid/mail')


// Forgot Password Controller ...................................

// Token
const signToken = id => {
  var date = new Date();
  var minutes = 5;
  const Expired = date.setTime(date.getTime() + (minutes * 60 * 1000));
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: Expired
  });
}
 
exports.forgotPassword = catchAsync(async (req, res, next) => { 
  const user = await db.models.user.findOne({
    attributes: ['id', 'email', 'firstname', 'lastname', 'password', 'profile_image', 'mobile_no', 'is_admin', 'user_type', 'active'],
    where: {
      deleted_at: null,
      email: req.body.email
    }
  }) 
    if (user) { 
      const token = signToken(user.id); 

      const update = await db.models.user.update({
        reset_password_token: token
      }, {
        where: {
          email: req.body.email
        }
      })
      // send email
      let link = generalConfig.adminUrl + `/reset_password?resetLink=${token}&email=${user.email}`; 
      sgMail.setApiKey(process.env.SENDGRID_API_KEY)
      var mailOptions = {
        from: process.env.SENDGRID_EMAIL,
        to: user.email,
        subject: 'Forgot Password',
        text: `Hi ${user.firstname +" "+ user.lastname }  \n 
        Please click on the following link ${link} to reset your password. \n\n 
        If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      }
      sgMail.send(mailOptions).then((response) => {
        res.json({ message: 'Mail Send sucessfully', error: false, data: response });
      }).catch((error) => {
        next(new AppError('Fail to send Mail', 404))
      })
    } else { 
        res.json({ message: 'Email is Invalid', error: true, data: null });
    } 
});

exports.resetPassword = catchAsync(async (req, res, next) => {
const { email, token, password, cpassword} = req.body; 
const decoded = jwt.verify(token, process.env.JWT_SECRET)
if (decoded) {
  if(password === cpassword){
  const updated = await db.models.user.update({
    password: generalConfig.encryptPassword(password)
  }, {
    where: {
      email,
      reset_password_token: token
    }
  })
  if (!updated) return next(new AppError('Not Found', 404))
  res.json({ status: 'success', message: 'Password changed successfully', error: false, data: updated });
  }else{
    res.json({ message: 'Password Are Not Matched', error: true, data: null });
  } 
}else { 
  res.json({ message: 'Token Expire Please Again Forgot Password', error: true, data: null });
} 
});
  