#!/usr/bin/env node
/**
 * Automated test for Service Model
 * Tests model validation and schema structure
 */

// Mock mongoose for testing
const mongoose = {
  Schema: class Schema {
    constructor(definition) {
      this.definition = definition
    }
    index() {} // Mock index method
  },
  model: (name, schema) => ({ name, schema })
}

// Test Service Model structure
function testServiceModel() {
  console.log('🧪 Testing Service Model...\n')
  
  const errors = []
  const warnings = []
  
  // Check if service.model.js exists
  const fs = require('fs')
  const path = require('path')
  const modelPath = path.join(__dirname, '../server/models/service.model.js')
  
  if (!fs.existsSync(modelPath)) {
    errors.push('❌ service.model.js file not found')
    return { errors, warnings, passed: false }
  }
  
  console.log('✅ Service model file exists')
  
  // Read and parse the model file
  const modelContent = fs.readFileSync(modelPath, 'utf8')
  
  // Check for required fields
  const requiredFields = [
    'title', 'description', 'price', 'category',
    'deliveryTime', 'revisions', 'seller'
  ]
  
  requiredFields.forEach(field => {
    if (modelContent.includes(`'${field}'`) || modelContent.includes(`"${field}"`)) {
      console.log(`✅ Field '${field}' found`)
    } else {
      errors.push(`❌ Required field '${field}' not found`)
    }
  })
  
  // Check for service-specific fields
  const serviceFields = ['deliveryTime', 'revisions', 'requirements', 'portfolio', 'tags', 'status', 'featured']
  serviceFields.forEach(field => {
    if (modelContent.includes(field)) {
      console.log(`✅ Service-specific field '${field}' found`)
    } else {
      warnings.push(`⚠️  Service field '${field}' not found`)
    }
  })
  
  // Check for indexes
  if (modelContent.includes('ServiceSchema.index')) {
    console.log('✅ Indexes defined')
  } else {
    warnings.push('⚠️  No indexes found (performance may be affected)')
  }
  
  // Check for validation
  if (modelContent.includes('required:') || modelContent.includes('required:')) {
    console.log('✅ Validation rules found')
  } else {
    warnings.push('⚠️  Limited validation rules')
  }
  
  // Check export
  if (modelContent.includes('export default') || modelContent.includes('module.exports')) {
    console.log('✅ Model exported correctly')
  } else {
    errors.push('❌ Model not exported')
  }
  
  console.log('\n📊 Test Results:')
  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ All checks passed!')
    return { errors, warnings, passed: true }
  }
  
  if (errors.length > 0) {
    console.log(`\n❌ Errors (${errors.length}):`)
    errors.forEach(err => console.log(`  ${err}`))
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  Warnings (${warnings.length}):`)
    warnings.forEach(warn => console.log(`  ${warn}`))
  }
  
  return { errors, warnings, passed: errors.length === 0 }
}

// Run tests
if (require.main === module) {
  const result = testServiceModel()
  process.exit(result.passed ? 0 : 1)
}

module.exports = { testServiceModel }

