/**
 * utils/logger.js
 *
 * Padrao [4] — Logging Seguro
 *
 * Configura o logger do Fastify com:
 * - Formato JSON estruturado (parseavel por ferramentas de log)
 * - Niveis corretos por ambiente (debug em dev, info em producao)
 * - Serializadores que NUNCA logam dados sensiveis
 * - request_id em todo log de uma mesma requisicao
 *
 * USO em server.js:
 *   import { loggerConfig, logEventos } from './utils/logger.js'
 *   const fastify = Fastify({ logger: loggerConfig })
 *
 * USO para logar eventos de seguranca no handler:
 *   import { logEventos } from './utils/logger.js'
 *   logEventos.loginSucesso(req, usuario.id)
 *   logEventos.acessoNegado(req, 'admin')
 */

import env from '../config/env.js'

// ─── Campos nunca logados ─────────────────────────────────────────────────────

const CAMPOS_SENSIVEIS = [
  'senha', 'password', 'pass',
  'token', 'access_token', 'refresh_token', 'authorization',
  'cpf', 'cnpj', 'rg',
  'cartao', 'card_number', 'cvv',
  'chave', 'secret', 'api_key',
  'certificado', 'pfx', 'p12',
]

/**
 * Remove campos sensiveis de um objeto antes de logar.
 * Aplica recursivamente em objetos aninhados.
 */
function sanitizarParaLog(obj, profundidade = 0) {
  if (profundidade > 3 || !obj || typeof obj !== 'object') return obj

  const resultado = Array.isArray(obj) ? [...obj] : { ...obj }

  for (const chave of Object.keys(resultado)) {
    if (CAMPOS_SENSIVEIS.some((s) => chave.toLowerCase().includes(s))) {
      resultado[chave] = '[REDACTED]'
    } else if (typeof resultado[chave] === 'object') {
      resultado[chave] = sanitizarParaLog(resultado[chave], profundidade + 1)
    }
  }

  return resultado
}

// ─── Configuracao do logger Fastify ──────────────────────────────────────────

export const loggerConfig = {
  // Debug apenas em desenvolvimento — nunca em producao
  level: env.isDevelopment ? 'debug' : 'info',

  // Formato legivel em dev, JSON em producao
  transport: env.isDevelopment
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,

  // Serializar request — remover headers de autenticacao do log
  serializers: {
    req(req) {
      return {
        method: req.method,
        url: req.url,
        // Nunca logar Authorization header completo
        user_agent: req.headers['user-agent'],
        ip: req.ip,
      }
    },
    res(reply) {
      return {
        status_code: reply.statusCode,
      }
    },
    err(err) {
      return {
        type: err.constructor.name,
        message: err.message,
        stack: env.isDevelopment ? err.stack : undefined,
      }
    },
  },

  // Campos base em todo log
  base: {
    app: process.env.APP_NAME || 'app',
    versao: process.env.APP_VERSION || '1.0.0',
    env: env.NODE_ENV,
  },
}

// ─── Helpers para eventos de seguranca ───────────────────────────────────────
// Usar nos handlers para logar eventos estruturados

export const logEventos = {
  loginSucesso(req, usuarioId) {
    req.log.info({
      evento: 'login_sucesso',
      usuario_id: usuarioId,
      ip: req.ip,
    })
  },

  loginFalha(req, motivo) {
    req.log.warn({
      evento: 'login_falha',
      // Nunca logar a senha tentada — apenas o motivo
      motivo,
      ip: req.ip,
    })
  },

  logout(req, usuarioId) {
    req.log.info({
      evento: 'logout',
      usuario_id: usuarioId,
      ip: req.ip,
    })
  },

  acessoNegado(req, recursoTipo = null) {
    req.log.warn({
      evento: 'acesso_negado',
      usuario_id: req.usuario?.id ?? null,
      perfil: req.usuario?.perfil ?? null,
      rota: req.url,
      recurso_tipo: recursoTipo,
      ip: req.ip,
    })
  },

  operacaoCritica(req, operacao, detalhes = {}) {
    req.log.info({
      evento: 'operacao_critica',
      operacao,
      usuario_id: req.usuario?.id,
      // Sanitizar detalhes antes de logar — remove campos sensiveis
      detalhes: sanitizarParaLog(detalhes),
      ip: req.ip,
    })
  },

  erroConexao(req, servico, mensagem) {
    req.log.error({
      evento: 'erro_conexao',
      servico,
      mensagem,
      rota: req.url,
    })
  },
}
