import { useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

interface MapSectionProps {
  location?: string;
  address?: string;
  mapUrl?: string;
  premium?: boolean;
  className?: string;
  latitude?: number;
  longitude?: number;
  center?: { lat: number; lng: number };
  showHeading?: boolean;
}

export function MapSection({
  location = 'Địa điểm sẽ được cập nhật',
  address = 'Thông tin địa chỉ sẽ được cập nhật',
  mapUrl,
  premium = false,
  className = '',
  latitude,
  longitude,
  center,
  showHeading = true,
}: MapSectionProps) {
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const coordinates = latitude !== undefined && longitude !== undefined
    ? `${latitude},${longitude}`
    : center
      ? `${center.lat},${center.lng}`
      : undefined;
  const mapDestination = coordinates ?? [location, address]
    .filter((value) => {
      const normalized = value.trim().toLocaleLowerCase('vi');
      return normalized
        && !normalized.includes('sẽ được cập nhật')
        && normalized !== 'địa điểm tổ chức'
        && !normalized.startsWith('thông tin địa chỉ');
    })
    .join(', ');
  const hasMapDestination = Boolean(mapDestination);
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapDestination)}&output=embed&t=${mapType === 'satellite' ? 'k' : 'm'}`;
  const searchUrl = mapUrl ?? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapDestination)}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapDestination)}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${encodeURIComponent(mapDestination)}`;

  return (
    <section className={`relative w-full px-4 py-12 sm:px-6 sm:py-16 ${className}`}>
      <div className="mx-auto w-full max-w-5xl">
        {showHeading && (
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-7 text-center sm:mb-9"
          >
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#9A752D]">
              Hẹn gặp bạn tại
            </p>
            <h2
              className="text-3xl font-medium leading-tight text-[#27352B] sm:text-4xl md:text-5xl"
              style={{ fontFamily: '"Playfair Display", serif' }}
            >
              Bản đồ địa điểm tổ chức
            </h2>
          </motion.header>
        )}

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[1.6rem] border border-[#D8CFBD] bg-white p-1.5 shadow-[0_24px_60px_rgba(39,53,43,0.14)] sm:rounded-[2rem] sm:p-2"
        >
          <div className="relative isolate aspect-[16/10] min-h-[18rem] overflow-hidden rounded-[1.2rem] bg-[#EEF0E8] sm:aspect-[16/8] sm:rounded-[1.55rem]">
            {hasMapDestination ? (
              <iframe
                src={embedUrl}
                title={`Bản đồ đến ${location}${address ? `, ${address}` : ''}`}
                className="absolute inset-0 h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div
                className="absolute inset-0 grid place-items-center"
                style={{
                  backgroundColor: '#E5EADF',
                  backgroundImage: 'linear-gradient(90deg, rgba(106,125,105,.07) 1px, transparent 1px), linear-gradient(rgba(106,125,105,.07) 1px, transparent 1px), linear-gradient(135deg, #f0f2ea, #e5eadf)',
                  backgroundSize: '32px 32px, 32px 32px, auto',
                }}
              >
                <div className="mx-4 max-w-sm rounded-2xl border border-white/80 bg-white/90 px-6 py-5 text-center shadow-lg backdrop-blur">
                  <MapPin className="mx-auto mb-2 h-6 w-6 text-[#9A752D]" aria-hidden="true" />
                  <p className="text-sm font-semibold text-[#27352B]">Bản đồ sẽ hiển thị khi có địa chỉ</p>
                  <p className="mt-1 text-xs leading-relaxed text-[#657084]">Cập nhật địa điểm tổ chức để khách mời mở chỉ đường chính xác.</p>
                </div>
              </div>
            )}

            {premium && hasMapDestination && (
              <div className="absolute right-3 top-3 z-10 inline-flex rounded-full border border-white/70 bg-white/95 p-1 shadow-lg backdrop-blur sm:right-4 sm:top-4">
                <button
                  type="button"
                  onClick={() => setMapType('roadmap')}
                  aria-pressed={mapType === 'roadmap'}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                    mapType === 'roadmap' ? 'bg-[#27352B] text-white' : 'text-[#596257] hover:bg-[#F2F3EF]'
                  }`}
                >
                  Bản đồ
                </button>
                <button
                  type="button"
                  onClick={() => setMapType('satellite')}
                  aria-pressed={mapType === 'satellite'}
                  className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
                    mapType === 'satellite' ? 'bg-[#27352B] text-white' : 'text-[#596257] hover:bg-[#F2F3EF]'
                  }`}
                >
                  Vệ tinh
                </button>
              </div>
            )}

            {hasMapDestination && (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/25 to-transparent px-4 pb-4 pt-14 sm:px-6 sm:pb-6 sm:pt-20">
                <div className="flex items-end gap-3 text-white sm:gap-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur-md sm:h-12 sm:w-12">
                    <MapPin className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-semibold sm:text-2xl">{location}</h3>
                    <p className="mt-0.5 line-clamp-2 text-sm text-white/85 sm:text-base">{address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {hasMapDestination && (
          <div className="mt-5 flex flex-col justify-center gap-3 sm:mt-6 sm:flex-row">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#27352B] px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-[#27352B]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#17251B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A752D]"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Chỉ đường
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
            </a>
            <a
              href={searchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D8CFBD] bg-white px-7 py-3 text-sm font-semibold text-[#344238] transition duration-200 hover:-translate-y-0.5 hover:border-[#9A752D] hover:bg-[#FCFBF8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A752D]"
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Xem trên Google Maps
            </a>
            {premium && (
              <a
                href={appleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D8CFBD] bg-white px-7 py-3 text-sm font-semibold text-[#344238] transition duration-200 hover:-translate-y-0.5 hover:border-[#9A752D] hover:bg-[#FCFBF8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9A752D]"
              >
                Apple Maps
                <ExternalLink className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
