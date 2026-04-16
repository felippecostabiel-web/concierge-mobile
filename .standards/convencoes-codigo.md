# Convencoes de Codigo — Padrao Global

> Padroes que se aplicam a todos os projetos. O `claude.md` de cada projeto pode estender, mas nunca contradizer.

## Principios Gerais
1. Codigo legivel > codigo clever
2. Nomear variaveis e funcoes de forma descritiva (sem abreviacoes obscuras)
3. Funcoes pequenas com responsabilidade unica
4. Comentarios explicam o "por que", nao o "o que"
5. Tratar erros explicitamente (nunca engolir silenciosamente)

## Nomenclatura
- **Variaveis e funcoes:** camelCase (JS/TS) ou snake_case (Python)
- **Classes e tipos:** PascalCase
- **Constantes:** UPPER_SNAKE_CASE
- **Arquivos:** kebab-case
- **Branches git:** `tipo/descricao-curta` (ex: `feat/integrar-whatsapp`, `fix/calculo-honorarios`)

## Git
- Commits em portugues ou ingles (manter consistencia por projeto)
- Formato: `tipo: descricao curta`
  - `feat:` nova funcionalidade
  - `fix:` correcao de bug
  - `refactor:` refatoracao sem mudar comportamento
  - `docs:` documentacao
  - `test:` testes
  - `chore:` tarefas de manutencao
- Uma mudanca logica por commit
- Branch principal: `main`
- Feature branches a partir de `main`

## Testes
- Todo codigo critico deve ter teste
- Nomear testes descritivamente: `deve_calcular_honorario_com_desconto`
- Preferir testes de integracao para fluxos criticos
- Testes unitarios para logica de negocio isolada

## APIs
- REST como padrao (a menos que haja motivo para GraphQL)
- Versionamento na URL: `/api/v1/`
- Respostas consistentes:
  ```json
  { "success": true, "data": {...} }
  { "success": false, "error": { "code": "...", "message": "..." } }
  ```
- Autenticacao via Bearer token (JWT)
- Rate limiting em endpoints publicos

## Stack Preferida
> Atualizar conforme definido. Esta e a stack padrao para novos projetos.

- **Frontend:** (a definir)
- **Backend:** (a definir)
- **Banco:** (a definir)
- **ORM:** (a definir)
- **IA/Agentes:** (a definir)
- **Deploy:** (a definir)
