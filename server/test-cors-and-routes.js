import assert from 'node:assert';

const BASE_URL = 'http://localhost:5000/api';

async function testCorsAndEndpoints() {
  console.log('Testing CORS & Preflight OPTIONS with deployed origins...\n');

  // Test 1: OPTIONS Preflight from Deployed Render Frontend
  console.log('▶ 1. Testing OPTIONS Preflight from https://mysteryverse-frontend.onrender.com');
  const preflightRes = await fetch(`${BASE_URL}/cases`, {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://mysteryverse-frontend.onrender.com',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'Content-Type'
    }
  });

  const allowOrigin = preflightRes.headers.get('access-control-allow-origin');
  const allowMethods = preflightRes.headers.get('access-control-allow-methods');
  const allowCredentials = preflightRes.headers.get('access-control-allow-credentials');

  console.log(`  Status: ${preflightRes.status}`);
  console.log(`  Access-Control-Allow-Origin: ${allowOrigin}`);
  console.log(`  Access-Control-Allow-Methods: ${allowMethods}`);
  console.log(`  Access-Control-Allow-Credentials: ${allowCredentials}`);

  assert.strictEqual(preflightRes.status, 200, 'Preflight should return 200 OK');
  assert.strictEqual(allowOrigin, 'https://mysteryverse-frontend.onrender.com', 'Allow-Origin must match request origin');
  assert.strictEqual(allowCredentials, 'true', 'Credentials must be allowed');
  assert.ok(allowMethods.includes('POST'), 'POST must be in allowed methods');
  console.log('  ✓ Preflight OPTIONS test passed!\n');

  // Test 2: GET Health Check with Render Origin
  console.log('▶ 2. Testing GET /api/health with Render Origin');
  const healthRes = await fetch(`${BASE_URL}/health`, {
    headers: {
      'Origin': 'https://mysteryverse-frontend.onrender.com'
    }
  });
  const healthJson = await healthRes.json();
  const healthOrigin = healthRes.headers.get('access-control-allow-origin');
  console.log(`  Status: ${healthRes.status}, Body:`, healthJson);
  console.log(`  Access-Control-Allow-Origin: ${healthOrigin}`);
  assert.strictEqual(healthOrigin, 'https://mysteryverse-frontend.onrender.com');
  console.log('  ✓ GET with Render Origin passed!\n');

  // Test 3: Localhost 5173 Development Access
  console.log('▶ 3. Testing Localhost Development Access (http://localhost:5173)');
  const localRes = await fetch(`${BASE_URL}/health`, {
    headers: {
      'Origin': 'http://localhost:5173'
    }
  });
  const localOrigin = localRes.headers.get('access-control-allow-origin');
  console.log(`  Access-Control-Allow-Origin: ${localOrigin}`);
  assert.strictEqual(localOrigin, 'http://localhost:5173');
  console.log('  ✓ Localhost dev origin passed!\n');

  // Test 4: Any Onrender Subdomain Access
  console.log('▶ 4. Testing Any *.onrender.com Subdomain');
  const renderRes = await fetch(`${BASE_URL}/health`, {
    headers: {
      'Origin': 'https://custom-preview-123.onrender.com'
    }
  });
  const renderOrigin = renderRes.headers.get('access-control-allow-origin');
  console.log(`  Access-Control-Allow-Origin: ${renderOrigin}`);
  assert.strictEqual(renderOrigin, 'https://custom-preview-123.onrender.com');
  console.log('  ✓ Render wildcard subdomain passed!\n');

  console.log('====================================================');
  console.log('  ALL CORS & PREFLIGHT VERIFICATION CHECKS PASSED   ');
  console.log('====================================================');
}

testCorsAndEndpoints().catch(err => {
  console.error('CORS verification failed:', err);
  process.exit(1);
});
