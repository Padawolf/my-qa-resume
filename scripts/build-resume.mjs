// Gera o currículo em PDF (português e inglês) em public/, com o Chromium do Playwright.
// Uso: npm run resume
// O conteúdo fica todo aqui embaixo: para atualizar o currículo, edite RESUME e rode de novo.
import { writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const CONTACT = {
  email: 'nataliaspandolfi@gmail.com',
  linkedin: 'linkedin.com/in/nat-pandolfi',
  github: 'github.com/Padawolf',
  site: 'padawolf.github.io/my-qa-resume',
};

const RESUME = {
  pt: {
    file: 'public/curriculo-natalia-pandolfi.pdf',
    lang: 'pt-BR',
    role: 'QA Engineer',
    location: 'Cotia, SP',
    labels: {
      summary: 'Resumo',
      experience: 'Experiência',
      projects: 'Projetos',
      skills: 'Competências',
      education: 'Formação',
      certifications: 'Certificações',
      languages: 'Idiomas',
    },
    summary:
      'QA Engineer com experiência em automação de testes web, mobile e de APIs, testes de performance e integração de suítes automatizadas em pipelines de CI/CD. Participo do projeto desde a discovery, junto com Product Owners e engenharia, definindo requisitos, critérios de aceite e cenários de teste com BDD e Shift Left. Também desenvolvi bases de conhecimento com IA para gerar testes de infraestrutura e montar repositórios de automação.',
    jobs: [
      {
        title: 'QA Engineer',
        company: 'Zup Innovation',
        period: 'dez/2022 – atual',
        bullets: [
          'Liderança da automação de testes web, mobile e de APIs em sistemas de grande escala e alto tráfego.',
          'Planejamento e execução de testes de performance e de carga.',
          'Integração das suítes automatizadas aos pipelines de CI/CD.',
          'Trabalho com POs e engenharia desde a discovery, na definição de requisitos, critérios de aceite e cenários de teste.',
        ],
      },
      {
        title: 'Test Specialist',
        company: 'IBM',
        period: 'jun/2022 – dez/2022',
        bullets: [
          'Definição e execução de estratégias de teste para aplicações web, mobile e orientadas a APIs.',
          'Desenvolvimento e manutenção de suítes automatizadas para integração contínua.',
          'Disseminação de boas práticas de QA, BDD e padrões de qualidade entre os times.',
        ],
      },
      {
        title: 'QA Analyst',
        company: 'Keeggo',
        period: 'jan/2022 – jun/2022',
        bullets: [
          'Testes manuais, exploratórios e automatizados em diferentes plataformas.',
          'Criação de cenários de teste a partir de regras de negócio e critérios de aceite.',
          'Trabalho junto aos desenvolvedores na identificação e correção de defeitos.',
        ],
      },
    ],
    projects: [
      {
        name: 'Testes de infraestrutura gerados com IA',
        text: 'Base de conhecimento que lê projetos de infraestrutura como código (IaC) e gera testes automatizados para validar recursos como buckets S3, políticas de acesso e regras de autorização.',
      },
      {
        name: 'Repositórios de automação a partir de APIs',
        text: 'Base de conhecimento que lê APIs e ajuda a montar o esqueleto de repositórios de testes automatizados.',
      },
      {
        name: 'Site pessoal',
        text: `Apresentação escrita em Gherkin (pt e en), feita com Astro e React. Testes E2E com Playwright + BDD, acessibilidade com axe-core e deploy por GitHub Actions.`,
        url: CONTACT.site,
      },
    ],
    skills: [
      ['Linguagens', 'Java, Python, JavaScript, TypeScript'],
      ['Web', 'Playwright, Selenium, Cypress, Robot Framework'],
      ['Mobile e API', 'Appium, RestAssured'],
      ['Performance e acessibilidade', 'k6, axe-core'],
      ['BDD', 'Gherkin, Cucumber'],
      ['Práticas', 'CI/CD, Shift Left, critérios de aceite, Scrum, Kanban'],
      ['Ferramentas', 'Git, Jira'],
      ['Tipos de teste', 'manual, exploratório, regressão, API, web, mobile, performance e carga'],
    ],
    education: [
      ['Pós-graduação em Arquitetura de Software', 'FIAP', '2024 – 2025'],
      ['Tecnólogo em Análise e Desenvolvimento de Sistemas', 'Impacta Tecnologia', '2018 – 2020'],
    ],
    certifications: [
      ['ISTQB CTFL – Certified Tester Foundation Level', 'BSTQB', '2023'],
      ['DevOps Essentials', 'CertiProf', '2020'],
      ['Scrum Foundation Professional Certificate', 'CertiProf', '2020'],
    ],
    languages: 'Português (nativo) · Inglês (avançado, uso profissional)',
  },
  en: {
    file: 'public/resume-natalia-pandolfi.pdf',
    lang: 'en',
    role: 'QA Engineer',
    location: 'Cotia, SP, Brazil',
    labels: {
      summary: 'Summary',
      experience: 'Experience',
      projects: 'Projects',
      skills: 'Skills',
      education: 'Education',
      certifications: 'Certifications',
      languages: 'Languages',
    },
    summary:
      'QA Engineer experienced in web, mobile and API test automation, performance testing and integrating automated suites into CI/CD pipelines. I join projects from discovery onwards, working with Product Owners and engineering to define requirements, acceptance criteria and test scenarios with BDD and Shift Left. I have also built AI knowledge bases that generate infrastructure tests and set up test automation repositories.',
    jobs: [
      {
        title: 'QA Engineer',
        company: 'Zup Innovation',
        period: 'Dec 2022 – present',
        bullets: [
          'Lead web, mobile and API test automation for large-scale, high-traffic systems.',
          'Plan and run performance and load tests.',
          'Integrate automated test suites into CI/CD pipelines.',
          'Work with POs and engineering from discovery, defining requirements, acceptance criteria and test scenarios.',
        ],
      },
      {
        title: 'Test Specialist',
        company: 'IBM',
        period: 'Jun 2022 – Dec 2022',
        bullets: [
          'Defined and executed test strategies for web, mobile and API-driven applications.',
          'Built and maintained automated suites for continuous integration.',
          'Promoted QA best practices, BDD and quality standards across teams.',
        ],
      },
      {
        title: 'QA Analyst',
        company: 'Keeggo',
        period: 'Jan 2022 – Jun 2022',
        bullets: [
          'Ran manual, exploratory and automated tests across several platforms.',
          'Wrote test scenarios from business rules and acceptance criteria.',
          'Worked with developers to find and fix defects.',
        ],
      },
    ],
    projects: [
      {
        name: 'AI-generated infrastructure tests',
        text: 'Knowledge base that reads infrastructure-as-code (IaC) projects and generates automated tests that validate resources such as S3 buckets, access policies and authorization rules.',
      },
      {
        name: 'Test automation repositories from APIs',
        text: 'Knowledge base that reads APIs and helps build the skeleton of test automation repositories.',
      },
      {
        name: 'Personal website',
        text: `Introduction written in Gherkin (Portuguese and English), built with Astro and React. E2E tests with Playwright + BDD, accessibility checks with axe-core and deployment via GitHub Actions.`,
        url: CONTACT.site,
      },
    ],
    skills: [
      ['Languages', 'Java, Python, JavaScript, TypeScript'],
      ['Web', 'Playwright, Selenium, Cypress, Robot Framework'],
      ['Mobile and API', 'Appium, RestAssured'],
      ['Performance and accessibility', 'k6, axe-core'],
      ['BDD', 'Gherkin, Cucumber'],
      ['Practices', 'CI/CD, Shift Left, acceptance criteria, Scrum, Kanban'],
      ['Tools', 'Git, Jira'],
      ['Testing types', 'manual, exploratory, regression, API, web, mobile, performance and load'],
    ],
    education: [
      ['Postgraduate Certificate in Software Architecture', 'FIAP', '2024 – 2025'],
      ['Associate Degree in Systems Analysis and Development', 'Impacta Tecnologia', '2018 – 2020'],
    ],
    certifications: [
      ['ISTQB CTFL – Certified Tester Foundation Level', 'BSTQB', '2023'],
      ['DevOps Essentials', 'CertiProf', '2020'],
      ['Scrum Foundation Professional Certificate', 'CertiProf', '2020'],
    ],
    languages: 'Portuguese (native) · English (advanced, professional working proficiency)',
  },
};

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function html(r) {
  const link = (url, text = url) => `<a href="${url.startsWith('http') || url.startsWith('mailto') ? url : 'https://' + url}">${esc(text)}</a>`;
  const rows = (items) =>
    items.map(([a, b, c]) => `<div class="row"><span><b>${esc(a)}</b> · ${esc(b)}</span><span class="when">${esc(c)}</span></div>`).join('');
  return `<!DOCTYPE html>
<html lang="${r.lang}"><head><meta charset="utf-8"><title>Natalia Pandolfi · ${r.role}</title>
<style>
  @page { size: A4; margin: 11mm 14mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, Helvetica, sans-serif; font-size: 9.5pt; line-height: 1.32; color: #1a1a1a; margin: 0; }
  h1 { font-size: 22pt; margin: 0; color: #0b2a5b; letter-spacing: 0.3px; }
  .role { font-size: 12pt; color: #333; margin: 2px 0 6px; }
  .contact { font-size: 9pt; color: #333; }
  .contact a { color: #0b2a5b; text-decoration: none; }
  h2 { font-size: 10.5pt; text-transform: uppercase; letter-spacing: 1px; color: #0b2a5b; border-bottom: 1.2px solid #0b2a5b; padding-bottom: 2px; margin: 10px 0 5px; }
  p { margin: 0; }
  .job { margin-bottom: 6px; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 12px; }
  .when { color: #555; white-space: nowrap; }
  ul { margin: 3px 0 0; padding-left: 16px; }
  li { margin: 1px 0; }
  .proj { margin-bottom: 3px; }
  .proj a { color: #0b2a5b; text-decoration: none; white-space: nowrap; }
  .skills { display: grid; grid-template-columns: max-content 1fr; column-gap: 12px; row-gap: 2px; }
  .skills dt { font-weight: 600; }
  .skills dd { margin: 0; }
</style></head>
<body>
  <header>
    <h1>Natalia Pandolfi</h1>
    <p class="role">${esc(r.role)}</p>
    <p class="contact">${esc(r.location)} · ${link('mailto:' + CONTACT.email, CONTACT.email)} · ${link(CONTACT.linkedin)} · ${link(CONTACT.github)}</p>
  </header>

  <h2>${r.labels.summary}</h2>
  <p>${esc(r.summary)}</p>

  <h2>${r.labels.experience}</h2>
  ${r.jobs
    .map(
      (j) => `<div class="job"><div class="row"><span><b>${esc(j.title)}</b> · ${esc(j.company)}</span><span class="when">${esc(j.period)}</span></div>
  <ul>${j.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul></div>`,
    )
    .join('')}

  <h2>${r.labels.projects}</h2>
  ${r.projects.map((p) => `<p class="proj"><b>${esc(p.name)}.</b> ${esc(p.text)}${p.url ? ' ' + link(p.url) : ''}</p>`).join('')}

  <h2>${r.labels.skills}</h2>
  <dl class="skills">${r.skills.map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>

  <h2>${r.labels.education}</h2>
  ${rows(r.education)}

  <h2>${r.labels.certifications}</h2>
  ${rows(r.certifications)}

  <h2>${r.labels.languages}</h2>
  <p>${esc(r.languages)}</p>
</body></html>`;
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const r of Object.values(RESUME)) {
    await page.setContent(html(r), { waitUntil: 'load' });
    writeFileSync(r.file, await page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true }));
    console.log('Gerado:', r.file);
  }
} finally {
  await browser.close();
}
