"use strict";
var jwt = require("jwt-simple");
var bodyParser = require("body-parser");
var generalConfig = require("../config/generalConfig");
var passport = require("../config/passport.js")();
const globalErrorHandler = require("../controllers/errorController");
const jwt_decode = require('jwt-decode');

module.exports = function (app) {
  app.use(passport.initialize());
  app.all("/admin/signin", function (req, res) {
    
    const { email, password } = req.body; 
    if (email && password) {
      passport.validateEmailPassword(email, password, function (res1) {
        if (res1) {
          if (res1.error === false) {
            generalConfig.generateJwtToken(
              res1.data._id,
              res1.data.role_id, 
              function (res2) { 
                res.json({
                  newToken: res2.newToken,
                  message: res1.message,
                  error: false,
                  firstname: res1.data.firstname,
                  lastname: res1.data.lastname,
                });
              }
            );  
          } else { 
            res.json({
              message: res1.message,
              error: true,
            });
          }
        } else { 
          res.json({
            message: "Some issue occurred.",
            error: true,
          });
        }
      });
    } else { 
      res.json({
        message: "User credentials are invalid",
        error: true,
      });
    }
  });

  app.all("/admin/*", passport.authenticate(), function (req, res, next) {
    next();
  });

  app.all("/apis/*", passport.authenticate(), function (req, res, next) {
    next();
  });

  app.all("/api/*", function (req, res, next) {
    next();
  });
  /* Admin Other Routes */

  var userRoute = require("./userRoute.js");
  new userRoute(app);

  var projectRoute = require("./projectRoute.js");
  new projectRoute(app);

  
  // Global error handling
  app.use(globalErrorHandler);

  app.use(function (err, req, res, next) {
    var msg = {
      error_code: err.error,
      message: err.message ? err.message : err.error_description,
    };
    if (err.code === 401 || err.code === 503) {
      res.status(err.code).send(msg);
    } else {
      return res.json({
        code: err.code,
        status: "fail",
        error: true,
        message: err.message ? err.message : err.error_description,
      });
    }
  });
};
