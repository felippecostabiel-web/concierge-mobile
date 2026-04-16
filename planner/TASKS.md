---
tipo: tasks
empresa: Forge Dev Lab
projeto: Concierge Mobile
feature: 001-concierge-mobile
status: aprovado
data: 2026-04-16
tags: [pwa, github-api, vite, tasks]
---

# TASKS: Concierge Mobile

## Matriz de Rastreabilidade

| Story | Fase | Tasks |
|---|---|---|
| US-05 Configuração | F1 Setup + F5 Screens | T01-T05, T22 |
| US-01 Hoje em Foco | F2 API + F3 Parser + F4 Shell + F5 Screens | T06-T12, T13-T16, T17 |
| US-02 Pendentes | F2 API + F3 Parser + F5 Screens | T06-T11, T18 |
| US-03 Diários | F2 API + F3 Parser + F5 Screens | T06-T12, T19, T20 |
| US-04 Planners | F2 API + F3 Parser + F5 Screens | T06-T11, T21 |
| Deploy | F6 Main + F7 Deploy | T23-T26 |

---

## Dependências entre Fases

```
F1 (Setup)
  └── F2 (API + Store)
        ├── F3 (Parser)      ← independente de F4
        └── F4 (Shell + CSS) ← independente de F3
              └── F5 (Screens) ← depende de F2 + F3 + F4
                    └── F6 (Main)
                          └── F7 (Deploy)
```

F3 e F4 rodam em paralelo após F2. F5 depende das duas.

---

## F1 — Setup do Projeto

> Criar repositório, instalar dependências, estrutura de pastas.

- [ ] **T01** — Criar repositório `concierge-mobile` no GitHub + `git init` local
  - Criar repo público em github.com
  - `git init`, `.gitignore` (node_modules, dist)
  - `npm create vite@latest . -- --template vanilla`

- [ ] **T02** — Instalar dependências
  - `npm install marked lucide`
  - `npm install -D vite`
  - Verificar `package.json`: scripts `dev`, `build`, `preview`

- [ ] **T03** — Criar estrutura de pastas
  - Criar: `src/api/`, `src/parser/`, `src/store/`, `src/screens/`, `src/components/`
  - Criar arquivos vazios com comentário de responsabilidade em cada módulo

- [ ] **T04** — Configurar PWA
  - Criar `public/manifest.json` com campos do PLAN
  - Criar `public/sw.js` — service worker mínimo (install + fetch passthrough)
  - Adicionar `<link rel="manifest">` e `<meta theme-color>` no `index.html`
  - Gerar ícones: 192×192 e 512×512 (fundo `#0A0A0A`, letra "C" em laranja `#F97316`)

- [ ] **T05** — HTML base (`index.html`)
  - Shell HTML completo: `#app`, `.hdr`, `.content`, `.bnav`
  - 6 sections: `#screen-hoje`, `#screen-pendentes`, `#screen-diarios`, `#screen-reader`, `#screen-planners`, `#screen-config`
  - `<link>` Google Fonts (Inter + JetBrains Mono)
  - `<script type="module" src="/src/main.js">`

---

## F2 — API + Store

> Camada de dados: config local e comunicação com GitHub API.
> **Pré-requisito:** F1 concluída.

- [ ] **T06** — `src/store/config.js`
  - `getConfig()` → lê `{ token, owner, repo, branch }` do localStorage
  - `saveConfig(cfg)` → escreve no localStorage
  - `clearConfig()` → remove do localStorage
  - `hasConfig()` → boolean, verifica se token existe

- [ ] **T07** — `src/api/github.js`
  - `githubFetch(path, config)` → fetch com header `Authorization: Bearer {token}`, retorna JSON ou lança erro
  - `getContents(path)` → `GET /repos/{owner}/{repo}/contents/{path}?ref={branch}`
  - `getFileContent(path)` → chama `getContents`, faz decode Base64 (`atob`), retorna string
  - `getTree()` → `GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1`, retorna array de `{ path, type }`
  - Tratar erros: 401 → `throw Error('TOKEN_INVALID')`, 404 → `throw Error('NOT_FOUND')`, outros → `throw Error('API_ERROR')`

- [ ] **T08** — `src/api/vault.js`
  - `buildVaultIndex(tree)` → filtra a árvore do repo, retorna `VaultIndex`:
    - `dailies`: items com `path` contendo `/Daily/` e terminando em `.md`, extrair data do nome do arquivo
    - `tasks`: items com `path` terminando em `TASKS.md` e contendo `/planner/`
  - `getTodayDailyPath(vaultIndex)` → encontra o daily de hoje por data `YYYY-MM-DD`
  - `getDailyPath(vaultIndex, date)` → encontra daily por data específica
  - Prefixo do vault: detectar automaticamente (pasta raiz dos dailies)

---

## F3 — Parser

> Transforma strings markdown em objetos JS.
> **Pode rodar em paralelo com F4.**

- [ ] **T09** — `src/parser/frontmatter.js`
  - `parseFrontmatter(raw)` → extrai bloco `---` inicial, converte linhas `key: value` em objeto
  - Suporte a arrays simples: `tags: [a, b]` → `['a', 'b']`
  - Retorna `{ frontmatter: {}, body: string }`

- [ ] **T10** — `src/parser/vault-parser.js` — Daily
  - `parseDaily(raw)` → usa `parseFrontmatter`, depois split por `## ` para extrair seções
  - Extrai `title` do primeiro `# ` (H1)
  - `extractTasks(sectionText)` → regex `^- \[ \] (.+)` → array de strings (openTasks)
  - `extractDone(sectionText)` → regex `^- \[x\] (.+)` (case-insensitive) → array de strings
  - Mapeia seções por título parcial (ver PLAN): pendentes, concluidos, agenda, resumo, reflexao
  - Retorna objeto `DailyNote` conforme modelo do PLAN

- [ ] **T11** — `src/parser/vault-parser.js` — Tasks
  - `parseTasksFile(raw, path)` → extrai frontmatter + todas as `- [ ]` e `- [x]` do corpo
  - Deriva `empresa` e `feature` do `path` (segmentos após `03-Empresas/`)
  - Retorna objeto `TasksFile` conforme modelo do PLAN

- [ ] **T12** — `src/parser/markdown.js`
  - Configurar `marked` com opções: `gfm: true`, `breaks: true`
  - `renderMarkdown(raw)` → retorna HTML string
  - `applyVaultStyles(html)` → pós-processa HTML do marked: adicionar classes CSS (`rd-h2`, `rd-p`, etc.) via substituição de seletores
  - Testar com um daily real (copiar conteúdo do 2026-04-16)

---

## F4 — Shell + CSS

> Estrutura visual do app: tokens, layout, navegação.
> **Pode rodar em paralelo com F3.**

- [ ] **T13** — `src/style.css`
  - Copiar CSS do protótipo (tokens, reset, shell, componentes)
  - Organizar em seções comentadas: Tokens / Reset / Shell / Bottom Nav / Componentes / Estados
  - Adicionar estilos de markdown renderizado: `.rd-table`, `.rd-blockquote`, `.rd-hr`
  - Verificar `env(safe-area-inset-bottom)` no bottom nav

- [ ] **T14** — `src/components/skeleton.js`
  - `showSkeleton(containerId, lines)` → insere N divs `.sk` com alturas variadas no container
  - `hideSkeleton(containerId)` → limpa o container

- [ ] **T15** — `src/components/empty.js`
  - `renderEmpty(containerId, { icon, title, sub })` → insere estado vazio com ícone Lucide + textos

- [ ] **T16** — `src/components/shell.js`
  - `initShell()` → registra listeners nos 4 tabs do bottom nav
  - `showTab(name)` → esconde todas as screens, mostra a correta, atualiza tab ativa, atualiza header
  - `setHeaderTitle(text)` → atualiza `#hdr-label`
  - `showSettingsIcon(bool)` → mostra/esconde botão ⚙
  - `showReaderNav(onPrev, onNext)` → injeta botões ‹ › no header com callbacks
  - `hideReaderNav()` → remove os botões

---

## F5 — Screens

> Lógica + render de cada tela.
> **Pré-requisito:** F2 + F3 + F4 concluídas.

- [ ] **T17** — `src/screens/hoje.js`
  - `initHoje(vaultIndex, config)` → carrega daily de hoje, parseia, renderiza
  - Seções renderizadas: data hero, agenda card, tasks abertas (3 + expandir), tasks concluídas, resumo
  - Estado vazio se daily não existir (ícone sun + mensagem)
  - Estado de loading com skeleton enquanto carrega

- [ ] **T18** — `src/screens/pendentes.js`
  - `initPendentes(vaultIndex, config)` → carrega todos os TASKS.md em paralelo (`Promise.all`)
  - Filtra apenas arquivos com `status: aprovado` ou `status: rascunho` (exclui concluídos)
  - Agrupa por empresa, ordena: Reserva Fiscal → Marechal → ASX → Vault
  - Renderiza accordions por empresa com contagem de tasks abertas
  - Loading: skeleton enquanto carrega os TASKS.md

- [ ] **T19** — `src/screens/diarios.js` — lista
  - `initDiarios(vaultIndex)` → renderiza lista de dailies agrupados: Hoje / Esta semana / Mais antigos
  - Ordenar por data decrescente
  - Card com dia bold, mês, título extraído do H1, weekday

- [ ] **T20** — `src/screens/diarios.js` — reader
  - `openReader(date, vaultIndex, config)` → carrega e renderiza o daily no `#screen-reader`
  - Chama `shell.showReaderNav()` com callbacks de navegação anterior/próximo
  - `navigateDay(direction)` → encontra index na lista de dailies, carrega adjacente
  - Renderiza markdown completo via `markdown.js`

- [ ] **T21** — `src/screens/planners.js`
  - `initPlanners(vaultIndex, config)` → carrega todos os TASKS.md
  - Agrupa por status: Em Build / Aprovados / Em Rascunho / Concluídos
  - Card com nome do planner (extraído do path), empresa, badge de status colorido

- [ ] **T22** — `src/screens/config.js`
  - `initConfig()` → preenche campos com config atual do localStorage
  - Botão "Testar Conexão" → chama `getTree()`, mostra status (conectado + nº de arquivos ou erro)
  - Botão "Salvar" → `saveConfig()` + redirect para tela Hoje
  - Botão "Limpar" → `clearConfig()` + recarrega app
  - Toggle show/hide do token

---

## F6 — Main

> Ponto de entrada: orquestra init, verifica config, constrói índice.
> **Pré-requisito:** F5 concluída.

- [ ] **T23** — `src/main.js`
  - Importar `style.css`
  - Chamar `initShell()`
  - Verificar `hasConfig()`:
    - Falso → `showTab('config')`
    - Verdadeiro → chamar `getTree()` → `buildVaultIndex()` → `initHoje()` → `showTab('hoje')`
  - Tratar erro de API: banner topo com mensagem e botão "Tentar novamente"
  - Lazy init: `initPendentes`, `initDiarios`, `initPlanners` chamados na primeira visita à tab (não no boot)
  - Registrar service worker: `navigator.serviceWorker.register('/sw.js')`

---

## F7 — Deploy

> CI/CD e validação final no dispositivo.
> **Pré-requisito:** F6 concluída.

- [ ] **T24** — GitHub Actions pipeline
  - Criar `.github/workflows/deploy.yml`
  - Trigger: `push` na branch `main`
  - Steps: `npm ci` → `npm run build` → deploy `dist/` para GitHub Pages
  - Habilitar GitHub Pages nas configurações do repo (source: GitHub Actions)

- [ ] **T25** — Testar no iOS Safari
  - Abrir URL do GitHub Pages no iPhone
  - Verificar: bottom nav safe area, fontes, touch targets, scroll
  - Instalar como PWA (Add to Home Screen) — verificar ícone e modo standalone

- [ ] **T26** — Testar no Android Chrome
  - Abrir URL, verificar visual e interatividade
  - Instalar como PWA — verificar prompt de instalação e ícone

---

## Ordem de Execução Sugerida

```
Sessão 1:  T01 → T02 → T03 → T04 → T05  (F1 completa)
Sessão 2:  T06 → T07 → T08              (F2 completa)
Sessão 3:  T09 + T13 em paralelo        (F3 início + F4 início)
           T10 + T11 + T12              (F3 completa)
           T14 + T15 + T16              (F4 completa)
Sessão 4:  T17 → T18 → T19 → T20 → T21 → T22  (F5 completa)
Sessão 5:  T23                          (F6 completa)
Sessão 6:  T24 → T25 → T26             (F7 completa)
```

**Total: 26 tasks em 6 fases, ~6 sessões de trabalho.**
