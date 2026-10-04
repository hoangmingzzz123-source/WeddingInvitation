import { useEffect, useId, useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  ClipboardPenLine,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';
import { navigateTo } from '../Router';

const REQUEST_FORM_URL = 'https://forms.gle/2qBNf4tHBiq6vavZ6';

interface InvitationCreationLauncherProps {
  children: (openOptions: () => void) => ReactNode;
}

export function InvitationCreationLauncher({ children }: InvitationCreationLauncherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const openOnlineCreator = () => {
    setIsOpen(false);
    navigateTo('/tao-thiep');
  };

  const openRequestForm = () => {
    setIsOpen(false);
    window.open(REQUEST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {children(() => setIsOpen(true))}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="creation-dialog__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setIsOpen(false);
            }}
          >
            <motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
              className="creation-dialog"
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 330, damping: 28 }}
            >
              <button
                type="button"
                className="creation-dialog__close"
                onClick={() => setIsOpen(false)}
                aria-label="Đóng lựa chọn tạo thiệp"
              >
                <X aria-hidden="true" />
              </button>

              <div className="creation-dialog__intro">
                <span className="creation-dialog__icon"><Sparkles aria-hidden="true" /></span>
                <p>Bắt đầu theo cách của bạn</p>
                <h2 id={titleId}>Bạn muốn tạo thiệp như thế nào?</h2>
                <span id={descriptionId}>
                  Gửi đầy đủ nội dung để đội ngũ hỗ trợ, hoặc tự tạo một bản demo ngay trên trình duyệt.
                </span>
              </div>

              <div className="creation-dialog__options">
                <button type="button" className="creation-option" onClick={openRequestForm}>
                  <span className="creation-option__icon creation-option__icon--form">
                    <ClipboardPenLine aria-hidden="true" />
                  </span>
                  <span className="creation-option__content">
                    <span className="creation-option__eyebrow">Có đội ngũ hỗ trợ</span>
                    <strong>Điền form như hiện tại</strong>
                    <small>Gửi nội dung, hình ảnh và yêu cầu chi tiết. Phù hợp khi bạn đã chọn được gói.</small>
                  </span>
                  <ArrowRight className="creation-option__arrow" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="creation-option creation-option--featured"
                  onClick={openOnlineCreator}
                >
                  <span className="creation-option__label">Mới · Miễn phí</span>
                  <span className="creation-option__icon creation-option__icon--demo">
                    <WandSparkles aria-hidden="true" />
                  </span>
                  <span className="creation-option__content">
                    <span className="creation-option__eyebrow">Thử ngay trong 5 phút</span>
                    <strong>Tự tạo demo online</strong>
                    <small>Nhập thông tin, chọn phong cách, xem trước tức thì và chia sẻ bằng một đường link.</small>
                  </span>
                  <ArrowRight className="creation-option__arrow" aria-hidden="true" />
                </button>
              </div>

              <p className="creation-dialog__note">Không cần đăng nhập · Bản nháp được lưu trên thiết bị này</p>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

