#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const PKG_ROOT = path.join(__dirname, '..');
const VERSION = require(path.join(PKG_ROOT, 'package.json')).version;

const AGENTS_BLOCK = `
<!-- trato:start -->
## Trato — Spec-Driven Pact

This repository uses the Trato spec-driven pact.

Before any product task, feature, bugfix, or refactor with behavioral impact,
read and follow \`TRATO.md\`. Do not skip the scope contract, the
criterion -> test/proof matrix, or the final evidence step.
<!-- trato:end -->
`;

const CLAUDE_BLOCK = `
<!-- trato:start -->
@TRATO.md
<!-- trato:end -->
`;

function log(status, file) {
  console.log(`  ${status.padEnd(8)} ${file}`);
}

function copyIfAbsent(src, dest, name) {
  if (fs.existsSync(dest)) {
    log('skipped', `${name} (already exists)`);
    return;
  }
  fs.copyFileSync(src, dest);
  log('created', name);
}

function ensureBlock(dest, name, block) {
  if (fs.existsSync(dest)) {
    const current = fs.readFileSync(dest, 'utf8');
    if (current.includes('TRATO.md')) {
      log('skipped', `${name} (already references TRATO.md)`);
      return;
    }
    fs.writeFileSync(dest, current.replace(/\s*$/, '\n') + block);
    log('updated', `${name} (Trato block appended, existing content preserved)`);
    return;
  }
  fs.writeFileSync(dest, block.replace(/^\n/, ''));
  log('created', name);
}

function init(targetDir) {
  const target = path.resolve(targetDir || '.');
  if (!fs.existsSync(target)) {
    console.error(`trato: target directory not found: ${target}`);
    process.exit(1);
  }
  console.log(`Initializing Trato in ${target}\n`);

  copyIfAbsent(path.join(PKG_ROOT, 'TRATO.md'), path.join(target, 'TRATO.md'), 'TRATO.md');

  const specsDir = path.join(target, 'specs');
  if (!fs.existsSync(specsDir)) {
    fs.mkdirSync(specsDir);
    log('created', 'specs/');
  }
  copyIfAbsent(path.join(PKG_ROOT, 'specs', 'TEMPLATE.md'), path.join(specsDir, 'TEMPLATE.md'), 'specs/TEMPLATE.md');
  copyIfAbsent(path.join(PKG_ROOT, 'specs', 'EXAMPLE.md'), path.join(specsDir, 'EXAMPLE.md'), 'specs/EXAMPLE.md');

  ensureBlock(path.join(target, 'AGENTS.md'), 'AGENTS.md', AGENTS_BLOCK);
  ensureBlock(path.join(target, 'CLAUDE.md'), 'CLAUDE.md', CLAUDE_BLOCK);

  console.log('\nDone. Your agents (Claude Code, Codex, and any AGENTS.md-aware tool) now follow TRATO.md.');
}

function help() {
  console.log(`trato ${VERSION} — spec-driven pact for coding agents

Usage:
  trato init [dir]   Install Trato into a project (default: current directory)
  trato --version    Print version
  trato --help       Show this help

init is non-destructive and idempotent: existing AGENTS.md/CLAUDE.md are
appended to (never overwritten), and existing Trato files are left untouched.`);
}

const [, , cmd, arg] = process.argv;
switch (cmd) {
  case 'init':
    init(arg);
    break;
  case '--version':
  case '-v':
    console.log(VERSION);
    break;
  case '--help':
  case '-h':
  case undefined:
    help();
    break;
  default:
    console.error(`trato: unknown command "${cmd}"\n`);
    help();
    process.exit(1);
}
