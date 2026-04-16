// parser/frontmatter.js — extrai YAML frontmatter de arquivos .md

/**
 * Recebe o conteúdo raw de um .md e retorna { frontmatter, body }.
 * Suporta valores simples e arrays simples: tags: [a, b, c]
 */
export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { frontmatter: {}, body: raw }

  const [, yamlBlock, body] = match
  const frontmatter = {}

  for (const line of yamlBlock.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const key = line.slice(0, colonIdx).trim()
    const val = line.slice(colonIdx + 1).trim()

    if (!key) continue

    // array simples: [a, b, c]
    if (val.startsWith('[') && val.endsWith(']')) {
      frontmatter[key] = val
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      continue
    }

    // booleano
    if (val === 'true') { frontmatter[key] = true; continue }
    if (val === 'false') { frontmatter[key] = false; continue }

    frontmatter[key] = val
  }

  return { frontmatter, body: body.trimStart() }
}
