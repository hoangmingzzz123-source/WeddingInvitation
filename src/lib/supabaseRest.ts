import type {
  AdminProfile,
  AdminSession,
  CustomerRecord,
  CustomerStatus,
  InvitationDemoRecord,
  InvitationPayload,
  PublicInvitationDemo,
} from '../types/admin';

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.replace(/\/$/, '') ?? '';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined ?? '';
const ADMIN_SESSION_KEY = 'mp-wedding-admin-session-v1';

type JsonRecord = Record<string, unknown>;

interface AuthResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user: { id: string; email?: string };
}

export interface AuthCallbackSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  type: string;
}

export class SupabaseRequestError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'SupabaseRequestError';
    this.status = status;
  }
}

export function isSupabaseConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
}

function assertConfigured() {
  if (!isSupabaseConfigured()) {
    throw new SupabaseRequestError(
      'Supabase chưa được cấu hình. Hãy thêm VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY.',
      503,
    );
  }
}

function toCamelCustomer(row: JsonRecord): CustomerRecord {
  return {
    id: String(row.id),
    fullName: String(row.full_name ?? ''),
    brideName: String(row.bride_name ?? ''),
    groomName: String(row.groom_name ?? ''),
    email: String(row.email ?? ''),
    phone: String(row.phone ?? ''),
    status: row.status as CustomerStatus,
    source: String(row.source ?? ''),
    notes: String(row.notes ?? ''),
    weddingDate: String(row.wedding_date ?? ''),
    weddingTime: String(row.wedding_time ?? '18:00').slice(0, 5),
    venue: String(row.venue ?? ''),
    address: String(row.address ?? ''),
    message: String(row.message ?? ''),
    selectedTemplateId: String(row.selected_template_id ?? ''),
    coverUrl: String(row.cover_url ?? ''),
    confirmedAt: row.confirmed_at ? String(row.confirmed_at) : null,
    exportedAt: row.exported_at ? String(row.exported_at) : null,
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  };
}

function toCamelDemo(row: JsonRecord): InvitationDemoRecord {
  const payload = (row.payload ?? {}) as Partial<InvitationPayload>;
  return {
    id: String(row.id),
    customerId: String(row.customer_id),
    templateId: String(row.template_id),
    publicToken: String(row.public_token),
    status: row.status as InvitationDemoRecord['status'],
    note: String(row.note ?? ''),
    expiresAt: row.expires_at ? String(row.expires_at) : null,
    payload: {
      brideName: String(payload.brideName ?? ''),
      groomName: String(payload.groomName ?? ''),
      weddingDate: String(payload.weddingDate ?? ''),
      weddingTime: String(payload.weddingTime ?? '18:00'),
      venue: String(payload.venue ?? ''),
      address: String(payload.address ?? ''),
      message: String(payload.message ?? ''),
      coverUrl: String(payload.coverUrl ?? ''),
    },
    createdAt: String(row.created_at ?? ''),
    updatedAt: String(row.updated_at ?? ''),
  };
}

function parseErrorPayload(payload: unknown, fallback: string) {
  if (payload && typeof payload === 'object') {
    const data = payload as Record<string, unknown>;
    return String(data.msg ?? data.message ?? data.error_description ?? data.hint ?? fallback);
  }
  return fallback;
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string; prefer?: string } = {},
): Promise<T> {
  assertConfigured();
  const { token, prefer, ...requestOptions } = options;
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    ...requestOptions,
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
      ...requestOptions.headers,
    },
  });

  const text = await response.text();
  let payload: unknown = null;
  if (text) {
    try { payload = JSON.parse(text); } catch { payload = text; }
  }

  if (!response.ok) {
    throw new SupabaseRequestError(
      parseErrorPayload(payload, `Yêu cầu Supabase thất bại (${response.status}).`),
      response.status,
    );
  }

  return payload as T;
}

export function readAdminSession(): AdminSession | null {
  try {
    const raw = window.sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    return session.accessToken && session.userId ? session : null;
  } catch {
    return null;
  }
}

function saveAdminSession(session: AdminSession) {
  window.sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
}

export function readAuthCallbackSession(): AuthCallbackSession {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const query = new URLSearchParams(window.location.search);
  const error = hash.get('error_description') ?? query.get('error_description');
  if (error) throw new SupabaseRequestError(error, 401);

  const accessToken = hash.get('access_token') ?? '';
  const refreshToken = hash.get('refresh_token') ?? '';
  const expiresIn = Number(hash.get('expires_in') ?? 3600);
  const expiresAt = Number(hash.get('expires_at') ?? 0) * 1000
    || Date.now() + expiresIn * 1000;

  if (!accessToken || !refreshToken) {
    throw new SupabaseRequestError(
      'Liên kết đặt mật khẩu không hợp lệ hoặc đã hết hạn. Hãy yêu cầu gửi lại email.',
      401,
    );
  }

  return {
    accessToken,
    refreshToken,
    expiresAt,
    type: hash.get('type') ?? query.get('type') ?? '',
  };
}

export async function setAdminPassword(
  callbackSession: AuthCallbackSession,
  password: string,
) {
  const user = await request<{ id: string; email?: string }>('/auth/v1/user', {
    method: 'PUT',
    token: callbackSession.accessToken,
    body: JSON.stringify({ password }),
  });
  const session: AdminSession = {
    accessToken: callbackSession.accessToken,
    refreshToken: callbackSession.refreshToken,
    expiresAt: callbackSession.expiresAt,
    userId: user.id,
    email: user.email ?? '',
  };

  await getAdminProfile(session);
  saveAdminSession(session);
  return session;
}

export function clearAdminSession() {
  window.sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export async function signInAdmin(email: string, password: string) {
  const auth = await request<AuthResponse>('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  const session: AdminSession = {
    accessToken: auth.access_token,
    refreshToken: auth.refresh_token,
    expiresAt: Date.now() + auth.expires_in * 1000,
    userId: auth.user.id,
    email: auth.user.email ?? email,
  };
  saveAdminSession(session);

  try {
    const profile = await getAdminProfile(session);
    return { session, profile };
  } catch (error) {
    clearAdminSession();
    throw error;
  }
}

export async function refreshAdminSession(session: AdminSession) {
  if (session.expiresAt > Date.now() + 60_000) return session;
  const auth = await request<AuthResponse>('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: session.refreshToken }),
  });
  const refreshed: AdminSession = {
    accessToken: auth.access_token,
    refreshToken: auth.refresh_token,
    expiresAt: Date.now() + auth.expires_in * 1000,
    userId: auth.user.id,
    email: auth.user.email ?? session.email,
  };
  saveAdminSession(refreshed);
  return refreshed;
}

export async function getAdminProfile(session: AdminSession): Promise<AdminProfile> {
  const rows = await request<JsonRecord[]>(
    `/rest/v1/admin_users?select=user_id,email,display_name&user_id=eq.${encodeURIComponent(session.userId)}&limit=1`,
    { token: session.accessToken },
  );
  if (!rows.length) throw new SupabaseRequestError('Tài khoản này chưa được cấp quyền quản trị.', 403);
  return {
    userId: String(rows[0].user_id),
    email: String(rows[0].email ?? session.email),
    displayName: String(rows[0].display_name ?? 'Quản trị viên'),
  };
}

export async function listCustomers(session: AdminSession) {
  const rows = await request<JsonRecord[]>(
    '/rest/v1/customers?select=*&order=created_at.desc',
    { token: session.accessToken },
  );
  return rows.map(toCamelCustomer);
}

export async function createCustomer(
  session: AdminSession,
  customer: Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'exportedAt'>,
) {
  const rows = await request<JsonRecord[]>('/rest/v1/customers', {
    method: 'POST',
    token: session.accessToken,
    prefer: 'return=representation',
    body: JSON.stringify({
      full_name: customer.fullName,
      bride_name: customer.brideName,
      groom_name: customer.groomName,
      email: customer.email || null,
      phone: customer.phone,
      status: customer.status,
      source: customer.source,
      notes: customer.notes,
      wedding_date: customer.weddingDate || null,
      wedding_time: customer.weddingTime || null,
      venue: customer.venue,
      address: customer.address,
      message: customer.message,
      selected_template_id: customer.selectedTemplateId || null,
      cover_url: customer.coverUrl || null,
    }),
  });
  return toCamelCustomer(rows[0]);
}

export async function updateCustomer(
  session: AdminSession,
  customerId: string,
  changes: Partial<CustomerRecord>,
) {
  const body: JsonRecord = {};
  const mappings: Array<[keyof CustomerRecord, string]> = [
    ['fullName', 'full_name'], ['brideName', 'bride_name'], ['groomName', 'groom_name'],
    ['email', 'email'], ['phone', 'phone'], ['status', 'status'], ['source', 'source'],
    ['notes', 'notes'], ['weddingDate', 'wedding_date'], ['weddingTime', 'wedding_time'],
    ['venue', 'venue'], ['address', 'address'], ['message', 'message'],
    ['selectedTemplateId', 'selected_template_id'], ['coverUrl', 'cover_url'],
  ];
  mappings.forEach(([key, column]) => {
    if (key in changes) body[column] = changes[key] || null;
  });
  if (changes.status === 'confirmed') body.confirmed_at = new Date().toISOString();

  const rows = await request<JsonRecord[]>(
    `/rest/v1/customers?id=eq.${encodeURIComponent(customerId)}`,
    {
      method: 'PATCH',
      token: session.accessToken,
      prefer: 'return=representation',
      body: JSON.stringify(body),
    },
  );
  return toCamelCustomer(rows[0]);
}

export async function listDemos(session: AdminSession, customerId?: string) {
  const filter = customerId ? `&customer_id=eq.${encodeURIComponent(customerId)}` : '';
  const rows = await request<JsonRecord[]>(
    `/rest/v1/invitation_demos?select=*${filter}&order=created_at.desc`,
    { token: session.accessToken },
  );
  return rows.map(toCamelDemo);
}

export async function createDemo(
  session: AdminSession,
  data: { customerId: string; templateId: string; note: string; expiresAt: string | null; payload: InvitationPayload },
) {
  const rows = await request<JsonRecord[]>('/rest/v1/invitation_demos', {
    method: 'POST',
    token: session.accessToken,
    prefer: 'return=representation',
    body: JSON.stringify({
      customer_id: data.customerId,
      template_id: data.templateId,
      status: 'published',
      note: data.note,
      expires_at: data.expiresAt,
      payload: data.payload,
    }),
  });
  return toCamelDemo(rows[0]);
}

export async function updateDemo(
  session: AdminSession,
  demoId: string,
  changes: Partial<Pick<InvitationDemoRecord, 'status' | 'note' | 'expiresAt' | 'payload' | 'templateId'>>,
) {
  const body: JsonRecord = {};
  if (changes.status) body.status = changes.status;
  if (changes.note !== undefined) body.note = changes.note;
  if (changes.expiresAt !== undefined) body.expires_at = changes.expiresAt;
  if (changes.payload) body.payload = changes.payload;
  if (changes.templateId) body.template_id = changes.templateId;
  const rows = await request<JsonRecord[]>(
    `/rest/v1/invitation_demos?id=eq.${encodeURIComponent(demoId)}`,
    {
      method: 'PATCH', token: session.accessToken, prefer: 'return=representation', body: JSON.stringify(body),
    },
  );
  return toCamelDemo(rows[0]);
}

export async function getPublicDemo(token: string): Promise<PublicInvitationDemo> {
  const result = await request<JsonRecord | null>('/rest/v1/rpc/get_public_demo', {
    method: 'POST',
    body: JSON.stringify({ p_token: token }),
  });
  if (!result) throw new SupabaseRequestError('Link demo không tồn tại hoặc đã hết hạn.', 404);
  const payload = (result.payload ?? {}) as Partial<InvitationPayload>;
  return {
    id: String(result.id),
    templateId: String(result.template_id),
    note: String(result.note ?? ''),
    expiresAt: result.expires_at ? String(result.expires_at) : null,
    payload: {
      brideName: String(payload.brideName ?? ''),
      groomName: String(payload.groomName ?? ''),
      weddingDate: String(payload.weddingDate ?? ''),
      weddingTime: String(payload.weddingTime ?? '18:00'),
      venue: String(payload.venue ?? ''),
      address: String(payload.address ?? ''),
      message: String(payload.message ?? ''),
      coverUrl: String(payload.coverUrl ?? ''),
    },
  };
}

export async function submitCustomerRequest(data: {
  fullName: string;
  email: string;
  phone: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  message: string;
  selectedTemplateId: string;
  coverUrl: string;
}) {
  return request<{ id: string }>('/rest/v1/rpc/submit_customer_request', {
    method: 'POST',
    body: JSON.stringify({
      p_full_name: data.fullName,
      p_email: data.email || null,
      p_phone: data.phone,
      p_bride_name: data.brideName,
      p_groom_name: data.groomName,
      p_wedding_date: data.weddingDate || null,
      p_wedding_time: data.weddingTime || null,
      p_venue: data.venue,
      p_address: data.address,
      p_message: data.message,
      p_selected_template_id: data.selectedTemplateId || null,
      p_cover_url: data.coverUrl || null,
    }),
  });
}
