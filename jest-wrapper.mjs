#!/usr/bin/env node
process.env.NODE_OPTIONS = '--experimental-vm-modules';
require('child_process').execSync('npx jest', { 
  stdio: 'inherit',
  shell: true
});
