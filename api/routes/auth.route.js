import Express from "express";
import { google, signin, signup } from "../controllers/auth.controller.js";
import { forgotPassword, resetPassword } from "../controllers/auth.controller.js";

const router = Express.Router();


router.post('/signup', signup);
router.post('/signin', signin);
router.post('/google', google);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;