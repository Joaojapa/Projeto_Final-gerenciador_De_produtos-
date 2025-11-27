import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { productRouter } from '../../routes/productRoutes.js';
import { ProductModel } from '../../models/ProductModel.js';

jest.mock('../../models/ProductModel.js');

describe('Product Routes', () => {
  let app;
  const mockToken = 'valid-token-123';
  const mockAdminUser = { id: '123', role: 'admin' };
  const mockCommonUser = { id: '456', role: 'common' };

  beforeEach(() => {
    app = express();
    app.use(express.json());

    // Mock middleware de autenticação
    app.use((req, res, next) => {
      if (req.headers.authorization === `Bearer ${mockToken}`) {
        req.user = mockAdminUser;
      }
      next();
    });

    app.use('/api/products', productRouter);
    jest.clearAllMocks();
  });

  describe('GET /api/products', () => {
    it('deve retornar todos os produtos', async () => {
      const products = [
        {
          _id: '1',
          nome: 'Notebook',
          preco: 2500,
          categoria: 'Eletrônicos',
          quantidade: 10
        },
        {
          _id: '2',
          nome: 'Mouse',
          preco: 100,
          categoria: 'Periféricos',
          quantidade: 50
        }
      ];

      ProductModel.mockImplementation(() => ({
        findAll: jest.fn().mockResolvedValue(products)
      }));

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(products);
      expect(response.body.length).toBe(2);
    });

    it('deve retornar lista vazia quando não houver produtos', async () => {
      ProductModel.mockImplementation(() => ({
        findAll: jest.fn().mockResolvedValue([])
      }));

      const response = await request(app).get('/api/products');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/products/:id', () => {
    it('deve retornar um produto pelo ID', async () => {
      const product = {
        _id: '1',
        nome: 'Notebook',
        preco: 2500,
        categoria: 'Eletrônicos',
        quantidade: 10
      };

      ProductModel.mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue(product)
      }));

      const response = await request(app).get('/api/products/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });

    it('deve retornar erro 404 se produto não existir', async () => {
      ProductModel.mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue(null)
      }));

      const response = await request(app).get('/api/products/invalid-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Produto não encontrado');
    });
  });

  describe('POST /api/products', () => {
    it('deve criar um novo produto com token válido', async () => {
      const newProduct = {
        _id: '1',
        nome: 'Notebook',
        preco: 2500,
        categoria: 'Eletrônicos',
        quantidade: 10
      };

      ProductModel.mockImplementation(() => ({
        create: jest.fn().mockResolvedValue(newProduct)
      }));

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          nome: 'Notebook',
          preco: 2500,
          categoria: 'Eletrônicos',
          quantidade: 10
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Produto criado com sucesso');
      expect(response.body.product).toEqual(newProduct);
    });

    it('deve validar campos obrigatórios ao criar produto', async () => {
      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          nome: 'Notebook'
          // faltam preco e categoria
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeTruthy();
    });

    it('deve rejeitar requisição sem autenticação', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({
          nome: 'Notebook',
          preco: 2500,
          categoria: 'Eletrônicos'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/products/:id', () => {
    it('deve atualizar um produto com token válido', async () => {
      ProductModel.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue(true)
      }));

      const response = await request(app)
        .put('/api/products/1')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          nome: 'Notebook Atualizado',
          preco: 3000
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Produto atualizado com sucesso');
    });

    it('deve retornar erro 404 se produto não existir', async () => {
      ProductModel.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue(false)
      }));

      const response = await request(app)
        .put('/api/products/invalid-id')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          nome: 'Novo Nome'
        });

      expect(response.status).toBe(404);
    });

    it('deve rejeitar requisição sem autenticação', async () => {
      const response = await request(app)
        .put('/api/products/1')
        .send({
          nome: 'Novo Nome'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('deve fazer update parcial com token válido', async () => {
      ProductModel.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue(true)
      }));

      const response = await request(app)
        .patch('/api/products/1')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          preco: 2000
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Produto atualizado com sucesso');
    });

    it('deve rejeitar PATCH sem campos', async () => {
      const response = await request(app)
        .patch('/api/products/1')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('deve deletar um produto com token válido', async () => {
      ProductModel.mockImplementation(() => ({
        remove: jest.fn().mockResolvedValue(true)
      }));

      const response = await request(app)
        .delete('/api/products/1')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Produto deletado com sucesso');
    });

    it('deve retornar erro 404 se produto não existir', async () => {
      ProductModel.mockImplementation(() => ({
        remove: jest.fn().mockResolvedValue(false)
      }));

      const response = await request(app)
        .delete('/api/products/invalid-id')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
    });

    it('deve rejeitar requisição sem autenticação', async () => {
      const response = await request(app).delete('/api/products/1');

      expect(response.status).toBe(401);
    });
  });
});
