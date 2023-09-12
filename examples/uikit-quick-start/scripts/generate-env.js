#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');

const pak = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
);
const file = path.join(__dirname, '../src/env.ts');
console.log(`📝 Generate the ${pak.name}@${pak.version} env file: ${file}`);
const content = `export const test = true;
export const appKey = '';
export const id = '';
export const token = '';
export const agoraAppId = '';
export const targetId = '';
`;
fs.writeFileSync(file, content, 'utf-8');
