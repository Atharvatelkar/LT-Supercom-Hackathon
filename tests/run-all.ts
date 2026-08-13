import { runAuthTests } from "./auth.test";
import { runMultiTenancyTests } from "./multi-tenancy.test";

async function main() {
  console.log("==================================================");
  console.log("LT SUPERCOM — BACKEND & SECURITY TEST RUNNER");
  console.log("==================================================");

  try {
    await runAuthTests();
    await runMultiTenancyTests();
    console.log("==================================================");
    console.log("🎉 ALL TEST SUITES PASSED CLEANLY WITH 0 ERRORS!");
    console.log("==================================================");
    process.exit(0);
  } catch (err: any) {
    console.error("\n❌ TEST RUN FAILED:", err.message);
    process.exit(1);
  }
}

main();
