import { ArrowLeft, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { navigateTo } from '../Router';
import { weddingTemplates } from '../data/templates';
import { InvitationCreationLauncher } from './InvitationCreationDialog';

export function DemoShell({ route, children }: { route: string; children: ReactNode }) {
  const template = weddingTemplates.find((item) => item.route === route);

  return (
    <div className="demo-shell">
      <div className="demo-toolbar">
        <button type="button" onClick={() => navigateTo('/templates')}>
          <ArrowLeft aria-hidden="true" />
          <span>Thư viện</span>
        </button>
        <p>
          <Sparkles aria-hidden="true" />
          <span><small>Đang xem demo</small>{template?.name ?? 'Mẫu thiệp cưới'}</span>
        </p>
        <InvitationCreationLauncher>
          {(openOptions) => (
            <button type="button" onClick={openOptions}>Tạo thiệp từ mẫu này</button>
          )}
        </InvitationCreationLauncher>
      </div>
      {children}
    </div>
  );
}

