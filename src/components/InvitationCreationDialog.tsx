import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'motion/react';
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
  children: (
    openOptions: (event?: MouseEvent<HTMLElement>) => void,
  ) => ReactNode;
}

export function InvitationCreationLauncher({
  children,
}: InvitationCreationLauncherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);

  const openOptions = (event?: MouseEvent<HTMLElement>) => {
    openerRef.current =
      event?.currentTarget ?? (document.activeElement as HTMLElement | null);
    setIsOpen(true);
  };

  const openOnlineCreator = () => {
    setIsOpen(false);
    navigateTo('/tao-thiep');
  };

  const openRequestForm = () => {
    setIsOpen(false);
    window.open(REQUEST_FORM_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      {children(openOptions)}

      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="creation-dialog__backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Dialog.Content
              asChild
              onCloseAutoFocus={(event) => {
                event.preventDefault();
                if (openerRef.current?.isConnected)
                  openerRef.current.focus({ preventScroll: true });
              }}
            >
              <motion.section
                className="creation-dialog"
                initial={{ opacity: 0, y: 28, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
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
                  <span className="creation-dialog__icon">
                    <Sparkles aria-hidden="true" />
                  </span>
                  <p>Bắt đầu theo cách của bạn</p>
                  <Dialog.Title asChild>
                    <h2>Bạn muốn tạo thiệp như thế nào?</h2>
                  </Dialog.Title>
                  <Dialog.Description asChild>
                    <span>
                      Gửi đầy đủ nội dung để đội ngũ hỗ trợ, hoặc tự tạo một bản
                      demo ngay trên trình duyệt.
                    </span>
                  </Dialog.Description>
                </div>

                <div className="creation-dialog__options">
                  <button
                    type="button"
                    className="creation-option"
                    onClick={openRequestForm}
                  >
                    <span className="creation-option__icon creation-option__icon--form">
                      <ClipboardPenLine aria-hidden="true" />
                    </span>
                    <span className="creation-option__content">
                      <span className="creation-option__eyebrow">
                        Có đội ngũ hỗ trợ
                      </span>
                      <strong>Điền form như hiện tại</strong>
                      <small>
                        Gửi nội dung, hình ảnh và yêu cầu chi tiết. Phù hợp khi
                        bạn đã chọn được gói.
                      </small>
                    </span>
                    <ArrowRight
                      className="creation-option__arrow"
                      aria-hidden="true"
                    />
                  </button>

                  <button
                    type="button"
                    className="creation-option creation-option--featured"
                    onClick={openOnlineCreator}
                  >
                    <span className="creation-option__label">
                      Mới · Miễn phí
                    </span>
                    <span className="creation-option__icon creation-option__icon--demo">
                      <WandSparkles aria-hidden="true" />
                    </span>
                    <span className="creation-option__content">
                      <span className="creation-option__eyebrow">
                        Thử ngay trong 5 phút
                      </span>
                      <strong>Tự tạo demo online</strong>
                      <small>
                        Nhập thông tin, chọn phong cách, xem trước tức thì và
                        chia sẻ bằng một đường link.
                      </small>
                    </span>
                    <ArrowRight
                      className="creation-option__arrow"
                      aria-hidden="true"
                    />
                  </button>
                </div>

                <p className="creation-dialog__note">
                  Không cần đăng nhập · Bản nháp được lưu trên thiết bị này
                </p>
              </motion.section>
            </Dialog.Content>
          </motion.div>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
