import { Router } from 'express';
import { verifySlackSignature } from '../services/slackService.js';

const router = Router();
router.post('/interactions', (req, res) => {
  const timestamp = req.headers['x-slack-request-timestamp'];
  const signature = req.headers['x-slack-signature'];
  const rawBody = JSON.stringify(req.body);

  if (!verifySlackSignature({ body: rawBody, timestamp, signature })) {
    return res.status(401).json({ error: 'Invalid Slack signature' });
  }

  return res.json({ ok: true });
});

export default router;
