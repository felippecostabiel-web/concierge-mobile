# Napkin — Concierge Mobile

> Base de conhecimento viva deste repositorio. Leia no inicio de cada sessao. Cuide a cada leitura: repriorize, remova o que ficou obsoleto, mantenha max 10 itens por categoria.

## Execucao & Validacao

- [2026-04-16] **Dev server na porta 5174** — `npm run dev -- --port 5174` (5173 pode estar ocupada)
- [2026-04-16] **Build antes de commit** — sempre rodar `npm run build` para confirmar zero erros antes de push
- [2026-04-16] **Deploy automatico** — qualquer push na branch `main` dispara o GitHub Actions e publica em ~2 min

## Shell & Comandos

```bash
npm run dev      # dev server (localhost:5173)
npm run build    # build producao → dist/
npm run preview  # preview do build local
git push origin main  # dispara deploy automatico
```

## Comportamento de Dominio

- [2026-04-16] **Owner correto do vault:** `felippecostabiel-web` — NAO usar `felippeabielcosta` (nao existe)
- [2026-04-16] **Repo do vault:** `felippecostabiel-web/concierge`, branch `main`
- [2026-04-16] **URL de producao:** `https://felippecostabiel-web.github.io/concierge-mobile/`
- [2026-04-16] **base do Vite:** `/concierge-mobile/` — obrigatorio para GitHub Pages funcionar
- [2026-04-16] **Token PAT:** somente leitura (`repo` read) — nunca precisa de escrita
- [2026-04-16] **Daily format:** aceita `YYYY-MM-DD` e `DD-MM-YYYY` (vault tem os dois formatos)
- [2026-04-16] **Lazy init das screens:** Pendentes, Diarios e Planners so carregam na primeira visita a tab — nao no boot

## Diretivas do Usuario

- [2026-04-16] **Design:** dark + laranja (`#F97316`) como acento — referencia visual em `planner/prototype.html`
- [2026-04-16] **Sem framework:** Vanilla JS puro — nao sugerir React/Vue mesmo que pareca mais simples
- [2026-04-16] **Somente leitura:** nao implementar nenhuma escrita no vault, nem criar issues/PRs

<!--
REGRAS DE CURADORIA:
- Cada entry deve ter: data [YYYY-MM-DD], titulo, e acao explicita "Faca X em vez de Y"
- Maximo 10 itens por categoria
- Itens mais importantes primeiro
- Remover o que ficou obsoleto ou tem baixo sinal
- NAO e um log cronologico — e uma base de conhecimento para velocidade e confiabilidade
- Incluir: gotchas frequentes do repo, diretivas do usuario, taticas nao obvias comprovadas
- Excluir: notas avulsas, postmortems sem acao, erros sem orientacao acionavel
-->
