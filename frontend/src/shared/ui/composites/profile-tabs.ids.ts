function toDomIdSegment(value: string): string {
  return value.trim().replace(/[^A-Za-z0-9_-]+/g, '-');
}

export function getTabButtonId(idBase: string, tabId: string): string {
  return `${idBase}-tab-${toDomIdSegment(tabId)}`;
}

export function getPanelId(idBase: string, tabId: string): string {
  return `${idBase}-panel-${toDomIdSegment(tabId)}`;
}
