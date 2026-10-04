const FAVORITES_STORAGE_KEY = 'mp-wedding-favorite-templates-v1';

export const TEMPLATE_FAVORITES_EVENT = 'mp:template-favorites-change';

export function readTemplateFavorites(): string[] {
  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!storedValue) return [];

    const parsedValue: unknown = JSON.parse(storedValue);
    return Array.isArray(parsedValue)
      ? parsedValue.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function isTemplateFavorite(templateId: string) {
  return readTemplateFavorites().includes(templateId);
}

export function toggleTemplateFavorite(templateId: string) {
  const favorites = new Set(readTemplateFavorites());
  const willBeFavorite = !favorites.has(templateId);

  if (willBeFavorite) favorites.add(templateId);
  else favorites.delete(templateId);

  try {
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify([...favorites]));
  } catch {
    // The UI still updates for this session when storage is unavailable.
  }

  window.dispatchEvent(new CustomEvent(TEMPLATE_FAVORITES_EVENT, {
    detail: { templateId, isFavorite: willBeFavorite, favorites: [...favorites] },
  }));

  return willBeFavorite;
}
