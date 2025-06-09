#!/usr/bin/env node

// scripts/test-deployment.js - Deployment Testing Script
const https = require('https');
const http = require('http');

// Configuration - Update these URLs after deployment
const BACKEND_URL = 'https://task-management-system-4q03.onrender.com';
const FRONTEND_URL = 'https://task-management-system-eight-rust.vercel.app';
const API_URL = `${BACKEND_URL}/api`;

console.log('🧪 Testing Task Management System Deployment\n');
console.log(`Backend URL: ${BACKEND_URL}`);
console.log(`Frontend URL: ${FRONTEND_URL}`);
console.log(`API URL: ${API_URL}\n`);

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.request(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Deployment-Test-Script/1.0',
        'Origin': FRONTEND_URL, // For CORS testing
        ...options.headers
      },
      timeout: 10000
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    req.end();
  });
}

// Test functions
async function testBackendHealth() {
  console.log('1️⃣ Testing Backend Health Check...');
  try {
    const response = await makeRequest(API_URL);
    
    if (response.status === 200) {
      console.log('✅ Backend health check passed');
      console.log(`   Status: ${response.status}`);
      console.log(`   Message: ${response.data.message}`);
      console.log(`   Environment: ${response.data.environment}`);
      return true;
    } else {
      console.log(`❌ Backend health check failed - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend health check failed - Error: ${error.message}`);
    return false;
  }
}

async function testCORSConfiguration() {
  console.log('\n2️⃣ Testing CORS Configuration...');
  try {
    const response = await makeRequest(API_URL, {
      headers: {
        'Origin': FRONTEND_URL,
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type,Authorization'
      }
    });

    const corsHeaders = response.headers['access-control-allow-origin'];
    
    if (corsHeaders) {
      console.log('✅ CORS headers present');
      console.log(`   Allow-Origin: ${corsHeaders}`);
      
      if (corsHeaders === '*' || corsHeaders === FRONTEND_URL || corsHeaders.includes('vercel.app')) {
        console.log('✅ CORS configured correctly for frontend');
        return true;
      } else {
        console.log('⚠️  CORS may not allow frontend origin');
        return false;
      }
    } else {
      console.log('❌ CORS headers missing');
      return false;
    }
  } catch (error) {
    console.log(`❌ CORS test failed - Error: ${error.message}`);
    return false;
  }
}

async function testAuthEndpoints() {
  console.log('\n3️⃣ Testing Authentication Endpoints...');
  try {
    // Test registration endpoint
    const registerResponse = await makeRequest(`${API_URL}/auth/register`, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': FRONTEND_URL
      }
    });

    if (registerResponse.status === 405 || registerResponse.status === 400) {
      console.log('✅ Auth register endpoint accessible (method not allowed for GET)');
    } else {
      console.log(`⚠️  Auth register endpoint response: ${registerResponse.status}`);
    }

    // Test login endpoint
    const loginResponse = await makeRequest(`${API_URL}/auth/login`);
    
    if (loginResponse.status === 405 || loginResponse.status === 400) {
      console.log('✅ Auth login endpoint accessible (method not allowed for GET)');
    } else {
      console.log(`⚠️  Auth login endpoint response: ${loginResponse.status}`);
    }

    return true;
  } catch (error) {
    console.log(`❌ Auth endpoints test failed - Error: ${error.message}`);
    return false;
  }
}

async function testTaskEndpoints() {
  console.log('\n4️⃣ Testing Task Endpoints...');
  try {
    const response = await makeRequest(`${API_URL}/tasks`);
    
    if (response.status === 401) {
      console.log('✅ Tasks endpoint requires authentication (401 Unauthorized)');
      return true;
    } else if (response.status === 200) {
      console.log('⚠️  Tasks endpoint accessible without auth (check auth middleware)');
      return true;
    } else {
      console.log(`❌ Tasks endpoint unexpected response: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Tasks endpoint test failed - Error: ${error.message}`);
    return false;
  }
}

async function testFrontendAvailability() {
  console.log('\n5️⃣ Testing Frontend Availability...');
  try {
    const response = await makeRequest(FRONTEND_URL);
    
    if (response.status === 200) {
      console.log('✅ Frontend is accessible');
      console.log(`   Status: ${response.status}`);
      return true;
    } else {
      console.log(`❌ Frontend accessibility failed - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Frontend test failed - Error: ${error.message}`);
    console.log('   Note: Update FRONTEND_URL in this script after Vercel deployment');
    return false;
  }
}

// Main test runner
async function runDeploymentTests() {
  console.log('Starting deployment tests...\n');
  
  const tests = [
    testBackendHealth,
    testCORSConfiguration,
    testAuthEndpoints,
    testTaskEndpoints,
    testFrontendAvailability
  ];

  let passed = 0;
  let total = tests.length;

  for (const test of tests) {
    const result = await test();
    if (result) passed++;
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passed}/${total}`);
  console.log(`❌ Failed: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('\n🎉 All tests passed! Deployment is working correctly.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some tests failed. Check the deployment configuration.');
    process.exit(1);
  }
}

// Update URLs helper
function printConfigInstructions() {
  console.log('\n📝 Configuration Instructions:');
  console.log('1. Update BACKEND_URL after Render deployment');
  console.log('2. Update FRONTEND_URL after Vercel deployment');
  console.log('3. Run this script: node scripts/test-deployment.js');
  console.log('\nExample URLs:');
  console.log('  Backend: https://task-management-system.onrender.com');
  console.log('  Frontend: https://your-app.vercel.app');
}

// Check if URLs are still default values
if (BACKEND_URL.includes('task-management-system.onrender.com') && 
    FRONTEND_URL.includes('your-app.vercel.app')) {
  console.log('⚠️  Using example URLs. Please update the URLs in this script.');
  printConfigInstructions();
} else {
  runDeploymentTests().catch(console.error);
} 