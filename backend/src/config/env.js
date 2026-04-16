/**
 * config/env.js
 *
 * Padrao [5] — Secrets e Variaveis de Ambiente
 *
 * Valida a presenca e formato de todas as variaveis de ambiente obrigatorias
 * ao iniciar a aplicacao. Falha rapido (fail fast) se algo estiver faltando.
 *
 * USO: importar no topo do server.js antes de qualquer outra coisa.
 *   import env from './config/env.js'
 */

const erros = []

// ─── Validador interno ──────────────────────────────────────────────────────

function exigir(nome, validacao = null) {
  const valor = process.env[nome]

  if (!valor || valor.trim() === '') {
    erros.push(`${nome}: variavel obrigatoria nao definida`)
    return undefined
  }

  if (validacao) {
    const resultado = validacao(valor, nome)
    if (resultado !== true) {
      erros.push(`${nome}: ${resultado}`)
    }
  }

  return valor
}

function exigirNumero(nome, min = 1, max = 65535) {
  const valor = exigir(nome)
  if (valor !== undefined) {
    const n = parseInt(valor, 10)
    if (isNaN(n) || n < min || n > max) {
      erros.push(`${nome}: deve ser um numero entre ${min} e ${max}`)
    }
  }
  return valor
}

function exigirEnum(nome, valores) {
  return exigir(nome, (v) =>
    valores.includes(v)
      ? true
      : `deve ser um dos valores: ${valores.join(', ')}`
  )
}

// ─── Variaveis obrigatorias ──────────────────────────────────────────────────
// Adaptar esta secao para cada projeto — adicionar/remover conforme necessario

const DATABASE_URL = exigir('DATABASE_URL', (v) =>
  v.startsWith('postgresql://') || v.startsWith('postgres://')
    ? true
    : 'deve comecar com postgresql:// ou postgres://'
)

const JWT_SECRET = exigir('JWT_SECRET', (v) =>
  v.length >= 64 ? true : 'deve ter no minimo 64 caracteres'
)

const PORT = exigirNumero('PORT', 1, 65535)

const NODE_ENV = exigirEnum('NODE_ENV', ['development', 'production', 'test'])

// Exemplo de variaveis adicionais — descomentar conforme o projeto
// const CERT_ENCRYPTION_KEY = exigir('CERT_ENCRYPTION_KEY', (v) =>
//   v.length >= 32 ? true : 'deve ter no minimo 32 caracteres'
// )
// const SMTP_HOST = exigir('SMTP_HOST')
// const SMTP_USER = exigir('SMTP_USER')
// const SMTP_PASS = exigir('SMTP_PASS')
// const SEFAZ_AMBIENTE = exigirEnum('SEFAZ_AMBIENTE', ['homologacao', 'producao'])
// const CORS_ORIGINS = exigir('CORS_ORIGINS')

// ─── Fail fast ───────────────────────────────────────────────────────────────

if (erros.length > 0) {
  console.error('\n[ERRO] Configuracao invalida — aplicacao nao pode iniciar:\n')
  erros.forEach((e) => console.error(`  ✗ ${e}`))
  console.error('\nVerifique o arquivo .env.example para a lista completa.\n')
  process.exit(1)
}

// ─── Exportar valores ja validados ──────────────────────────────────────────

export default {
  DATABASE_URL,
  JWT_SECRET,
  PORT: parseInt(PORT, 10),
  NODE_ENV,
  isProduction: NODE_ENV === 'production',
  isDevelopment: NODE_ENV === 'development',
  // CERT_ENCRYPTION_KEY,
  // SMTP_HOST,
  // SMTP_USER,
  // SMTP_PASS,
  // SEFAZ_AMBIENTE,
  // CORS_ORIGINS: CORS_ORIGINS?.split(',').map((o) => o.trim()),
}
