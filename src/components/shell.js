// components/shell.js — header, bottom nav e troca de tabs

import { createIcons, Sun, CircleCheck, BookOpen, Layers, Settings, ChevronLeft, ChevronRight } from 'lucide'

const ICONS = { Sun, CircleCheck, BookOpen, Layers, Settings, ChevronLeft, ChevronRight }

const TAB_LABELS = {
  hoje:      'Central',
  pendentes: 'Pendentes',
  diarios:   'Diários',
  planners:  'Planners',
  config:    'Configuração',
}

let _currentTab = null
let _inReader   = false
let _onTabChange = null

/** Inicializa o shell: injeta ícones e registra listeners */
export function initShell({ onTabChange } = {}) {
  _onTabChange = onTabChange

  // ícone de settings no header
  document.getElementById('btn-settings').innerHTML =
    '<i data-lucide="settings"></i>'
  document.getElementById('btn-settings').addEventListener('click', () => showTab('config'))

  // ícones das tabs
  const tabIcons = { hoje: 'sun', pendentes: 'circle-check', diarios: 'book-open', planners: 'layers' }
  for (const [tab, icon] of Object.entries(tabIcons)) {
    const el = document.getElementById(`tab-${tab}`)
    const label = el.querySelector('span').textContent
    el.innerHTML = `<i data-lucide="${icon}"></i><span>${label}</span>`
    el.addEventListener('click', () => showTab(tab))
  }

  createIcons({ icons: ICONS })
}

/** Troca a tab ativa */
export function showTab(name) {
  if (_inReader) closeReader()

  document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'))
  document.querySelectorAll('.ntab').forEach((b) => b.classList.remove('active'))

  const screen = document.getElementById(`screen-${name}`)
  if (screen) screen.classList.add('active')

  const tab = document.getElementById(`tab-${name}`)
  if (tab) tab.classList.add('active')

  _currentTab = name
  document.getElementById('hdr-label').textContent = TAB_LABELS[name] ?? name

  const settingsBtn = document.getElementById('btn-settings')
  settingsBtn.style.display = name === 'hoje' ? 'flex' : 'none'

  removeReaderNav()

  _onTabChange?.(name)
}

/** Retorna a tab atual */
export function getCurrentTab() { return _currentTab }

/** Mostra a navegação do reader no header */
export function showReaderNav({ label, onPrev, onNext, prevDisabled, nextDisabled }) {
  removeReaderNav()
  _inReader = true

  document.getElementById('btn-settings').style.display = 'none'
  document.getElementById('hdr-label').textContent = ''

  const nav = document.createElement('div')
  nav.id = 'reader-nav'
  nav.className = 'hdr-reader-nav'
  nav.innerHTML = `
    <button id="rn-prev" aria-label="Dia anterior"><i data-lucide="chevron-left"></i></button>
    <span class="rn-label">${label}</span>
    <button id="rn-next" aria-label="Próximo dia"><i data-lucide="chevron-right"></i></button>
  `
  document.getElementById('main-hdr').appendChild(nav)

  document.getElementById('rn-prev').disabled = prevDisabled
  document.getElementById('rn-next').disabled = nextDisabled
  document.getElementById('rn-prev').addEventListener('click', onPrev)
  document.getElementById('rn-next').addEventListener('click', onNext)

  createIcons({ icons: ICONS })
}

/** Atualiza o label e estado dos botões do reader nav sem recriar */
export function updateReaderNav({ label, prevDisabled, nextDisabled }) {
  const lbl = document.querySelector('.rn-label')
  if (lbl) lbl.textContent = label
  const prev = document.getElementById('rn-prev')
  const next = document.getElementById('rn-next')
  if (prev) prev.disabled = prevDisabled
  if (next) next.disabled = nextDisabled
}

/** Fecha o reader e volta para a lista de diários */
export function closeReader() {
  _inReader = false
  document.getElementById('screen-reader').classList.remove('active')
  document.getElementById('screen-diarios').classList.add('active')
  removeReaderNav()
  document.getElementById('hdr-label').textContent = TAB_LABELS['diarios']
}

export function isInReader() { return _inReader }

function removeReaderNav() {
  document.getElementById('reader-nav')?.remove()
}

/** Exibe/esconde banner de erro global */
export function showErrorBanner(message, onRetry) {
  document.getElementById('error-banner')?.remove()

  const el = document.createElement('div')
  el.id = 'error-banner'
  el.className = 'error-banner'
  el.innerHTML = `
    <i data-lucide="alert-triangle"></i>
    <span>${message}</span>
    <button>Tentar novamente</button>
  `
  el.querySelector('button').addEventListener('click', () => {
    el.remove()
    onRetry?.()
  })

  document.getElementById('main-content').prepend(el)
  createIcons({ icons: ICONS })
}

export function hideErrorBanner() {
  document.getElementById('error-banner')?.remove()
}
