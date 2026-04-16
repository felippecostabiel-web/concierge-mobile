# Estrutura de Pastas Padrao — Projetos de Software

> Todo novo projeto de software deve seguir esta estrutura base. Adaptar conforme necessidade, mas manter o esqueleto.

## Estrutura Base

```
projeto/
├── claude.md              # Harness do projeto (convenções locais + link pro vault)
├── README.md              # Visao geral do projeto
├── docs/                  # Documentacao tecnica
│   ├── architecture.md    # Decisoes de arquitetura
│   ├── api.md             # Documentacao de APIs
│   └── changelog.md       # Historico de mudancas (alimenta o vault)
├── src/                   # Codigo fonte
│   ├── modules/           # Modulos/features
│   ├── shared/            # Codigo compartilhado
│   ├── config/            # Configuracoes
│   └── types/             # Tipos/interfaces
├── tests/                 # Testes
├── scripts/               # Scripts utilitarios
├── .env.example           # Variaveis de ambiente (exemplo, nunca commitar .env real)
└── package.json / requirements.txt / etc.
```

## Regras

### claude.md do projeto
Cada projeto deve ter seu proprio `claude.md` com:
- Referencia ao vault central: "Consultar vault em [caminho] para padroes globais"
- Convenções especificas do projeto
- Stack tecnologica
- Comandos de desenvolvimento (build, test, deploy)
- Instrucoes de sync com o vault (ver [[Protocolo-Sync]])

### docs/changelog.md
Este arquivo e a ponte entre o projeto e o vault. Toda mudanca significativa deve ser registrada aqui no formato:

```markdown
## [YYYY-MM-DD] Titulo da mudanca
- **O que mudou:** descricao
- **Por que:** motivacao
- **Impacto:** sistemas afetados
- **Vault:** [sim|nao] (se ja foi sincronizado com o vault)
```

### Nomenclatura
- Pastas: kebab-case (`user-management`, nao `UserManagement`)
- Arquivos de codigo: seguir convenção da linguagem
- Arquivos de doc: kebab-case.md

## Adaptacoes por Tipo de Projeto

### Projeto com Frontend
Adicionar:
```
├── src/
│   ├── components/      # Componentes UI
│   ├── pages/           # Paginas/telas
│   ├── styles/          # Estilos globais (seguir [[Padroes-UI-UX]])
│   ├── hooks/           # Custom hooks
│   └── assets/          # Imagens, icones, fontes
```

### Projeto de Agente IA
Adicionar:
```
├── src/
│   ├── agents/          # Definicao de agentes
│   ├── tools/           # Ferramentas/skills do agente
│   ├── prompts/         # System prompts e templates
│   └── knowledge/       # Base de conhecimento local
```

### Projeto de API/Backend
Adicionar:
```
├── src/
│   ├── routes/          # Endpoints
│   ├── services/        # Logica de negocio
│   ├── models/          # Modelos de dados
│   ├── middleware/       # Middlewares
│   └── database/        # Migrations, seeds
```
