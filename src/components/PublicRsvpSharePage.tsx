import { useEffect, useState } from 'react';
import { AlertCircle, CalendarDays, CheckCircle2, Users } from 'lucide-react';

interface SharedRsvp {
  id: string;
  name: string;
  attending: 'yes' | 'no';
  guestCount: number;
  answers: Record<string, string>;
  submittedAt: string;
}

interface SharedRsvpsResult {
  couple: string;
  responses: SharedRsvp[];
}

const answerLabels: Record<string, string> = {
  transport: 'Xe đưa đón',
  meal: 'Chế độ ăn',
};

export function PublicRsvpSharePage({ token }: { token: string }) {
  const [result, setResult] = useState<SharedRsvpsResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`/api/customer-media?action=invitation-rsvps-share&token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || 'Không thể mở danh sách RSVP.');
        return payload as SharedRsvpsResult;
      })
      .then((payload) => { if (active) setResult(payload); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể mở danh sách RSVP.');
      });
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (result) document.title = `RSVP · ${result.couple}`;
  }, [result]);

  if (error) return (
    <main className="public-rsvp-state">
      <AlertCircle aria-hidden="true" />
      <p>Danh sách RSVP</p>
      <h1>{error}</h1>
    </main>
  );

  if (!result) return (
    <main className="public-rsvp-state is-loading" role="status" aria-live="polite">
      <span />
      <p>Đang tải danh sách RSVP...</p>
    </main>
  );

  const yesCount = result.responses.filter((response) => response.attending === 'yes').length;
  const guestCount = result.responses.reduce((total, response) => total + (response.attending === 'yes' ? response.guestCount : 0), 0);

  return (
    <main className="public-rsvp-share">
      <header>
        <p>RSVP · DANH SÁCH HỒI ĐÁP</p>
        <h1>{result.couple}</h1>
        <div className="public-rsvp-share__stats">
          <span><CheckCircle2 aria-hidden="true" /> {yesCount} sẽ tham dự</span>
          <span><Users aria-hidden="true" /> {guestCount} khách xác nhận</span>
          <span>{result.responses.length} phản hồi</span>
        </div>
      </header>
      {result.responses.length ? (
        <ol>
          {result.responses.map((response) => (
            <li key={response.id}>
              <div className="public-rsvp-share__guest">
                <strong>{response.name}</strong>
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
        </ol>
      ) : <p className="public-rsvp-share__empty">Chưa có lời hồi đáp nào.</p>}
      <footer>Chế độ chỉ xem</footer>
    </main>
  );
}
