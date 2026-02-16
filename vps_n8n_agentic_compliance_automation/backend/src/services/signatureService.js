import fs from 'fs';
import path from 'path';

const signatureDir = '/data/signatures';

export async function storeSignature({ invoiceId, base64Png }) {
  await fs.promises.mkdir(signatureDir, { recursive: true });
  const relativePath = `${invoiceId}.png`;
  const filePath = path.join(signatureDir, relativePath);
  const png = base64Png.replace(/^data:image\/png;base64,/, '');
  await fs.promises.writeFile(filePath, png, 'base64');
  return filePath;
}
