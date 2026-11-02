const API_BASE = 'http://localhost:5000/api';

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
    throw new Error(`Failed to fetch case ${caseId}`);
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
    throw new Error(`Failed to discover clue ${clueId}`);
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
    throw new Error('Failed to request hint');
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
    throw new Error(errorData.error || 'Failed to submit accusation');
  }

  return response.json();
}

/**
 * Get final post-mortem and score result
 */
export async function getCaseResultAPI(caseId) {
  const response = await fetch(`${API_BASE}/cases/${caseId}/result`);
  if (!response.ok) {
    throw new Error('Failed to fetch case result');
  }
  return response.json();
}
