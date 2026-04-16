---
tipo: spec
empresa: Forge Dev Lab
projeto: Concierge Mobile
feature: 001-concierge-mobile
status: aprovado
data: 2026-04-16
tags: [pwa, github-api, mobile, vault, leitura, daily, tasks, agenda]
---

# SPEC: Concierge Mobile — Vault no Smartphone

## Problema

O vault é o sistema operacional pessoal do Felippe, mas está preso ao PC com Obsidian. Em movimento — entre reuniões, no celular, fora do escritório — não há acesso às atividades pendentes, ao diário do dia ou à agenda. A lacuna gera perda de contexto e dependência do PC para qualquer consulta rápida.

## Objetivo

Criar um PWA (Progressive Web App) de uso pessoal que lê o vault via GitHub API e entrega uma visão focada e legível no smartphone: **o que está aberto hoje, o que aconteceu no dia e o que vem pela frente.**

Somente leitura. Sem edição, sem commits, sem complexidade de escrita.

---

## Contexto Técnico

O vault já é um repositório Git no GitHub. Isso elimina a necessidade de backend próprio — a GitHub API REST consegue listar e ler qualquer arquivo do repositório gratuitamente. A autenticação é feita por Personal Access Token (PAT) com permissão `repo:read`, armazenado localmente no browser (localStorage). O PWA é hospedado como site estático (GitHub Pages ou similar), sem servidor.

**Fluxo de dados:**

```
Smartphone → PWA (browser) → GitHub API → arquivos .md do vault → parse → UI
```

---

## Usuários

Uso exclusivamente pessoal (Felippe Costa). Não há multiusuário, roles ou permissões a considerar.

---

## User Stories

### US-01 — Hoje em Foco
> Como usuário, quero abrir o app e ver imediatamente o resumo do dia de hoje: o que está pendente, o que já foi feito e qual é minha agenda.

**Critérios de aceite:**
- [ ] Tela inicial mostra data de hoje e carrega automaticamente o Daily do dia
- [ ] Exibe seção "Em aberto / Pendentes" extraída do Daily
- [ ] Exibe seção "Concluído hoje" extraída do Daily
- [ ] Exibe seção "Agenda" do arquivo `02-Calendario/Agenda/YYYY-MM-DD.md` (se existir)
- [ ] Se Daily do dia não existir, exibe mensagem clara (ex: "Nenhum diário registrado hoje")

---

### US-02 — Pendentes por Empresa
> Como usuário, quero ver um painel consolidado de tasks abertas por empresa, sem precisar navegar arquivo por arquivo.

**Critérios de aceite:**
- [ ] Lê todos os `TASKS.md` de planners com `status: aprovado` no frontmatter
- [ ] Agrupa tasks `- [ ]` por empresa (Reserva Fiscal / Marechal Barbearia / ASX / Vault-Concierge)
- [ ] Exibe nome do planner/feature como subtítulo de cada grupo
- [ ] Tasks `- [x]` não aparecem nessa view (filtradas)
- [ ] Mostra contagem total de tasks abertas por empresa

---

### US-03 — Histórico de Diários
> Como usuário, quero navegar entre os diários dos dias anteriores para consultar o que aconteceu.

**Critérios de aceite:**
- [ ] Lista os arquivos em `02-Calendario/Daily/` ordenados por data (mais recente primeiro)
- [ ] Ao tocar em um dia, carrega e renderiza o conteúdo do Daily correspondente
- [ ] Navegação por setas (anterior / próximo) dentro do diário aberto
- [ ] Markdown renderizado (headings, listas, checkboxes, bold/italic)

---

### US-04 — Status dos Planners
> Como usuário, quero ver rapidamente o status de todos os planners: o que está em build, o que está em rascunho, o que está bloqueado.

**Critérios de aceite:**
- [ ] Lista todos os `TASKS.md` com frontmatter `tipo: tasks`
- [ ] Exibe status (aprovado / rascunho / em-build / concluído)
- [ ] Agrupa por empresa
- [ ] Toque no planner abre o TASKS.md renderizado

---

### US-05 — Configuração Inicial
> Como usuário, quero configurar o acesso ao meu vault uma única vez e não precisar repetir.

**Critérios de aceite:**
- [ ] Tela de setup pede: GitHub Token (PAT), owner do repo, nome do repo, branch
- [ ] Token salvo em localStorage (não transmitido a nenhum servidor externo)
- [ ] Após salvar, redireciona para tela principal e testa a conexão
- [ ] Erro de autenticação exibe mensagem clara com link para gerar novo token
- [ ] Opção de redefinir configuração disponível nas configurações

---

## O que NÃO está no escopo

- Edição de qualquer arquivo do vault
- Criação de notas, tasks ou diários
- Notificações push
- Modo offline completo (cache agressivo)
- Autenticação OAuth (PAT pessoal é suficiente)
- Busca full-text no vault
- Renderização de Dataview queries (não executável fora do Obsidian)
- Suporte a múltiplos vaults

---

## Critérios de Sucesso do MVP

- [ ] Configuração em menos de 2 minutos na primeira abertura
- [ ] Tela inicial carrega em menos de 3 segundos (arquivos pequenos, GitHub API rápida)
- [ ] Daily do dia visível sem nenhuma navegação extra
- [ ] Pendentes consolidados por empresa legíveis e sem ruído
- [ ] Funciona no Safari iOS e Chrome Android

---

## Arquivos do Vault Lidos pelo App

| Arquivo/Pasta | Conteúdo extraído |
|---|---|
| `02-Calendario/Daily/YYYY-MM-DD.md` | Diário do dia — pendentes, concluídos, reflexão |
| `02-Calendario/Agenda/YYYY-MM-DD.md` | Agenda do dia (se existir) |
| `03-Empresas/**/planner/**/TASKS.md` | Tasks abertas por empresa/feature |
| Frontmatter de qualquer `.md` | `tipo`, `status`, `empresa`, `projeto` |
