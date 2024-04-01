import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const test = (req, res) => {
    res.json({ message: "API is working" });
  };


  export const updateUser = async (req, res, next) => {

    if(req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to update this user'));
    }

    if(req.body.password){
        if(req.body.password.length < 6){
            return next(errorHandler(400, 'Password must be at least 6 characters long'));
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    if(req.body.username){
        if(req.body.username.length < 7 || req.body.username.length > 20){
            return next(errorHandler(400, 'Username must be between 7 and 20 characters long'));
        }
        if(req.body.username.includes(' ')){
            return next(errorHandler(400, 'Username must not contain spaces'));
        }
        if(req.body.username !== req.body.username.toLowerCase()){
            return next(errorHandler(400, 'Username must be in lowercase'));
        }
        if(!req.body.username.match(/^[a-zA-Z0-9]+$/)){
            return next(errorHandler(400, 'Username must contain only letters and numbers'));
        }
        try {
          const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
              $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                profilePicture: req.body.profilePicture,
              }
          }, { new: true });
          const { password, ...rest } = updatedUser._doc;
          res.status(200).json(rest);
        } catch (error) {
          next(error);
        }
    }

  };