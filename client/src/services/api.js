/**
 * MysteryVerse API Service
 * 
 * Dynamically resolves API base URL from import.meta.env.VITE_API_URL,
 * with resilient fallback for deployed Render environments and local development.
 */

function resolveApiBase() {
  const envUrl = import.meta.env.VITE_API_URL;

  // 1. If explicit environment variable is provided, normalize and use it
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    const trimmed = envUrl.trim().replace(/\/+$/, '');
    return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
  }

  // 2. If running on Render in production, automatically point to deployed backend
  if (typeof window !== 'undefined' && window.location.hostname.includes('onrender.com')) {
    return 'https://mysteryverse-pg2r.onrender.com/api';
  }

  // 3. Fallback for local development
  return 'http://localhost:5000/api';
}

export const API_BASE = resolveApiBase();

/**
 * Generate a new mystery case via the backend Gemini API
 */
export async function createCaseAPI({ premise, difficulty = 'Medium' }) {
  const response = await fetch(`${API_BASE}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ premise, difficulty })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to generate case (${response.status})`);
  }

  return response.json();
}

/**
 * Get case details without revealing solution
 */
export async function getCaseAPI(caseId) {
  const response = await fetch(`${API_BASE}/cases/${caseId}`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch case ${caseId} (${response.status})`);
  }
  return response.json();
}

/**
 * Log a discovered clue on the backend
 */
export async function discoverClueAPI(caseId, clueId) {
  const response = await fetch(`${API_BASE}/cases/${caseId}/clues/${clueId}/discover`, {
    method: 'POST'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to discover clue ${clueId} (${response.status})`);
  }
  return response.json();
}

/**
 * Request an inspector hint on the backend
 */
export async function requestHintAPI(caseId) {
  const response = await fetch(`${API_BASE}/cases/${caseId}/hints`, {
    method: 'POST'
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to request hint (${response.status})`);
  }
  return response.json();
}

/**
 * Submit formal accusation and compute backend score
 */
export async function submitAccusationAPI(caseId, { accusedId, motive, reasoning }) {
  const response = await fetch(`${API_BASE}/cases/${caseId}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accusedId, motive, reasoning })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to submit accusation (${response.status})`);
  }

  return response.json();
}

/**
 * Get final post-mortem and score result
 */
export async function getCaseResultAPI(caseId) {
  const response = await fetch(`${API_BASE}/cases/${caseId}/result`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Failed to fetch case result (${response.status})`);
  }
  return response.json();
}
