import { useEffect, useState } from 'react';
import { AlertCircle, Heart, MessageCircleHeart } from 'lucide-react';

interface SharedWish {
  id: string;
  name: string;
  message: string;
  submittedAt: string;
}

interface SharedWishesResult {
  couple: string;
  wishes: SharedWish[];
}

export function PublicWishesSharePage({ token }: { token: string }) {
  const [result, setResult] = useState<SharedWishesResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch(`/api/customer-media?action=invitation-wishes-share&token=${encodeURIComponent(token)}`)
      .then(async (response) => {
        const payload = await response.json().catch(() => null);
        if (!response.ok) throw new Error(payload?.message || 'Không thể mở sổ lưu bút.');
        return payload as SharedWishesResult;
      })
      .then((payload) => { if (active) setResult(payload); })
      .catch((requestError: unknown) => {
        if (active) setError(requestError instanceof Error ? requestError.message : 'Không thể mở sổ lưu bút.');
      });
    return () => { active = false; };
  }, [token]);

  useEffect(() => {
    if (result) document.title = `Lời chúc · ${result.couple}`;
  }, [result]);

  if (error) return (
    <main className="public-rsvp-state">
      <AlertCircle aria-hidden="true" />
      <p>Sổ lưu bút</p>
      <h1>{error}</h1>
    </main>
  );

  if (!result) return (
    <main className="public-rsvp-state is-loading" role="status" aria-live="polite">
      <span />
      <p>Đang tải sổ lưu bút...</p>
    </main>
  );

  return (
    <main className="public-wishes-share">
      <header>
        <p><MessageCircleHeart aria-hidden="true" /> SỔ LƯU BÚT</p>
        <h1>{result.couple}</h1>
        <span>{result.wishes.length} lời chúc</span>
      </header>
      {result.wishes.length ? (
        <ol>
          {result.wishes.map((wish) => (
            <li key={wish.id}>
              <Heart aria-hidden="true" />
              <div><strong>{wish.name}</strong><p>{wish.message}</p><time>{new Date(wish.submittedAt).toLocaleString('vi-VN')}</time></div>
            </li>
          ))}
        </ol>
      ) : <p className="public-wishes-share__empty">Chưa có lời chúc nào.</p>}
      <footer>Chế độ chỉ xem</footer>
    </main>
  );
}
