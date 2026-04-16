// components/empty.js — estados vazios

import { createIcons, Sun, Inbox, BookOpen, Layers, AlertTriangle } from 'lucide'

const ICONS = { Sun, Inbox, BookOpen, Layers, AlertTriangle }

/**
 * Renderiza um estado vazio num container.
 * @param {string|HTMLElement} target - id do elemento ou o elemento diretamente
 * @param {{ icon: string, title: string, sub?: string }} opts
 */
export function renderEmpty(target, { icon, title, sub = '' }) {
  const el = typeof target === 'string' ? document.getElementById(target) : target
  if (!el) return

  el.innerHTML = `
    <div class="empty-state">
      <i data-lucide="${icon}"></i>
      <span class="empty-title">${title}</span>
      ${sub ? `<span class="empty-sub">${sub}</span>` : ''}
    </div>
  `
  createIcons({ icons: ICONS })
}
