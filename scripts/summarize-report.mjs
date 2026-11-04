#!/usr/bin/env node
// Uso: node scripts/summarize-report.mjs <cucumber.json> [saida1.json saida2.json ...]
// No CI: node scripts/summarize-report.mjs reports/cucumber.json dist/last-run.json
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { cucumberToRun } from './cucumber-to-run.mjs';

const [input = 'reports/cucumber.json', ...outputs] = process.argv.slice(2);

if (!existsSync(input)) {
  console.error(`Relatório não encontrado: ${input}. Rode "npm run test:e2e" antes.`);
  process.exit(1);
}

const { GITHUB_SHA, GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
const run = cucumberToRun(JSON.parse(readFileSync(input, 'utf8')), {
  commit: GITHUB_SHA?.slice(0, 7),
  runUrl: GITHUB_RUN_ID ? `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}` : undefined,
});

for (const out of outputs.length ? outputs : ['public/last-run.json']) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, JSON.stringify(run, null, 2) + '\n');
  console.log(`Resumo gravado em ${out}`);
}

const scenarios = run.features.flatMap((f) => f.scenarios);
const failed = scenarios.filter((s) => s.status === 'failed').length;
console.log(`${scenarios.length} cenários · ${scenarios.length - failed} aprovados · ${failed} com falha`);
