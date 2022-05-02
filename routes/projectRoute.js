'use strict'; 
var project = require('../controllers/projectsController');  
// var upload = require('../lib/projectUpload');

// var multerware = upload.fields([
//   { name: 'photo', maxCount: 1}
//  ])

module.exports = function (app) {
  app.post('/apis/project/save_project', project.saveProject);
  app.get('/apis/project/all', project.getAllProjects);
  app.get('/apis/project/:project_id', project.getProjectById); 
  app.delete('/apis/project/delete/:project_id', project.deleteProjectById); 
};