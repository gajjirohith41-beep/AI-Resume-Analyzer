const KEY = "resumeiq_analysis_history";

export function getHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function saveHistory(item) {
  const history = [item, ...getHistory()].slice(0, 5);
  localStorage.setItem(KEY, JSON.stringify(history));
  return history;
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
