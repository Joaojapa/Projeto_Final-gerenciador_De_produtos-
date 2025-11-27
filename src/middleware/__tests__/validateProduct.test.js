import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { validateProduct } from '../validateProduct.js';

describe('validateProduct Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('validação de nome', () => {
    it('deve retornar erro se nome não for fornecido', () => {
      req.body = { preco: 100, categoria: 'eletrônicos', quantidade: 10 };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se nome tiver menos de 2 caracteres', () => {
      req.body = { nome: 'A', preco: 100, categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se nome for string vazia', () => {
      req.body = { nome: '   ', preco: 100, categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se nome não for uma string', () => {
      req.body = { nome: 123, preco: 100, categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nome é obrigatório e deve ter pelo menos 2 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar nome válido', () => {
      req.body = { nome: 'Notebook', preco: 2000, categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProduct.nome).toBe('Notebook');
    });
  });

  describe('validação de preço', () => {
    it('deve retornar erro se preço não for fornecido', () => {
      req.body = { nome: 'Notebook', categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Preço deve ser um número positivo'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se preço for negativo', () => {
      req.body = { nome: 'Notebook', preco: -100, categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Preço deve ser um número positivo'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se preço não for um número', () => {
      req.body = { nome: 'Notebook', preco: 'caro', categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Preço deve ser um número positivo'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar preço válido', () => {
      req.body = { nome: 'Notebook', preco: 2500.50, categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProduct.preco).toBe(2500.50);
    });
  });

  describe('validação de categoria', () => {
    it('deve retornar erro se categoria não for fornecida', () => {
      req.body = { nome: 'Notebook', preco: 2000 };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Categoria é obrigatória'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se categoria não for uma string', () => {
      req.body = { nome: 'Notebook', preco: 2000, categoria: 123 };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Categoria é obrigatória'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar categoria válida', () => {
      req.body = { nome: 'Notebook', preco: 2000, categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProduct.categoria).toBe('eletrônicos');
    });
  });

  describe('validação de quantidade', () => {
    it('deve aceitar quantidade não fornecida', () => {
      req.body = { nome: 'Notebook', preco: 2000, categoria: 'eletrônicos' };

      validateProduct(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('deve retornar erro se quantidade for negativa', () => {
      req.body = {
        nome: 'Notebook',
        preco: 2000,
        categoria: 'eletrônicos',
        quantidade: -5
      };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Estoque deve ser um número não negativo'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se quantidade não for um número', () => {
      req.body = {
        nome: 'Notebook',
        preco: 2000,
        categoria: 'eletrônicos',
        quantidade: 'muitos'
      };

      validateProduct(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Estoque deve ser um número não negativo'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar quantidade zero', () => {
      req.body = {
        nome: 'Notebook',
        preco: 2000,
        categoria: 'eletrônicos',
        quantidade: 0
      };

      validateProduct(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProduct.quantidade).toBe(0);
    });

    it('deve aceitar quantidade válida', () => {
      req.body = {
        nome: 'Notebook',
        preco: 2000,
        categoria: 'eletrônicos',
        quantidade: 50
      };

      validateProduct(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProduct.quantidade).toBe(50);
    });
  });

  describe('sucesso de validação', () => {
    it('deve validar dados completos e fazer trim', () => {
      req.body = {
        nome: '  Notebook Dell  ',
        preco: 2500,
        categoria: 'Eletrônicos',
        quantidade: 15
      };

      validateProduct(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProduct).toEqual({
        nome: 'Notebook Dell',
        preco: 2500,
        categoria: 'Eletrônicos',
        quantidade: 15
      });
    });

    it('deve validar com quantidade omitida', () => {
      req.body = {
        nome: 'Mouse',
        preco: 50,
        categoria: 'Periféricos'
      };

      validateProduct(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProduct).toEqual({
        nome: 'Mouse',
        preco: 50,
        categoria: 'Periféricos'
      });
    });
  });
});
