// src/middlewares/validateUserRegister.js
export const validateUserRegister = (req, res, next) => {
    const { email, password, role } = req.body;

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

    // 3. Valida força da senha
    if (typeof password !== 'string' || password.trim().length < 6) {
        return res.status(400).json({
            error: 'A senha deve ter pelo menos 6 caracteres'
        });
    }

    // 4. Valida role (opcional, mas se vier tem que ser válido)
    if (role && !['admin', 'common'].includes(role)) {
        return res.status(400).json({
            error: 'Role deve ser "admin" ou "common"'
        });
    }

    // Tudo OK → salva os dados limpos e validados
    req.validatedUserRegister = {
        email: email.toLowerCase().trim(),
        password: password.trim(),
        role: role || 'common'
    };

    next();
};