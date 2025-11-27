import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { validateProductUpdate } from '../validateProductUpdate.js';

describe('validateProductUpdate Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('validação de campos obrigatórios', () => {
    it('deve retornar erro se nenhum campo for fornecido', () => {
      req.body = {};

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Pelo menos um campo deve ser enviado para atualização'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('validação de nome', () => {
    it('deve retornar erro se nome tiver menos de 2 caracteres', () => {
      req.body = { nome: 'A' };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nome deve ser uma string com pelo menos 2 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se nome for vazio', () => {
      req.body = { nome: '   ' };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nome deve ser uma string com pelo menos 2 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se nome não for uma string', () => {
      req.body = { nome: 123 };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Nome deve ser uma string com pelo menos 2 caracteres'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar nome válido', () => {
      req.body = { nome: 'Novo Notebook' };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate.nome).toBe('Novo Notebook');
    });

    it('deve fazer trim no nome', () => {
      req.body = { nome: '  Mouse Gamer  ' };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate.nome).toBe('Mouse Gamer');
    });
  });

  describe('validação de preço', () => {
    it('deve retornar erro se preço for negativo', () => {
      req.body = { preco: -50 };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Preço deve ser um número maior ou igual a zero'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se preço não for um número', () => {
      req.body = { preco: 'caro' };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Preço deve ser um número maior ou igual a zero'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar preço zero', () => {
      req.body = { preco: 0 };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate.preco).toBe(0);
    });

    it('deve aceitar preço válido', () => {
      req.body = { preco: 1999.99 };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate.preco).toBe(1999.99);
    });
  });

  describe('validação de categoria', () => {
    it('deve retornar erro se categoria for vazia', () => {
      req.body = { categoria: '   ' };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Categoria deve ser uma string não vazia'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se categoria não for uma string', () => {
      req.body = { categoria: 123 };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Categoria deve ser uma string não vazia'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar categoria válida', () => {
      req.body = { categoria: 'Periféricos' };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate.categoria).toBe('Periféricos');
    });

    it('deve fazer trim na categoria', () => {
      req.body = { categoria: '  Eletrônicos  ' };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate.categoria).toBe('Eletrônicos');
    });
  });

  describe('validação de quantidade', () => {
    it('deve retornar erro se quantidade for negativa', () => {
      req.body = { quantidade: -10 };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Quantidade deve ser um número maior ou igual a zero'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro se quantidade não for um número', () => {
      req.body = { quantidade: 'muitos' };

      validateProductUpdate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Quantidade deve ser um número maior ou igual a zero'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('deve aceitar quantidade zero', () => {
      req.body = { quantidade: 0 };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate.quantidade).toBe(0);
    });

    it('deve aceitar quantidade válida', () => {
      req.body = { quantidade: 100 };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate.quantidade).toBe(100);
    });
  });

  describe('sucesso de validação', () => {
    it('deve aceitar atualização parcial com um campo', () => {
      req.body = { nome: 'Novo Nome' };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate).toEqual({ nome: 'Novo Nome' });
    });

    it('deve aceitar atualização com múltiplos campos', () => {
      req.body = {
        nome: '  iPhone 14  ',
        preco: 4500,
        categoria: '  Smartphones  '
      };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate).toEqual({
        nome: 'iPhone 14',
        preco: 4500,
        categoria: 'Smartphones'
      });
    });

    it('deve aceitar todos os campos', () => {
      req.body = {
        nome: 'Samsung Galaxy',
        preco: 3000,
        categoria: 'Smartphones',
        quantidade: 50
      };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate).toEqual({
        nome: 'Samsung Galaxy',
        preco: 3000,
        categoria: 'Smartphones',
        quantidade: 50
      });
    });

    it('deve ignorar campos undefined', () => {
      req.body = {
        nome: 'Novo Produto',
        preco: undefined,
        categoria: 'Nova Categoria'
      };

      validateProductUpdate(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.validatedProductUpdate).toEqual({
        nome: 'Novo Produto',
        categoria: 'Nova Categoria'
      });
      expect(req.validatedProductUpdate.preco).toBeUndefined();
    });
  });
});
