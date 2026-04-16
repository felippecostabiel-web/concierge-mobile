// screens/diarios.js — lista de diários + reader (US-03)

import { getFileContent }   from '../api/github.js'
import { renderMarkdown }   from '../parser/markdown.js'
import { parseFrontmatter } from '../parser/frontmatter.js'
import { renderEmpty }      from '../components/empty.js'
import { showReaderNav, updateReaderNav, closeReader } from '../components/shell.js'
import { createIcons, ChevronRight } from 'lucide'

const ICONS = { ChevronRight }

const MONTHS_LONG  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const MONTHS_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const WEEKDAYS     = ['Domingo','Segunda','Terça','Quarta','Quinta','Sexta','Sábado']

let _vaultIndex = null
let _config     = null
let _currentIdx = 0
let _initialized = false

export function initDiarios(vaultIndex, config) {
  if (_initialized) return
  _initialized = true

  _vaultIndex = vaultIndex
  _config     = config

  const screen = document.getElementById('screen-diarios')
  const dailies = vaultIndex.dailies

  if (!dailies.length) {
    renderEmpty(screen, { icon: 'book-open', title: 'Nenhum diário encontrado', sub: 'O vault não tem notas daily.' })
    return
  }

  screen.innerHTML = renderList(dailies) + '<div style="height:20px"></div>'
  createIcons({ icons: ICONS })

  // listener de clique nas cards
  screen.querySelectorAll('[data-date]').forEach((card) => {
    card.addEventListener('click', () => openReader(card.dataset.date))
  })
}

export function resetDiarios() { _initialized = false }

// ── lista ─────────────────────────────────────────────────────────────────────

function renderList(dailies) {
  const today   = toISODate(new Date())
  const thisWeekStart = getWeekStart(new Date())

  const groups = { hoje: [], semana: [], antigos: [] }

  for (const d of dailies) {
    if (d.date === today) groups.hoje.push(d)
    else if (d.date >= thisWeekStart) groups.semana.push(d)
    else groups.antigos.push(d)
  }

  let html = ''
  if (groups.hoje.length)   html += renderGroup('Hoje',         groups.hoje)
  if (groups.semana.length) html += renderGroup('Esta Semana',  groups.semana)
  if (groups.antigos.length)html += renderGroup('Mais Antigos', groups.antigos)
  return html
}

function renderGroup(label, dailies) {
  const today = toISODate(new Date())
  return `
    <div class="dly-group-label">${label}</div>
    <div class="dly-list">
      ${dailies.map((d) => renderCard(d, d.date === today)).join('')}
    </div>
  `
}

function renderCard(d, isToday) {
  const [y, m, day] = d.date.split('-')
  const date  = new Date(Number(y), Number(m) - 1, Number(day))
  const wkday = WEEKDAYS[date.getDay()]
  const month = MONTHS_SHORT[Number(m) - 1]

  return `
    <div class="dly-card${isToday ? ' today' : ''}" data-date="${d.date}" role="button" tabindex="0">
      <div class="dly-num">
        <div class="dly-day">${day}</div>
        <div class="dly-mon">${month}</div>
      </div>
      <div class="dly-info">
        <div class="dly-title">${escHtml(d.date)}</div>
        <div class="dly-sub">${wkday}</div>
      </div>
      <i data-lucide="chevron-right" class="dly-arr" style="width:16px;height:16px"></i>
    </div>
  `
}

// ── reader ────────────────────────────────────────────────────────────────────

async function openReader(date) {
  const dailies = _vaultIndex.dailies
  _currentIdx   = dailies.findIndex((d) => d.date === date)
  if (_currentIdx === -1) return

  // mostra screen reader
  document.getElementById('screen-diarios').classList.remove('active')
  const readerEl = document.getElementById('screen-reader')
  readerEl.classList.add('active')
  readerEl.innerHTML = '<div style="padding:20px"><div class="sk" style="height:24px;margin-bottom:16px;width:70%"></div><div class="sk" style="height:14px;margin-bottom:10px"></div><div class="sk" style="height:14px;margin-bottom:10px;width:80%"></div><div class="sk" style="height:14px;width:60%"></div></div>'

  showReaderNav({
    label:        navLabel(dailies[_currentIdx].date),
    prevDisabled: _currentIdx >= dailies.length - 1,
    nextDisabled: _currentIdx === 0,
    onPrev:       () => navigateDay(-1),
    onNext:       () => navigateDay(1),
  })

  await loadAndRender(_currentIdx)
}

async function loadAndRender(idx) {
  const entry = _vaultIndex.dailies[idx]
  const readerEl = document.getElementById('screen-reader')

  try {
    const raw  = await getFileContent(entry.path, _config)
    const { body } = parseFrontmatter(raw)

    // extrai H1 como título separado
    const titleMatch = body.match(/^#\s+(.+)$/m)
    const title   = titleMatch ? titleMatch[1] : entry.date
    const content = titleMatch ? body.replace(titleMatch[0], '').trimStart() : body

    readerEl.innerHTML = `
      <div style="padding:20px">
        <div class="rd-h1">${escHtml(title)}</div>
        ${renderMarkdown(content)}
        <div class="pad-bottom"></div>
      </div>
    `
    document.querySelector('.content').scrollTop = 0
  } catch {
    readerEl.innerHTML = `<div style="padding:20px"><p class="rd-p">Erro ao carregar diário.</p></div>`
  }
}

function navigateDay(dir) {
  // dir: +1 = mais recente (idx menor), -1 = mais antigo (idx maior)
  const next = _currentIdx + (-dir)
  if (next < 0 || next >= _vaultIndex.dailies.length) return
  _currentIdx = next

  updateReaderNav({
    label:        navLabel(_vaultIndex.dailies[_currentIdx].date),
    prevDisabled: _currentIdx >= _vaultIndex.dailies.length - 1,
    nextDisabled: _currentIdx === 0,
  })

  const readerEl = document.getElementById('screen-reader')
  readerEl.innerHTML = ''
  loadAndRender(_currentIdx)
}

function navLabel(date) {
  const [, m, d] = date.split('-')
  return `${d} ${MONTHS_SHORT[Number(m) - 1]}`
}

// ── utils ─────────────────────────────────────────────────────────────────────

function toISODate(d) { return d.toISOString().slice(0, 10) }
function getWeekStart(d) {
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return toISODate(new Date(d.setDate(diff)))
}
function escHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
