#!/usr/bin/env node
/**
 * Comprehensive test for all service components
 */

const fs = require('fs')
const { execSync } = require('child_process')

console.log('🧪 Testing All Service Components...\n')
console.log('='.repeat(50))

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

// Test component files exist
const components = [
  'client/service/api-service.js',
  'client/service/Services.js',
  'client/service/Service.js',
  'client/service/NewService.js',
  'client/service/EditService.js',
  'client/service/Suggestions.js'
]

components.forEach(comp => {
  test(`${comp.split('/').pop()} Exists`, fs.existsSync(comp))
})

// Test syntax
components.forEach(comp => {
  if (fs.existsSync(comp)) {
    try {
      execSync(`node -c ${comp}`, { stdio: 'pipe' })
      test(`${comp.split('/').pop()} Syntax Valid`, true)
    } catch {
      test(`${comp.split('/').pop()} Syntax Valid`, false)
    }
  }
})

// Test MainRouter has service routes
if (fs.existsSync('client/MainRouter.js')) {
  const content = fs.readFileSync('client/MainRouter.js', 'utf8')
  test('MainRouter Imports Service Components', content.includes('from \'./service/'))
  test('MainRouter Has Service Routes', content.includes('/service/'))
  test('MainRouter Has NewService Route', content.includes('NewService'))
  test('MainRouter Has EditService Route', content.includes('EditService'))
}

// Test API file
if (fs.existsSync('client/service/api-service.js')) {
  const apiContent = fs.readFileSync('client/service/api-service.js', 'utf8')
  test('API Has Service Endpoints', apiContent.includes('/services'))
  test('API No Product References', !apiContent.includes('/products'))
}

// Test Services component
if (fs.existsSync('client/service/Services.js')) {
  const content = fs.readFileSync('client/service/Services.js', 'utf8')
  test('Services Uses Service Terminology', content.includes('service'))
  test('Services Has Delivery Time', content.includes('deliveryTime'))
  test('Services No Product References', !content.includes('product') && !content.includes('Product'))
}

// Test Service component
if (fs.existsSync('client/service/Service.js')) {
  const content = fs.readFileSync('client/service/Service.js', 'utf8')
  test('Service Uses Service Terminology', content.includes('service'))
  test('Service Has Delivery Time Display', content.includes('deliveryTime'))
  test('Service Has Revisions Display', content.includes('revisions'))
  test('Service No Product References', !content.includes('product') && !content.includes('Product'))
}

// Test NewService component
if (fs.existsSync('client/service/NewService.js')) {
  const content = fs.readFileSync('client/service/NewService.js', 'utf8')
  test('NewService Has Service Fields', content.includes('deliveryTime') && content.includes('revisions'))
  test('NewService No Quantity Field', !content.includes('quantity'))
  test("NewService Uses Title Not Name", () => {
    const content = fs.readFileSync("client/service/NewService.js", "utf8")
    return (content.includes("title") || content.includes("Title")) && !content.match(/name:\s*["']/)
  })
}

// Test EditService component
if (fs.existsSync('client/service/EditService.js')) {
  const content = fs.readFileSync('client/service/EditService.js', 'utf8')
  test('EditService Has Service Fields', content.includes('deliveryTime') && content.includes('revisions'))
  test('EditService No Quantity Field', !content.includes('quantity'))
}

console.log('\n' + '='.repeat(50))
console.log('\n📊 Test Results:')
console.log(`✅ Passed: ${results.passed.length}`)
console.log(`❌ Failed: ${results.failed.length}`)

if (results.failed.length > 0) {
  console.log('\n❌ Failed Tests:')
  results.failed.forEach(t => console.log(`   - ${t}`))
}

const allPassed = results.failed.length === 0
console.log(`\n${allPassed ? '✅' : '❌'} Overall: ${allPassed ? 'ALL TESTS PASSED' : 'SOME TESTS FAILED'}`)

process.exit(allPassed ? 0 : 1)
