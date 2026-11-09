const DRAFT_KEY = "velqora_booking_draft";

export function saveDraft(draft) {
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
}

export function getDraft() {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  sessionStorage.removeItem(DRAFT_KEY);
}