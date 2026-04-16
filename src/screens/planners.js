// screens/planners.js — tela Planners (US-04)

import { getFileContent } from '../api/github.js'
import { parseTasksFile }  from '../parser/vault-parser.js'
import { renderEmpty }     from '../components/empty.js'

const STATUS_ORDER = { 'aprovado': 0, 'em-build': 0, 'rascunho': 1, 'pendente': 1, 'concluido': 2, 'concluído': 2 }
const STATUS_LABEL = { 'aprovado': 'Aprovados', 'em-build': 'Em Build', 'rascunho': 'Em Rascunho', 'pendente': 'Em Rascunho', 'concluido': 'Concluídos', 'concluído': 'Concluídos' }
const STATUS_BADGE = { 'aprovado': 'b-approved', 'em-build': 'b-build', 'rascunho': 'b-draft', 'pendente': 'b-draft', 'concluido': 'b-done', 'concluído': 'b-done' }
const STATUS_TEXT  = { 'aprovado': 'Aprovado', 'em-build': 'Build', 'rascunho': 'Rascunho', 'pendente': 'Rascunho', 'concluido': 'Concluído', 'concluído': 'Concluído' }

let _initialized = false

export async function initPlanners(vaultIndex, config) {
  if (_initialized) return
  _initialized = true

  const screen = document.getElementById('screen-planners')
  screen.innerHTML = '<div style="padding:20px"><div class="sk" style="height:60px;margin-bottom:8px"></div><div class="sk" style="height:60px;margin-bottom:8px"></div><div class="sk" style="height:60px"></div></div>'

  try {
    const results = await Promise.allSettled(
      vaultIndex.tasks.map((t) => getFileContent(t.path, config))
    )

    const planners = results
      .map((r, i) => {
        if (r.status === 'rejected') return null
        return parseTasksFile(r.value, vaultIndex.tasks[i].path)
      })
      .filter(Boolean)

    if (!planners.length) {
      renderEmpty(screen, { icon: 'layers', title: 'Nenhum planner encontrado' })
      return
    }

    screen.innerHTML = renderPlanners(planners) + '<div style="height:20px"></div>'
  } catch (e) {
    renderEmpty(screen, { icon: 'layers', title: 'Erro ao carregar planners', sub: e.message })
  }
}

export function resetPlanners() { _initialized = false }

// ── render ────────────────────────────────────────────────────────────────────

function renderPlanners(planners) {
  const groups = {}

  for (const p of planners) {
    const status = (p.status || 'rascunho').toLowerCase()
    const groupLabel = STATUS_LABEL[status] ?? 'Em Rascunho'
    if (!groups[groupLabel]) groups[groupLabel] = { order: STATUS_ORDER[status] ?? 1, items: [] }
    groups[groupLabel].items.push(p)
  }

  return Object.entries(groups)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([label, { items }]) => `
      <div class="pl-group">
        <div class="pl-group-label">${label}</div>
        ${items.map((p) => renderCard(p)).join('')}
      </div>
    `).join('')
}

function renderCard(p) {
  const status = (p.status || 'rascunho').toLowerCase()
  const badgeClass = STATUS_BADGE[status] ?? 'b-draft'
  const badgeText  = STATUS_TEXT[status]  ?? 'Rascunho'
  const name = p.feature || p.projeto || p.path.split('/').slice(-2, -1)[0] || 'planner'
  const openCount = p.openTasks.length
  const sub = [p.empresa, openCount ? `${openCount} task${openCount > 1 ? 's' : ''} abertas` : ''].filter(Boolean).join(' · ')

  return `
    <div class="pl-card">
      <div class="pl-info">
        <div class="pl-name">${escHtml(name)}</div>
        <div class="pl-empresa">${escHtml(sub)}</div>
      </div>
      <span class="badge ${badgeClass}">${badgeText}</span>
    </div>
  `
}

function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
