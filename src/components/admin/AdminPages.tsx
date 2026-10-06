import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Archive,
  ArrowLeft,
  Check,
  Clipboard,
  Download,
  ExternalLink,
  FileArchive,
  LayoutDashboard,
  Link2,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  WandSparkles,
} from 'lucide-react';
import { navigateTo } from '../../Router';
import { weddingTemplates } from '../../data/templates';
import {
  clearAdminSession,
  createCustomer,
  createDemo,
  getAdminProfile,
  isSupabaseConfigured,
  listCustomers,
  listDemos,
  readAdminSession,
  refreshAdminSession,
  signInAdmin,
  updateCustomer,
  updateDemo,
} from '../../lib/supabaseRest';
import {
  customerStatusLabels,
  emptyInvitationPayload,
  type AdminProfile,
  type AdminSession,
  type CustomerRecord,
  type CustomerStatus,
  type InvitationDemoRecord,
} from '../../types/admin';
import { CustomerInvitationPreview } from '../CustomerInvitationPreview';

const customerStatuses = Object.keys(customerStatusLabels) as CustomerStatus[];

type CustomerEditor = Omit<CustomerRecord, 'id' | 'createdAt' | 'updatedAt' | 'confirmedAt' | 'exportedAt'>;

const emptyCustomer: CustomerEditor = {
  ...emptyInvitationPayload,
  fullName: '',
  email: '',
  phone: '',
  status: 'new',
  source: 'admin',
  notes: '',
  selectedTemplateId: '',
};

function customerToEditor(customer: CustomerRecord): CustomerEditor {
  return {
    fullName: customer.fullName,
    brideName: customer.brideName,
    groomName: customer.groomName,
    email: customer.email,
    phone: customer.phone,
    status: customer.status,
    source: customer.source,
    notes: customer.notes,
    weddingDate: customer.weddingDate,
    weddingTime: customer.weddingTime,
    venue: customer.venue,
    address: customer.address,
    message: customer.message,
    selectedTemplateId: customer.selectedTemplateId,
    coverUrl: customer.coverUrl,
  };
}

function formatDate(value: string) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('vi-VN', { dateStyle: 'medium' }).format(new Date(value));
}

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.title = 'Đăng nhập quản trị | Wedding Invitation MP';
    const existingSession = readAdminSession();
    if (existingSession) {
      getAdminProfile(existingSession)
        .then(() => navigateTo('/admin'))
        .catch(() => clearAdminSession());
    }
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInAdmin(email.trim(), password);
      navigateTo('/admin');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Không thể đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">
      <section className="admin-login-card">
        <button type="button" className="admin-login-card__back" onClick={() => navigateTo('/')}>
          <ArrowLeft aria-hidden="true" /> Về website
        </button>
        <div className="admin-login-card__brand"><ShieldCheck aria-hidden="true" /></div>
        <p>Khu vực nội bộ</p>
        <h1>Wedding Invitation MP</h1>
        <span>Đăng nhập bằng tài khoản quản trị đã được cấp quyền.</span>
        {!isSupabaseConfigured() && (
          <div className="admin-alert">Supabase chưa được cấu hình trong biến môi trường.</div>
        )}
        {error && <div className="admin-alert is-error" role="alert">{error}</div>}
        <form onSubmit={submit}>
          <label><Mail aria-hidden="true" /> Email<input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
          <label><LockKeyhole aria-hidden="true" /> Mật khẩu<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
          <button type="submit" disabled={loading || !isSupabaseConfigured()}>
            {loading ? <LoaderCircle className="is-spinning" aria-hidden="true" /> : <LockKeyhole aria-hidden="true" />}
            {loading ? 'Đang xác minh...' : 'Đăng nhập quản trị'}
          </button>
        </form>
        <small>Route này không xuất hiện trên website công khai. Dữ liệu vẫn được bảo vệ bằng Supabase Auth và RLS.</small>
      </section>
    </main>
  );
}

export function AdminDashboardPage() {
  const [session, setSession] = useState<AdminSession | null>(readAdminSession);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);
  const [demos, setDemos] = useState<InvitationDemoRecord[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [editor, setEditor] = useState<CustomerEditor>(emptyCustomer);
  const [isNewCustomer, setIsNewCustomer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CustomerStatus>('all');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [demoNote, setDemoNote] = useState('Đây là bản demo để khách hàng xem trước và góp ý trước khi xuất bản chính thức.');
  const [demoExpiry, setDemoExpiry] = useState(() => {
    const nextWeek = new Date(Date.now() + 7 * 86_400_000);
    return nextWeek.toISOString().slice(0, 10);
  });

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) ?? null;
  const customerDemos = demos.filter((demo) => demo.customerId === selectedCustomerId);

  const loadData = useCallback(async (preferredCustomerId?: string) => {
    const existingSession = readAdminSession();
    if (!existingSession) {
      navigateTo('/admin/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const activeSession = await refreshAdminSession(existingSession);
      const [nextProfile, nextCustomers, nextDemos] = await Promise.all([
        getAdminProfile(activeSession), listCustomers(activeSession), listDemos(activeSession),
      ]);
      setSession(activeSession);
      setProfile(nextProfile);
      setCustomers(nextCustomers);
      setDemos(nextDemos);
      const nextSelectedId = preferredCustomerId
        ?? selectedCustomerId
        ?? nextCustomers[0]?.id
        ?? null;
      setSelectedCustomerId(nextSelectedId);
      const nextSelected = nextCustomers.find((item) => item.id === nextSelectedId);
      if (nextSelected) setEditor(customerToEditor(nextSelected));
    } catch (loadError) {
      clearAdminSession();
      setError(loadError instanceof Error ? loadError.message : 'Không thể tải dữ liệu quản trị.');
      window.setTimeout(() => navigateTo('/admin/login'), 1400);
    } finally {
      setLoading(false);
    }
  }, [selectedCustomerId]);

  useEffect(() => {
    document.title = 'Quản trị khách hàng | Wedding Invitation MP';
    void loadData();
    // Only bootstrap once; subsequent reloads are explicit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedCustomer || isNewCustomer) return;
    setEditor(customerToEditor(selectedCustomer));
  }, [isNewCustomer, selectedCustomer]);

  const filteredCustomers = useMemo(() => {
    const search = searchTerm.trim().toLocaleLowerCase('vi');
    return customers.filter((customer) => {
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesSearch = !search || [
        customer.fullName, customer.brideName, customer.groomName, customer.phone, customer.email,
      ].join(' ').toLocaleLowerCase('vi').includes(search);
      return matchesStatus && matchesSearch;
    });
  }, [customers, searchTerm, statusFilter]);

  const stats = useMemo(() => ({
    total: customers.length,
    waiting: customers.filter((customer) => customer.status === 'new' || customer.status === 'contacted').length,
    demos: customers.filter((customer) => customer.status === 'demo_ready').length,
    confirmed: customers.filter((customer) => customer.status === 'confirmed' || customer.status === 'completed').length,
  }), [customers]);

  const updateEditor = <Key extends keyof CustomerEditor>(key: Key, value: CustomerEditor[Key]) => {
    setEditor((current) => ({ ...current, [key]: value }));
  };

  const showMessage = (value: string) => {
    setMessage(value);
    window.setTimeout(() => setMessage(''), 3200);
  };

  const saveCustomer = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!session) return;
    if (!editor.fullName.trim() || !editor.phone.trim()) {
      setError('Người liên hệ và số điện thoại là bắt buộc.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const saved = isNewCustomer || !selectedCustomer
        ? await createCustomer(session, editor)
        : await updateCustomer(session, selectedCustomer.id, editor);
      setIsNewCustomer(false);
      await loadData(saved.id);
      showMessage('Đã lưu thông tin khách hàng.');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Không thể lưu khách hàng.');
    } finally {
      setSaving(false);
    }
  };

  const publishDemo = async () => {
    if (!session || !selectedCustomer) return;
    if (!editor.selectedTemplateId) {
      setError('Hãy chọn mẫu thiệp trước khi tạo demo.');
      return;
    }
    setActionLoading('demo');
    setError('');
    try {
      if (JSON.stringify(customerToEditor(selectedCustomer)) !== JSON.stringify(editor)) {
        await updateCustomer(session, selectedCustomer.id, editor);
      }
      const expiresAt = demoExpiry ? new Date(`${demoExpiry}T23:59:59`).toISOString() : null;
      const demo = await createDemo(session, {
        customerId: selectedCustomer.id,
        templateId: editor.selectedTemplateId,
        note: demoNote,
        expiresAt,
        payload: {
          brideName: editor.brideName,
          groomName: editor.groomName,
          weddingDate: editor.weddingDate,
          weddingTime: editor.weddingTime,
          venue: editor.venue,
          address: editor.address,
          message: editor.message,
          coverUrl: editor.coverUrl,
        },
      });
      await updateCustomer(session, selectedCustomer.id, { status: 'demo_ready', selectedTemplateId: editor.selectedTemplateId });
      await loadData(selectedCustomer.id);
      await copyPreviewLink(demo.publicToken);
      showMessage('Đã tạo demo và sao chép link preview.');
    } catch (demoError) {
      setError(demoError instanceof Error ? demoError.message : 'Không thể tạo demo.');
    } finally {
      setActionLoading('');
    }
  };

  const copyPreviewLink = async (token: string) => {
    const url = `${window.location.origin}/preview/${token}`;
    try { await navigator.clipboard.writeText(url); } catch { window.prompt('Sao chép link preview:', url); }
  };

  const confirmOrder = async () => {
    if (!session || !selectedCustomer) return;
    setActionLoading('confirm');
    try {
      await updateCustomer(session, selectedCustomer.id, { status: 'confirmed' });
      await loadData(selectedCustomer.id);
      showMessage('Đã xác nhận khách đặt mẫu. Nút xuất ZIP đã được mở.');
    } catch (confirmError) {
      setError(confirmError instanceof Error ? confirmError.message : 'Không thể xác nhận đơn.');
    } finally { setActionLoading(''); }
  };

  const expireDemo = async (demo: InvitationDemoRecord) => {
    if (!session) return;
    setActionLoading(`expire:${demo.id}`);
    try {
      await updateDemo(session, demo.id, { status: demo.status === 'expired' ? 'published' : 'expired' });
      await loadData(selectedCustomerId ?? undefined);
      showMessage(demo.status === 'expired' ? 'Đã mở lại link demo.' : 'Đã khóa link demo.');
    } catch (demoError) {
      setError(demoError instanceof Error ? demoError.message : 'Không thể cập nhật link demo.');
    } finally { setActionLoading(''); }
  };

  const exportZip = async (demo: InvitationDemoRecord) => {
    if (!session || !selectedCustomer) return;
    setActionLoading(`export:${demo.id}`);
    setError('');
    try {
      const activeSession = await refreshAdminSession(session);
      const response = await fetch('/api/export-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${activeSession.accessToken}` },
        body: JSON.stringify({ customerId: selectedCustomer.id, demoId: demo.id }),
      });
      if (!response.ok) {
        const payload = await response.json().catch(() => ({ message: 'Không thể xuất file ZIP.' }));
        throw new Error(payload.message || 'Không thể xuất file ZIP.');
      }
      const blob = await response.blob();
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `thiep-cuoi-${selectedCustomer.brideName}-${selectedCustomer.groomName}.zip`
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9.-]+/g, '-').toLowerCase();
      link.click();
      URL.revokeObjectURL(href);
      await loadData(selectedCustomer.id);
      showMessage('Đã xuất source code thiệp cưới thành file ZIP.');
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Không thể xuất file ZIP.');
    } finally { setActionLoading(''); }
  };

  const signOut = () => {
    clearAdminSession();
    setSession(null);
    navigateTo('/admin/login');
  };

  const startNewCustomer = () => {
    setIsNewCustomer(true);
    setSelectedCustomerId(null);
    setEditor(emptyCustomer);
    setError('');
  };

  if (loading && !customers.length) {
    return <main className="admin-loading" role="status"><LoaderCircle className="is-spinning" /><span>Đang tải trung tâm quản trị...</span></main>;
  }

  return (
    <main className="admin-app">
      <aside className="admin-sidebar">
        <a href="/admin" onClick={(event) => { event.preventDefault(); navigateTo('/admin'); }}>
          <span><Sparkles aria-hidden="true" /></span>
          <b>Wedding MP</b>
          <small>Studio Console</small>
        </a>
        <nav aria-label="Điều hướng quản trị">
          <button type="button" className="is-active"><LayoutDashboard aria-hidden="true" /> Tổng quan</button>
          <button type="button" onClick={() => document.querySelector('.admin-customer-list')?.scrollIntoView()}><Users aria-hidden="true" /> Khách hàng</button>
          <button type="button" onClick={() => document.querySelector('.admin-demo-panel')?.scrollIntoView()}><WandSparkles aria-hidden="true" /> Demo khách</button>
        </nav>
        <div className="admin-sidebar__profile">
          <span><UserRound aria-hidden="true" /></span>
          <div><b>{profile?.displayName ?? 'Quản trị viên'}</b><small>{profile?.email}</small></div>
          <button type="button" onClick={signOut} aria-label="Đăng xuất"><LogOut aria-hidden="true" /></button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div><p>Trung tâm vận hành</p><h1>Khách hàng &amp; demo thiệp cưới</h1></div>
          <div>
            <button type="button" onClick={() => void loadData(selectedCustomerId ?? undefined)}><RefreshCw aria-hidden="true" /> Làm mới</button>
            <button type="button" className="is-primary" onClick={startNewCustomer}><Plus aria-hidden="true" /> Thêm khách</button>
          </div>
        </header>

        {message && <div className="admin-toast" role="status"><Check aria-hidden="true" /> {message}</div>}
        {error && <div className="admin-alert is-error" role="alert">{error}<button type="button" onClick={() => setError('')}>×</button></div>}

        <section className="admin-stats" aria-label="Thống kê khách hàng">
          <article><span><Users /></span><div><small>Tổng khách hàng</small><strong>{stats.total}</strong></div></article>
          <article><span><UserRound /></span><div><small>Đang tư vấn</small><strong>{stats.waiting}</strong></div></article>
          <article><span><WandSparkles /></span><div><small>Đang xem demo</small><strong>{stats.demos}</strong></div></article>
          <article><span><FileArchive /></span><div><small>Đã xác nhận</small><strong>{stats.confirmed}</strong></div></article>
        </section>

        <section className="admin-workspace">
          <div className="admin-customer-list">
            <div className="admin-panel-heading"><div><p>CRM khách hàng</p><h2>Danh sách yêu cầu</h2></div><span>{filteredCustomers.length}</span></div>
            <div className="admin-list-tools">
              <label><Search aria-hidden="true" /><input placeholder="Tìm tên, SĐT, email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | CustomerStatus)}>
                <option value="all">Tất cả trạng thái</option>
                {customerStatuses.map((status) => <option key={status} value={status}>{customerStatusLabels[status]}</option>)}
              </select>
            </div>
            <div className="admin-customer-list__items">
              {filteredCustomers.map((customer) => (
                <button
                  type="button"
                  key={customer.id}
                  className={selectedCustomerId === customer.id && !isNewCustomer ? 'is-active' : ''}
                  onClick={() => { setIsNewCustomer(false); setSelectedCustomerId(customer.id); setEditor(customerToEditor(customer)); }}
                >
                  <span className="admin-customer-avatar">{(customer.brideName || customer.fullName || '?').charAt(0)}</span>
                  <span><b>{customer.brideName && customer.groomName ? `${customer.brideName} & ${customer.groomName}` : customer.fullName}</b><small>{customer.phone || customer.email || 'Chưa có liên hệ'}</small></span>
                  <i className={`status-${customer.status}`}>{customerStatusLabels[customer.status]}</i>
                  <time>{formatDate(customer.createdAt)}</time>
                </button>
              ))}
              {!filteredCustomers.length && <div className="admin-empty"><Users /><p>Chưa có khách hàng phù hợp bộ lọc.</p></div>}
            </div>
          </div>

          <div className="admin-customer-detail">
            <div className="admin-panel-heading">
              <div><p>{isNewCustomer ? 'Hồ sơ mới' : 'Thông tin khách hàng'}</p><h2>{isNewCustomer ? 'Thêm khách hàng' : selectedCustomer ? `${selectedCustomer.brideName} & ${selectedCustomer.groomName}` : 'Chọn một khách hàng'}</h2></div>
              {selectedCustomer && <span className={`status-${selectedCustomer.status}`}>{customerStatusLabels[selectedCustomer.status]}</span>}
            </div>

            {(isNewCustomer || selectedCustomer) ? (
              <form className="admin-customer-form" onSubmit={saveCustomer}>
                <div className="admin-form-grid">
                  <label>Người liên hệ <b>*</b><input value={editor.fullName} onChange={(e) => updateEditor('fullName', e.target.value)} /></label>
                  <label>Số điện thoại <b>*</b><input value={editor.phone} onChange={(e) => updateEditor('phone', e.target.value)} /></label>
                  <label>Email<input type="email" value={editor.email} onChange={(e) => updateEditor('email', e.target.value)} /></label>
                  <label>Nguồn khách<input value={editor.source} onChange={(e) => updateEditor('source', e.target.value)} /></label>
                  <label>Tên cô dâu<input value={editor.brideName} onChange={(e) => updateEditor('brideName', e.target.value)} /></label>
                  <label>Tên chú rể<input value={editor.groomName} onChange={(e) => updateEditor('groomName', e.target.value)} /></label>
                  <label>Ngày cưới<input type="date" value={editor.weddingDate} onChange={(e) => updateEditor('weddingDate', e.target.value)} /></label>
                  <label>Giờ đón khách<input type="time" value={editor.weddingTime} onChange={(e) => updateEditor('weddingTime', e.target.value)} /></label>
                  <label className="is-wide">Địa điểm<input value={editor.venue} onChange={(e) => updateEditor('venue', e.target.value)} /></label>
                  <label className="is-wide">Địa chỉ<input value={editor.address} onChange={(e) => updateEditor('address', e.target.value)} /></label>
                  <label className="is-wide">Lời mời<textarea rows={3} value={editor.message} onChange={(e) => updateEditor('message', e.target.value)} /></label>
                  <label className="is-wide">Ảnh cover URL<input type="url" value={editor.coverUrl} onChange={(e) => updateEditor('coverUrl', e.target.value)} placeholder="Để trống để dùng thumbnail của mẫu" /></label>
                  <label>Mẫu thiệp
                    <select value={editor.selectedTemplateId} onChange={(e) => updateEditor('selectedTemplateId', e.target.value)}>
                      <option value="">Chọn mẫu</option>
                      {weddingTemplates.filter((item) => item.route).map((template) => <option key={template.id} value={template.id}>{template.name}</option>)}
                    </select>
                  </label>
                  <label>Trạng thái
                    <select value={editor.status} onChange={(e) => updateEditor('status', e.target.value as CustomerStatus)}>
                      {customerStatuses.map((status) => <option key={status} value={status}>{customerStatusLabels[status]}</option>)}
                    </select>
                  </label>
                  <label className="is-wide">Ghi chú nội bộ<textarea rows={3} value={editor.notes} onChange={(e) => updateEditor('notes', e.target.value)} /></label>
                </div>
                <div className="admin-form-actions">
                  {isNewCustomer && <button type="button" onClick={() => { setIsNewCustomer(false); setSelectedCustomerId(customers[0]?.id ?? null); }}>Hủy</button>}
                  <button type="submit" className="is-primary" disabled={saving}>{saving ? <LoaderCircle className="is-spinning" /> : <Save />} {saving ? 'Đang lưu...' : 'Lưu hồ sơ'}</button>
                </div>
              </form>
            ) : <div className="admin-empty is-large"><UserRound /><p>Chọn khách hàng để xem và chỉnh sửa hồ sơ.</p></div>}
          </div>
        </section>

        {selectedCustomer && !isNewCustomer && (
          <section className="admin-demo-panel">
            <div className="admin-panel-heading"><div><p>Demo Studio</p><h2>Tạo và quản lý link preview</h2></div><span>{customerDemos.length} demo</span></div>
            <div className="admin-demo-builder">
              <div className="admin-demo-preview">
                <CustomerInvitationPreview
                  compact
                  templateId={editor.selectedTemplateId || 'classic-minimalist'}
                  payload={{
                    brideName: editor.brideName, groomName: editor.groomName, weddingDate: editor.weddingDate,
                    weddingTime: editor.weddingTime, venue: editor.venue, address: editor.address,
                    message: editor.message, coverUrl: editor.coverUrl,
                  }}
                />
              </div>
              <div className="admin-demo-controls">
                <label>Ghi chú hiển thị trên popup<textarea rows={4} value={demoNote} onChange={(e) => setDemoNote(e.target.value)} /></label>
                <label>Ngày hết hạn<input type="date" value={demoExpiry} onChange={(e) => setDemoExpiry(e.target.value)} /></label>
                <button type="button" className="is-primary" onClick={publishDemo} disabled={actionLoading === 'demo'}>
                  {actionLoading === 'demo' ? <LoaderCircle className="is-spinning" /> : <Link2 />} Tạo link preview
                </button>
                <button type="button" onClick={confirmOrder} disabled={selectedCustomer.status === 'confirmed' || selectedCustomer.status === 'completed' || actionLoading === 'confirm'}>
                  <Check /> {selectedCustomer.status === 'confirmed' || selectedCustomer.status === 'completed' ? 'Khách đã xác nhận' : 'Xác nhận khách đặt mẫu'}
                </button>
              </div>
            </div>

            <div className="admin-demo-list">
              {customerDemos.map((demo) => {
                const previewUrl = `${window.location.origin}/preview/${demo.publicToken}`;
                const canExport = selectedCustomer.status === 'confirmed' || selectedCustomer.status === 'completed';
                return (
                  <article key={demo.id}>
                    <span className={demo.status === 'published' ? 'is-live' : ''}><i /> {demo.status === 'published' ? 'Đang hoạt động' : 'Đã khóa'}</span>
                    <div><b>{weddingTemplates.find((item) => item.id === demo.templateId)?.name ?? demo.templateId}</b><small>Tạo {formatDate(demo.createdAt)}{demo.expiresAt ? ` · Hết hạn ${formatDate(demo.expiresAt)}` : ''}</small></div>
                    <label><input readOnly value={previewUrl} /><button type="button" onClick={() => void copyPreviewLink(demo.publicToken)} aria-label="Sao chép link"><Clipboard /></button><a href={previewUrl} target="_blank" rel="noreferrer" aria-label="Mở preview"><ExternalLink /></a></label>
                    <div className="admin-demo-list__actions">
                      <button type="button" onClick={() => void expireDemo(demo)}><Archive /> {demo.status === 'expired' ? 'Mở lại' : 'Khóa link'}</button>
                      <button type="button" className="is-primary" disabled={!canExport || actionLoading === `export:${demo.id}`} title={canExport ? 'Xuất source code ZIP' : 'Cần xác nhận khách đặt mẫu trước'} onClick={() => void exportZip(demo)}>
                        {actionLoading === `export:${demo.id}` ? <LoaderCircle className="is-spinning" /> : <Download />} Xuất code ZIP
                      </button>
                    </div>
                  </article>
                );
              })}
              {!customerDemos.length && <div className="admin-empty"><WandSparkles /><p>Chưa có demo. Chọn mẫu và tạo link preview đầu tiên.</p></div>}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

