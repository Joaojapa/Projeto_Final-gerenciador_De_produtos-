import UserModel from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userModel = new UserModel();
export class AuthController {
    constructor(parameters) {

    }


    createUser = async (req, res) => {
        try {
            const { email, password, role } = req.validatedUserRegister;

            if (!email || !password) {
                return res.status(400).json({ error: 'Email e senha são obrigatórios' });
            }

            const existingUser = await userModel.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await userModel.create({
                email,
                password: hashedPassword,
                role: role || 'common'
            });

            const token = jwt.sign(
                { id: newUser._id, role: newUser.role },
                process.env.JWT_SECRET,
                { expiresIn: '7d' }
            );

            res.status(201).json({
                message: 'Usuário criado com sucesso',
                token,
                user: { id: newUser._id, email: newUser.email, role: newUser.role }
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao registrar usuário' });
        }
    };


    loginUser = async (req, res) => {
        try {
            // 1. Pega os dados já validados e limpos pelo middleware
            const { email, password } = req.validatedUserLogin;

            // 2. Busca o usuário no banco
            const user = await userModel.findByEmail(email);
            if (!user) {
                return res.status(401).json({
                    error: 'Email ou senha inválidos'
                });
            }

            // 3. Compara a senha
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    error: 'Email ou senha inválidos'
                });
            }

            // 4. Gera o token JWT
            const token = jwt.sign(
                {
                    id: user._id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                { expiresIn: '7d' } // ou '1h', '24h', como preferir
            );

            const { password: _, ...userWithoutPassword } = user;

            res.status(200).json({
                message: 'Login realizado com sucesso',
                token,
                user: userWithoutPassword
            });

        } catch (err) {
            console.error('Erro no login:', err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    getAllUsers = async (req, res) => {
        try {
            const users = await userModel.findAll();
            res.status(200).json(users);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar users' });
        }
    };



    getUserById = async (req, res) => {
        try {
            const user = await userModel.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ error: 'User não encontrado' });
            }
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar User' });
        }
    };

}