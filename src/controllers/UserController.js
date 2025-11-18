import UserModel from '../models/UserModel.js';
const userModel = new UserModel();
export class userController {
    constructor(parameters) {

    }


    createUser = async (req, res) => {
        try {

            const { email, password } = req.validatedUser;

            const userExists = await userModel.findById(email);

            if (userExists) {
                return res.status(409).json({ message: 'Email já cadastrado.' });
            }

            const result = await UserModel.createUser(req.validatedUser);

            return res.status(201).json({
                message: 'Usuário criado com sucesso',
                id: result.insertedId
            });

        } catch (err) {
            // tratar duplicata mesmo assim (corrida concorrente)
            if (err.code === 11000 && err.keyPattern?.email) {
                return res.status(409).json({ error: 'Email já cadastrado' });
            }
            console.error(err);
            return res.status(500).json({ error: 'Erro interno' });
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