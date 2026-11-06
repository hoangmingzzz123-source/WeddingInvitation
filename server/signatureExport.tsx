import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { SignatureDemo, type SignatureDemoCustomization, type SignatureRsvpQuestion } from '../src/components/demos/SignatureDemos.js';

export function renderSignatureInvitation(
  templateId: string,
  customization: SignatureDemoCustomization,
  rsvpQuestions: SignatureRsvpQuestion[],
) {
  const content = renderToStaticMarkup(createElement(SignatureDemo, {
    id: templateId,
    customization,
    rsvpQuestions,
    embedded: true,
    staticExport: true,
  }));
  return `<div id="root"><div class="demo-page-content demo-page-content--signature" data-template="${templateId}">${content}</div></div>`;
}
