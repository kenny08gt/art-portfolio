'use strict';
/**
 * Starts server.js with test credentials for Playwright.
 * Uses bcrypt rounds=1 so startup is fast.
 */
const bcrypt = require('bcryptjs');

async function main() {
  const hash = await bcrypt.hash('testadmin123', 1);
  process.env.PORT                 = process.env.TEST_PORT || '13081';
  process.env.ADMIN_PASSWORD_HASH  = hash;
  process.env.JWT_SECRET           = 'playwright_test_secret_do_not_use_in_prod';
  require('../server.js');
}

main().catch(err => { console.error(err); process.exit(1); });
