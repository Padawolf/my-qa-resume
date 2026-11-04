/**
 * Converte o relatório JSON do Cucumber (gerado pelo playwright-bdd) no resumo
 * enxuto que o site lê em `last-run.json` (formato `RunReport` de src/lib/report.ts).
 *
 * @param {Array<any>} features  conteúdo de reports/cucumber.json
 * @param {{ generatedAt?: string, commit?: string, runUrl?: string }} [meta]
 */
export function cucumberToRun(features, meta = {}) {
  const run = {
    generatedAt: meta.generatedAt ?? new Date().toISOString(),
    commit: meta.commit,
    runUrl: meta.runUrl,
    durationMs: 0,
    features: [],
  };

  for (const feature of features ?? []) {
    const fr = { name: feature.name, uri: feature.uri, scenarios: [] };
    let background = [];

    for (const el of feature.elements ?? []) {
      const steps = (el.steps ?? []).filter((s) => !s.hidden);
      if (el.type === 'background') {
        background = steps;
        continue;
      }

      const all = [...background, ...steps];
      background = [];
      const counts = { passed: 0, failed: 0, skipped: 0 };
      let durationMs = 0;
      let error;

      for (const s of all) {
        const status = s.result?.status ?? 'skipped';
        if (status === 'passed') counts.passed++;
        else if (status === 'failed') counts.failed++;
        else counts.skipped++;
        // O Cucumber registra a duração em nanossegundos.
        durationMs += (s.result?.duration ?? 0) / 1e6;
        if (status === 'failed' && !error && s.result?.error_message) {
          error = String(s.result.error_message).split('\n').find((l) => l.trim())?.trim().slice(0, 160);
        }
      }

      const status = counts.failed ? 'failed' : counts.skipped && !counts.passed ? 'skipped' : counts.skipped ? 'failed' : 'passed';
      const scenario = { name: el.name, status, durationMs: Math.round(durationMs), steps: counts };
      if (error) scenario.error = error;
      fr.scenarios.push(scenario);
      run.durationMs += scenario.durationMs;
    }

    if (fr.scenarios.length) run.features.push(fr);
  }

  return run;
}
