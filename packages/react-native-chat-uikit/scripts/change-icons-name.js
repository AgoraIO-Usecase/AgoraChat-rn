#!/usr/bin/env node

/* eslint-disable import/no-commonjs */
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

const ignorePatterns = /@2x|@3x/g;
const iconDir = path.join(root, 'src', 'assets', 'icons');

fs.readdirSync(iconDir).forEach((filename) => {
  if (filename.match(ignorePatterns)) {
    const r = filename.replace(ignorePatterns, (full, a) => {
      console.log(filename, a, full);
      if (full === '@2x') {
        return '_2x';
      } else if (full === '@3x') {
        return '_3x';
      } else {
        return new Error('impossible');
      }
    });
    console.log('r:', r);
    console.log(path.join(iconDir, filename), path.join(iconDir, r));
    fs.rename(path.join(iconDir, filename), path.join(iconDir, r), (err) => {
      console.log('error:', err);
    });
  }
});
