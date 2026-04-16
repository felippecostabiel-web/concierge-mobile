// parser/markdown.js — converte markdown para HTML usando marked

import { marked } from 'marked'

marked.setOptions({ gfm: true, breaks: true })

/**
 * Converte markdown raw em HTML e aplica classes CSS do design system.
 * @param {string} raw
 * @returns {string} HTML string
 */
export function renderMarkdown(raw) {
  // Remover bloco de frontmatter antes de renderizar
  const body = raw.replace(/^---[\s\S]*?---\n?/, '').trimStart()
  const html = marked.parse(body)
  return applyStyles(html)
}

/** Adiciona classes CSS do design system ao HTML gerado pelo marked */
function applyStyles(html) {
  return html
    .replace(/<h1>/g, '<h1 class="rd-h1">')
    .replace(/<h2>/g, '<h2 class="rd-h2">')
    .replace(/<h3>/g, '<h3 class="rd-h3">')
    .replace(/<h4>/g, '<h4 class="rd-h4">')
    .replace(/<p>/g, '<p class="rd-p">')
    .replace(/<ul>/g, '<ul class="rd-ul">')
    .replace(/<ol>/g, '<ol class="rd-ol">')
    .replace(/<li>/g, '<li class="rd-li">')
    .replace(/<table>/g, '<table class="rd-table">')
    .replace(/<blockquote>/g, '<blockquote class="rd-blockquote">')
    .replace(/<hr>/g, '<hr class="rd-hr">')
    .replace(/<code>/g, '<code class="rd-code">')
    .replace(/<pre>/g, '<pre class="rd-pre">')
    // checkboxes do marked: <li><input type="checkbox" disabled=""> → estilizar
    .replace(
      /<li><input type="checkbox" disabled="">/g,
      '<li class="rd-li rd-task-open"><span class="rd-check-open"></span>'
    )
    .replace(
      /<li><input type="checkbox" checked="" disabled="">/g,
      '<li class="rd-li rd-task-done"><span class="rd-check-done"></span>'
    )
}
