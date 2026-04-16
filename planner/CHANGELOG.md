# [NOME DO PROJETO] — Histórico de Módulos & Guia de Desenvolvimento

Este documento serve como **filesystem do projeto**: registra o histórico de criação e edição de cada módulo, e define o processo obrigatório para criar ou modificar módulos.

---

## Processo Obrigatório: Criando um Novo Módulo

Sempre que um novo módulo for criado, siga este checklist:

### 1. Planejamento (planner/)
- [ ] Criar pasta em `planner/<nome-do-modulo>/`
- [ ] Criar `README.md` com: descrição, funcionalidades, UI/UX, tabelas, fluxos
- [ ] Definir as tabelas necessárias e seus relacionamentos
- [ ] Mapear endpoints da API (método, rota, auth, descrição)
- [ ] Documentar componentes de UI necessários
- [ ] Listar dependências com outros módulos

### 2. Banco de Dados
- [ ] Criar arquivo SQL de migração
- [ ] Definir tabelas respeitando multi-tenancy (se aplicável)
- [ ] Adicionar timestamps (`created_at`, `updated_at`)
- [ ] Criar índices para campos de busca frequente

### 3. Backend (API)
- [ ] Criar arquivo de rotas
- [ ] Aplicar middleware de autenticação/autorização
- [ ] Validar inputs
- [ ] Registrar rotas no entry point
- [ ] Testar endpoints

### 4. Frontend
- [ ] Criar service layer
- [ ] Criar página/componentes seguindo design system
- [ ] Registrar no roteamento e navegação

### 5. Integração
- [ ] Verificar conexões com outros módulos
- [ ] Atualizar módulos relacionados se necessário
- [ ] Testar fluxos cross-module

### 6. Documentação
- [ ] Registrar neste CHANGELOG
- [ ] Atualizar `planner/PROJETO.md` com status do módulo
- [ ] Registrar em `docs/changelog.md` (com `Vault: pendente`)

---

## Processo Obrigatório: Editando um Módulo Existente

### Antes de editar:
- [ ] Ler o `planner/<modulo>/README.md` para entender o contexto
- [ ] Verificar dependências com outros módulos
- [ ] Identificar impacto das mudanças

### Depois de editar:
- [ ] Registrar a alteração neste CHANGELOG
- [ ] Atualizar o README.md do módulo no planner
- [ ] Registrar em `docs/changelog.md` (com `Vault: pendente`)

---

## Processo Obrigatório: Registrando Decisões

Toda decisão técnica ou de produto DEVE ser registrada aqui e no `docs/changelog.md`.

### Formato do registro de decisão:
```
### [DATA] — DEC — Titulo da decisao
- **Contexto:** situacao que gerou a necessidade de decidir
- **Alternativas:** opcoes consideradas
- **Decisao:** o que foi escolhido e por que
- **Modulos afetados:** quais modulos mudam
- **Impacto:** o que muda a partir disso
```

Além disso, atualizar o `planner/<modulo>/README.md` dos módulos afetados pela decisão.

---

## Registro de Módulos

### Formato do registro de módulo:
```
### [DATA] — Nome do Módulo — AÇÃO
- **Status:** Criado | Editado | Expandido
- **Arquivos afetados:** lista de arquivos
- **Descrição:** o que foi feito
- **Dependências:** módulos relacionados
- **Próximos passos:** o que falta
```

---
