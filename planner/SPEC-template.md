---
tipo: spec
empresa:
projeto:
feature:
status: [rascunho|revisao|aprovada|implementada]
data: {{date:YYYY-MM-DD}}
tags: [spec]
---

# Spec: [NOME DA FEATURE]

<!--
  SPEC = O QUE construir e PARA QUEM.
  Nao menciona tecnologia, framework ou banco de dados.
  Cada User Story deve ser INDEPENDENTEMENTE testavel — implementar so ela ja entrega valor.
  Se nao souber responder algo, marcar com [PRECISA CLARIFICACAO: motivo].
-->

---

## User Stories

<!--
  Ordenar por prioridade. P1 = minimo para validar a hipotese (MVP).
  Cada story deve ser: desenvolvivel, testavel e demonstravel de forma independente.
-->

### US1 — [Titulo] (P1) 🎯 MVP

[Descrever a jornada do usuario em linguagem natural. Quem faz o que, em qual contexto.]

**Por que P1:** [Qual valor esta story entrega e por que e a mais critica]

**Teste independente:** [Como validar esta story sem implementar as demais — que acao especifica demonstra que funciona]

**Acceptance Scenarios:**

1. **Dado** [estado inicial], **quando** [acao do usuario], **entao** [resultado esperado]
2. **Dado** [estado inicial], **quando** [acao do usuario], **entao** [resultado esperado]
3. **Dado** [estado inicial], **quando** [acao do usuario], **entao** [resultado esperado]

---

### US2 — [Titulo] (P2)

[Descrever a jornada do usuario em linguagem natural.]

**Por que P2:** [Qual valor adicional esta story entrega sobre o MVP]

**Teste independente:** [Como validar esta story com apenas US1 implementada]

**Acceptance Scenarios:**

1. **Dado** [estado inicial], **quando** [acao do usuario], **entao** [resultado esperado]
2. **Dado** [estado inicial], **quando** [acao do usuario], **entao** [resultado esperado]

---

### US3 — [Titulo] (P3)

[Descrever a jornada do usuario em linguagem natural.]

**Por que P3:** [Valor entregue]

**Teste independente:** [Como validar independentemente]

**Acceptance Scenarios:**

1. **Dado** [estado inicial], **quando** [acao do usuario], **entao** [resultado esperado]

---

<!-- Adicionar mais user stories conforme necessario, mantendo a prioridade e independencia -->

---

## Requisitos Funcionais

<!--
  RF = capacidades que o sistema DEVE ter para que as stories funcionem.
  Use DEVE para obrigatorio e PODE para opcional.
  Marcar [PRECISA CLARIFICACAO: ...] para qualquer requisito ambiguo.
-->

- **RF-001:** Sistema DEVE [capacidade especifica]
- **RF-002:** Sistema DEVE [capacidade especifica]
- **RF-003:** Usuario DEVE conseguir [interacao chave]
- **RF-004:** Sistema DEVE [comportamento de dados]
- **RF-005:** Sistema DEVE [requisito de seguranca/acesso]
- **RF-006:** Sistema DEVE [PRECISA CLARIFICACAO: detalhe nao definido]

### Entidades Principais *(incluir se a feature envolve dados)*

- **[Entidade 1]:** [O que representa, atributos-chave sem implementacao]
- **[Entidade 2]:** [O que representa, relacionamentos com outras entidades]

---

## Criterios de Sucesso

<!--
  Metricas mensuraveis e tecnologia-agnosticas.
  Definem quando a feature pode ser considerada bem-sucedida.
-->

- **CS-001:** [Metrica de usabilidade — ex: "Usuario conclui [acao] em menos de X minutos"]
- **CS-002:** [Metrica de performance — ex: "Sistema responde em menos de Xs com Y usuarios"]
- **CS-003:** [Metrica de satisfacao — ex: "X% dos usuarios completam [tarefa] na primeira tentativa"]
- **CS-004:** [Metrica de negocio — ex: "Reduzir [problema] em X%"]

---

## Assuncoes

<!--
  Decisoes tomadas quando a descricao nao especificou algum detalhe.
  Documentar para nao descobrir depois que o assumido estava errado.
-->

- [Assuncao sobre o usuario — ex: "Usuarios tem conexao estavel de internet"]
- [Assuncao sobre escopo — ex: "Suporte mobile e out of scope para v1"]
- [Assuncao sobre dados — ex: "Sistema existente de autenticacao sera reutilizado"]
- [Dependencia de sistema existente — ex: "Requer acesso a API do Ambiente Reserva"]

---

## Edge Cases

- O que acontece quando [condicao limite]?
- Como o sistema trata [cenario de erro]?
- O que acontece se [acao do usuario em estado invalido]?
