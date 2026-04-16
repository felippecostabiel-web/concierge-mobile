# Protocolo de Sincronizacao — Projeto → Vault

> Define como mudancas nos projetos individuais alimentam o vault central. O vault e a fonte de verdade para gestao; os repositorios sao a fonte de verdade para codigo.

## Principio

```
Repositorio do Projeto  →  docs/changelog.md     →  Vault (Logs/ + notas de projeto)
                         →  decisoes tecnicas     →  Vault (Decisoes/) + planner/CHANGELOG.md
                         →  novas APIs            →  Vault (01-Atlas/APIs/)
                         →  criacao/edicao modulo →  planner/CHANGELOG.md + planner/<modulo>/README.md
```

O vault nunca contem codigo. Ele contem **o que mudou, por que, e como isso afeta o todo.**
O planner/ contem o **contexto tecnico detalhado** que o agente precisa pra trabalhar no codigo.

## O que deve ser sincronizado

### Sempre sincronizar (obrigatorio)
| Evento no Projeto | Acao no Repo | Acao no Vault |
|-------------------|-------------|---------------|
| Feature/modulo criado | `docs/changelog.md` + `planner/CHANGELOG.md` + `planner/<modulo>/README.md` | Criar LOG em Logs/ |
| Feature/modulo editado | `docs/changelog.md` + `planner/CHANGELOG.md` + atualizar `planner/<modulo>/README.md` | Criar LOG em Logs/ |
| Decisao tecnica tomada | `docs/changelog.md` (tipo decisao) + `planner/CHANGELOG.md` | Criar DEC em Decisoes/ |
| Mudanca que afeta outro projeto | `docs/changelog.md` | Atualizar nota do projeto afetado + LOG |
| Nova API criada/modificada | `docs/changelog.md` | Criar/atualizar nota em `01-Atlas/APIs/` |
| Bug critico corrigido | `docs/changelog.md` | LOG com contexto do problema |
| Mudanca de status do projeto | `planner/PROJETO.md` | Atualizar frontmatter do PRJ |

### Sincronizar periodicamente (semanal)
| O que | Acao no Vault |
|-------|---------------|
| Estado geral do backlog | Atualizar secao "Backlog" na nota PRJ |
| Metricas relevantes | Atualizar secao "Metricas" na nota PRJ |
| Novos riscos/bloqueios | Atualizar secao "Riscos" + [[MOC-Processos]] |

### Nao sincronizar
- Commits individuais (fica no git)
- Bugs menores e fixes triviais
- Mudancas de estilo/refatoracao sem impacto funcional

## Formato de Sync

### Dentro do projeto (docs/changelog.md)
O agente trabalhando no projeto registra mudancas no changelog local:

```markdown
## [2026-03-21] Integrar API de honorarios com CRM
- **O que:** Novo endpoint /api/v1/honorarios disponivel para CRM
- **Por que:** CRM precisa exibir honorarios pendentes por cliente
- **Impacto:** CRM-ReservaFiscal precisa consumir novo endpoint
- **Vault:** pendente
```

### Exportacao para o vault
Quando o campo `Vault: pendente` existir, o agente deve:

1. Ler o entry do changelog
2. Criar nota correspondente no vault (LOG ou DEC conforme o tipo)
3. Atualizar notas de projetos afetados
4. Atualizar MOCs relevantes
5. Marcar como `Vault: sincronizado` no changelog do projeto

## Como o agente executa o sync

### Opcao 1 — Sync manual (voce pede)
Voce diz ao agente: "Sincroniza as mudancas do [projeto] com o vault"
O agente:
1. Le `docs/changelog.md` do projeto
2. Filtra entries com `Vault: pendente`
3. Cria notas no vault
4. Atualiza links e MOCs
5. Marca como sincronizado

### Opcao 2 — Sync ao final de sessao
No `claude.md` do projeto, instruir o agente:
"Ao finalizar uma sessao de trabalho significativa, verificar se ha entries pendentes no changelog e oferecer para sincronizar com o vault."

### Opcao 3 — Sync em lote (semanal)
Na revisao semanal, voce percorre todos os projetos:
"Revise os changelogs de todos os projetos e sincronize tudo que esta pendente com o vault."

## Conflitos e Dependencias

Quando uma mudanca em um projeto afeta outro:

1. O agente cria LOG no vault mencionando ambos os projetos
2. Cria item de backlog no projeto afetado (se acao e necessaria)
3. Adiciona alerta na nota PRJ do projeto afetado

Exemplo: se Ambiente cria nova API que CRM precisa consumir:
- LOG no vault linkando [[PRJ-Ambiente-Reserva]] e [[PRJ-CRM-ReservaFiscal]]
- BKL no CRM: "Integrar com novo endpoint de honorarios do Ambiente"
- Nota do CRM atualizada com o novo backlog item

## Diagrama de Fluxo

```
[Trabalho no Projeto]
        |
        v
[Mudanca significativa?] --Nao--> [Seguir trabalhando]
        |
       Sim
        |
        v
[Registrar em docs/changelog.md]
        |
        v
[Afeta outro projeto?] --Sim--> [Marcar dependencia no changelog]
        |
       Nao
        |
        v
[Vault: pendente]
        |
        v
[Sync (manual/fim de sessao/semanal)]
        |
        v
[Criar LOG/DEC no vault + atualizar MOCs]
        |
        v
[Vault: sincronizado]
```
