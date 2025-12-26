#!/usr/bin/env node
/**
 * Automated QA Test Suite
 * Runs all automated tests that can be verified objectively
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🔍 Automated QA Test Suite\n')
console.log('=' .repeat(50))

const results = {
  passed: [],
  failed: [],
  warnings: []
}

function test(name, testFn) {
  try {
    const result = testFn()
    if (result === true || (result && result.passed)) {
      results.passed.push(name)
      console.log(`✅ ${name}`)
      return true
    } else {
      results.failed.push(name)
      console.log(`❌ ${name}`)
      if (result && result.message) console.log(`   ${result.message}`)
      return false
    }
  } catch (error) {
    results.failed.push(name)
    console.log(`❌ ${name}: ${error.message}`)
    return false
  }
}

function warn(name, message) {
  results.warnings.push({ name, message })
  console.log(`⚠️  ${name}: ${message}`)
}

// Test 1: Service Model Exists
test('Service Model File Exists', () => {
  return fs.existsSync('server/models/service.model.js')
})

// Test 2: Service Controller Exists
test('Service Controller File Exists', () => {
  return fs.existsSync('server/controllers/service.controller.js')
})

// Test 3: Service Routes Exist
test('Service Routes File Exists', () => {
  return fs.existsSync('server/routes/service.routes.js')
})

// Test 4: Service Model Structure
test('Service Model Has Required Fields', () => {
  const content = fs.readFileSync('server/models/service.model.js', 'utf8')
  const required = ["title", "description", "price", "category", "deliveryTime", "revisions", "seller"]
  const missing = required.filter(field => !content.includes(`'${field}'`) && !content.includes(`"${field}"`))
  if (missing.length > 0) {
    return { passed: false, message: `Missing fields: ${missing.join(', ')}` }
  }
  return true
})

// Test 5: Service Model Has Service-Specific Fields
test('Service Model Has Service-Specific Fields', () => {
  const content = fs.readFileSync('server/models/service.model.js', 'utf8')
  const serviceFields = ["deliveryTime", "revisions", 'requirements', 'portfolio', 'tags', 'status', 'featured']
  const found = serviceFields.filter(field => content.includes(field))
  if (found.length < 5) {
    warn('Service Model', `Only ${found.length}/7 service-specific fields found`)
  }
  return found.length >= 5
})

// Test 6: Service Model Has Indexes
test('Service Model Has Indexes', () => {
  const content = fs.readFileSync('server/models/service.model.js', 'utf8')
  return content.includes('ServiceSchema.index')
})

// Test 7: Service Model Exports Correctly
test('Service Model Exports Correctly', () => {
  const content = fs.readFileSync('server/models/service.model.js', 'utf8')
  return content.includes('export default')
})

// Test 8: Service Controller Has CRUD Methods
test('Service Controller Has CRUD Methods', () => {
  const content = fs.readFileSync('server/controllers/service.controller.js', 'utf8')
  const methods = ['create', 'read', 'update', 'remove', 'list']
  const found = methods.filter(method => content.includes(`${method}`))
  return found.length >= 4
})

// Test 9: Service Routes Mounted
test('Service Routes Mounted in Express', () => {
  const content = fs.readFileSync('server/express.js', 'utf8')
  return content.includes('serviceRoutes') && content.includes('app.use')
})

// Test 10: Service Routes Imported
test('Service Routes Imported in Express', () => {
  const content = fs.readFileSync('server/express.js', 'utf8')
  return content.includes('import serviceRoutes') || content.includes('require.*service.routes')
})

// Test 11: Syntax Validation - Service Model
test('Service Model Syntax Valid', () => {
  try {
    execSync('node -c server/models/service.model.js', { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
})

// Test 12: Syntax Validation - Service Controller
test('Service Controller Syntax Valid', () => {
  try {
    execSync('node -c server/controllers/service.controller.js', { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
})

// Test 13: Syntax Validation - Service Routes
test('Service Routes Syntax Valid', () => {
  try {
    execSync('node -c server/routes/service.routes.js', { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
})

// Test 14: Service Model No Quantity Field
test('Service Model Does Not Have Quantity Field', () => {
  const content = fs.readFileSync('server/models/service.model.js', 'utf8')
  return !content.includes('quantity')
})

// Test 15: Service Model Has Seller Not Shop
test('Service Model Uses Seller Not Shop', () => {
  const content = fs.readFileSync('server/models/service.model.js', 'utf8')
  return content.includes("seller") && !content.includes('shop:')
})

console.log('\n' + '='.repeat(50))
console.log('\n📊 Test Results Summary:')
console.log(`✅ Passed: ${results.passed.length}`)
console.log(`❌ Failed: ${results.failed.length}`)
console.log(`⚠️  Warnings: ${results.warnings.length}`)

if (results.failed.length > 0) {
  console.log('\n❌ Failed Tests:')
  results.failed.forEach(test => console.log(`   - ${test}`))
}

if (results.warnings.length > 0) {
  console.log('\n⚠️  Warnings:')
  results.warnings.forEach(w => console.log(`   - ${w.name}: ${w.message}`))
}

const allPassed = results.failed.length === 0
console.log(`\n${allPassed ? '✅' : '❌'} Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`)

process.exit(allPassed ? 0 : 1)

