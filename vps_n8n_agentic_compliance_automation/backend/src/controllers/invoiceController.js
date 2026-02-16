import { InvoiceStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { calculateTotals } from '../utils/invoiceMath.js';
import { buildInvoiceProductSnapshots } from '../utils/snapshot.js';
import { buildSlackInvoiceSummary, postInvoiceApprovalMessage } from '../services/slackService.js';
import { generateInvoicePdf } from '../services/pdfService.js';
import { storeSignature } from '../services/signatureService.js';

export async function createInvoice(req, res) {
  const { customerId, jobDate, productIds, serviceCost, findings, treatment, recommendation, warranty } = req.body;

  const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  if (!customer || !products.length) return res.status(400).json({ error: 'Invalid customer or products' });

  const totals = calculateTotals(serviceCost);
  const invoice = await prisma.invoice.create({
    data: {
      customerId,
      jobDate: new Date(jobDate),
      findings,
      treatment,
      recommendation,
      warranty,
      serviceCost: totals.serviceCost,
      hst: totals.hst,
      total: totals.total,
      status: InvoiceStatus.Draft,
    },
  });

  const snapshots = buildInvoiceProductSnapshots(products, invoice.id);
  await prisma.invoiceProductSnapshot.createMany({ data: snapshots });

  const pending = await prisma.invoice.update({
    where: { id: invoice.id },
    data: { status: InvoiceStatus.PendingApproval },
  });

  const slackPayload = buildSlackInvoiceSummary(pending, customer, snapshots);
  const slackResp = await postInvoiceApprovalMessage(slackPayload);
  if (slackResp.ok) {
    await prisma.invoice.update({ where: { id: invoice.id }, data: { slackMessageTs: slackResp.ts } });
  }

  return res.status(201).json({ invoiceId: invoice.id, status: pending.status, slack: slackResp.ok });
}

export async function handleApprovalAction(req, res) {
  const { invoiceId, action, rejectionReason } = req.body;
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { customer: true, productSnapshots: true },
  });

  if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

  if (action === 'approve') {
    const pdfPath = await generateInvoicePdf({ ...invoice, status: InvoiceStatus.Approved }, invoice.customer, invoice.productSnapshots);
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.Sent, pdfPath },
    });
    return res.json({ status: 'Sent', pdfPath });
  }

  if (action === 'edit') {
    await prisma.invoice.update({ where: { id: invoiceId }, data: { status: InvoiceStatus.Draft } });
    return res.json({ status: 'Draft', editorUrl: `/invoices/${invoiceId}/edit` });
  }

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: InvoiceStatus.Rejected, rejectionReason: rejectionReason || 'Not provided' },
  });
  return res.json({ status: 'Rejected' });
}

export async function captureSignature(req, res) {
  const { invoiceId, base64Png } = req.body;
  const filePath = await storeSignature({ invoiceId, base64Png });
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      signaturePath: filePath,
      signedAt: new Date(),
      signedIpAddress: String(ip),
    },
  });

  return res.json({ ok: true, signaturePath: filePath });
}
