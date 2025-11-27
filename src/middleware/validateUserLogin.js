// src/middlewares/validateUserLogin.js
export const validateUserLogin = (req, res, next) => {
    const { email, password } = req.body;

    // 1. Verifica campos obrigatórios
    if (!email || !password) {
        return res.status(400).json({
            error: 'Email e senha são obrigatórios'
        });
    }

    // 2. Valida formato do email
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            error: 'Formato de email inválido'
        });
    }

    // 3. Valida tipo da senha (não precisa de tamanho aqui, só existir)
    if (typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({
            error: 'Senha inválida'
        });
    }

    // Tudo OK → salva dados limpos para o controller usar
    req.validatedUserLogin = {
        email: email.toLowerCase().trim(),
        password: password.trim()
    };

    next();
};