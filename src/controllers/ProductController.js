import { ProductModel } from '../models/ProductModel.js';

const productModel = new ProductModel();
export class ProductController {
    constructor(parameters) {

    }


    createProduct = async (req, res) => {
        try {
            const product = await productModel.create(req.validatedProduct);
            res.status(201).json({ message: 'Produto criado com sucesso', product });
        } catch (err) {
            res.status(500).json({ error: 'Erro interno ao criar produto' });
        }
    };

    getAllProducts = async (req, res) => {
        try {
            const products = await productModel.findAll();
            res.status(200).json(products);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar produtos' });
        }
    };

    getProductById = async (req, res) => {
        try {
            const product = await productModel.findById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.status(200).json(product);
        } catch (err) {
            res.status(500).json({ error: 'Erro ao buscar produto' });
        }
    };

    updateProduct = async (req, res) => {
        try {
            const dataToUpdate = req.validatedProductUpdate

            const wasUpdated = await productModel.update(req.params.id, dataToUpdate);

            if (!wasUpdated) {
                return res.status(404).json({
                    error: 'Produto não encontrado ou nenhum campo foi alterado'
                });
            }

            res.status(200).json({
                message: 'Produto atualizado com sucesso'
            });
        } catch (err) {
            console.error('Erro ao atualizar produto:', err);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    };

    deleteProduct = async (req, res) => {
        try {
            const deleted = await productModel.remove(req.params.id);
            if (!deleted) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.status(200).json({ message: 'Produto deletado com sucesso' });
        } catch (err) {
            res.status(500).json({ error: 'Erro ao deletar produto' });
        }
    };
}