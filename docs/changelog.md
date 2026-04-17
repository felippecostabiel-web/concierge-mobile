# Changelog — Concierge Mobile

> Registre aqui TODAS as mudancas significativas e decisoes do projeto.
> Entries com `Vault: pendente` serao sincronizadas com o vault central.

---

## [2026-04-16] MVP completo — app no ar em producao

- **O que:** Implementacao completa do Concierge Mobile, do zero ao deploy em producao
- **Por que:** Necessidade de acessar vault pessoal (diarios, tasks, planners) pelo smartphone sem depender do PC
- **Impacto:** App disponivel em `https://felippecostabiel-web.github.io/concierge-mobile/`
- **Vault:** sincronizado (LOG-Concierge-Mobile-2026-04-16)

### Modulos implementados

| Modulo | Arquivo | Descricao |
|---|---|---|
| Store | `src/store/config.js` | Config PAT + repo em localStorage |
| GitHub API | `src/api/github.js` | Fetch autenticado, getTree, getFileContent |
| Vault Index | `src/api/vault.js` | Indexa dailies e TASKS.md do vault |
| Frontmatter | `src/parser/frontmatter.js` | Parser YAML do cabecalho dos .md |
| Vault Parser | `src/parser/vault-parser.js` | Extrai secoes do Daily e tasks abertas |
| Markdown | `src/parser/markdown.js` | marked.js com classes do design system |
| CSS | `src/style.css` | Design system completo (dark + laranja) |
| Shell | `src/components/shell.js` | Header, bottom nav, reader nav |
| Skeleton | `src/components/skeleton.js` | Loading states |
| Empty | `src/components/empty.js` | Estados vazios |
| Hoje | `src/screens/hoje.js` | Daily do dia + chips + agenda + tasks |
| Pendentes | `src/screens/pendentes.js` | Tasks abertas por empresa |
| Diarios | `src/screens/diarios.js` | Lista + reader com navegacao |
| Planners | `src/screens/planners.js` | Status dos planners por grupo |
| Config | `src/screens/config.js` | Setup PAT + teste de conexao |
| Main | `src/main.js` | Boot, lazy init, error handling |
| CI/CD | `.github/workflows/deploy.yml` | GitHub Actions → GitHub Pages |

---

## [2026-04-16] DEC — Vanilla JS + Vite sem framework

- **Tipo:** decisao
- **Contexto:** Escolha da stack para o PWA
- **Alternativas:** React + Vite, Vue + Vite, Vanilla JS + Vite
- **Decisao:** Vanilla JS — app e somente leitura, sem estado reativo complexo. Framework adicionaria bundle desnecessario
- **Impacto:** Bundle final de 76KB (gzip: 23KB). Zero dependencias de runtime alem de marked e lucide
- **Vault:** sincronizado (LOG-Concierge-Mobile-2026-04-16)

---

## [2026-04-16] DEC — GitHub API com git/trees?recursive=1

- **Tipo:** decisao
- **Contexto:** Como indexar o vault eficientemente sem muitas chamadas
- **Alternativas:** Chamar /contents recursivamente, usar Search API, usar git/trees
- **Decisao:** `GET /repos/.../git/trees/{branch}?recursive=1` — uma unica chamada indexa todo o vault
- **Impacto:** Boot rapido (~1 chamada API), depois carregamento por demanda por arquivo
- **Vault:** sincronizado (LOG-Concierge-Mobile-2026-04-16)

---

## [2026-04-16] DEC — GitHub Pages com repo publico

- **Tipo:** decisao
- **Contexto:** Hosting do PWA — repo estava privado, Pages exige publico (plano gratuito)
- **Alternativas:** Tornar publico, usar Vercel, usar Netlify
- **Decisao:** Tornar repo publico — codigo nao contem segredos (token fica em localStorage no dispositivo)
- **Impacto:** App acessivel sem autenticacao, vault permanece privado em repo separado
- **Vault:** sincronizado (LOG-Concierge-Mobile-2026-04-16)
