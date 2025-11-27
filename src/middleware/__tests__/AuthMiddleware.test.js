import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { AuthMiddleware } from '../AuthMiddleware.js';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

jest.mock('jsonwebtoken');
jest.mock('util');

describe('AuthMiddleware', () => {
  let authMiddleware;
  let req, res, next;
  const mockToken = 'valid-token-123';
  const mockUser = {
    id: '507f1f77bcf86cd799439011',
    role: 'admin'
  };

  beforeEach(() => {
    authMiddleware = new AuthMiddleware();
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret-key';
  });

  describe('verifyToken', () => {
    it('deve verificar token válido com sucesso', async () => {
      req.headers.authorization = `Bearer ${mockToken}`;

      const mockPromisifiedVerify = jest.fn().mockResolvedValue(mockUser);
      promisify.mockReturnValue(mockPromisifiedVerify);

      await authMiddleware.verifyToken(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve retornar erro se nenhum token for fornecido', async () => {
      req.headers.authorization = undefined;

      await authMiddleware.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No token provided'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se header Authorization não existir', async () => {
      req.headers = {};

      await authMiddleware.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'No token provided'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se token for inválido', async () => {
      req.headers.authorization = `Bearer invalid-token`;

      const mockPromisifiedVerify = jest.fn().mockRejectedValue(
        new Error('Invalid token')
      );
      promisify.mockReturnValue(mockPromisifiedVerify);

      await authMiddleware.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se token estiver expirado', async () => {
      req.headers.authorization = `Bearer expired-token`;

      const mockPromisifiedVerify = jest.fn().mockRejectedValue(
        new Error('Token expired')
      );
      promisify.mockReturnValue(mockPromisifiedVerify);

      await authMiddleware.verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Unauthorized'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve extrair token corretamente do header Bearer', async () => {
      req.headers.authorization = `Bearer ${mockToken}`;

      const mockPromisifiedVerify = jest.fn().mockResolvedValue(mockUser);
      promisify.mockReturnValue(mockPromisifiedVerify);

      await authMiddleware.verifyToken(req, res, next);

      expect(mockPromisifiedVerify).toHaveBeenCalledWith(
        mockToken,
        process.env.JWT_SECRET
      );
    });
  });

  describe('authorize', () => {
    it('deve autorizar usuário com role permitido', () => {
      req.user = { id: '123', role: 'admin' };

      const middleware = authMiddleware.authorize('admin');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve autorizar usuário com uma das múltiplas roles permitidas', () => {
      req.user = { id: '123', role: 'admin' };

      const middleware = authMiddleware.authorize('admin', 'moderator');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve negar acesso se usuário não tiver role permitido', () => {
      req.user = { id: '123', role: 'common' };

      const middleware = authMiddleware.authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden: insufficient permissions'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se usuário não estiver autenticado', () => {
      req.user = undefined;

      const middleware = authMiddleware.authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Not authenticated'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve suportar múltiplas roles', () => {
      req.user = { id: '123', role: 'common' };

      const middleware = authMiddleware.authorize('admin', 'common', 'moderator');
      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('deve ser case-sensitive para roles', () => {
      req.user = { id: '123', role: 'Admin' };

      const middleware = authMiddleware.authorize('admin');
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden: insufficient permissions'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro quando não houver roles permitidas definidas', () => {
      req.user = { id: '123', role: 'admin' };

      const middleware = authMiddleware.authorize();
      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Forbidden: insufficient permissions'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
