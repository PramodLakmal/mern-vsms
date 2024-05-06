import express from "express";
import { test, updateUser, signout} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { deleteUser } from "../controllers/user.controller.js";
import { getUsers } from "../controllers/user.controller.js";
import { getUser } from "../controllers/user.controller.js";
import { generateUserCSVReport } from "../controllers/user.controller.js";
import { generateUserPDFReport } from "../controllers/user.controller.js";
import { generateUserReport } from "../controllers/user.controller.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { errorHandler } from '../utils/error.js';


const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.post('/signout', signout);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.get('/getusers', verifyToken, getUsers);



router.get('/:userId', getUser)
router.get('/csv-report', generateUserCSVReport);
router.get('/pdf-report', generateUserPDFReport);

router.get('/generate-report', generateUserReport);





export default router;