#!/usr/bin/env node

/**
 * Test File Verification Script
 * Checks that all test files follow the required structure and best practices
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testDir = path.join(__dirname, 'tests');

function checkTestFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const filename = path.basename(filePath);
  
  console.log(`\n📋 Checking: ${filename}`);
  
  const checks = {
    hasSpecComment: content.includes('// spec: specs/eap-test-plan.md'),
    hasPlaywrightImport: content.includes("import { test, expect } from '@playwright/test'"),
    usesRoleBasedLocators: !content.includes('page.locator(') || content.includes('page.getByRole(') || content.includes('page.getByText('),
    usesWebFirstAssertions: content.includes('expect(') && content.includes('.toBe'),
    hasTestDescribe: content.includes('test.describe('),
    hasIndividualTests: (content.match(/test\(/g) || []).length > 0,
    hasBeforeEachForAuth: content.includes('test.beforeEach') || !filename.includes('auth') || content.includes('login'),
    followsNaming: filename.endsWith('.spec.ts'),
  };
  
  let passed = 0;
  let total = 0;
  
  for (const [checkName, checkResult] of Object.entries(checks)) {
    total++;
    if (checkResult) {
      passed++;
      console.log(`  ✅ ${checkName}`);
    } else {
      console.log(`  ❌ ${checkName}`);
    }
  }
  
  return { passed, total };
}

function main() {
  console.log('🔍 Verifying Playwright Test Files');
  console.log('==================================\n');
  
  const testFiles = [];
  
  // Find all test files
  function findTestFiles(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findTestFiles(fullPath);
      } else if (item.endsWith('.spec.ts')) {
        testFiles.push(fullPath);
      }
    }
  }
  
  findTestFiles(testDir);
  
  console.log(`Found ${testFiles.length} test files:\n`);
  
  let totalPassed = 0;
  let totalChecks = 0;
  
  for (const testFile of testFiles) {
    const relativePath = path.relative(__dirname, testFile);
    const { passed, total } = checkTestFile(testFile);
    totalPassed += passed;
    totalChecks += total;
  }
  
  console.log('\n==================================');
  console.log('📊 Verification Results');
  console.log('==================================');
  console.log(`Total Test Files: ${testFiles.length}`);
  console.log(`Checks Passed: ${totalPassed}/${totalChecks} (${Math.round((totalPassed / totalChecks) * 100)}%)`);
  
  if (totalPassed === totalChecks) {
    console.log('\n🎉 All test files follow best practices!');
  } else {
    console.log('\n⚠️  Some test files need attention.');
    process.exit(1);
  }
}

  if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
  }
  
  export { checkTestFile };