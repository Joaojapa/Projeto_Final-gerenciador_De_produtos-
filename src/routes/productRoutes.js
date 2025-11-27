import express from 'express';
import { ProductController } from '../controllers/ProductController.js';
import { validateProduct } from '../middleware/validateProduct.js';
import { validateProductUpdate } from '../middleware/validateProductUpdate.js';
import { AuthMiddleware } from '../middleware/AuthMiddleware.js';

const router = express.Router();
const authenticate = new AuthMiddleware().verifyToken
const authorize = new AuthMiddleware().authorize
const productController = new ProductController();

// ================================
// ROTAS PÚBLICAS (leitura)
// ================================
router.get('/', productController.getAllProducts);           // GET    /api/products
router.get('/:id', productController.getProductById);       // GET    /api/products/6925d041...

// ================================
// ROTAS PROTEGIDAS - APENAS ADMIN
// ================================
router.post(
    '/',
   authenticate,
    authorize('admin'),
    validateProduct,
    productController.createProduct
); // POST   /api/products

router.put(
    '/:id',
    authenticate,
    authorize('admin'),
    validateProductUpdate,
    productController.updateProduct
); // PUT    /api/products/6925d041... (substituição completa)

router.patch(
    '/:id',
    authenticate,
    authorize('admin'),
    validateProductUpdate,
    productController.updateProduct
); // PATCH  /api/products/6925d041... (atualização parcial)

router.delete(
    '/:id',
    authenticate,
    authorize('admin'),
    productController.deleteProduct
); // DELETE /api/products/6925d041...

export { router as productRouter };