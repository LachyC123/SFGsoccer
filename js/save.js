const KEY = "turbo-street-strikers-save-v1";

export function loadSave() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "null");
  } catch {
    return null;
  }
}

export function writeSave(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function clearSave() {
  localStorage.removeItem(KEY);
}
