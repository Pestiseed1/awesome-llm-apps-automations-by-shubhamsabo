import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import { captureSignature, createInvoice, handleApprovalAction } from '../controllers/invoiceController.js';

const router = Router();
router.post('/', authenticate, createInvoice);
router.post('/actions', handleApprovalAction);
router.post('/signature', authenticate, captureSignature);

export default router;
