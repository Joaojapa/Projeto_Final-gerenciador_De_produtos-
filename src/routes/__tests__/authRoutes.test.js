import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { authRouter } from '../../routes/authRoutes.js';
import UserModel from '../../models/UserModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../../models/UserModel.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('Auth Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRouter);
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const newUser = {
        _id: '507f1f77bcf86cd799439011',
        email: 'newuser@example.com',
        password: 'hashedpassword',
        role: 'common'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(newUser)
      }));

      bcrypt.hash.mockResolvedValue('hashedpassword');
      jwt.sign.mockReturnValue('token123');

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: 'senha123456',
          role: 'common'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Usuário criado com sucesso');
      expect(response.body.token).toBe('token123');
      expect(response.body.user.email).toBe('newuser@example.com');
    });

    it('deve validar email na rota de registro', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalidemail',
          password: 'senha123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Formato de email inválido');
    });

    it('deve validar força de senha na rota de registro', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'abc'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        'A senha deve ter pelo menos 6 caracteres'
      );
    });

    it('deve rejeitar email já cadastrado', async () => {
      UserModel.mockImplementation(() => ({
        findByEmail: jest
          .fn()
          .mockResolvedValue({ email: 'existing@example.com' })
      }));

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'senha123456'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Email já cadastrado');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve fazer login com sucesso', async () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'admin'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(user)
      }));

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('token123');

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'senha123'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login realizado com sucesso');
      expect(response.body.token).toBe('token123');
    });

    it('deve rejeitar login com email inválido', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalidemail',
          password: 'senha123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Formato de email inválido');
    });

    it('deve rejeitar login com email não encontrado', async () => {
      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(null)
      }));

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'senha123'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Email ou senha inválidos');
    });

    it('deve rejeitar login com senha incorreta', async () => {
      const user = {
        _id: '507f1f77bcf86cd799439011',
        email: 'user@example.com',
        password: 'hashedpassword',
        role: 'common'
      };

      UserModel.mockImplementation(() => ({
        findByEmail: jest.fn().mockResolvedValue(user)
      }));

      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'senhaerrada'
        });

      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Email ou senha inválidos');
    });
  });

  describe('GET /api/auth/users', () => {
    it('deve retornar lista de usuários', async () => {
      const users = [
        { _id: '1', email: 'user1@example.com', role: 'admin' },
        { _id: '2', email: 'user2@example.com', role: 'common' }
      ];

      UserModel.mockImplementation(() => ({
        findAll: jest.fn().mockResolvedValue(users)
      }));

      const response = await request(app).get('/api/auth/users');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(users);
      expect(response.body.length).toBe(2);
    });
  });
});
