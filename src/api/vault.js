// api/vault.js — conhece a estrutura do vault e constrói o índice

/**
 * Constrói o VaultIndex a partir da árvore do repositório.
 * Identifica dailies e arquivos TASKS.md dos planners.
 */
export function buildVaultIndex(tree) {
  const blobs = tree.filter((n) => n.type === 'blob')

  // Dailies: arquivos .md dentro de qualquer pasta /Daily/
  const dailies = blobs
    .filter((n) => n.path.includes('/Daily/') && n.path.endsWith('.md'))
    .map((n) => {
      const filename = n.path.split('/').pop().replace('.md', '')
      // aceita tanto YYYY-MM-DD quanto DD-MM-YYYY
      const date = normalizeDate(filename)
      return { date, path: n.path }
    })
    .filter((d) => d.date) // descarta nomes sem data válida
    .sort((a, b) => b.date.localeCompare(a.date)) // mais recente primeiro

  // Tasks: TASKS.md dentro de pastas /planner/
  const tasks = blobs
    .filter((n) => n.path.endsWith('TASKS.md') && n.path.includes('/planner/'))
    .map((n) => {
      const parts = n.path.split('/')
      const featureIdx = parts.findIndex((p) => p === 'planner') + 1
      const feature = parts[featureIdx] ?? 'desconhecido'
      const empresa = extractEmpresa(n.path)
      return { path: n.path, feature, empresa, status: null }
    })

  return { dailies, tasks }
}

/** Retorna o path do daily de hoje (formato YYYY-MM-DD) */
export function getTodayDailyPath(vaultIndex) {
  const today = toISODate(new Date())
  return getDailyPath(vaultIndex, today)
}

/** Retorna o path do daily de uma data específica (YYYY-MM-DD) */
export function getDailyPath(vaultIndex, date) {
  return vaultIndex.dailies.find((d) => d.date === date) ?? null
}

// ── helpers ──────────────────────────────────────────────────────────────────

function toISODate(d) {
  return d.toISOString().slice(0, 10)
}

/** Normaliza YYYY-MM-DD ou DD-MM-YYYY para YYYY-MM-DD */
function normalizeDate(str) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str
  if (/^\d{2}-\d{2}-\d{4}$/.test(str)) {
    const [d, m, y] = str.split('-')
    return `${y}-${m}-${d}`
  }
  return null
}

/** Extrai o nome da empresa do path (pasta após 03-Empresas/) */
function extractEmpresa(path) {
  const match = path.match(/03-Empresas\/([^/]+)/)
  if (!match) return 'Vault'
  return match[1].replace(/-/g, ' ')
}
