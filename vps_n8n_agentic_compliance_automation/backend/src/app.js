import express from 'express';
import invoiceRoutes from './routes/invoiceRoutes.js';
import productRoutes from './routes/productRoutes.js';
import slackRoutes from './routes/slackRoutes.js';

const app = express();
app.use(express.json({ limit: '5mb' }));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/invoices', invoiceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/slack', slackRoutes);

export default app;
