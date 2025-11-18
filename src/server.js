import 'dotenv/config'
import express from 'express';
import {connectDB}  from './config/database.js';
import {productRouter} from './routes/productRoutes.js';
import {authRouter} from './routes/authRoutes.js';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);

// Swagger
const swaggerDocument = yaml.load(path.join(__dirname, 'docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Iniciar servidor
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`API rodando em http://localhost:${PORT}`);
    console.log(`Documentação: http://localhost:${PORT}/api-docs`);
  });
};

startServer();