'use strict';
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')
const project = require('../models/project');
const user = require('../models/user');
var generalConfig = require('../config/generalConfig');
const jwt_decode = require('jwt-decode');
var path = require('path');

exports.saveProject = catchAsync(async (req, res, next) => {
    var decoded = jwt_decode(req.headers.authorization);  
    var user_id = decoded.id; 
    const { id, project_name, project_description, } = req.body;
    if (id) {
        const update = await project.updateOne({ _id: id },
            { project_name, project_description, user_id 
        });
        if (!update) return next(new AppError('Project not update sucessfully', 404))
        res.json({ message: 'Projects update sucessfully', error: false, data: update });
    } else {
        const create = await project.create({
            project_name, project_description, user_id
        });
        if (!create) return next(new AppError('Project not created successfully', 404))
        res.json({ message: 'Projects create sucessfully', error: false, data: create });
    }
})

exports.getAllProjects = catchAsync(async (req, res, next) => {
    var decoded = jwt_decode(req.headers.authorization);  
    var user_id = decoded.id;
    const projects = await project.find({ 'user_id': user_id })
    // const projects = await project.aggregate([{
    //     $lookup:
    //     {
    //       from: 'users',
    //       localField: '_id',
    //       foreignField: 'user_id',
    //       as: 'projectDetail'
    //     }
    // }])
    if (!projects.length) return next(new AppError('Projects not found', 404));
    res.json({ message: 'Projects found', error: false, data: projects });
})

exports.getProjectById = catchAsync(async (req, res, next) => {
    const { project_id } = req.params;
    const detail = await project.findOne({ '_id': project_id });
    if (!detail) return next(new AppError('Project not found', 404))
    res.json({ message: 'Project found', error: false, data: detail });
})

exports.deleteProjectById = catchAsync(async (req, res, next) => {
    const { project_id } = req.params; 
    const deleted = await project.deleteOne({ '_id': project_id });
    if (!deleted) return next(new AppError('Project not deleted successfully', 404))
    res.json({ message: 'Project has been deleted successfully.', error: false, data: null });
})
