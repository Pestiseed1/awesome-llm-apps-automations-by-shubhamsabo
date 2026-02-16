export const env = {
  port: Number(process.env.API_PORT || 4000),
  jwtSecret: process.env.JWT_SECRET || 'dev-secret',
  slackSigningSecret: process.env.SLACK_SIGNING_SECRET || '',
  slackApprovalChannel: process.env.SLACK_APPROVAL_CHANNEL || '#invoice-approval',
  slackBaseUrl: process.env.SLACK_BASE_URL || 'https://slack.com/api',
  registrySourceUrl: process.env.REGISTRY_SOURCE_URL || '',
};
