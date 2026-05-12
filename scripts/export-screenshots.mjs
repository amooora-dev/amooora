/**
 * Gera PNGs das telas do app (modo dev com ?screen=) para uso com o prompt Figma.
 * Uso: npm run screenshots:export
 * Saída: MD/screenshots-export/*.png
 */

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT = join(ROOT, 'MD', 'screenshots-export');
const PORT = 5199;
const BASE = `http://127.0.0.1:${PORT}`;

/** Nome do arquivo (sem .png) → query (sem leading ?) */
const SCREENS = [
  ['welcome', 'screen=welcome'],
  ['login', 'screen=login'],
  ['cadastro', 'screen=cadastro'],
  ['home', 'screen=home'],
  ['places', 'screen=places'],
  ['services', 'screen=services'],
  ['events', 'screen=events'],
  ['community', 'screen=community'],
  ['todas-comunidades', 'screen=todas-comunidades'],
  ['mapa', 'screen=mapa'],
  ['profile', 'screen=profile'],
  ['edit-profile', 'screen=edit-profile'],
  ['settings', 'screen=settings'],
  ['notifications', 'screen=notifications'],
  ['favoritos', 'screen=favoritos'],
  ['minhas-publicacoes', 'screen=minhas-publicacoes'],
  ['friends', 'screen=friends'],
  ['friends-search', 'screen=friends-search'],
  ['friends-requests', 'screen=friends-requests'],
  ['friend-chat', 'screen=friend-chat'],
  ['busca', 'screen=busca'],
  ['minhas-comunidades', 'screen=minhas-comunidades'],
  ['perfil-locais-favoritos', 'screen=perfil-locais-favoritos'],
  ['perfil-meus-eventos', 'screen=perfil-meus-eventos'],
  ['perfil-servicos-favoritos', 'screen=perfil-servicos-favoritos'],
  ['edit-perfil-profissional', 'screen=edit-perfil-profissional'],
  ['perfil-profissional', 'screen=perfil-profissional'],
  ['sobre-amooora', 'screen=sobre-amooora'],
  ['fale-conosco', 'screen=fale-conosco'],
  ['service-category-terapia', 'screen=service-category-terapia'],
  ['service-category-advocacia', 'screen=service-category-advocacia'],
  ['service-category-saude', 'screen=service-category-saude'],
  ['service-category-carreira', 'screen=service-category-carreira'],
  ['create-review', 'screen=create-review'],
  ['place-details', 'screen=place-details'],
  ['service-details', 'screen=service-details'],
  ['event-details', 'screen=event-details'],
  ['post-details', 'screen=post-details'],
  ['community-details', 'screen=community-details'],
  ['event-participants', 'screen=event-participants'],
  ['view-profile', 'screen=view-profile'],
  ['admin', 'screen=admin'],
  ['admin-cadastrar-usuario', 'screen=admin-cadastrar-usuario'],
  ['admin-gerenciar-usuarios', 'screen=admin-gerenciar-usuarios'],
  ['admin-cadastrar-local', 'screen=admin-cadastrar-local'],
  ['admin-cadastrar-servico', 'screen=admin-cadastrar-servico'],
  ['admin-cadastrar-evento', 'screen=admin-cadastrar-evento'],
  ['admin-cadastrar-comunidade', 'screen=admin-cadastrar-comunidade'],
  ['admin-editar-conteudos', 'screen=admin-editar-conteudos'],
  ['admin-editar-local', 'screen=admin-editar-local'],
  ['admin-editar-evento', 'screen=admin-editar-evento'],
  ['admin-editar-servico', 'screen=admin-editar-servico'],
  ['admin-editar-comunidade', 'screen=admin-editar-comunidade'],
  ['admin-conteudos-desativados', 'screen=admin-conteudos-desativados'],
  ['curadoria', 'screen=curadoria'],
];

async function waitForServer(maxMs = 120_000) {
  const start = Date.now();
  while (Date.now() - start < maxMs) {
    try {
      const res = await fetch(BASE);
      if (res.ok) return;
    } catch {
      /* ainda subindo */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Timeout: servidor não respondeu em ${BASE}`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const server = spawn('npx', ['vite', '--port', String(PORT), '--host', '127.0.0.1'], {
    cwd: ROOT,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, BROWSER: 'none' },
  });

  const killServer = () => {
    try {
      server.kill('SIGTERM');
    } catch {
      /* ignore */
    }
  };

  process.on('SIGINT', () => {
    killServer();
    process.exit(1);
  });

  try {
    await waitForServer();

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    for (const [name, query] of SCREENS) {
      const url = `${BASE}/?${query}`;
      process.stdout.write(`Capturando ${name}… `);
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 });
        await sleep(2200);
        await page.screenshot({
          path: join(OUT, `${name}.png`),
          fullPage: true,
        });
        console.log('ok');
      } catch (e) {
        console.log('erro', e.message);
      }
    }

    await browser.close();
    console.log(`\nConcluído. PNGs em: ${OUT}`);
  } finally {
    killServer();
    await sleep(500);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
