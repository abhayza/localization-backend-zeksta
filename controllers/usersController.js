'use strict';
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync')
const user = require('../models/user');
var generalConfig = require('../config/generalConfig');
const jwt_decode = require('jwt-decode');
var path = require('path');

exports.saveUser = catchAsync(async (req, res, next) => {
    const { _id, email, password, reset_password_token, firstname, lastname, mobile_no, role_id, } = req.body;
    if (password) {
        var pass = generalConfig.encryptPassword(password);
    }
    if (_id) {
        const update = await user.updateOne({ _id: _id },
            { reset_password_token, email, firstname, lastname, mobile_no, role_id, 
        });
        if (!update) return next(new AppError('User not update sucessfully', 404))
        res.json({ message: 'Users update sucessfully', error: false, data: update });
    } else {
        const create = await user.create({
            email, password: pass, reset_password_token, firstname, lastname, mobile_no, role_id
        });
        if (!create) return next(new AppError('User not created successfully', 404))
        res.json({ message: 'Users create sucessfully', error: false, data: create });
    }
})

exports.getAllUsers = catchAsync(async (req, res, next) => {
    const users = await user.aggregate([{
        $lookup:
        {
          from: 'roles',
          localField: 'role_id',
          foreignField: '_id',
          as: 'roles_detail'
        }
    }])
    if (!users.length) return next(new AppError('All user not found', 404));
    res.json({ message: 'Users found', error: false, data: users });
})

exports.getUsers = catchAsync(async (req, res, next) => {
    var decoded = jwt_decode(req.headers.authorization);  
    var user_id = decoded.id;
    const detail = await user.findOne({ '_id': user_id });
    if (!detail) return next(new AppError('User not found', 404))
    res.json({ message: 'User found', error: false, data: detail });
})


exports.deleteUser = catchAsync(async (req, res, next) => {
    const { id } = req.body;
    const deleted = await user.deleteOne({ '_id': id });
    if (!deleted) return next(new AppError('User not deleted successfully', 404))
    res.json({ message: 'User has been deleted successfully.', error: false, data: null });
})
