---
tipo: tasks
empresa:
projeto:
feature:
spec: planner/[###-feature]/SPEC.md
plano: planner/[###-feature]/PLAN.md
data: {{date:YYYY-MM-DD}}
tags: [tasks]
---

# Tasks: [NOME DA FEATURE]

<!--
  TASKS = QUEM faz O QUE, em QUE ORDEM, o que pode rodar EM PARALELO.
  Derivado do PLAN.md + SPEC.md. Ler ambos antes de preencher.

  Formato de cada task: [ID] [P?] [USn] Descricao com caminho exato do arquivo

  [P]   = pode rodar em paralelo (arquivos diferentes, sem dependencia)
  [USn] = qual user story esta task pertence (US1, US2, US3...)

  Regra: models antes de services, services antes de routes/endpoints.
  Regra: testes (se solicitados) escritos ANTES da implementacao.
-->

**Spec:** SPEC.md | **Plano:** PLAN.md

---

## Fase 1 — Setup

**Objetivo:** Estrutura do projeto e dependencias base

- [ ] T001 Criar estrutura de pastas conforme PLAN.md
- [ ] T002 Instalar dependencias do backend ([lista conforme PLAN.md])
- [ ] T003 [P] Instalar dependencias do frontend ([lista conforme PLAN.md])
- [ ] T004 [P] Criar docker-compose.yml com banco de dados e servicos necessarios

---

## Fase 2 — Fundacao (BLOQUEANTE)

**Objetivo:** Infraestrutura que TODAS as user stories dependem

⚠️ **Nenhuma user story comeca antes desta fase terminar**

- [ ] T005 Criar schema do banco (Prisma ou SQL) com todas as tabelas do PLAN.md
- [ ] T006 Rodar migration inicial — gerar tabelas no banco
- [ ] T007 [P] Implementar middleware de autenticacao em backend/src/middleware/auth.js
- [ ] T008 [P] Implementar estrutura base da API (entry point, error handler, CORS)
- [ ] T009 [P] Criar instancia do cliente HTTP configurada no frontend
- [ ] T010 Criar seed com dados iniciais de teste (usuarios, dados base)

**Checkpoint:** Banco rodando, auth funcionando, frontend consegue fazer request autenticado ✓

---

## Fase 3 — US1: [Titulo] (P1) 🎯 MVP

**Goal:** [O que esta story entrega ao ser concluida]

**Teste independente:** [Como verificar que US1 funciona sem as demais stories]

### Backend US1

- [ ] T011 [P] [US1] Criar [Entidade1]Service em backend/src/services/[entidade1]Service.js
- [ ] T012 [P] [US1] Criar [Entidade2]Service em backend/src/services/[entidade2]Service.js
- [ ] T013 [US1] Implementar rotas /[recurso] com validacao Zod em backend/src/routes/[recurso].js (depende de T011)
- [ ] T014 [US1] Registrar rotas no entry point da API

### Frontend US1

- [ ] T015 [P] [US1] Criar pagina [NomePagina] em frontend/src/pages/[NomePagina].jsx
- [ ] T016 [P] [US1] Criar componente [NomeComponente] em frontend/src/components/[NomeComponente].jsx
- [ ] T017 [US1] Conectar pagina com queries/mutations (TanStack Query ou equivalente) (depende de T015)
- [ ] T018 [US1] Integrar formularios com validacao no frontend

**Checkpoint:** [Descricao concreta do que esta funcionando ao fim desta fase] ✓

---

## Fase 4 — US2: [Titulo] (P2)

**Goal:** [O que esta story entrega]

**Teste independente:** [Como verificar que US2 funciona com apenas US1 implementada]

### Backend US2

- [ ] T019 [US2] Criar [Entidade]Service em backend/src/services/[entidade]Service.js
- [ ] T020 [US2] Implementar rotas /[recurso] em backend/src/routes/[recurso].js (depende de T019)
- [ ] T021 [US2] Registrar rotas no entry point

### Frontend US2

- [ ] T022 [P] [US2] Criar componente [NomeComponente] em frontend/src/components/[NomeComponente].jsx
- [ ] T023 [US2] Integrar componente na pagina relevante (depende de T015, T022)

**Checkpoint:** [Descricao do que esta funcionando — US1 e US2 ambas operacionais] ✓

---

## Fase 5 — US3: [Titulo] (P3)

**Goal:** [O que esta story entrega]

**Teste independente:** [Como verificar que US3 funciona com US1 e US2 implementadas]

### Backend US3

- [ ] T024 [US3] Implementar queries agregadas para [recurso] em backend/src/routes/[recurso].js
- [ ] T025 [US3] Registrar rota no entry point

### Frontend US3

- [ ] T026 [US3] Criar pagina [NomePagina] em frontend/src/pages/[NomePagina].jsx
- [ ] T027 [US3] Conectar com dados via TanStack Query

**Checkpoint:** Todas as user stories funcionando de forma independente ✓

---

<!-- Adicionar mais fases conforme necessario, uma por user story -->

---

## Fase N — Polish e Cortes Transversais

**Objetivo:** Melhorias que afetam multiplas stories

- [ ] TXXX [P] Loading states e tratamento de erros em todos os formularios
- [ ] TXXX Responsividade mobile nas paginas principais
- [ ] TXXX Variaveis de ambiente: .env.example documentado
- [ ] TXXX Atualizar docs/changelog.md (Vault: pendente)
- [ ] TXXX Rodar quickstart do projeto e validar fluxo completo

---

## Dependencias e Ordem de Execucao

### Ordem das Fases

- **Fase 1 (Setup):** sem dependencias — comecar imediatamente
- **Fase 2 (Fundacao):** depende do Setup — BLOQUEIA todas as stories
- **Fase 3+ (User Stories):** todas dependem da Fundacao
  - Executar em sequencia de prioridade (P1 → P2 → P3) se solo
  - Ou em paralelo se houver mais de um desenvolvedor
- **Fase N (Polish):** depende de todas as stories desejadas estarem concluidas

### Dentro de Cada Story

1. Backend: model/schema → service → routes → registrar no entry point
2. Frontend: pagina/componente → conectar com API → validacao e estados
3. Integracao e teste da story de forma independente
4. Commit e checkpoint antes de comecar a proxima story

### Paralelismo Disponivel

- Tasks marcadas com [P] dentro da mesma fase podem rodar simultaneamente
- Stories diferentes podem ser desenvolvidas em paralelo por pessoas diferentes
- Setup e Fundacao: tasks [P] podem rodar em paralelo entre si

---

## Estrategia de Entrega

### MVP First (apenas US1)

1. Fase 1: Setup
2. Fase 2: Fundacao
3. Fase 3: US1
4. **Parar e validar** — US1 funcionando de forma independente
5. Deploy/demo se aprovado

### Incremental

1. Setup + Fundacao
2. US1 → validar → deploy
3. US2 → validar → deploy
4. US3 → validar → deploy
5. Cada story adiciona valor sem quebrar as anteriores
