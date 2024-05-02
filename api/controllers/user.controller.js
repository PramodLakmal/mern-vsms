import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';
import fs from 'fs';
import json2csv from 'json2csv';
import ejs from 'ejs';
import pdf from 'html-pdf';
import jsPDF from 'jspdf';
import router from '../routes/user.route.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { verifyToken } from '../utils/verifyUser.js';
import { json } from 'express';
import { response } from 'express';



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
    }
    if(req.body.phoneNumber){
        if(!/\d{10}/.test(req.body.phoneNumber)){
            return next(errorHandler(400, 'Phone number must be 10 digits long'));
        }
    }

        try {
          const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
              $set: {
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                fullName: req.body.fullName,
                username: req.body.username,
                email: req.body.email,
                profilePicture: req.body.profilePicture,
                password: req.body.password,
                
              }
          }, { new: true });
          const { password, ...rest } = updatedUser._doc;
          res.status(200).json(rest);
        } catch (error) {
          next(error);
        }

};

export const signout = (req, res, next) => {
    try {
      res.clearCookie('access_token');
      res.status(200).json({ message: 'Signout successful' });
    } catch (error) {
      next(error);
    }
};    

export const deleteUser = async (req, res, next) => {
    if(!req.user.isAdmin && req.user.id !== req.params.userId){
        return next(errorHandler(403, 'You are not allowed to delete this user'));
    }
    try {
      await User.findByIdAndDelete(req.params.userId);
      res.status(200).json('User has been deleted');
    } catch (error) {
      next(error);
    }
        
};

export const getUsers = async (req, res, next) => {
  if(!req.user.isAdmin){
      return next(errorHandler(403, 'You are not allowed to get all users'));
  }    
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 20;
      const sortDirection = req.query.sort === 'asc' ? 1 : -1;

      const users = await User.find().skip(startIndex).limit(limit).sort({ createdAt: sortDirection });
      const usersWithoutPassword = users.map(user => {
        const { password, ...rest } = user._doc;
        return rest;
      });
      const totalUsers = await User.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      const lastMonthUsers = await User.find({ createdAt: { $gte: oneMonthAgo } }).countDocuments();
     
      res.status(200).json({ users: usersWithoutPassword, totalUsers, lastMonthUsers });

    } catch (error) {
      next(error);
    }
};

export const getUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.userId);
      const { password, ...rest } = user._doc;
      res.status(200).json(rest);
    } 
    catch (error) {
      next(error);
    }
};

export const generateUserCSVReport = async (req, res) => {
  try {
    const user = await User.find();

    if (!user || user.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Define CSV fields
    const fields = [
      { label: 'User Name', value: 'username' },
      { label: 'Account Created Date', value: 'createdAt' },
      { label: 'Account Updated Date', value: 'updatedAt' },
      { label: 'Email', value: 'email' },
    ];

    // Format users data into CSV format using json2csv
    const csvData = json2csv.parse(user, { fields, withBOM: true });

    // Write CSV data to a file
    fs.writeFileSync('user_report.csv', csvData);

    // Send the file as a response
    res.download('user_report.csv');
  } catch (error) {
    console.error('Error generating CSV report:', error);
    res.status(500).json({ message: 'Failed to generate CSV report' });
  }
};
// Endpoint for generating PDF report
export const generateUserPDFReport = async (req, res) => {
  try {
    const user = await User.find();

    // Render PDF template using EJS
    const template = fs.readFileSync('report_template.ejs', 'utf-8');
    const html = ejs.render(template, { user });

    // Generate PDF
    pdf.create(html).toFile('user_report.pdf', (err, result) => {
      if (err) throw err;
      res.download('user_report.pdf');
    });
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ message: 'Failed to generate PDF report' });
  }
};

export const generateUserReport = async (req, res) => {
  try {
      const user = await User.find();
      const doc = new jsPDF();
      // Generate report logic here
      res.status(200).json({ message: 'Users report generated successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};





// Generate a JWT token
const signToken = (id) => {
  return jwt.sign({ id }, 'sahand', {
    expiresIn: '10m', // Token expires in 10 minutes
  });
};

// Send the reset link to the user's email
const sendResetEmail = async (email, resetToken) => {
  const resetURL = `http://localhost:5173//resetPassword/${resetToken}`;
  
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'vehicleservicemanagementsystem@gmail.com',
      pass: 'xyoy dfso gjez hlxo',
    },
  });

  const mailOptions = {
    from: 'vehicleservicemanagementsystem@gmail.com',
    to: email,
    subject: 'Password Reset Link',
    html: `Click <a href="${resetURL}">here</a> to reset your password.`,
  };

  await transporter.sendMail(mailOptions);
};

// Generate a random token for password reset
const generateResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString('hex');
  return resetToken;
};
