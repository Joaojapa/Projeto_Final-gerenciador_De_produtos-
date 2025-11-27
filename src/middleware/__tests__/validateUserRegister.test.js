import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { validateUserRegister } from '../validateUserRegister.js';

describe('validateUserRegister Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('campos obrigatórios', () => {
    it('deve retornar erro se email não for fornecido', () => {
      req.body = { password: 'senha123' };

      validateUserRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email e senha são obrigatórios'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se senha não for fornecida', () => {
      req.body = { email: 'test@example.com' };

      validateUserRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email e senha são obrigatórios'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validação de email', () => {
    it('deve retornar erro para email inválido', () => {
      req.body = { email: 'invalidemail', password: 'senha123456' };

      validateUserRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Formato de email inválido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar email válido', () => {
      req.body = { email: 'user@example.com', password: 'senha123456' };

      validateUserRegister(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('validação de força de senha', () => {
    it('deve retornar erro se senha tiver menos de 6 caracteres', () => {
      req.body = { email: 'test@example.com', password: 'abc12' };

      validateUserRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'A senha deve ter pelo menos 6 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se senha for uma string vazia', () => {
      req.body = { email: 'test@example.com', password: '   ' };

      validateUserRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'A senha deve ter pelo menos 6 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar senha com exatamente 6 caracteres', () => {
      req.body = { email: 'test@example.com', password: '123456' };

      validateUserRegister(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve aceitar senha com mais de 6 caracteres', () => {
      req.body = { email: 'test@example.com', password: 'senhaforte123' };

      validateUserRegister(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('validação de role', () => {
    it('deve retornar erro se role for inválido', () => {
      req.body = {
        email: 'test@example.com',
        password: 'senha123456',
        role: 'superadmin'
      };

      validateUserRegister(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Role deve ser "admin" ou "common"'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar role "admin"', () => {
      req.body = {
        email: 'test@example.com',
        password: 'senha123456',
        role: 'admin'
      };

      validateUserRegister(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedUserRegister.role).toBe('admin');
    });

    it('deve aceitar role "common"', () => {
      req.body = {
        email: 'test@example.com',
        password: 'senha123456',
        role: 'common'
      };

      validateUserRegister(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedUserRegister.role).toBe('common');
    });

    it('deve usar role "common" como padrão se não fornecido', () => {
      req.body = {
        email: 'test@example.com',
        password: 'senha123456'
      };

      validateUserRegister(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedUserRegister.role).toBe('common');
    });
  });

  describe('sucesso de validação', () => {
    it('deve validar dados corretos com todos os campos', () => {
      req.body = {
        email: 'user@example.com',
        password: 'senha123456',
        role: 'admin'
      };

      validateUserRegister(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedUserRegister).toEqual({
        email: 'user@example.com',
        password: 'senha123456',
        role: 'admin'
      });
    });

    it('deve normalizar dados e usar role padrão', () => {
      req.body = {
        email: 'user@example.com',
        password: '  senhaforte  '
      };

      validateUserRegister(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedUserRegister).toEqual({
        email: 'user@example.com',
        password: 'senhaforte',
        role: 'common'
      });
    });
  });
});
