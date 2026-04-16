---
tipo: plano
empresa:
projeto:
feature:
spec: planner/[###-feature]/SPEC.md
data: {{date:YYYY-MM-DD}}
tags: [plano]
---

# Plano Tecnico: [NOME DA FEATURE]

<!--
  PLAN = COMO construir e COM O QUE.
  Traduz as decisoes da SPEC em decisoes tecnicas concretas.
  Ler a SPEC antes de preencher este arquivo.
  Verificar .standards/ antes de qualquer decisao de stack.
-->

**Spec:** [link para SPEC.md]
**Data:** {{date:YYYY-MM-DD}}

---

## Resumo

[2-3 frases descrevendo o que sera construido, a abordagem tecnica principal, e o escopo desta feature.]

---

## Stack e Decisoes Tecnicas

<!--
  Registrar APENAS as decisoes que precisam ser tomadas para ESTA feature.
  Para decisoes que ja estao no PROJETO.md, apenas referenciar.
  Incluir o MOTIVO de cada escolha — o "o que" esta no codigo, o "porque" precisa ficar aqui.
-->

| Decisao | Escolha | Motivo |
|---------|---------|--------|
| [ex: Framework frontend] | [escolha] | [motivo alinhado com .standards/] |
| [ex: ORM] | [escolha] | [motivo] |
| [ex: Autenticacao] | [escolha] | [motivo] |
| [ex: Storage] | [escolha] | [motivo] |

### Decisoes Descartadas

<!--
  Opcoes consideradas e rejeitadas. Documentar para nao revisitar o mesmo debate.
-->

- **[Opcao descartada]** — [motivo do descarte]

---

## Estrutura de Pastas

<!--
  Apenas os arquivos/pastas relevantes para ESTA feature.
  Seguir .standards/estrutura-pastas.md.
-->

```
[nome-do-projeto]/
├── backend/
│   └── src/
│       ├── routes/      [arquivos de rota desta feature]
│       ├── services/    [services desta feature]
│       └── middleware/  [middleware se necessario]
├── frontend/
│   └── src/
│       ├── pages/       [paginas desta feature]
│       └── components/  [componentes desta feature]
└── planner/
    └── [###-feature]/
        ├── SPEC.md
        ├── PLAN.md      (este arquivo)
        └── TASKS.md
```

---

## Modelo de Dados

<!--
  Tabelas novas ou modificadas por esta feature.
  Nao duplicar tabelas que ja existem — apenas referenciar.
-->

### [nome_tabela] *(nova)*

| Campo | Tipo | Restricoes | Descricao |
|-------|------|-----------|-----------|
| id | uuid | PK, NOT NULL, DEFAULT gen_random_uuid() | |
| [campo] | [tipo] | [restricoes] | [descricao] |
| created_at | timestamp | NOT NULL, DEFAULT now() | |
| updated_at | timestamp | NOT NULL, DEFAULT now() | |

> Relacionamentos:
> - [tabela_a] 1:N [tabela_b] via [campo_fk]

---

## Contratos de API

<!--
  Endpoints expostos por esta feature.
  Incluir metodo, rota, se requer auth, e descricao curta.
-->

| Metodo | Rota | Auth | Descricao |
|--------|------|------|-----------|
| GET | /api/[recurso] | sim | Listar com filtros |
| GET | /api/[recurso]/:id | sim | Buscar por ID |
| POST | /api/[recurso] | sim | Criar |
| PUT | /api/[recurso]/:id | sim | Atualizar |
| DELETE | /api/[recurso]/:id | sim | Remover (soft delete) |

---

## Verificacao de Convencoes

<!--
  Checklist rapido antes de comecar a construir.
  Consultar .standards/convencoes-codigo.md para os detalhes completos.
-->

- [ ] Nomenclatura de arquivos segue o padrao do projeto
- [ ] IDs usam UUID via gen_random_uuid()
- [ ] Datas em ISO 8601 / timestamps PostgreSQL
- [ ] Soft delete via deleted_at nas tabelas que precisam
- [ ] Validacao com Zod em todos os endpoints (body + params)
- [ ] Estrutura de erro padronizada
- [ ] Variaveis de ambiente documentadas no .env.example
