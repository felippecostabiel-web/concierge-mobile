// parser/vault-parser.js — extrai seções do Daily e tasks dos TASKS.md

import { parseFrontmatter } from './frontmatter.js'

// ── Daily ─────────────────────────────────────────────────────────────────────

/**
 * Parseia um arquivo Daily e retorna um objeto DailyNote.
 * @param {string} raw - conteúdo raw do arquivo .md
 * @param {string} date - YYYY-MM-DD
 */
export function parseDaily(raw, date) {
  const { frontmatter, body } = parseFrontmatter(raw)

  // título: primeiro H1
  const titleMatch = body.match(/^#\s+(.+)$/m)
  const title = titleMatch ? titleMatch[1].trim() : date

  // split por seções H2
  const sections = splitH2(body)

  return {
    date,
    title,
    frontmatter,
    sections: {
      pendentes: extractOpenTasks(findSection(sections, ['em aberto', 'pendente'])),
      concluidos: extractDoneTasks(findSection(sections, ['concluíd', 'concluido', 'feito'])),
      agenda:   findSection(sections, ['agenda']) ?? '',
      resumo:   findSection(sections, ['resumo']) ?? '',
      reflexao: findSection(sections, ['reflexão', 'reflexao']) ?? '',
    },
    raw,
  }
}

// ── Tasks file ────────────────────────────────────────────────────────────────

/**
 * Parseia um TASKS.md e retorna um objeto TasksFile.
 * @param {string} raw
 * @param {string} path - path completo no vault
 */
export function parseTasksFile(raw, path) {
  const { frontmatter } = parseFrontmatter(raw)

  return {
    path,
    empresa:   frontmatter.empresa ?? extractEmpresa(path),
    projeto:   frontmatter.projeto ?? '',
    feature:   frontmatter.feature ?? extractFeature(path),
    status:    frontmatter.status ?? 'desconhecido',
    openTasks: extractOpenTasks(raw),
    doneTasks: extractDoneTasks(raw),
  }
}

// ── helpers ───────────────────────────────────────────────────────────────────

/** Divide o body em seções mapeadas por título H2 (lowercase) */
function splitH2(body) {
  const parts = body.split(/^##\s+/m)
  const map = {}
  for (const part of parts) {
    const nl = part.indexOf('\n')
    if (nl === -1) continue
    const heading = part.slice(0, nl).trim().toLowerCase()
    map[heading] = part.slice(nl + 1)
  }
  return map
}

/** Encontra uma seção pelo título parcial (qualquer das keywords) */
function findSection(sections, keywords) {
  for (const [heading, content] of Object.entries(sections)) {
    if (keywords.some((k) => heading.includes(k))) return content
  }
  return null
}

/** Extrai itens de checkbox abertos: - [ ] texto */
function extractOpenTasks(text) {
  if (!text) return []
  return [...text.matchAll(/^- \[ \] (.+)$/gm)].map((m) => m[1].trim())
}

/** Extrai itens de checkbox fechados: - [x] texto (case-insensitive) */
function extractDoneTasks(text) {
  if (!text) return []
  return [...text.matchAll(/^- \[[xX]\] (.+)$/gm)].map((m) => m[1].trim())
}

function extractEmpresa(path) {
  const match = path.match(/03-Empresas\/([^/]+)/)
  return match ? match[1].replace(/-/g, ' ') : 'Vault'
}

function extractFeature(path) {
  const parts = path.split('/')
  const pi = parts.findIndex((p) => p === 'planner')
  return pi !== -1 ? (parts[pi + 1] ?? '') : ''
}
