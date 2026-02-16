import crypto from 'crypto';
import { env } from '../config/env.js';

export function verifySlackSignature({ body, timestamp, signature }) {
  const sigBaseString = `v0:${timestamp}:${body}`;
  const expected = `v0=${crypto
    .createHmac('sha256', env.slackSigningSecret)
    .update(sigBaseString, 'utf8')
    .digest('hex')}`;

  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature || ''));
}

export async function postInvoiceApprovalMessage(payload) {
  try {
    // Replace with Web API call to chat.postMessage using SLACK_BOT_TOKEN.
    return { ok: true, ts: String(Date.now()), payload };
  } catch (error) {
    console.error('Slack unavailable, continuing workflow', error);
    return { ok: false, error: 'Slack unavailable' };
  }
}

export function buildSlackInvoiceSummary(invoice, customer, snapshots) {
  return {
    channel: env.slackApprovalChannel,
    text: `Invoice ${invoice.id} pending approval`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Customer:* ${customer.name}\n*Address:* ${customer.address}\n*Job Date:* ${invoice.jobDate}`,
        },
      },
      ...snapshots.map((item) => ({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*${item.productName}*\nRegistration #: ${item.registrationNumber}\nActive Ingredient: ${item.activeIngredient}\nConcentration: ${item.concentration}`,
        },
      })),
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Service: $${invoice.serviceCost} | HST: $${invoice.hst} | Total: $${invoice.total}`,
        },
      },
      {
        type: 'actions',
        elements: [
          { type: 'button', text: { type: 'plain_text', text: 'Approve' }, value: `approve:${invoice.id}` },
          { type: 'button', text: { type: 'plain_text', text: 'Edit' }, value: `edit:${invoice.id}` },
          { type: 'button', text: { type: 'plain_text', text: 'Reject' }, value: `reject:${invoice.id}` },
        ],
      },
    ],
  };
}
