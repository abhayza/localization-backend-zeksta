const mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment')

const ProjectSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  }, 
  project_name: {
    type: String,
    required: true
  },
  project_description: {
    type: String,
    required: true
  }, 
  status: {
    type: Boolean,
    default: 1
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Date,
    default: null
  }
});

autoIncrement.initialize(mongoose.connection);
ProjectSchema.plugin(autoIncrement.plugin, 'project');
const project = mongoose.model('project', ProjectSchema);

module.exports = project;