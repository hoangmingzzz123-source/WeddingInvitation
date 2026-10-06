export type CustomerStatus = 'new' | 'contacted' | 'demo_ready' | 'confirmed' | 'completed';

export type DemoStatus = 'draft' | 'published' | 'expired';

export interface InvitationPayload {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingTime: string;
  venue: string;
  address: string;
  message: string;
  coverUrl: string;
}

export interface CustomerRecord extends InvitationPayload {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: CustomerStatus;
  source: string;
  notes: string;
  selectedTemplateId: string;
  confirmedAt: string | null;
  exportedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationDemoRecord {
  id: string;
  customerId: string;
  templateId: string;
  publicToken: string;
  status: DemoStatus;
  note: string;
  expiresAt: string | null;
  payload: InvitationPayload;
  createdAt: string;
  updatedAt: string;
}

export interface PublicInvitationDemo {
  id: string;
  templateId: string;
  note: string;
  expiresAt: string | null;
  payload: InvitationPayload;
}

export interface AdminProfile {
  userId: string;
  email: string;
  displayName: string;
}

export interface AdminSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  userId: string;
  email: string;
}

export const emptyInvitationPayload: InvitationPayload = {
  brideName: '',
  groomName: '',
  weddingDate: '',
  weddingTime: '18:00',
  venue: '',
  address: '',
  message: 'Trân trọng mời bạn đến chung vui trong ngày hạnh phúc của chúng mình.',
  coverUrl: '',
};

export const customerStatusLabels: Record<CustomerStatus, string> = {
  new: 'Khách mới',
  contacted: 'Đã liên hệ',
  demo_ready: 'Đã có demo',
  confirmed: 'Đã xác nhận',
  completed: 'Đã bàn giao',
};

