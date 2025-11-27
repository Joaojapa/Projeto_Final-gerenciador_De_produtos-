import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AuthController } from '../AuthController.js';
import UserModel from '../../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mock, mockReset } from 'jest-mock-extended';

jest.mock('../../models/UserModel.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AuthController', () => {
  let authController;
  let req, res;
  let mockUserModel;
  const mockUserId = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    mockUserModel = mock();
    UserModel.mockImplementation(() => mockUserModel);
    authController = new AuthController();
    req = {
      body: {},
      validatedUserRegister: {},
      validatedUserLogin: {},
      params: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockReset(mockUserModel);
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('createUser', () => {
    it('deve criar um novo usuário com sucesso', async () => {
      const newUser = {
        _id: mockUserId,
        email: 'newuser@example.com',
        password: 'hashedpassword',
        role: 'common'
      };

      req.validatedUserRegister = {
        email: 'newuser@example.com',
        password: 'senha123',
        role: 'common'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(newUser)
      }));

      bcrypt.hash.mockResolvedValue('hashedpassword');
      jwt.sign.mockReturnValue('token123');

      await authController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário criado com sucesso',
        token: 'token123',
        user: {
          id: mockUserId,
          email: 'newuser@example.com',
          role: 'common'
        }
      });
    });

    it('deve retornar erro se email já estiver cadastrado', async () => {
      req.validatedUserRegister = {
        email: 'existing@example.com',
        password: 'senha123',
        role: 'common'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue({ email: 'existing@example.com' })
      }));

      await authController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email já cadastrado'
      });
    });

    it('deve retornar erro se houver erro no servidor', async () => {
      req.validatedUserRegister = {
        email: 'newuser@example.com',
        password: 'senha123'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await authController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao registrar usuário'
      });
    });
  });

  describe('loginUser', () => {
    it('deve fazer login com sucesso', async () => {
      const user = {
        _id: mockUserId,
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'admin'
      };

      req.validatedUserLogin = {
        email: 'user@example.com',
        password: 'senha123'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(user)
      }));

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login realizado com sucesso',
        token: 'token123',
        user: {
          _id: mockUserId,
          email: 'user@example.com',
          role: 'admin'
        }
      });
    });

    it('deve retornar erro se email não for encontrado', async () => {
      req.validatedUserLogin = {
        email: 'notfound@example.com',
        password: 'senha123'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(null)
      }));

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email ou senha inválidos'
      });
    });

    it('deve retornar erro se senha for incorreta', async () => {
      const user = {
        _id: mockUserId,
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'common'
      };

      req.validatedUserLogin = {
        email: 'user@example.com',
        password: 'senhaerrada'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(user)
      }));

      bcrypt.compare.mockResolvedValue(false);

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Email ou senha inválidos'
      });
    });

    it('deve retornar erro de servidor em caso de exceção', async () => {
      req.validatedUserLogin = {
        email: 'user@example.com',
        password: 'senha123'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await authController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor'
      });
    });
  });

  describe('getAllUsers', () => {
    it('deve retornar todos os usuários', async () => {
      const users = [
        { _id: '1', email: 'user1@example.com', role: 'admin' },
        { _id: '2', email: 'user2@example.com', role: 'common' }
      ];

      UserModel.mockImplementation(() => ({
        findAll: jest.fn().mockResolvedValue(users)
      }));

      await authController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('deve retornar erro ao buscar usuários', async () => {
      UserModel.mockImplementation(() => ({
        findAll: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await authController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar users'
      });
    });
  });

  describe('getUserById', () => {
    it('deve retornar um usuário pelo ID', async () => {
      const user = {
        _id: mockUserId,
        email: 'user@example.com',
        role: 'admin'
      };

      req.params.id = mockUserId;

      UserModel.mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue(user)
      }));

      await authController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(user);
    });

    it('deve retornar erro se usuário não for encontrado', async () => {
      req.params.id = mockUserId;

      UserModel.mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue(null)
      }));

      await authController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'User não encontrado'
      });
    });

    it('deve retornar erro ao buscar usuário', async () => {
      req.params.id = mockUserId;

      UserModel.mockImplementation(() => ({
        findById: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await authController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar User'
      });
    });
  });
});
