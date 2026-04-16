---
tipo: design
empresa: Forge Dev Lab
projeto: Concierge Mobile
feature: 001-concierge-mobile
status: aprovado
data: 2026-04-16
tags: [pwa, mobile, design, dark, produtividade]
---

# DESIGN: Concierge Mobile

## Identidade Visual

**Conceito:** Central de comando pessoal. Não é um app de notas — é um painel de situação. Visual denso, legível, sem distrações. Inspiração: Linear mobile + Obsidian dark theme.

**Modo:** Dark-only. Uso em mobilidade, muitas vezes em telas com brilho reduzido. Dark evita fadiga e combina com o contexto de "sistema operacional" do vault.

---

## Paleta de Cores

### Fundação

| Token | Hex | Uso |
|---|---|---|
| `--bg-base` | `#0D0D0D` | Background da página |
| `--bg-surface` | `#161616` | Cards, painéis |
| `--bg-elevated` | `#1F1F1F` | Modais, dropdowns |
| `--border` | `#2A2A2A` | Bordas sutis |
| `--border-hover` | `#3A3A3A` | Hover em bordas |

### Texto

| Token | Hex | Uso |
|---|---|---|
| `--text-primary` | `#F0F0F0` | Títulos, conteúdo principal |
| `--text-secondary` | `#A0A0A0` | Labels, metadados |
| `--text-muted` | `#555555` | Datas, placeholder |

### Acento

| Token | Hex | Uso |
|---|---|---|
| `--accent` | `#F97316` | Laranja — elemento ativo, CTA, destaque primário |
| `--accent-dim` | `#2D1700` | Background de badge laranja |

### Semântico

| Token | Hex | Uso |
|---|---|---|
| `--success` | `#22C55E` | Task concluída, status "aprovado" |
| `--success-dim` | `#14291D` | Background de badge success |
| `--warning` | `#F59E0B` | Alerta, status "rascunho" |
| `--warning-dim` | `#2D2206` | Background de badge warning |
| `--danger` | `#EF4444` | Erro, alerta crítico |
| `--danger-dim` | `#2D1010` | Background de badge danger |
| `--neutral` | `#6B7280` | Status "concluído", inativo |

---

## Tipografia

**Fonte principal:** `Inter` (Google Fonts — sem instalação)
**Fonte mono:** `JetBrains Mono` — usada para renderizar conteúdo markdown (blocos de código, paths)

### Escala

| Nível | Tamanho | Peso | Line-height | Uso |
|---|---|---|---|---|
| `--text-xs` | 11px | 400 | 1.4 | Metadados, labels secundários |
| `--text-sm` | 13px | 400 | 1.5 | Corpo de listas, descrições |
| `--text-base` | 15px | 400 | 1.6 | Conteúdo markdown principal |
| `--text-md` | 17px | 500 | 1.4 | Subtítulos de seção |
| `--text-lg` | 20px | 600 | 1.3 | Título do card / nome do planner |
| `--text-xl` | 24px | 700 | 1.2 | Título de tela |
| `--text-date` | 34px | 300 | 1.0 | Data grande na tela Hoje |

---

## Espaçamento

Base: **4px**

| Token | Valor | Uso |
|---|---|---|
| `--space-1` | 4px | Gap interno mínimo |
| `--space-2` | 8px | Padding de badges |
| `--space-3` | 12px | Gap entre elementos de lista |
| `--space-4` | 16px | Padding de cards |
| `--space-5` | 20px | Padding horizontal da tela |
| `--space-6` | 24px | Espaçamento entre seções |
| `--space-8` | 32px | Separação de blocos maiores |

---

## Ícones

**Biblioteca:** Lucide (SVG inline, leve, consistente)

| Contexto | Ícone |
|---|---|
| Tab — Hoje | `sun` |
| Tab — Pendentes | `circle-check` |
| Tab — Diários | `book-open` |
| Tab — Planners | `layers` |
| Empresa Reserva Fiscal | `building-2` |
| Empresa Marechal Barbearia | `scissors` |
| Empresa ASX | `truck` |
| Empresa Vault | `folder-open` |
| Status aprovado | `check-circle-2` |
| Status rascunho | `file-clock` |
| Status em-build | `hammer` |
| Status bloqueado | `lock` |
| Configurações | `settings` |
| Navegação anterior | `chevron-left` |
| Navegação próxima | `chevron-right` |
| Loading | `loader-2` (animated) |
| Erro | `alert-triangle` |

---

## Layout e Navegação

### Shell do App

```
┌─────────────────────────┐
│  [header: data + título]│  ← fixo, 56px
├─────────────────────────┤
│                         │
│     [conteúdo]          │  ← scroll vertical
│                         │
├─────────────────────────┤
│  [bottom nav: 4 tabs]   │  ← fixo, 64px + safe area
└─────────────────────────┘
```

**Header:**
- Background: `--bg-base` com borda inferior `--border`
- Esquerda: título da tela atual
- Direita: ícone de configurações (apenas na tela Hoje)
- Altura: 56px

**Bottom Navigation:**
- 4 tabs: Hoje / Pendentes / Diários / Planners
- Tab ativa: texto + ícone na cor `--accent`
- Tab inativa: `--text-muted`
- Background: `--bg-surface` com borda superior `--border`
- Altura: 64px + `env(safe-area-inset-bottom)` (suporte a iPhone com notch)
- Área de toque mínima: 44×44px por tab

---

## Telas

### Tela 1 — Hoje (US-01)

```
┌─────────────────────────┐
│  Hoje          [⚙]      │
├─────────────────────────┤
│  Quarta-feira           │
│  16 de Abril            │
│                         │
│  ── Agenda ─────────────│
│  [card agenda do dia]   │
│                         │
│  ── Em Aberto ──────────│
│  ○ task 1               │
│  ○ task 2               │
│  ○ task 3               │
│  + 4 mais               │
│                         │
│  ── Concluído ──────────│
│  ✓ task A               │
│  ✓ task B               │
│                         │
│  ── Resumo ─────────────│
│  [texto da seção        │
│   Resumo do daily]      │
├─────────────────────────┤
│ [Hoje][Pend][Diár][Plan]│
└─────────────────────────┘
```

**Componentes:**
- Data: fonte `--text-date` + `--text-xl`, cor `--text-primary`
- Seções: label `--text-sm` `--text-muted` uppercase + linha separadora `--border`
- Task aberta: ponto cinza `--text-secondary` + texto `--text-base`
- Task fechada: check verde `--success` + texto riscado `--text-muted`
- "N mais": link `--accent` que expande a lista
- Agenda: card com fundo `--bg-surface`, border-left 3px `--accent`
- Se daily não existir: estado vazio com ícone `sun` e texto "Nenhum diário registrado hoje"

---

### Tela 2 — Pendentes (US-02)

```
┌─────────────────────────┐
│  Pendentes              │
├─────────────────────────┤
│  [🏢] Reserva Fiscal  12│
│  ├─ 021-nfe-ui      3   │
│  │  ○ T01 Criar...      │
│  │  ○ T02 Refatorar...  │
│  ├─ CRM 004-core    5   │
│  │  ○ T06 Query...      │
│  │  ...                 │
│  └─ BI MVP          4   │
│                         │
│  [✂] Marechal Barbearia │
│  ├─ BarberPro 001   3   │
│  │  ○ TK-001 ...        │
│                         │
│  [🚛] ASX Transportes   │
│  └─ ASX MVP 001     8   │
│     ○ ...               │
├─────────────────────────┤
│ [Hoje][Pend][Diár][Plan]│
└─────────────────────────┘
```

**Componentes:**
- Empresa: row com ícone + nome bold + contagem badge `--accent`
- Feature: subtítulo `--text-sm` `--text-secondary` + contagem `--text-muted`
- Task: `- [ ]` renderizada como item de lista simples (sem checkbox interativo)
- Accordion por empresa: expandida por padrão, colapsável com toque no header

---

### Tela 3 — Diários (US-03)

**Sub-tela: Lista**
```
┌─────────────────────────┐
│  Diários                │
├─────────────────────────┤
│  Hoje                   │
│  ┌─────────────────────┐│
│  │ 16 Abr · Quarta    ▶││
│  │ ART + CRM + Plugins ││
│  └─────────────────────┘│
│                         │
│  Esta semana            │
│  ┌─────────────────────┐│
│  │ 15 Abr · Terça     ▶││
│  │ ...                 ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ 14 Abr · Segunda   ▶││
│  └─────────────────────┘│
│                         │
│  Mais antigos           │
│  13 Abr  12 Abr  ...   │
├─────────────────────────┤
│ [Hoje][Pend][Diár][Plan]│
└─────────────────────────┘
```

**Sub-tela: Leitor de Daily**
```
┌─────────────────────────┐
│  ‹  16 de Abril   ›     │  ← navegação entre dias
├─────────────────────────┤
│  # Título do Daily      │
│                         │
│  ## Resumo              │
│  [texto...]             │
│                         │
│  ## O que foi feito     │
│  ### Seção 1            │
│  [texto...]             │
│                         │
│  ## Em aberto           │
│  - [ ] item 1           │
│  - [x] item 2           │
│                         │
│  ## Reflexão            │
│  [texto...]             │
├─────────────────────────┤
│ [Hoje][Pend][Diár][Plan]│
└─────────────────────────┘
```

**Componentes:**
- Card de daily na lista: data grande + título (extraído do H1) + preview
- Leitor: markdown renderizado com estilos limpos
- Setas ‹ › no header para dia anterior / próximo
- H1: `--text-xl` `--text-primary`
- H2: `--text-lg` `--text-secondary` + margin-top `--space-6`
- H3: `--text-md` `--text-secondary`
- `- [ ]`: ponto cinza, sem interatividade
- `- [x]`: check verde, texto com opacidade 50%
- Código inline: fundo `--bg-elevated`, mono font, padding horizontal 4px
- Bold: `--text-primary` font-weight 600

---

### Tela 4 — Planners (US-04)

```
┌─────────────────────────┐
│  Planners               │
├─────────────────────────┤
│  Em Build               │
│  ┌─────────────────────┐│
│  │ BarberPro 001    🔨 ││
│  │ Marechal · aprovado ││
│  └─────────────────────┘│
│                         │
│  Em Rascunho            │
│  ┌─────────────────────┐│
│  │ CRM 004-core   📄   ││
│  │ Reserva Fiscal      ││
│  └─────────────────────┘│
│  ┌─────────────────────┐│
│  │ BI MVP 001     📄   ││
│  └─────────────────────┘│
│                         │
│  Concluídos             │
│  ...                    │
├─────────────────────────┤
│ [Hoje][Pend][Diár][Plan]│
└─────────────────────────┘
```

**Componentes:**
- Agrupado por status: Em Build / Em Rascunho / Concluídos
- Card: nome do planner + empresa + badge de status colorido
- Badge cores: aprovado=`--success`, rascunho=`--warning`, concluído=`--neutral`
- Toque abre o TASKS.md renderizado em leitor simples

---

### Tela 5 — Configuração (US-05)

```
┌─────────────────────────┐
│  Configuração           │
├─────────────────────────┤
│  GitHub Token           │
│  [●●●●●●●●●●●●●●●●] 👁  │
│                         │
│  Owner (usuário/org)    │
│  [felippeabielcosta   ] │
│                         │
│  Repositório            │
│  [concierge           ] │
│                         │
│  Branch                 │
│  [main                ] │
│                         │
│  [Testar Conexão]       │
│  ✓ Conectado — 247 arq  │
│                         │
│  [Salvar]               │
│                         │
│  ─────────────────────  │
│  [Limpar configuração]  │
│  (remove token local)   │
├─────────────────────────┤
│ [Hoje][Pend][Diár][Plan]│
└─────────────────────────┘
```

---

## Estados Globais

### Loading
- Skeleton screens (não spinner centralizado) — blocos cinza animados no lugar do conteúdo
- Cor do skeleton: `--bg-elevated` com animação pulse

### Erro de Conexão
- Banner topo da tela: fundo `--danger-dim`, borda `--danger`, ícone `alert-triangle`
- Texto: "Erro ao carregar. Verifique o token." + botão "Tentar novamente"

### Sem Conteúdo
- Ícone Lucide relevante + texto descritivo + sub-texto de orientação
- Exemplo: ícone `sun` + "Nenhum diário hoje" + "Crie o daily no vault para vê-lo aqui"

---

## Comportamento Mobile

- **Área de toque mínima:** 44×44px em todos os elementos interativos
- **Scroll:** apenas vertical, sem scroll horizontal
- **Overscroll:** nativo do browser (pull-to-refresh desabilitado — não há escrita)
- **Texto:** selecionável (útil para copiar tasks)
- **Safe areas:** `env(safe-area-inset-*)` aplicado no header e bottom nav
- **Viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">`
- **Instalação como PWA:** manifest.json com nome "Concierge", ícone, `display: standalone`
