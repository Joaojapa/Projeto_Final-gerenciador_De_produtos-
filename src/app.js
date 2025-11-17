import express from 'express';
import bodyParser from 'body-parser';
import { handleError } from './middleware/errorHandler';
import setProductRoutes from './routes/productRoutes';
import setAuthRoutes from './routes/authRoutes';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

setProductRoutes(app);
setAuthRoutes(app);

export default app.use(handleError);