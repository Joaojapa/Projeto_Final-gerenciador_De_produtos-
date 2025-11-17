import  express from 'express';
import  {ProductController} from '../controllers/ProductController.js';
import  { validateProduct } from '../middleware/validate.js';
import  {AuthMiddleware} from '../middleware/AuthMiddleware.js';

const router = express.Router();
const authenticate = new AuthMiddleware().verifyToken
const productController = new ProductController();

// Rotas públicas
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Rotas protegidas (escrita)
router.post('/', authenticate, validateProduct, productController.createProduct);
router.put('/:id', validateProduct, productController.updateProduct);
router.patch('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
// router.post('/', authenticate, validateProduct, productController.createProduct);
// router.put('/:id', authenticate, validateProduct, productController.updateProduct);
// router.patch('/:id', authenticate, validateProduct, productController.updateProduct);
// router.delete('/:id', authenticate, productController.deleteProduct);

export {router as productRouter};