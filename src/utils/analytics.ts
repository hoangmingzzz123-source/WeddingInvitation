type AnalyticsValue = string | number | boolean | null | undefined;

export function trackEvent(
  event: string,
  properties: Record<string, AnalyticsValue> = {},
) {
  const payload = { event, ...properties };
  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, AnalyticsValue>>;
  };

  analyticsWindow.dataLayer = analyticsWindow.dataLayer ?? [];
  analyticsWindow.dataLayer.push(payload);
  window.dispatchEvent(new CustomEvent('mp:analytics', { detail: payload }));
}
