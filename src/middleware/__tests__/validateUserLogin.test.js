import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { validateUserLogin } from '../validateUserLogin.js';

describe('validateUserLogin Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('campos obrigatórios', () => {
    it('deve retornar erro se email não for fornecido', () => {
      req.body = { password: 'senha123' };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email e senha são obrigatórios'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se senha não for fornecida', () => {
      req.body = { email: 'test@example.com' };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email e senha são obrigatórios'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se email e senha não forem fornecidos', () => {
      req.body = {};

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email e senha são obrigatórios'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validação de email', () => {
    it('deve retornar erro para email com formato inválido (sem @)', () => {
      req.body = { email: 'invalidemail.com', password: 'senha123' };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Formato de email inválido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro para email com formato inválido (sem domínio)', () => {
      req.body = { email: 'usuario@', password: 'senha123' };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Formato de email inválido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro para email com formato inválido (sem extensão)', () => {
      req.body = { email: 'usuario@dominio', password: 'senha123' };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Formato de email inválido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar email válido', () => {
      req.body = { email: 'usuario@example.com', password: 'senha123' };

      validateUserLogin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(req.validatedUserLogin.email).toBe('usuario@example.com');
    });
  });

  describe('validação de senha', () => {
    it('deve retornar erro se senha for uma string vazia', () => {
      req.body = { email: 'test@example.com', password: '   ' };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Senha inválida'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se senha não for uma string', () => {
      req.body = { email: 'test@example.com', password: 123 };

      validateUserLogin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Senha inválida'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('sucesso de validação', () => {
    it('deve validar dados corretos e chamar next()', () => {
      req.body = { email: 'user@example.com', password: 'senha123' };

      validateUserLogin(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedUserLogin).toEqual({
        email: 'user@example.com',
        password: 'senha123'
      });
    });

    it('deve normalizar email para minúsculas', () => {
      req.body = { email: 'USER@EXAMPLE.COM', password: 'senha123' };

      validateUserLogin(req, res, next);

      expect(req.validatedUserLogin.email).toBe('user@example.com');
      expect(next).toHaveBeenCalled();
    });

    it('deve remover espaços da senha', () => {
      req.body = { email: 'user@example.com', password: '  senha123  ' };

      validateUserLogin(req, res, next);

      expect(req.validatedUserLogin.password).toBe('senha123');
      expect(next).toHaveBeenCalled();
    });
  });
});
