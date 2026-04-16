// screens/hoje.js — tela Hoje (US-01)

import { getFileContent } from '../api/github.js'
import { getTodayDailyPath } from '../api/vault.js'
import { parseDaily } from '../parser/vault-parser.js'
import { renderEmpty } from '../components/empty.js'
import { createIcons, Sun, Calendar } from 'lucide'

const ICONS = { Sun, Calendar }

const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const MONTHS   = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

let _initialized = false

export async function initHoje(vaultIndex, config) {
  if (_initialized) return
  _initialized = true

  const screen = document.getElementById('screen-hoje')
  screen.innerHTML = renderShell()
  createIcons({ icons: ICONS })

  // data de hoje
  const now = new Date()
  document.getElementById('hoje-num').textContent = now.getDate()
  document.getElementById('hoje-wkd').textContent = WEEKDAYS[now.getDay()]

  // carregar daily
  const entry = getTodayDailyPath(vaultIndex)

  if (!entry) {
    document.getElementById('hoje-agenda').innerHTML = ''
    renderEmpty('hoje-pendentes', {
      icon: 'sun',
      title: 'Nenhum diário hoje',
      sub: 'Crie o daily no vault para vê-lo aqui',
    })
    document.getElementById('hoje-concluidos-block').style.display = 'none'
    document.getElementById('hoje-resumo-block').style.display = 'none'
    updateChips(0, 0, vaultIndex.tasks.length)
    return
  }

  try {
    const raw = await getFileContent(entry.path, config)
    const daily = parseDaily(raw, entry.date)
    renderDaily(daily, vaultIndex)
  } catch (e) {
    renderEmpty('hoje-pendentes', {
      icon: 'inbox',
      title: 'Erro ao carregar diário',
      sub: e.message,
    })
  }
}

export function resetHoje() { _initialized = false }

// ── render ────────────────────────────────────────────────────────────────────

function renderShell() {
  const now = new Date()
  return `
    <div class="hoje-hero">
      <div class="hoje-greeting">Bom dia, Felippe</div>
      <div class="hoje-date-row">
        <div>
          <div class="hoje-date" id="hoje-num">${now.getDate()}</div>
          <div class="hoje-weekday" id="hoje-wkd"></div>
        </div>
        <div class="hoje-dot"><i data-lucide="sun"></i></div>
      </div>
    </div>

    <div class="status-strip">
      <div class="status-chip">
        <span class="chip-label">Pendentes</span>
        <span class="chip-value c-orange" id="chip-pendentes">—</span>
        <span class="chip-sub">tasks abertas</span>
      </div>
      <div class="status-chip">
        <span class="chip-label">Concluídos</span>
        <span class="chip-value c-green" id="chip-concluidos">—</span>
        <span class="chip-sub">feitos hoje</span>
      </div>
      <div class="status-chip">
        <span class="chip-label">Planners</span>
        <span class="chip-value" id="chip-planners">—</span>
        <span class="chip-sub">em andamento</span>
      </div>
    </div>

    <div class="sec">
      <div class="sec-hdr"><span class="sec-title">Agenda de Hoje</span></div>
      <div id="hoje-agenda"></div>
    </div>

    <div class="sec">
      <div class="sec-hdr">
        <span class="sec-title">Em Aberto</span>
        <span class="badge-count bc-orange" id="badge-pendentes" style="display:none"></span>
      </div>
      <div id="hoje-pendentes"></div>
    </div>

    <div class="sec" id="hoje-concluidos-block">
      <div class="sec-hdr">
        <span class="sec-title">Concluído Hoje</span>
        <span class="badge-count bc-green" id="badge-concluidos" style="display:none"></span>
      </div>
      <div id="hoje-concluidos"></div>
    </div>

    <div class="sec" id="hoje-resumo-block">
      <div class="sec-hdr"><span class="sec-title">Resumo do Dia</span></div>
      <div id="hoje-resumo" style="font-size:14px;color:var(--text-2);line-height:1.7;padding-bottom:4px"></div>
    </div>

    <div class="pad-bottom"></div>
  `
}

function renderDaily(daily, vaultIndex) {
  // chips
  updateChips(daily.sections.pendentes.length, daily.sections.concluidos.length, vaultIndex.tasks.length)

  // agenda
  renderAgenda(daily)

  // pendentes
  renderTaskList('hoje-pendentes', 'badge-pendentes', daily.sections.pendentes, false)

  // concluídos
  if (daily.sections.concluidos.length > 0) {
    renderTaskList('hoje-concluidos', 'badge-concluidos', daily.sections.concluidos, true)
  } else {
    document.getElementById('hoje-concluidos-block').style.display = 'none'
  }

  // resumo
  const resumo = daily.sections.resumo.trim()
  if (resumo) {
    // pega primeiro parágrafo(s) sem markup
    const text = resumo.replace(/^#+.+$/gm, '').replace(/\*\*/g, '').trim()
    document.getElementById('hoje-resumo').textContent = text.slice(0, 400) + (text.length > 400 ? '…' : '')
  } else {
    document.getElementById('hoje-resumo-block').style.display = 'none'
  }
}

function updateChips(pendentes, concluidos, planners) {
  document.getElementById('chip-pendentes').textContent  = pendentes
  document.getElementById('chip-concluidos').textContent = concluidos
  document.getElementById('chip-planners').textContent   = planners
}

function renderAgenda(daily) {
  const container = document.getElementById('hoje-agenda')
  const agenda = daily.sections.agenda.trim()

  if (!agenda) {
    container.innerHTML = ''
    return
  }

  const now = new Date()
  const items = agenda
    .split('\n')
    .filter((l) => l.match(/^[-*]\s+/) || l.match(/^- \[[ x]\]/i))
    .map((l) => l.replace(/^[-*]\s+/, '').replace(/^- \[[ x]\]\s*/i, '').trim())
    .filter(Boolean)

  if (!items.length) { container.innerHTML = ''; return }

  const label = `${now.getDate()} de ${MONTHS[now.getMonth()]} · ${WEEKDAYS[now.getDay()].split('-')[0]}`
  container.innerHTML = `
    <div class="agenda-card">
      <div class="agenda-card-hdr">
        <i data-lucide="calendar"></i>
        <span>${label}</span>
      </div>
      <div class="agenda-card-body">
        ${items.map((i) => `<div class="agenda-item">${escHtml(i)}</div>`).join('')}
      </div>
    </div>
  `
  createIcons({ icons: ICONS })
}

function renderTaskList(containerId, badgeId, tasks, done) {
  const container = document.getElementById(containerId)
  const badge     = document.getElementById(badgeId)

  if (!tasks.length) {
    container.innerHTML = ''
    return
  }

  badge.textContent = tasks.length
  badge.style.display = 'inline-flex'

  const VISIBLE = 3
  const shown   = tasks.slice(0, VISIBLE)
  const hidden  = tasks.slice(VISIBLE)

  const dotClass  = done ? 'tc-dot tc-dot-done' : 'tc-dot'
  const textClass = done ? 'tc-text tc-text-done' : 'tc-text'
  const empClass  = done ? 'tc-empresa tc-empresa-done' : 'tc-empresa'

  const makeCard = (t) => `
    <div class="task-card">
      <div class="${dotClass}"></div>
      <div class="tc-body">
        <div class="${textClass}">${escHtml(t)}</div>
      </div>
    </div>
  `

  let html = shown.map(makeCard).join('')

  if (hidden.length) {
    const hiddenId = `${containerId}-hidden`
    const btnId    = `${containerId}-btn`
    html += `<div id="${hiddenId}" style="display:none">${hidden.map(makeCard).join('')}</div>`
    html += `<button class="show-more-btn" id="${btnId}">+ ${hidden.length} mais</button>`

    container.innerHTML = html
    document.getElementById(btnId).addEventListener('click', () => {
      const el  = document.getElementById(hiddenId)
      const btn = document.getElementById(btnId)
      const vis = el.style.display === 'none'
      el.style.display  = vis ? 'block' : 'none'
      btn.textContent   = vis ? 'Mostrar menos' : `+ ${hidden.length} mais`
    })
  } else {
    container.innerHTML = html
  }
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
}
