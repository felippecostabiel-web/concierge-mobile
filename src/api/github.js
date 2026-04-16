// api/github.js — cliente GitHub API REST (somente leitura)

const BASE = 'https://api.github.com'

async function githubFetch(path, config) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (res.status === 401) throw new Error('TOKEN_INVALID')
  if (res.status === 404) throw new Error('NOT_FOUND')
  if (!res.ok) throw new Error('API_ERROR')

  return res.json()
}

/** Lê o conteúdo de um arquivo e retorna a string decodificada */
export async function getFileContent(path, config) {
  const data = await githubFetch(
    `/repos/${config.owner}/${config.repo}/contents/${encodeURIComponent(path)}?ref=${config.branch}`,
    config
  )
  // GitHub retorna Base64 com quebras de linha — removê-las antes do atob
  return atob(data.content.replace(/\n/g, ''))
}

/** Retorna a árvore completa do repositório (recursive) */
export async function getTree(config) {
  const data = await githubFetch(
    `/repos/${config.owner}/${config.repo}/git/trees/${config.branch}?recursive=1`,
    config
  )
  return data.tree // array de { path, type, sha }
}

/** Testa a conexão — retorna o número de arquivos encontrados */
export async function testConnection(config) {
  const tree = await getTree(config)
  return tree.filter((n) => n.type === 'blob').length
}
