// screens/pendentes.js — tela Pendentes (US-02)

import { getFileContent } from '../api/github.js'
import { parseTasksFile }  from '../parser/vault-parser.js'
import { renderEmpty }     from '../components/empty.js'
import { createIcons, Building2, Scissors, Truck, FolderOpen, ChevronDown } from 'lucide'

const ICONS = { Building2, Scissors, Truck, FolderOpen, ChevronDown }

// Ordem e ícone por empresa
const EMPRESA_CONFIG = {
  'Forge Dev Lab':      { icon: 'folder-open', order: 0 },
  'Reserva Fiscal':     { icon: 'building-2',  order: 1 },
  'Marechal Barbearia': { icon: 'scissors',     order: 2 },
  'ASX Transportes':    { icon: 'truck',        order: 3 },
}

function empresaOrder(nome) {
  return EMPRESA_CONFIG[nome]?.order ?? 99
}

let _initialized = false

export async function initPendentes(vaultIndex, config) {
  if (_initialized) return
  _initialized = true

  const screen = document.getElementById('screen-pendentes')
  screen.innerHTML = '<div style="padding:20px"><div class="sk" style="height:60px;margin-bottom:8px"></div><div class="sk" style="height:60px;margin-bottom:8px"></div><div class="sk" style="height:60px"></div></div>'

  try {
    // carrega todos os TASKS.md em paralelo
    const results = await Promise.allSettled(
      vaultIndex.tasks.map((t) => getFileContent(t.path, config))
    )

    const tasksFiles = results
      .map((r, i) => {
        if (r.status === 'rejected') return null
        return parseTasksFile(r.value, vaultIndex.tasks[i].path)
      })
      .filter(Boolean)
      .filter((t) => t.openTasks.length > 0) // só exibe quem tem tasks abertas

    if (!tasksFiles.length) {
      renderEmpty(screen, { icon: 'inbox', title: 'Nenhuma task aberta', sub: 'Todos os planners estão em dia.' })
      return
    }

    screen.innerHTML = renderPendentes(tasksFiles) + '<div style="height:20px"></div>'
    createIcons({ icons: ICONS })
    registerToggles()

  } catch (e) {
    renderEmpty(screen, { icon: 'inbox', title: 'Erro ao carregar tasks', sub: e.message })
  }
}

export function resetPendentes() { _initialized = false }

// ── render ────────────────────────────────────────────────────────────────────

function renderPendentes(tasksFiles) {
  // agrupa por empresa
  const groups = {}
  for (const tf of tasksFiles) {
    const emp = tf.empresa || 'Vault'
    if (!groups[emp]) groups[emp] = []
    groups[emp].push(tf)
  }

  // ordena empresas
  const sorted = Object.entries(groups).sort(([a], [b]) => empresaOrder(a) - empresaOrder(b))

  return sorted.map(([empresa, files]) => {
    const totalOpen = files.reduce((s, f) => s + f.openTasks.length, 0)
    const icon = EMPRESA_CONFIG[empresa]?.icon ?? 'folder-open'
    const id   = `grp-${slugify(empresa)}`

    return `
      <div class="empresa-block" id="${id}">
        <div class="empresa-hdr" data-group="${id}">
          <i data-lucide="${icon}" class="emp-icon" style="width:18px;height:18px"></i>
          <span class="emp-name">${escHtml(empresa)}</span>
          <span class="emp-badge">${totalOpen}</span>
          <i data-lucide="chevron-down" class="emp-chev" style="width:16px;height:16px"></i>
        </div>
        <div class="emp-body">
          ${files.map((f) => renderFeatureBlock(f)).join('')}
        </div>
      </div>
    `
  }).join('')
}

function renderFeatureBlock(tf) {
  const name  = tf.feature || tf.projeto || tf.path.split('/').slice(-2, -1)[0] || 'tasks'
  const count = tf.openTasks.length
  return `
    <div class="feat-block">
      <div class="feat-label">
        ${escHtml(name)}
        <span class="fl-count">${count} ${count === 1 ? 'aberta' : 'abertas'}</span>
      </div>
      ${tf.openTasks.map((t) => `
        <div class="pt">
          <div class="pt-dot"></div>
          <span class="pt-text">${escHtml(t)}</span>
        </div>
      `).join('')}
    </div>
  `
}

function registerToggles() {
  document.querySelectorAll('[data-group]').forEach((hdr) => {
    hdr.addEventListener('click', () => {
      document.getElementById(hdr.dataset.group)?.classList.toggle('collapsed')
    })
  })
}

function slugify(str) { return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') }
function escHtml(s)   { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
