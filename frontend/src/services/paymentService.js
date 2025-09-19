import { VIETQR } from '../utils/constants';

export function buildVietQrImageUrl({ amount, addInfo, template = 'compact2' }) {
  const bank = encodeURIComponent(VIETQR.bankCode);
  const acc = encodeURIComponent(VIETQR.accountNumber);
  const name = encodeURIComponent(VIETQR.accountName);
  const info = encodeURIComponent(addInfo || '');
  const amt = Math.max(0, Math.floor(Number(amount || 0)));
  return `https://img.vietqr.io/image/${bank}-${acc}-${template}.jpg?amount=${amt}&addInfo=${info}&accountName=${name}`;
}
