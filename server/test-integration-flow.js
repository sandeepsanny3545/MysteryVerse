import dotenv from 'dotenv';
dotenv.config();

const API_BASE = 'http://localhost:5000/api';

async function testFullFlow() {
  console.log('===========================================================');
  console.log('🕵️‍♂️ FULL END-TO-END FRONTEND-BACKEND INTEGRATION TEST');
  console.log('===========================================================\n');

  // Step 1: Check server connectivity
  console.log('1. Checking Server Health...');
  const healthRes = await fetch(`${API_BASE}/health`);
  if (!healthRes.ok) throw new Error('Backend server is not running on localhost:5000');
  const health = await healthRes.json();
  console.log('   ✅ Server is Healthy:', health.service, '\n');

  // Step 2: Create Mystery (Home -> Create Mystery)
  console.log('2. [Create Mystery] Calling POST /api/cases with Gemini API...');
  const startTime = Date.now();
  const createRes = await fetch(`${API_BASE}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      premise: 'During an exclusive midnight masquerade, the host Lord Sterling was found poisoned in his locked study.',
      difficulty: 'Easy'
    })
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create case: ${errText}`);
  }

  const { case: newCase } = await createRes.json();
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`   ✅ Mystery Generated & Saved to MongoDB Atlas in ${elapsed}s`);
  console.log(`   • Case ID: ${newCase._id}`);
  console.log(`   • Title: "${newCase.title}"`);
  console.log(`   • Suspects Count: ${newCase.suspects.length}`);
  console.log(`   • Clues Count: ${newCase.clues.length}`);
  console.log(`   • Hints Count: ${newCase.hints.length}`);
  console.log(`   • Security Check: culpritId is ${newCase.culpritId ? 'EXPOSED ❌' : 'SHIELDED ✅'}\n`);

  // Step 3: Investigation Room (Fetch case without solution)
  console.log('3. [Investigation Room] Fetching case details via GET /api/cases/:id...');
  const getRes = await fetch(`${API_BASE}/cases/${newCase._id}`);
  const { case: fetchedCase } = await getRes.json();
  console.log(`   ✅ Case Retrieved: "${fetchedCase.title}"`);
  console.log(`   • Clues available to inspect: ${fetchedCase.clues.map(c => c.title).join(', ')}\n`);

  // Step 4: Discover Clues
  const targetClueId = fetchedCase.clues[0].id;
  console.log(`4. [Discover Clues] Inspecting clue "${targetClueId}" via POST /api/cases/:id/clues/:clueId/discover...`);
  const clueRes = await fetch(`${API_BASE}/cases/${newCase._id}/clues/${targetClueId}/discover`, {
    method: 'POST'
  });
  const clueData = await clueRes.json();
  console.log(`   ✅ Clue Discovered: "${clueData.clue.title}"`);
  console.log(`   • Discovered Clues Array in DB: [${clueData.discoveredClues.join(', ')}]\n`);

  // Step 5: Request Hint
  console.log('5. [Request Hint] Unlocking Inspector Hint via POST /api/cases/:id/hints...');
  const hintRes = await fetch(`${API_BASE}/cases/${newCase._id}/hints`, {
    method: 'POST'
  });
  const hintData = await hintRes.json();
  console.log(`   ✅ Hint Unlocked: "${hintData.hint.title}"`);
  console.log(`   • Hint Content: "${hintData.hint.content}"`);
  console.log(`   • Hints Used Count: ${hintData.hintsUsed.length}\n`);

  // Step 6: Accusation Submission
  const accusedSuspect = fetchedCase.suspects[0];
  console.log(`6. [Accusation] Indicting "${accusedSuspect.name}" via POST /api/cases/:id/accuse...`);
  const accuseRes = await fetch(`${API_BASE}/cases/${newCase._id}/accuse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accusedId: accusedSuspect.id,
      motive: 'Financial gain and debt concealment',
      reasoning: 'The physical residue on the safe and broken alibis prove guilt.'
    })
  });
  const accuseData = await accuseRes.json();
  console.log('   ✅ Accusation Processed by Backend:');
  console.log(`   • Verdict: ${accuseData.isCorrect ? 'GUILTY ✅' : 'NOT GUILTY / FALSE ACCUSATION ❌'}`);
  console.log(`   • Final Score: ${accuseData.score} PTS`);
  console.log('   • Score Breakdown:', accuseData.scoreBreakdown, '\n');

  // Step 7: Results & Post-Mortem (Only available after accusation)
  console.log('7. [Results] Fetching complete resolution via GET /api/cases/:id/result...');
  const resultRes = await fetch(`${API_BASE}/cases/${newCase._id}/result`);
  const finalResult = await resultRes.json();
  console.log('   ✅ Case Resolution Retrieved:');
  console.log(`   • Culprit Unmasked: ${finalResult.culprit.name} (${finalResult.culprit.role})`);
  console.log(`   • Solution Narrative: ${finalResult.solutionExplanation.substring(0, 150)}...`);
  console.log(`   • Accuracy: ${finalResult.isCorrect ? '100%' : '0%'}`);
  console.log(`   • Total Clues Gathered: ${finalResult.cluesDiscovered}/${finalResult.totalClues}`);
  console.log(`   • Total Hints Used: ${finalResult.hintsUsed}`);

  console.log('\n===========================================================');
  console.log('🎉 FULL INTEGRATION FLOW TEST PASSED WITH ZERO ERRORS!');
  console.log('===========================================================');
}

testFullFlow().catch(err => {
  console.error('\n❌ Integration Test Failed:', err);
  process.exit(1);
});
