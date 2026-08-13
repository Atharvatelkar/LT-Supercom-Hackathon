export async function runSuite(suiteName: string, tests: Record<string, () => Promise<void> | void>) {
  console.log(`\n========================================`);
  console.log(`RUNNING TEST SUITE: ${suiteName}`);
  console.log(`========================================`);

  let passed = 0;
  let failed = 0;

  for (const [testName, fn] of Object.entries(tests)) {
    try {
      await fn();
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ FAIL: ${testName}`);
      console.error(`    ${err.message}`);
      if (err.stack) console.error(`    ${err.stack.split("\n")[1]}`);
      failed++;
    }
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  if (failed > 0) {
    throw new Error(`Suite ${suiteName} failed with ${failed} failing tests.`);
  }
}

export function assert(condition: any, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function assertThrows(fn: () => any, expectedCode?: string) {
  let threw = false;
  try {
    fn();
  } catch (e: any) {
    threw = true;
    if (expectedCode && e.code !== expectedCode && !e.message?.includes(expectedCode)) {
      throw new Error(`Expected error code ${expectedCode} but got ${e.code || e.message}`);
    }
  }
  if (!threw) {
    throw new Error("Expected function to throw an error, but it did not.");
  }
}

export async function assertAsyncThrows(fn: () => Promise<any>, expectedCode?: string) {
  let threw = false;
  try {
    await fn();
  } catch (e: any) {
    threw = true;
    if (expectedCode && e.code !== expectedCode && !e.message?.includes(expectedCode)) {
      throw new Error(`Expected error code ${expectedCode} but got ${e.code || e.message}`);
    }
  }
  if (!threw) {
    throw new Error("Expected async function to throw an error, but it did not.");
  }
}
