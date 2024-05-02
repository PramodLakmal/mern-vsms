import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { error } from "console";


export const signup = async (req, res, next) => {
        const {phoneNumber, address, fullName, username, email, password } = req.body;

        if (!username || !email || !password || username === "" || email === "" || password === "") {
            next(errorHandler(400, 'All fields are required'));
        }

        const hashPassword = bcryptjs.hashSync(password, 10);

        const newUser = new User({
            address,
            phoneNumber,
            fullName,
            username,
            email,
            password: hashPassword,
        });

        try{
            await newUser.save();
            res.json('Signup success');
        }catch(error){
            next(error);
        }
 
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || email === '' || password === '') {
        next(errorHandler(400, 'All fields are required'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Invalid credentials'));
    }
    const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin, isCustomerServiceAgent: validUser.isCustomerServiceAgent}, process.env.JWT_SECRET);

    const { password: pass, ...rest } = validUser._doc;

    res.status(200).cookie('access_token', token, {
        httpOnly: true}).json(rest);
    } catch (error) {
        next(error);
    }
};

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if(user) {
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin, isCustomerServiceAgent: user.isCustomerServiceAgent }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            return res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        } else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashPassword = bcryptjs.hashSync(generatedPassword, 10);
            const newUser = new User({
                fullName: name,
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin,  isCustomerServiceAgent: newUser.isCustomerServiceAgent}, process.env.JWT_SECRET);
            const { password, ...rest } = newUser._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest);
        }
    } catch (error) {
        next(error);
    }
};

// Function to send email
const sendResetPasswordEmail = async (email, resetToken) => {
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
        subject: 'Password Reset',
        html: `<p>You requested a password reset. Click <a href="http://localhost:5173/reset-password/${resetToken}">here</a> to reset your password.<br><br> Your reset Token is:<b> ${resetToken} </b> </p>`,
    };

    await transporter.sendMail(mailOptions);
};

export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(errorHandler(404, 'User not found'));
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Save reset token to user document
        user.resetPasswordToken = resetToken;
        await user.save();

        // Send reset password email
        await sendResetPasswordEmail(email, resetToken);

        res.json('Reset password email sent');
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    const { resetToken, newPassword } = req.body;

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return errorHandler(404, 'User not found');
        }

        // Hash new password
        const hashPassword = bcryptjs.hashSync(newPassword, 10);

        // Update user's password
        user.password = hashPassword;
        user.resetPasswordToken = null;
        await user.save();

        res.json('Password reset successfully');
    } catch (error) {
        console.error("Error resetting password:", error);
        next(error);
    }
};


