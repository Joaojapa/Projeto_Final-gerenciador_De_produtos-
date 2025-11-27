import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { ProductController } from '../ProductController.js';
import { ProductModel } from '../../models/ProductModel.js';

jest.mock('../../models/ProductModel.js');

describe('ProductController', () => {
  let productController;
  let req, res;
  const mockProductId = '507f1f77bcf86cd799439011';

  beforeEach(() => {
    productController = new ProductController();
    req = {
      body: {},
      validatedProduct: {},
      validatedProductUpdate: {},
      params: {},
      user: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('deve criar um novo produto com sucesso', async () => {
      const newProduct = {
        _id: mockProductId,
        nome: 'Notebook',
        preco: 2500,
        categoria: 'Eletrônicos',
        quantidade: 10
      };

      req.validatedProduct = {
        nome: 'Notebook',
        preco: 2500,
        categoria: 'Eletrônicos',
        quantidade: 10
      };

      ProductModel.mockImplementation(() => ({
        create: jest.fn().mockResolvedValue(newProduct)
      }));

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Produto criado com sucesso',
        product: newProduct
      });
    });

    it('deve retornar erro ao criar produto', async () => {
      req.validatedProduct = {
        nome: 'Notebook',
        preco: 2500,
        categoria: 'Eletrônicos'
      };

      ProductModel.mockImplementation(() => ({
        create: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno ao criar produto'
      });
    });
  });

  describe('getAllProducts', () => {
    it('deve retornar todos os produtos', async () => {
      const products = [
        { _id: '1', nome: 'Notebook', preco: 2500, categoria: 'Eletrônicos' },
        { _id: '2', nome: 'Mouse', preco: 100, categoria: 'Periféricos' }
      ];

      ProductModel.mockImplementation(() => ({
        findAll: jest.fn().mockResolvedValue(products)
      }));

      await productController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(products);
    });

    it('deve retornar array vazio se não houver produtos', async () => {
      ProductModel.mockImplementation(() => ({
        findAll: jest.fn().mockResolvedValue([])
      }));

      await productController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });

    it('deve retornar erro ao buscar produtos', async () => {
      ProductModel.mockImplementation(() => ({
        findAll: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await productController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar produtos'
      });
    });
  });

  describe('getProductById', () => {
    it('deve retornar um produto pelo ID', async () => {
      const product = {
        _id: mockProductId,
        nome: 'Notebook',
        preco: 2500,
        categoria: 'Eletrônicos',
        quantidade: 10
      };

      req.params.id = mockProductId;

      ProductModel.mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue(product)
      }));

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(product);
    });

    it('deve retornar erro se produto não for encontrado', async () => {
      req.params.id = mockProductId;

      ProductModel.mockImplementation(() => ({
        findById: jest.fn().mockResolvedValue(null)
      }));

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Produto não encontrado'
      });
    });

    it('deve retornar erro ao buscar produto', async () => {
      req.params.id = mockProductId;

      ProductModel.mockImplementation(() => ({
        findById: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao buscar produto'
      });
    });
  });

  describe('updateProduct', () => {
    it('deve atualizar um produto com sucesso', async () => {
      req.params.id = mockProductId;
      req.validatedProductUpdate = {
        nome: 'Notebook Atualizado',
        preco: 3000
      };

      ProductModel.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue(true)
      }));

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Produto atualizado com sucesso'
      });
    });

    it('deve retornar erro se produto não for encontrado', async () => {
      req.params.id = mockProductId;
      req.validatedProductUpdate = { nome: 'Novo Nome' };

      ProductModel.mockImplementation(() => ({
        update: jest.fn().mockResolvedValue(false)
      }));

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Produto não encontrado ou nenhum campo foi alterado'
      });
    });

    it('deve retornar erro ao atualizar produto', async () => {
      req.params.id = mockProductId;
      req.validatedProductUpdate = { nome: 'Novo Nome' };

      ProductModel.mockImplementation(() => ({
        update: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro interno do servidor'
      });
    });
  });

  describe('deleteProduct', () => {
    it('deve deletar um produto com sucesso', async () => {
      req.params.id = mockProductId;

      ProductModel.mockImplementation(() => ({
        remove: jest.fn().mockResolvedValue(true)
      }));

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Produto deletado com sucesso'
      });
    });

    it('deve retornar erro se produto não for encontrado', async () => {
      req.params.id = mockProductId;

      ProductModel.mockImplementation(() => ({
        remove: jest.fn().mockResolvedValue(false)
      }));

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Produto não encontrado'
      });
    });

    it('deve retornar erro ao deletar produto', async () => {
      req.params.id = mockProductId;

      ProductModel.mockImplementation(() => ({
        remove: jest.fn().mockRejectedValue(new Error('Database error'))
      }));

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erro ao deletar produto'
      });
    });
  });
});
