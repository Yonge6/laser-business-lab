export const savedOpportunityKey = "maker-business-lab:saved-opportunities";
export const savedOpportunityEvent = "maker-saved-change";

export function getSavedOpportunitySnapshot() {
  return window.localStorage.getItem(savedOpportunityKey) ?? "[]";
}

export function getSavedOpportunityServerSnapshot() {
  return "[]";
}

export function subscribeToSavedOpportunities(onStoreChange: () => void) {
  const sync = () => onStoreChange();
  window.addEventListener(savedOpportunityEvent, sync);
  window.addEventListener("storage", sync);
  return () => {
    window.removeEventListener(savedOpportunityEvent, sync);
    window.removeEventListener("storage", sync);
  };
}

export function writeSavedOpportunityIds(ids: string[]) {
  window.localStorage.setItem(savedOpportunityKey, JSON.stringify(Array.from(new Set(ids))));
  window.dispatchEvent(new Event(savedOpportunityEvent));
}
