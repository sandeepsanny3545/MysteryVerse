import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
import mongoose from 'mongoose';
import { generateMysteryCase } from './src/services/geminiService.js';
import Case from './src/models/Case.js';
import { calculateCaseScore } from './src/services/scoringService.js';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

const results = {
  check1_generation: false,
  check2_correctAccusation: false,
  check3_incorrectAccusation: false,
  check4_hintsAndCluesProtection: false,
  check5_hiddenCulpritAndSolution: false,
  check6_frontendNoMockFallback: false,
  check7_gitSecretsExcluded: false,
  check8_servicesRunning: false,
  details: {}
};

async function runPreDeploymentChecks() {
  console.log('================================================================');
  console.log('       MYSTERYVERSE PRE-DEPLOYMENT COMPREHENSIVE VERIFICATION   ');
  console.log('================================================================\n');

  try {
    // -------------------------------------------------------------
    // CHECK 8 (Part A): Confirm backend health and frontend HTTP
    // -------------------------------------------------------------
    console.log('▶ [CHECK 8] Confirming both Frontend and Backend start correctly...');
    const healthRes = await fetch(`${BASE_URL}/health`);
    if (!healthRes.ok) throw new Error(`Backend health returned status ${healthRes.status}`);
    const healthJson = await healthRes.json();
    console.log(`  ✓ Backend Health OK: status=${healthJson.status}, db=${healthJson.database}`);

    const feRes = await fetch(FRONTEND_URL);
    if (!feRes.ok) throw new Error(`Frontend returned status ${feRes.status}`);
    const feHtml = await feRes.text();
    if (!feHtml.includes('root')) throw new Error('Frontend HTML does not include #root');
    console.log(`  ✓ Frontend Dev Server OK: HTTP 200, length=${feHtml.length} bytes`);

    results.check8_servicesRunning = true;
    results.details.check8 = {
      backend: healthJson,
      frontendStatus: feRes.status
    };

    // Connect to database directly for deep assertions
    await mongoose.connect(process.env.MONGODB_URI);

    // -------------------------------------------------------------
    // CHECK 1: Test Easy, Medium and Hard mystery generation
    // -------------------------------------------------------------
    console.log('\n▶ [CHECK 1] Testing Easy, Medium and Hard mystery generation via Gemini...');
    
    // Easy
    console.log('  Testing Easy mystery generation...');
    const easyData = await generateMysteryCase({
      premise: 'The Stolen Diamond: Lady Pembroke diamond missing from locked display.',
      difficulty: 'Easy'
    });
    console.log(`    ✓ Easy title: "${easyData.title}" | Suspects: ${easyData.suspects.length} (expected 3) | Clues: ${easyData.clues.length} (expected 5) | Hints: ${easyData.hints.length} (expected 2)`);
    if (easyData.suspects.length !== 3 || easyData.clues.length !== 5 || easyData.hints.length !== 2) {
      throw new Error(`Easy mystery constraints failed: suspects=${easyData.suspects.length}, clues=${easyData.clues.length}, hints=${easyData.hints.length}`);
    }

    // Medium
    console.log('  Testing Medium mystery generation...');
    const medData = await generateMysteryCase({
      premise: 'The Gallery Shadow: Art restorer found poisoned in vault.',
      difficulty: 'Medium'
    });
    console.log(`    ✓ Medium title: "${medData.title}" | Suspects: ${medData.suspects.length} (expected 4) | Clues: ${medData.clues.length} (expected 7) | Hints: ${medData.hints.length} (expected 3)`);
    if (medData.suspects.length !== 4 || medData.clues.length !== 7 || medData.hints.length !== 3) {
      throw new Error(`Medium mystery constraints failed: suspects=${medData.suspects.length}, clues=${medData.clues.length}, hints=${medData.hints.length}`);
    }

    // Hard
    console.log('  Testing Hard mystery generation...');
    const hardData = await generateMysteryCase({
      premise: 'The Quantum Syndicate: High-frequency trading architect vanished from server room.',
      difficulty: 'Hard'
    });
    console.log(`    ✓ Hard title: "${hardData.title}" | Suspects: ${hardData.suspects.length} (expected 5) | Clues: ${hardData.clues.length} (expected 9) | Hints: ${hardData.hints.length} (expected 3)`);
    if (hardData.suspects.length !== 5 || hardData.clues.length !== 9 || hardData.hints.length !== 3) {
      throw new Error(`Hard mystery constraints failed: suspects=${hardData.suspects.length}, clues=${hardData.clues.length}, hints=${hardData.hints.length}`);
    }

    results.check1_generation = true;
    results.details.check1 = {
      easy: { title: easyData.title, suspects: easyData.suspects.length, clues: easyData.clues.length, hints: easyData.hints.length },
      medium: { title: medData.title, suspects: medData.suspects.length, clues: medData.clues.length, hints: medData.hints.length },
      hard: { title: hardData.title, suspects: hardData.suspects.length, clues: hardData.clues.length, hints: hardData.hints.length }
    };

    // -------------------------------------------------------------
    // CHECK 5: Verify culprit and solution remain hidden before accusation
    // -------------------------------------------------------------
    console.log('\n▶ [CHECK 5] Verifying culprit and solution remain hidden before accusation...');
    
    // Save Easy mystery to DB to test endpoints
    const testCase = await Case.create({
      ...easyData,
      premise: easyData.premise || 'The Stolen Diamond: Lady Pembroke diamond missing from locked display.',
      difficulty: 'Easy',
      status: 'active'
    });
    const caseId = testCase._id.toString();

    // 1. GET /api/cases/:id
    const getRes = await fetch(`${BASE_URL}/cases/${caseId}`);
    const getJson = await getRes.json();
    const fetchedCase = getJson.case;

    const hasCulpritInPublicCase = 'culpritId' in fetchedCase || fetchedCase.culpritId !== undefined;
    const hasSolutionInPublicCase = 'solutionExplanation' in fetchedCase || fetchedCase.solutionExplanation !== undefined;

    console.log(`  Checking GET /api/cases/:id:`);
    console.log(`    culpritId exposed in public view: ${hasCulpritInPublicCase ? 'FAIL' : 'NO (HIDDEN)'}`);
    console.log(`    solutionExplanation exposed in public view: ${hasSolutionInPublicCase ? 'FAIL' : 'NO (HIDDEN)'}`);

    // Check suspect objects don't leak guilt
    const suspectLeaks = fetchedCase.suspects.some(s => s.isCulprit !== undefined || s.isGuilty !== undefined);
    console.log(`    Suspect objects leak guilt: ${suspectLeaks ? 'FAIL' : 'NO (SAFE)'}`);

    // 2. GET /api/cases/:id/result BEFORE accusation
    const prematureResultRes = await fetch(`${BASE_URL}/cases/${caseId}/result`);
    console.log(`  Checking GET /api/cases/:id/result before accusation:`);
    console.log(`    HTTP status returned: ${prematureResultRes.status} (expected 400 Bad Request)`);
    const prematureResultJson = await prematureResultRes.json();
    console.log(`    Rejection message: "${prematureResultJson.error}"`);

    if (hasCulpritInPublicCase || hasSolutionInPublicCase || suspectLeaks || prematureResultRes.status !== 400) {
      throw new Error('Check 5 failed: Culprit or solution leaked before accusation!');
    }
    results.check5_hiddenCulpritAndSolution = true;
    results.details.check5 = {
      culpritHidden: !hasCulpritInPublicCase,
      solutionHidden: !hasSolutionInPublicCase,
      prematureResultRejectedWith400: prematureResultRes.status === 400
    };

    // -------------------------------------------------------------
    // CHECK 4: Verify hints cannot be reused and clues cannot be repeatedly rewarded
    // -------------------------------------------------------------
    console.log('\n▶ [CHECK 4] Verifying hints cannot be reused & clues cannot be repeatedly rewarded...');

    const clue1Id = testCase.clues[0].id;
    // Discover clue 1 first time
    const disc1Res = await fetch(`${BASE_URL}/cases/${caseId}/clues/${clue1Id}/discover`, { method: 'POST' });
    const disc1Json = await disc1Res.json();
    console.log(`  First discovery of clue #${clue1Id}: isNewDiscovery = ${disc1Json.isNewDiscovery}, discoveredCount = ${disc1Json.discoveredClues.length}`);

    // Discover clue 1 second time (DUPLICATE)
    const disc2Res = await fetch(`${BASE_URL}/cases/${caseId}/clues/${clue1Id}/discover`, { method: 'POST' });
    const disc2Json = await disc2Res.json();
    console.log(`  Second discovery of clue #${clue1Id}: isNewDiscovery = ${disc2Json.isNewDiscovery}, discoveredCount = ${disc2Json.discoveredClues.length}`);

    if (disc1Json.isNewDiscovery !== true || disc2Json.isNewDiscovery !== false || disc2Json.discoveredClues.length !== 1) {
      throw new Error('Check 4 failed: Duplicate clue discovery allowed or rewarded twice!');
    }

    // Discover clue 2 (unique)
    const clue2Id = testCase.clues[1].id;
    const disc3Res = await fetch(`${BASE_URL}/cases/${caseId}/clues/${clue2Id}/discover`, { method: 'POST' });
    const disc3Json = await disc3Res.json();
    console.log(`  Discovery of clue #${clue2Id}: isNewDiscovery = ${disc3Json.isNewDiscovery}, discoveredCount = ${disc3Json.discoveredClues.length}`);

    // Hints Exhaustion Test: Easy has 2 hints
    // Hint 1
    const hint1Res = await fetch(`${BASE_URL}/cases/${caseId}/hints`, { method: 'POST' });
    const hint1Json = await hint1Res.json();
    console.log(`  Hint Request 1: returned hint #${hint1Json.hint?.id}, hintsUsed = [${hint1Json.hintsUsed.join(', ')}]`);

    // Hint 2
    const hint2Res = await fetch(`${BASE_URL}/cases/${caseId}/hints`, { method: 'POST' });
    const hint2Json = await hint2Res.json();
    console.log(`  Hint Request 2: returned hint #${hint2Json.hint?.id}, hintsUsed = [${hint2Json.hintsUsed.join(', ')}]`);

    // Hint 3 (Exhausted - should fail with 400)
    const hint3Res = await fetch(`${BASE_URL}/cases/${caseId}/hints`, { method: 'POST' });
    const hint3Json = await hint3Res.json();
    console.log(`  Hint Request 3 (exceeded): HTTP ${hint3Res.status}, error message = "${hint3Json.error}"`);

    if (hint1Json.hint?.id !== 1 || hint2Json.hint?.id !== 2 || hint3Res.status !== 400) {
      throw new Error('Check 4 failed: Hints could be reused or requested beyond total available!');
    }

    results.check4_hintsAndCluesProtection = true;
    results.details.check4 = {
      duplicateCluePrevented: true,
      hintsExhaustionRejectedWith400: true,
      uniqueCluesCount: disc3Json.discoveredClues.length,
      hintsUsed: hint2Json.hintsUsed
    };

    // -------------------------------------------------------------
    // CHECK 2: Test a correct accusation and verify the correct score
    // -------------------------------------------------------------
    console.log('\n▶ [CHECK 2] Testing a correct accusation and exact score verification...');
    
    // For testCase (Easy):
    // Base score: 100
    // Clues discovered: 2 (+10)
    // Hints used: 2 (-20)
    // Expected score: 100 + (2 * 5) - (2 * 10) = 100 + 10 - 20 = 90
    const trueCulpritId = testCase.culpritId;
    console.log(`  Submitting accusation for true culprit (ID: ${trueCulpritId})...`);

    const correctAccuseRes = await fetch(`${BASE_URL}/cases/${caseId}/accuse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accusedId: trueCulpritId,
        motive: 'Financial embezzlement uncovered by the victim.',
        reasoning: 'Fingerprints and timetable inconsistencies place suspect at scene.'
      })
    });
    const correctAccuseJson = await correctAccuseRes.json();

    console.log(`  Accusation Result:`);
    console.log(`    isCorrect: ${correctAccuseJson.isCorrect} (expected true)`);
    console.log(`    score: ${correctAccuseJson.score} (expected 90)`);
    console.log(`    scoreBreakdown: base=${correctAccuseJson.scoreBreakdown?.basePoints}, clues=+${correctAccuseJson.scoreBreakdown?.clueBonus}, hints=-${correctAccuseJson.scoreBreakdown?.hintPenalty}, total=${correctAccuseJson.scoreBreakdown?.totalScore}`);

    if (correctAccuseJson.isCorrect !== true || correctAccuseJson.score !== 90) {
      throw new Error(`Check 2 failed: Expected isCorrect=true and score=90, got isCorrect=${correctAccuseJson.isCorrect}, score=${correctAccuseJson.score}`);
    }

    // Now verify GET /api/cases/:id/result AFTER accusation
    const resultRes = await fetch(`${BASE_URL}/cases/${caseId}/result`);
    const resultJson = await resultRes.json();
    console.log(`  Verifying revealed solution via GET /api/cases/:id/result:`);
    console.log(`    Culprit revealed: "${resultJson.culprit?.name}" (${resultJson.culprit?.role})`);
    console.log(`    Solution preview: "${resultJson.solutionExplanation?.slice(0, 75)}..."`);

    if (!resultJson.culprit || !resultJson.solutionExplanation) {
      throw new Error('Check 2 failed: Result endpoint did not reveal culprit and solution explanation after accusation!');
    }

    results.check2_correctAccusation = true;
    results.details.check2 = {
      isCorrect: correctAccuseJson.isCorrect,
      score: correctAccuseJson.score,
      scoreBreakdown: correctAccuseJson.scoreBreakdown,
      solutionRevealed: Boolean(resultJson.solutionExplanation)
    };

    // -------------------------------------------------------------
    // CHECK 3: Test an incorrect accusation
    // -------------------------------------------------------------
    console.log('\n▶ [CHECK 3] Testing an incorrect accusation and score verification...');
    
    // Create another case for Medium difficulty
    const testCase2 = await Case.create({
      ...medData,
      premise: medData.premise || 'The Gallery Shadow: Art restorer found poisoned in vault.',
      difficulty: 'Medium',
      status: 'active'
    });
    const caseId2 = testCase2._id.toString();

    // Discover 3 clues on testCase2
    await fetch(`${BASE_URL}/cases/${caseId2}/clues/${testCase2.clues[0].id}/discover`, { method: 'POST' });
    await fetch(`${BASE_URL}/cases/${caseId2}/clues/${testCase2.clues[1].id}/discover`, { method: 'POST' });
    await fetch(`${BASE_URL}/cases/${caseId2}/clues/${testCase2.clues[2].id}/discover`, { method: 'POST' });
    // Request 1 hint
    await fetch(`${BASE_URL}/cases/${caseId2}/hints`, { method: 'POST' });

    // Pick an INNOCENT suspect
    const innocentSuspect = testCase2.suspects.find(s => s.id !== testCase2.culpritId);
    console.log(`  Submitting accusation for innocent suspect (ID: ${innocentSuspect.id}, Name: ${innocentSuspect.name})...`);

    // Expected score for incorrect accusation:
    // Base: 0
    // Clues: 3 * 5 = +15
    // Hints: 1 * 10 = -10
    // Expected score: max(0, 0 + 15 - 10) = 5
    const wrongAccuseRes = await fetch(`${BASE_URL}/cases/${caseId2}/accuse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        accusedId: innocentSuspect.id,
        motive: 'Erroneous assumption based on behavioral stress.',
        reasoning: 'Suspect appeared nervous during interrogation.'
      })
    });
    const wrongAccuseJson = await wrongAccuseRes.json();

    console.log(`  Accusation Result:`);
    console.log(`    isCorrect: ${wrongAccuseJson.isCorrect} (expected false)`);
    console.log(`    score: ${wrongAccuseJson.score} (expected 5)`);
    console.log(`    scoreBreakdown: base=${wrongAccuseJson.scoreBreakdown?.basePoints}, clues=+${wrongAccuseJson.scoreBreakdown?.clueBonus}, hints=-${wrongAccuseJson.scoreBreakdown?.hintPenalty}, total=${wrongAccuseJson.scoreBreakdown?.totalScore}`);

    if (wrongAccuseJson.isCorrect !== false || wrongAccuseJson.score !== 5 || wrongAccuseJson.scoreBreakdown.basePoints !== 0) {
      throw new Error(`Check 3 failed: Expected isCorrect=false and score=5 with basePoints=0, got score=${wrongAccuseJson.score}`);
    }

    results.check3_incorrectAccusation = true;
    results.details.check3 = {
      isCorrect: wrongAccuseJson.isCorrect,
      score: wrongAccuseJson.score,
      scoreBreakdown: wrongAccuseJson.scoreBreakdown
    };

    // -------------------------------------------------------------
    // CHECK 6: Check frontend does not silently fall back to mock data
    // -------------------------------------------------------------
    console.log('\n▶ [CHECK 6] Checking that frontend does not silently fall back to mock data...');
    const contextFilePath = path.resolve('../client/src/context/MysteryContext.jsx');
    const contextContent = fs.readFileSync(contextFilePath, 'utf8');

    // 1. Verify no fallback assignment to mock cases
    const hasMockCaseAssignment = /setCurrentMystery\s*\(\s*(mockCases|mockMystery|DEFAULT_CASE|sampleCases)/i.test(contextContent);
    console.log(`  Mock case assignment in MysteryContext: ${hasMockCaseAssignment ? 'FOUND (FAIL)' : 'NONE (PASS)'}`);

    // 2. Verify createMystery throws/rejects on failure
    const hasCatchRethrow = contextContent.includes('throw err') && contextContent.includes('setApiError');
    console.log(`  createMystery sets apiError and rethrows exception: ${hasCatchRethrow ? 'CONFIRMED (PASS)' : 'FAIL'}`);

    if (hasMockCaseAssignment || !hasCatchRethrow) {
      throw new Error('Check 6 failed: Frontend has silent mock data fallback or suppresses backend errors!');
    }

    results.check6_frontendNoMockFallback = true;
    results.details.check6 = {
      noMockCaseFallback: !hasMockCaseAssignment,
      explicitErrorThrow: hasCatchRethrow
    };

    // -------------------------------------------------------------
    // CHECK 7: Verify all environment files and secrets are excluded from Git
    // -------------------------------------------------------------
    console.log('\n▶ [CHECK 7] Verifying all environment files and secrets are excluded from Git...');
    
    // Test git check-ignore on .env, server/.env, client/.env
    const gitCheckIgnoreOut = execSync('git check-ignore -v server/.env .env client/.env', { cwd: '..' }).toString();
    console.log(`  Git check-ignore output:\n${gitCheckIgnoreOut.trim().split('\n').map(l => '    ' + l).join('\n')}`);

    // Test git status --porcelain does NOT show .env
    const gitStatusOut = execSync('git status --porcelain', { cwd: '..' }).toString();
    const envInStatus = gitStatusOut.split('\n').some(line => line.includes('.env') && !line.includes('.env.example'));
    console.log(`  Any .env or secret file staged or untracked in Git status: ${envInStatus ? 'YES (FAIL)' : 'NONE (PASS)'}`);

    if (envInStatus) {
      throw new Error('Check 7 failed: A .env secret file is tracked or visible in git status!');
    }

    results.check7_gitSecretsExcluded = true;
    results.details.check7 = {
      serverEnvIgnored: gitCheckIgnoreOut.includes('server/.env'),
      rootEnvIgnored: gitCheckIgnoreOut.includes('.env'),
      clientEnvIgnored: gitCheckIgnoreOut.includes('client/.env'),
      noSecretsInGitStatus: !envInStatus
    };

    // Clean up test cases from DB
    await Case.deleteMany({ _id: { $in: [testCase._id, testCase2._id] } });
    console.log('\n  (Cleaned up temporary test cases from Atlas database)');

    // -------------------------------------------------------------
    // FINAL SUMMARY
    // -------------------------------------------------------------
    console.log('\n================================================================');
    console.log('              ALL 8 PRE-DEPLOYMENT CHECKS PASSED                ');
    console.log('================================================================');
    console.log(JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('\n❌ PRE-DEPLOYMENT CHECK FAILED:', err.message);
    console.error(err.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

runPreDeploymentChecks();
