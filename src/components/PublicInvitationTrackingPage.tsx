import { useEffect, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, Heart, MessageCircleHeart, Users } from 'lucide-react';

interface TrackingResponse {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  answers: Record<string, string>;
  side?: 'groom' | 'bride' | null;
  submittedAt: string;
}

interface TrackingWish {
  id: string;
  name: string;
  message: string;
  side?: 'groom' | 'bride' | null;
  submittedAt: string;
}

interface InvitationTrackingResult {
  couple: string;
  responses: TrackingResponse[];
  wishes: TrackingWish[];
}

const answerLabels: Record<string, string> = { transport: 'Xe đưa đón', meal: 'Chế độ ăn' };
const sideLabel = (side?: 'groom' | 'bride' | null) => side === 'groom' ? 'Thiệp nhà trai' : side === 'bride' ? 'Thiệp nhà gái' : '';

export function PublicInvitationTrackingPage({ token }: { token: string }) {
  const [result, setResult] = useState<InvitationTrackingResult | null>(null);
  const [activeTab, setActiveTab] = useState<'wishes' | 'rsvp'>('wishes');
  const [sideFilter, setSideFilter] = useState<'all' | 'groom' | 'bride'>('all');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`/api/customer-media?action=invitation-tracking-share&token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || 'Không thể mở link theo dõi.');
        return payload as InvitationTrackingResult;
      })
      .then((payload) => { if (active) setResult(payload); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể mở link theo dõi.');
      });
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (result) document.title = `Lời chúc & RSVP · ${result.couple}`;
  }, [result]);

  if (error) return (
    <main className="public-rsvp-state">
      <AlertCircle aria-hidden="true" />
      <p>Link theo dõi</p>
      <h1>{error}</h1>
    </main>
  );

  if (!result) return (
    <main className="public-rsvp-state is-loading" role="status" aria-live="polite">
      <span />
      <p>Đang tải lời chúc và RSVP...</p>
    </main>
  );

  const filterBySide = <T extends { side?: 'groom' | 'bride' | null }>(items: T[]) => (
    sideFilter === 'all' ? items : items.filter((item) => item.side === sideFilter)
  );
  const wishes = filterBySide(result.wishes);
  const responses = filterBySide(result.responses);
  const yesCount = responses.filter((response) => response.attending === 'yes').length;
  const guestCount = responses.reduce((total, response) => total + (response.attending === 'yes' ? response.guestCount : 0), 0);

  return (
    <main className="public-tracking-share">
      <header className="public-tracking-share__header">
        <p><MessageCircleHeart aria-hidden="true" /> THE WEDDING GUESTBOOK</p>
        <h1>{result.couple}</h1>
      </header>
      <div className="public-tracking-share__filters" role="group" aria-label="Lọc theo bên gia đình">
        <span>Lọc theo</span>
        {([
          ['all', 'Tất cả'],
          ['groom', 'Nhà trai'],
          ['bride', 'Nhà gái'],
        ] as const).map(([value, label]) => (
          <button type="button" key={value} aria-pressed={sideFilter === value} onClick={() => setSideFilter(value)}>
            {label}
          </button>
        ))}
        {sideFilter === 'all' && <small>Lời chúc và phản hồi cũ chưa gắn bên gia đình vẫn được hiển thị.</small>}
      </div>
      <div className="public-tracking-share__tabs" role="tablist" aria-label="Nội dung theo dõi">
        <button id="tracking-tab-wishes" type="button" role="tab" aria-selected={activeTab === 'wishes'}
          aria-controls="tracking-panel-wishes" onClick={() => setActiveTab('wishes')}>
          Lời chúc <span>{wishes.length}</span>
        </button>
        <button id="tracking-tab-rsvp" type="button" role="tab" aria-selected={activeTab === 'rsvp'}
          aria-controls="tracking-panel-rsvp" onClick={() => setActiveTab('rsvp')}>
          RSVP <span>{responses.length}</span>
        </button>
      </div>
      {activeTab === 'wishes' ? (
        <section id="tracking-panel-wishes" role="tabpanel" aria-labelledby="tracking-tab-wishes" className="public-tracking-share__panel">
          {wishes.length ? <ol className="public-tracking-share__wishes">
            {wishes.map((wish) => (
              <li key={wish.id}>
                <Heart aria-hidden="true" />
                <div>
                  <strong>{wish.name}</strong>
                  {sideLabel(wish.side) && <span className="public-tracking-share__side">{sideLabel(wish.side)}</span>}
                  <p>{wish.message}</p>
                  <time>{new Date(wish.submittedAt).toLocaleString('vi-VN')}</time>
                </div>
              </li>
            ))}
          </ol> : <p className="public-wishes-share__empty">Không có lời chúc phù hợp bộ lọc.</p>}
        </section>
      ) : (
        <section id="tracking-panel-rsvp" role="tabpanel" aria-labelledby="tracking-tab-rsvp" className="public-tracking-share__panel">
          <div className="public-rsvp-share__stats">
            <span><CheckCircle2 aria-hidden="true" /> {yesCount} sẽ tham dự</span>
            <span><Users aria-hidden="true" /> {guestCount} khách xác nhận</span>
            <span>{responses.length} phản hồi</span>
          </div>
          {responses.length ? <ol className="public-tracking-share__rsvps">
            {responses.map((response) => (
              <li key={response.id}>
                <div className="public-rsvp-share__guest">
                  <strong>{response.name}</strong>
                  {sideLabel(response.side) && <span className="public-tracking-share__side">{sideLabel(response.side)}</span>}
                  <span className={response.attending === 'yes' ? 'is-yes' : 'is-no'}>
                    {response.attending === 'yes' ? `Sẽ tham dự · ${response.guestCount} khách` : 'Không thể tham dự'}
                  </span>
                </div>
                <div className="public-rsvp-share__meta">
                  <span><CalendarDays aria-hidden="true" /> {new Date(response.submittedAt).toLocaleString('vi-VN')}</span>
                  {Object.entries(response.answers ?? {}).map(([key, value]) => answerLabels[key] && value && (
                    <span key={key}>{answerLabels[key]}: {value}</span>
                  ))}
                </div>
              </li>
            ))}
          </ol> : <p className="public-rsvp-share__empty">Không có hồi đáp phù hợp bộ lọc.</p>}
        </section>
      )}
      <footer>Chế độ chỉ xem</footer>
    </main>
  );
}
