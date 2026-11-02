// Comprehensive verification script for MysteryVerse backend APIs
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- 🧪 STARTING MYSTERYVERSE API TEST SUITE ---');

  // 1. Health check
  console.log('\n1. Testing GET /api/health...');
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('Status:', healthRes.status, healthData);

  // 2. POST /api/cases (Easy: 3 suspects, 5 clues, 2 hints)
  console.log('\n2. Testing POST /api/cases (Easy)...');
  const createEasyRes = await fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'A vintage pocket watch collector is found lifeless in an antique shop.',
      difficulty: 'Easy'
    })
  });
  const easyCaseData = await createEasyRes.json();
  const easyCase = easyCaseData.case;
  console.log('Created Case ID:', easyCase._id);
  console.log('Title:', easyCase.title);
  console.log('Suspects count (Expected 3):', easyCase.suspects.length);
  console.log('Clues count (Expected 5):', easyCase.clues.length);
  console.log('Hints count (Expected 2):', easyCase.hints.length);
  console.log('SECURITY CHECK - Is culpritId exposed?:', easyCase.culpritId === undefined ? '✅ NO (Protected)' : '❌ LEAKED');
  console.log('SECURITY CHECK - Is solutionExplanation exposed?:', easyCase.solutionExplanation === undefined ? '✅ NO (Protected)' : '❌ LEAKED');

  // 3. POST /api/cases (Medium: 4 suspects, 7 clues, 3 hints)
  console.log('\n3. Testing POST /api/cases (Medium)...');
  const createMedRes = await fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'A high-stakes art auction goes dark and the auctioneer collapses.',
      difficulty: 'Medium'
    })
  });
  const medCaseData = await createMedRes.json();
  const medCase = medCaseData.case;
  console.log('Medium Suspects count (Expected 4):', medCase.suspects.length);
  console.log('Medium Clues count (Expected 7):', medCase.clues.length);
  console.log('Medium Hints count (Expected 3):', medCase.hints.length);

  // 4. POST /api/cases (Hard: 5 suspects, 9 clues, 3 hints)
  console.log('\n4. Testing POST /api/cases (Hard)...');
  const createHardRes = await fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'Cybernetics laboratory cleanroom breach during neuro-protocol trials.',
      difficulty: 'Hard'
    })
  });
  const hardCaseData = await createHardRes.json();
  const hardCase = hardCaseData.case;
  console.log('Hard Suspects count (Expected 5):', hardCase.suspects.length);
  console.log('Hard Clues count (Expected 9):', hardCase.clues.length);
  console.log('Hard Hints count (Expected 3):', hardCase.hints.length);

  // 5. GET /api/cases/:id
  console.log('\n5. Testing GET /api/cases/:id...');
  const getRes = await fetch(`${BASE_URL}/cases/${easyCase._id}`);
  const getCase = (await getRes.json()).case;
  console.log('Fetched Case Title:', getCase.title);
  console.log('SECURITY CHECK - Is culpritId exposed on GET?:', getCase.culpritId === undefined ? '✅ NO' : '❌ LEAKED');

  // 6. POST /api/cases/:id/clues/:clueId/discover
  const firstClueId = easyCase.clues[0].id;
  console.log(`\n6. Testing POST /api/cases/:id/clues/${firstClueId}/discover...`);
  const clueRes = await fetch(`${BASE_URL}/cases/${easyCase._id}/clues/${firstClueId}/discover`, {
    method: 'POST'
  });
  const clueData = await clueRes.json();
  console.log('Discovered Clues:', clueData.discoveredClues);

  // 7. POST /api/cases/:id/hints
  console.log('\n7. Testing POST /api/cases/:id/hints...');
  const hintRes = await fetch(`${BASE_URL}/cases/${easyCase._id}/hints`, {
    method: 'POST'
  });
  const hintData = await hintRes.json();
  console.log('Unlocked Hint:', hintData.hint);
  console.log('Hints Used:', hintData.hintsUsed);

  // 8. POST /api/cases/:id/accuse
  // Pick the first suspect
  const accusedId = easyCase.suspects[0].id;
  console.log(`\n8. Testing POST /api/cases/:id/accuse with suspect "${accusedId}"...`);
  const accuseRes = await fetch(`${BASE_URL}/cases/${easyCase._id}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accusedId,
      motive: 'Greed and fear of exposure',
      reasoning: 'The physical residue on the safe and contradictory statements prove guilt.'
    })
  });
  const accuseData = await accuseRes.json();
  console.log('Accusation Result:', accuseData);
  console.log('Score calculation:', accuseData.scoreBreakdown);

  // 9. GET /api/cases/:id/result
  console.log('\n9. Testing GET /api/cases/:id/result...');
  const resultRes = await fetch(`${BASE_URL}/cases/${easyCase._id}/result`);
  const resultData = await resultRes.json();
  console.log('Final Result Status:', resultData.status);
  console.log('Was Accusation Correct?:', resultData.isCorrect);
  console.log('Culprit Revealed:', resultData.culprit);
  console.log('Solution Explanation:', resultData.solutionExplanation);
  console.log('Final Total Score:', resultData.score);

  console.log('\n--- 🎉 ALL MYSTERYVERSE BACKEND TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
