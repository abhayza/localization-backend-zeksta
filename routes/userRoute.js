'use strict'; 
var user = require('../controllers/usersController');  
var upload = require('../lib/userUpload');

var multerware = upload.fields([
  { name: 'photo', maxCount: 1}
 ])

module.exports = function (app) {
  app.post('/api/user/save_user', user.saveUser);
  app.get('/apis/user/all', user.getAllUsers);
  app.get('/apis/user/by_id', user.getUsers);
  app.delete('/apis/user/delete', user.deleteUser);
};