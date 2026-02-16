import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { syncProducts } from '../controllers/productController.js';

const router = Router();
router.post('/sync', authenticate, syncProducts);

export default router;
