#!/usr/bin/env node

// scripts/install-all.js - Install dependencies for both server and client
const { spawn } = require('child_process');
const path = require('path');

console.log('📦 Installing Task Management System Dependencies\n');

function runCommand(command, args, cwd) {
  return new Promise((resolve, reject) => {
    console.log(`🔧 Running: ${command} ${args.join(' ')} in ${cwd}`);
    
    const process = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    process.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ Completed: ${command} ${args.join(' ')}\n`);
        resolve();
      } else {
        console.log(`❌ Failed: ${command} ${args.join(' ')} (exit code: ${code})\n`);
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    process.on('error', (error) => {
      console.log(`❌ Error: ${error.message}\n`);
      reject(error);
    });
  });
}

async function installDependencies() {
  const rootDir = path.resolve(__dirname, '..');
  const serverDir = path.join(rootDir, 'server');
  const clientDir = path.join(rootDir, 'client');

  try {
    // Install server dependencies
    console.log('1️⃣ Installing server dependencies...');
    await runCommand('npm', ['install'], serverDir);

    // Install client dependencies
    console.log('2️⃣ Installing client dependencies...');
    await runCommand('npm', ['install'], clientDir);

    console.log('🎉 All dependencies installed successfully!');
    console.log('\n📝 Next steps:');
    console.log('1. Copy environment files: cp server/.env.example server/.env');
    console.log('2. Copy environment files: cp client/.env.example client/.env');
    console.log('3. Update environment variables with your values');
    console.log('4. Setup database: npm run setup-db');
    console.log('5. Start development: npm run dev:server & npm run dev:client');

  } catch (error) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

installDependencies(); 