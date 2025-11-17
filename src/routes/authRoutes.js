import express  from 'express';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

// Simulação de usuário (em produção: banco de dados)
const USERS = [
  { id: 1, email: 'admin@exemplo.com', password: '123456' }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = USERS.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  const token = generateToken({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});

export { router as authRouter };