import dotenv from 'dotenv';
dotenv.config();

import dns from 'node:dns';
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

import mongoose from 'mongoose';
import { generateMysteryCase, GeminiMysteryResponseSchema } from './src/services/geminiService.js';

function maskString(str) {
  if (!str) return '[NOT SET]';
  if (str.length <= 8) return '***';
  return str.slice(0, 4) + '...' + str.slice(-4);
}

function maskMongoUri(uri) {
  if (!uri) return '[NOT SET]';
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
}

async function runVerification() {
  console.log('======================================================');
  console.log('🕵️‍♂️ MYSTERYVERSE BACKEND VERIFICATION');
  console.log('======================================================\n');

  // 1. Verify Dotenv Loading
  console.log('▶ STEP 1: Verifying dotenv configuration...');
  const mongoUri = process.env.MONGODB_URI;
  const geminiKey = process.env.GEMINI_API_KEY;
  const geminiModel = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const port = process.env.PORT || 5000;

  console.log(`  • PORT: ${port}`);
  console.log(`  • MONGODB_URI: ${maskMongoUri(mongoUri)} [Loaded: ${Boolean(mongoUri)}]`);
  console.log(`  • GEMINI_API_KEY: ${maskString(geminiKey)} [Loaded: ${Boolean(geminiKey)}]`);
  console.log(`  • GEMINI_MODEL: ${geminiModel}`);

  if (!mongoUri || !geminiKey) {
    throw new Error('Missing MONGODB_URI or GEMINI_API_KEY in server/.env');
  }
  console.log('  ✅ Step 1 Passed: Environment variables loaded successfully.\n');

  // 2. Test MongoDB Atlas Connection
  console.log('▶ STEP 2: Testing MongoDB Atlas Connection...');
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    console.log(`  • Mongoose ReadyState: ${mongoose.connection.readyState} (1 = Connected)`);
    console.log(`  • Host: ${mongoose.connection.host}`);
    console.log(`  • Database Name: ${mongoose.connection.name || 'default'}`);
    console.log('  ✅ Step 2 Passed: Connected to MongoDB Atlas successfully.\n');
  } catch (err) {
    console.error(`  ❌ Step 2 Failed: MongoDB Atlas connection error: ${err.message}`);
    throw err;
  }

  // 3, 4, 5. Generate Easy, Medium, Hard using actual Gemini API & Verify Zod
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const generatedResults = [];

  for (const diff of difficulties) {
    console.log(`▶ STEP 3-5: Generating "${diff}" Mystery with Gemini API...`);
    const startTime = Date.now();

    const mystery = await generateMysteryCase({
      premise: `A high-profile locked-room mystery on a luxury train stranded in a blizzard (${diff} difficulty).`,
      difficulty: diff
    });

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`  • Generated in ${elapsed}s`);
    console.log(`  • Title: "${mystery.title}"`);
    console.log(`  • Suspects Count: ${mystery.suspects.length}`);
    console.log(`  • Clues Count: ${mystery.clues.length}`);
    console.log(`  • Hints Count: ${mystery.hints.length}`);
    console.log(`  • Culprit ID: ${mystery.culpritId}`);
    console.log(`  • Solution Explanation: ${mystery.solutionExplanation.substring(0, 100)}...`);

    // Strictly re-validate against Zod schema
    const zodValidation = GeminiMysteryResponseSchema.safeParse(mystery);
    if (!zodValidation.success) {
      console.error(`  ❌ Zod Validation Failed for ${diff}:`, zodValidation.error.format());
      throw new Error(`Zod validation failed for ${diff}`);
    }
    console.log(`  ✅ Zod Schema Validation: PASSED for ${diff}\n`);

    generatedResults.push({
      difficulty: diff,
      title: mystery.title,
      suspects: mystery.suspects.length,
      clues: mystery.clues.length,
      hints: mystery.hints.length,
      culpritId: mystery.culpritId
    });
  }

  console.log('======================================================');
  console.log('🎉 ALL TESTS COMPLETED & VERIFIED SUCCESSFULLY!');
  console.log('======================================================');
  console.table(generatedResults);

  await mongoose.disconnect();
  process.exit(0);
}

runVerification().catch(err => {
  console.error('\n❌ Verification Failed:', err);
  process.exit(1);
});
