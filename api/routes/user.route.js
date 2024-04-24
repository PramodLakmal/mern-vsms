import express from "express";
import { test, updateUser, signout} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { deleteUser } from "../controllers/user.controller.js";
import { getUsers } from "../controllers/user.controller.js";
import { getUser } from "../controllers/user.controller.js";


const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.post('/signout', signout);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.get('/getusers', verifyToken, getUsers);
router.get('/:userId', getUser)




export default router;