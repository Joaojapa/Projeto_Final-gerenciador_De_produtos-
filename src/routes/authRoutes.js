import express  from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { validateUserLogin } from '../middleware/validateUserLogin.js';
import {validateUserRegister} from '../middleware/validateUserRegister.js'

const router = express.Router();

const authController = new AuthController()

router.post('/login', validateUserLogin, authController.loginUser);

router.post('/register', validateUserRegister, authController.createUser);
router.get('/users', authController.getAllUsers)

export { router as authRouter };