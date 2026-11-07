export interface VietQrBank {
  bankName: string;
  bankBin: string;
}

export interface WeddingQrAccount {
  bankName: string;
  bankBin: string;
  accountNumber: string;
  accountName: string;
}

export interface WeddingQrAccounts {
  shared: WeddingQrAccount;
  groom: WeddingQrAccount;
  bride: WeddingQrAccount;
}

export const vietQrBanks: VietQrBank[] = [
  { bankName: 'ACB', bankBin: '970416' },
  { bankName: 'Agribank', bankBin: '970405' },
  { bankName: 'ABBANK', bankBin: '970425' },
  { bankName: 'BacABank', bankBin: '970409' },
  { bankName: 'BaoVietBank', bankBin: '970438' },
  { bankName: 'BIDV', bankBin: '970418' },
  { bankName: 'CBBank', bankBin: '970444' },
  { bankName: 'CIMB', bankBin: '422589' },
  { bankName: 'COOPBANK', bankBin: '970446' },
  { bankName: 'Eximbank', bankBin: '970431' },
  { bankName: 'HDBank', bankBin: '970437' },
  { bankName: 'IndovinaBank', bankBin: '970434' },
  { bankName: 'KBank', bankBin: '668888' },
  { bankName: 'KienLongBank', bankBin: '970452' },
  { bankName: 'KookminHCM', bankBin: '970463' },
  { bankName: 'KookminHN', bankBin: '970462' },
  { bankName: 'LPBank', bankBin: '970449' },
  { bankName: 'MBV', bankBin: '970414' },
  { bankName: 'MBBank', bankBin: '970422' },
  { bankName: 'MSB', bankBin: '970426' },
  { bankName: 'NamABank', bankBin: '970428' },
  { bankName: 'NCB', bankBin: '970419' },
  { bankName: 'OCB', bankBin: '970448' },
  { bankName: 'PGBank', bankBin: '970430' },
  { bankName: 'PVcomBank', bankBin: '970412' },
  { bankName: 'SaigonBank', bankBin: '970400' },
  { bankName: 'Sacombank', bankBin: '970403' },
  { bankName: 'SCB', bankBin: '970429' },
  { bankName: 'SeABank', bankBin: '970440' },
  { bankName: 'SHB', bankBin: '970443' },
  { bankName: 'ShinhanBank', bankBin: '970424' },
  { bankName: 'Techcombank', bankBin: '970407' },
  { bankName: 'TPBank', bankBin: '970423' },
  { bankName: 'VietABank', bankBin: '970427' },
  { bankName: 'VietBank', bankBin: '970433' },
  { bankName: 'VietCapitalBank', bankBin: '970454' },
  { bankName: 'Vietcombank', bankBin: '970436' },
  { bankName: 'VietinBank', bankBin: '970415' },
  { bankName: 'VIB', bankBin: '970441' },
  { bankName: 'VPBank', bankBin: '970432' },
  { bankName: 'Woori', bankBin: '970457' },
];

export function emptyWeddingQrAccount(): WeddingQrAccount {
  return {
    bankName: '',
    bankBin: '',
    accountNumber: '',
    accountName: '',
  };
}

export function isValidWeddingQrAccount(account?: Partial<WeddingQrAccount>): account is WeddingQrAccount {
  if (!account) return false;
  const bank = vietQrBanks.find(({ bankName, bankBin }) => bankName === account.bankName && bankBin === account.bankBin);
  return Boolean(bank)
    && typeof account.accountNumber === 'string'
    && /^\d{1,19}$/.test(account.accountNumber)
    && typeof account.accountName === 'string'
    && account.accountName.length <= 70
    && /^[\x20-\x7E]+$/.test(account.accountName);
}

export function sanitizeWeddingQrAccounts(value: unknown): WeddingQrAccounts | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return undefined;
  const accounts = value as Record<string, unknown>;
  const sanitize = (candidate: unknown) => {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return emptyWeddingQrAccount();
    const account = candidate as Record<string, unknown>;
    const bank = vietQrBanks.find(({ bankName, bankBin }) => bankName === account.bankName && bankBin === account.bankBin);
    const sanitized: WeddingQrAccount = {
      bankName: bank?.bankName ?? '',
      bankBin: bank?.bankBin ?? '',
      accountNumber: typeof account.accountNumber === 'string' ? account.accountNumber.slice(0, 19) : '',
      accountName: typeof account.accountName === 'string' ? account.accountName.slice(0, 70) : '',
    };
    return isValidWeddingQrAccount(sanitized) ? sanitized : emptyWeddingQrAccount();
  };
  return {
    shared: sanitize(accounts.shared),
    groom: sanitize(accounts.groom),
    bride: sanitize(accounts.bride),
  };
}

export function buildVietQrUrl(account: WeddingQrAccount) {
  if (!isValidWeddingQrAccount(account)) {
    throw new Error('Thông tin tài khoản chưa hợp lệ để tạo mã QR.');
  }
  const params = new URLSearchParams({ accountName: account.accountName });
  return `https://img.vietqr.io/image/${account.bankBin}-${account.accountNumber}-compact2.svg?${params}`;
}

export function weddingQrAccountHasDetails(account?: Partial<WeddingQrAccount>) {
  return Boolean(account?.bankName || account?.bankBin || account?.accountNumber || account?.accountName);
}
