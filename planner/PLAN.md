---
tipo: plan
empresa: Forge Dev Lab
projeto: Concierge Mobile
feature: 001-concierge-mobile
status: aprovado
data: 2026-04-16
tags: [pwa, github-api, vite, vanilla-js, markdown]
---

# PLAN: Concierge Mobile

## Decisões de Stack

### Por que Vanilla JS + Vite (sem framework)

O app é somente leitura — não há estado reativo complexo, formulários dinâmicos nem componentes que se re-renderizam com frequência. Um framework (React, Vue) adicionaria bundle desnecessário e complexidade sem benefício. Vanilla JS com módulos ES nativos é suficiente e resulta num PWA mais leve e rápido.

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Build | Vite | Zero config, HMR em dev, bundle otimizado |
| Linguagem | JavaScript (ESM) | Sem compilação extra, debug simples |
| Estilo | CSS puro (custom properties) | Já provado no protótipo |
| Ícones | Lucide (ESM import) | Tree-shakeable, leve |
| Markdown | marked.js | Leve, rápido, sem deps |
| Frontmatter | custom parser (15 linhas) | Sem overhead de biblioteca |
| Hosting | GitHub Pages | Gratuito, CI via GitHub Actions |
| Fontes | Google Fonts (Inter + JetBrains Mono) | CDN, sem build step |

---

## Estrutura de Arquivos

```
concierge-mobile/           ← repositório separado (ou pasta no concierge)
├── index.html
├── vite.config.js
├── package.json
├── public/
│   ├── manifest.json       ← PWA manifest
│   ├── icon-192.png
│   └── icon-512.png
└── src/
    ├── main.js             ← entry point, router, init
    ├── style.css           ← design tokens + reset + layout
    ├── api/
    │   ├── github.js       ← GitHub API client (fetch wrapper)
    │   └── vault.js        ← lógica de leitura do vault (daily, tasks, planners)
    ├── parser/
    │   ├── frontmatter.js  ← extrai YAML frontmatter de arquivos .md
    │   ├── markdown.js     ← converte markdown para HTML (wrapper do marked)
    │   └── vault-parser.js ← extrai seções específicas (pendentes, concluídos, etc.)
    ├── store/
    │   └── config.js       ← lê/escreve configuração no localStorage
    ├── screens/
    │   ├── hoje.js         ← lógica e render da tela Hoje
    │   ├── pendentes.js    ← lógica e render da tela Pendentes
    │   ├── diarios.js      ← lógica e render da tela Diários + Reader
    │   ├── planners.js     ← lógica e render da tela Planners
    │   └── config.js       ← lógica e render da tela Configuração
    └── components/
        ├── shell.js        ← header + bottom nav + tab switching
        ├── skeleton.js     ← estados de loading
        └── empty.js        ← estados vazios
```

---

## GitHub API — Contratos

**Base URL:** `https://api.github.com`
**Auth header:** `Authorization: Bearer {token}`
**Rate limit:** 5.000 req/hora com token autenticado (mais que suficiente)

### Listar arquivos de uma pasta

```
GET /repos/{owner}/{repo}/contents/{path}?ref={branch}
```

Retorna array de objetos. Campos usados: `name`, `path`, `type` (`file`|`dir`), `sha`.

### Ler conteúdo de um arquivo

```
GET /repos/{owner}/{repo}/contents/{path}?ref={branch}
```

Retorna objeto com `content` em Base64. Decode: `atob(content.replace(/\n/g,''))`.

### Buscar arquivos por nome recursivo

```
GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1
```

Retorna arvore completa do repo. Filtrar por `path.endsWith('TASKS.md')` ou `path.includes('/Daily/')`. **Usar para o carregamento inicial** — uma única chamada indexa todo o vault.

---

## Modelo de Dados (em memória)

```js
// Config (localStorage)
{
  token: "ghp_...",
  owner: "felippeabielcosta",
  repo:  "concierge",
  branch: "main"
}

// VaultIndex (carregado uma vez por sessão)
{
  dailies: [
    { date: "2026-04-16", path: "vault-concierge/02-Calendario/Daily/2026-04-16.md" },
    ...
  ],
  tasks: [
    {
      path: "vault-concierge/03-Empresas/Reserva-Fiscal/Produtos/CRM-ReservaFiscal/planner/004-correcoes-core/TASKS.md",
      empresa: null,   // extraído do frontmatter após carregar
      projeto: null,
      feature: "004-correcoes-core",
      status: null
    },
    ...
  ]
}

// DailyNote (carregado por demanda)
{
  date: "2026-04-16",
  title: "ART Novo Produto + ...",
  frontmatter: { tipo, data, tags },
  sections: {
    pendentes: ["task 1", "task 2"],   // itens de "- [ ]"
    concluidos: ["task A"],            // itens de "- [x]"
    agenda: "conteúdo raw da seção",
    resumo: "texto do resumo",
    reflexao: "texto da reflexão"
  },
  raw: "markdown completo"
}

// TasksFile (carregado por demanda)
{
  path: "...",
  empresa: "Reserva Fiscal",
  projeto: "CRM ReservaFiscal",
  feature: "004-correcoes-core",
  status: "rascunho",          // do frontmatter
  openTasks: ["T01 ...", ...], // "- [ ]" items
  doneTasks: ["T00 ..."]       // "- [x]" items
}
```

---

## Parser de Vault

### frontmatter.js

Extrai bloco `---` do início do arquivo e converte para objeto JS.

```
entrada: string markdown
saída:   { frontmatter: {}, body: string }
```

Campos extraídos: `tipo`, `empresa`, `projeto`, `feature`, `status`, `data`.

### vault-parser.js — extrair seções do Daily

Estratégia: split por `##` (H2), identificar seções por título parcial.

| Título H2 contém | Campo extraído |
|---|---|
| `"em aberto"` ou `"pendente"` | `sections.pendentes` — lista `- [ ]` |
| `"concluíd"` | `sections.concluidos` — lista `- [x]` |
| `"agenda"` | `sections.agenda` — texto raw |
| `"resumo"` | `sections.resumo` — texto raw |
| `"reflexão"` ou `"reflexao"` | `sections.reflexao` — texto raw |

### vault-parser.js — extrair tasks de TASKS.md

Regex: `^- \[ \] (.+)` → openTasks, `^- \[x\] (.+)` → doneTasks (case-insensitive no `x`).

---

## Estratégia de Cache

Sem cache persistente (localStorage) para conteúdo — o vault muda com frequência. Apenas:

1. **Índice da sessão:** `VaultIndex` construído na abertura do app (1 chamada `git/trees`), mantido em memória. Invalidado ao fechar o browser.
2. **Arquivos carregados:** mantidos em `Map` em memória durante a sessão. Recarregados a cada nova sessão.
3. **Config:** persistida em localStorage indefinidamente.

---

## PWA — manifest.json

```json
{
  "name": "Concierge",
  "short_name": "Concierge",
  "description": "Vault pessoal no smartphone",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0A0A0A",
  "theme_color": "#0A0A0A",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Service Worker: apenas para instalação como PWA (fetch passthrough). Sem cache de rede — leitura sempre ao vivo.

---

## Hosting — GitHub Actions

Pipeline de deploy no `concierge-mobile` repo:

```yaml
on: push (branch: main)
jobs:
  deploy:
    - npm ci
    - npm run build        # vite build → dist/
    - GitHub Pages deploy  # dist/ → gh-pages branch
```

URL final: `https://felippeabielcosta.github.io/concierge-mobile/`

---

## Design Tokens — mapeamento protótipo → CSS

O CSS do protótipo já é o CSS de produção. Mover para `src/style.css` sem alterações nos tokens. Única adição: estilos específicos de markdown renderizado pelo `marked.js` (tabelas, blockquotes, hr).

---

## Fluxo de Inicialização

```
1. App abre
2. Ler config do localStorage
   ├─ Sem config → exibir tela de Configuração
   └─ Com config → continuar
3. Chamar GET /repos/.../git/trees/main?recursive=1
   ├─ Erro 401 → banner "Token inválido"
   └─ Sucesso → construir VaultIndex em memória
4. Exibir tela Hoje
5. Chamar GET daily do dia atual
   ├─ 404 → estado vazio "Nenhum diário hoje"
   └─ Sucesso → parsear e renderizar
```

---

## Separação de Responsabilidades

| Módulo | Responsabilidade |
|---|---|
| `api/github.js` | Fetch + auth + decode Base64 + tratar erros HTTP |
| `api/vault.js` | Conhece a estrutura do vault (paths, nomes de pastas) |
| `parser/` | Transforma strings em objetos JS — sem conhecimento de API |
| `screens/` | Renderiza HTML a partir dos objetos — sem conhecimento de API |
| `store/config.js` | Isola acesso ao localStorage |
| `components/shell.js` | Gerencia tabs, header, navegação — sem conhecimento de dados |
