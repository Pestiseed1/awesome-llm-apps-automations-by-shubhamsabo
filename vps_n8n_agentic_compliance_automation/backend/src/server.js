import app from './app.js';
import { env } from './config/env.js';

app.listen(env.port, () => {
  console.log(`Compliance API running on ${env.port}`);
});
