export const API_BASE_URL = 'http://127.0.0.1:8000/api/';
export const ROLES = {
  USER: 0,
  ADMIN: 1,
};

export const VIETQR = {
  bankCode: '970422',            // mã ngân hàng (VD: VCB, ACB, MBBANK, ...)
  accountNumber: '6868680610204',// số tài khoản nhận
  accountName: 'TRUONG MINH TRUNG HUY' // tên chủ TK (IN HOA, không dấu càng tốt)
  // template: 'compact2' // để trống dùng mặc định
};

export function buildVietQrImageUrl({ amount, addInfo, template = 'compact2' }) {
  const bank = encodeURIComponent(VIETQR.bankCode);
  const acc = encodeURIComponent(VIETQR.accountNumber);
  const name = encodeURIComponent(VIETQR.accountName);
  const info = encodeURIComponent(addInfo || '');
  const amt = Math.max(0, Math.floor(Number(amount || 0)));
  return `https://img.vietqr.io/image/${bank}-${acc}-${template}.jpg?amount=${amt}&addInfo=${info}&accountName=${name}`;
}