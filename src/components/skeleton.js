// components/skeleton.js — estados de loading

/**
 * Insere N linhas skeleton num container.
 * @param {string} containerId
 * @param {Array<{w?: string, h?: string}>} lines - largura e altura de cada linha
 */
export function showSkeleton(containerId, lines = []) {
  const el = document.getElementById(containerId)
  if (!el) return
  el.innerHTML = lines
    .map(({ w = '100%', h = '16px' } = {}) =>
      `<div class="sk" style="width:${w};height:${h};margin-bottom:10px"></div>`
    )
    .join('')
}

export function hideSkeleton(containerId) {
  const el = document.getElementById(containerId)
  if (el) el.innerHTML = ''
}
