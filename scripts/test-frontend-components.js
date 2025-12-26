#!/usr/bin/env node
/**
 * Automated test for frontend service components
 */

const fs = require('fs')
const path = require('path')

console.log('🧪 Testing Frontend Service Components...\n')

const results = { passed: [], failed: [] }

function test(name, condition) {
  if (condition) {
    results.passed.push(name)
    console.log(`✅ ${name}`)
  } else {
    results.failed.push(name)
    console.log(`❌ ${name}`)
  }
}

// Test 1: Service directory exists
test('Service Components Directory Exists', fs.existsSync('client/service'))

// Test 2: API file exists
test('Service API File Exists', fs.existsSync('client/service/api-service.js'))

// Test 3: Services component exists
test('Services Component Exists', fs.existsSync('client/service/Services.js'))

// Test 4: API file has service endpoints
if (fs.existsSync('client/service/api-service.js')) {
  const apiContent = fs.readFileSync('client/service/api-service.js', 'utf8')
  test('API Has Service Endpoints', apiContent.includes('/services'))
  test('API Has Create Method', apiContent.includes('create'))
  test('API Has List Method', apiContent.includes('list'))
  test('API Has Read Method', apiContent.includes('read'))
  test('API Has Update Method', apiContent.includes('update'))
  test('API Has Delete Method', apiContent.includes('remove') || apiContent.includes('delete'))
  test('API No Product References', !apiContent.includes('/products'))
}

// Test 5: Services component uses service terminology
if (fs.existsSync('client/service/Services.js')) {
  const servicesContent = fs.readFileSync('client/service/Services.js', 'utf8')
  test('Services Component Uses Service Terminology', servicesContent.includes('service'))
  test('Services Component No Product References', !servicesContent.includes('product') && !servicesContent.includes('Product'))
  test('Services Component Has Delivery Time', servicesContent.includes('deliveryTime'))
  test('Services Component Uses Title', servicesContent.includes('title') || servicesContent.includes('service.title'))
}

console.log('\n📊 Results:')
console.log(`✅ Passed: ${results.passed.length}`)
console.log(`❌ Failed: ${results.failed.length}`)

if (results.failed.length > 0) {
  console.log('\n❌ Failed Tests:')
  results.failed.forEach(t => console.log(`   - ${t}`))
}

process.exit(results.failed.length === 0 ? 0 : 1)

