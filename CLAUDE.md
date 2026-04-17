# claude.md — Concierge Mobile

## Sobre este projeto
- **Projeto:** Concierge Mobile
- **Empresa:** Forge Dev Lab
- **Tipo:** PWA (frontend puro, sem backend)
- **Descricao:** PWA de leitura do vault pessoal no smartphone via GitHub API
- **Status:** ativo

## Vault Central
Este projeto e gerenciado via Obsidian vault pessoal do Felippe Costa.
- **Vault:** `C:/Users/Cliente/Documents/GitHub/concierge/vault-concierge/`
- **Nota no vault:** [[PRJ-Concierge-Mobile]]
- **Empresa no vault:** `03-Empresas/Forge-Dev-Lab/`
- **Planner no vault:** `03-Empresas/Forge-Dev-Lab/Produtos/Concierge-Mobile/planner/001-concierge-mobile/`

## Napkin (Memoria Tatica)
Este projeto usa o sistema Napkin para aprendizado continuo do agente.
- **Arquivo:** `.claude/napkin.md`
- **Regra:** Ler no inicio de TODA sessao, antes de qualquer trabalho
- **Curar:** A cada leitura, repriorizar e remover itens obsoletos
- **Adicionar:** Quando corrigido pelo usuario, quando descobrir gotcha, quando receber diretiva

## Padroes Globais
Os padroes completos estao em `.standards/` neste repositorio. O agente DEVE consultar esses arquivos antes de tomar decisoes sobre estrutura, codigo ou UI.

- `.standards/convencoes-codigo.md` — Nomenclatura, git, testes, APIs
- `.standards/estrutura-pastas.md` — Organizacao de pastas do projeto
- `.standards/padroes-ui-ux.md` — Diretrizes visuais e de experiencia
- `.standards/protocolo-sync.md` — Como sincronizar mudancas com o vault

## Stack deste Projeto
- **Linguagem:** JavaScript (ESM, sem TypeScript)
- **Build:** Vite
- **Estilo:** CSS puro com custom properties
- **Icones:** Lucide (ESM import)
- **Markdown:** marked.js
- **Dados:** GitHub API REST (autenticado via PAT pessoal, somente leitura)
- **Auth:** Personal Access Token armazenado em localStorage
- **Hosting:** GitHub Pages (deploy via GitHub Actions)
- **Banco:** nenhum — vault e a fonte de verdade

## Comandos de Desenvolvimento
```bash
# Instalar dependencias
npm install

# Rodar em dev
npm run dev

# Build
npm run build

# Preview do build
npm run preview
```

## Design System
Consultar `planner/DESIGN.md` para tokens completos.

- **Cor de fundo:** `#0A0A0A`
- **Superficie:** `#141414`
- **Acento:** `#F97316` (laranja)
- **Sucesso:** `#22C55E`
- **Fonte:** Inter + JetBrains Mono (Google Fonts)
- **Icones:** Lucide

O arquivo `planner/prototype.html` e a referencia visual definitiva. O CSS do prototype e o CSS de producao.

## Convencoes Locais

- Sem framework — Vanilla JS com modulos ES nativos
- Sem TypeScript — JS puro para simplicidade
- Sem backend — toda leitura via GitHub API
- Somente leitura — nenhuma escrita no vault
- Token nunca enviado a servidor externo — apenas GitHub API oficial
- Cache apenas em memoria (Map) durante a sessao, exceto config (localStorage)
- Lazy init das telas: cada screen so e inicializada na primeira visita

## Dependencias com Outros Projetos
- **Vault concierge** — fonte de dados (repositorio `felippecostabiel-web/concierge`)
- Nao ha dependencias de outros projetos de codigo

## Planner (Documentacao Viva do Projeto)

Todo o planejamento esta em `planner/`. Ler antes de qualquer implementacao.

```
planner/
├── SPEC.md        → User stories aprovadas (5 stories, US-01 a US-05)
├── DESIGN.md      → Tokens de cor, tipografia, espacamento, layout das 5 telas
├── prototype.html → Referencia visual interativa — fonte da verdade visual
├── PLAN.md        → Stack, estrutura de arquivos, contratos GitHub API, modelo de dados
└── TASKS.md       → 26 tasks em 6 fases (F1 Setup → F7 Deploy)
```

### Fases do TASKS.md

- **F1 (T01-T05):** Setup — repo, Vite, PWA, HTML base
- **F2 (T06-T08):** API + Store — config localStorage, GitHub API client, VaultIndex
- **F3 (T09-T12):** Parser — frontmatter, daily sections, tasks, markdown
- **F4 (T13-T16):** Shell + CSS — tokens, skeleton, empty state, navegacao
- **F5 (T17-T22):** Screens — Hoje, Pendentes, Diarios, Reader, Planners, Config
- **F6 (T23):** Main — orquestracao, init, lazy loading
- **F7 (T24-T26):** Deploy — GitHub Actions, testes iOS/Android

F3 e F4 rodam em paralelo apos F2.

## Protocolo de Documentacao e Sync

Protocolo completo em `.standards/protocolo-sync.md`.

### OBRIGATORIO — Ao fazer mudanca significativa
Registrar em `docs/changelog.md`:
```markdown
## [YYYY-MM-DD] Titulo
- **O que:** descricao da mudanca
- **Por que:** motivacao
- **Impacto:** sistemas afetados
- **Vault:** pendente
```

### OBRIGATORIO — Ao tomar decisao tecnica
Registrar em `docs/changelog.md` com tipo `decisao`:
```markdown
## [YYYY-MM-DD] DEC — Titulo da decisao
- **Tipo:** decisao
- **Contexto:** situacao que gerou a necessidade
- **Alternativas:** opcoes consideradas
- **Decisao:** o que foi escolhido e por que
- **Impacto:** o que muda
- **Vault:** pendente
```

### Ao finalizar sessao de trabalho
1. Verificar se ha entries com `Vault: pendente` no changelog
2. Oferecer para sincronizar com o vault
3. Se aceito: criar LOG no vault e marcar como `Vault: sincronizado`
