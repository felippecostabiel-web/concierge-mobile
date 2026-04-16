/**
 * utils/response.js
 *
 * Padrao [4] — Tratamento de Erros: Formato padrao de resposta
 *
 * Helpers para retornar respostas HTTP consistentes seguindo RFC 7807.
 * Nunca expoe detalhes internos (stack trace, SQL, caminho de arquivo).
 *
 * USO em route handlers:
 *   import { ok, fail, erroInterno } from '../utils/response.js'
 *
 *   // Sucesso
 *   return reply.status(200).send(ok(dados))
 *   return reply.status(201).send(ok(novoRecurso, 'Criado com sucesso.'))
 *
 *   // Erro de validacao / negocio
 *   return reply.status(400).send(fail('EMAIL_INVALIDO', 'Email invalido.'))
 *   return reply.status(404).send(fail('NAO_ENCONTRADO', 'Recurso nao encontrado.'))
 *
 *   // Erro interno (nunca passar err.message direto)
 *   return erroInterno(err, req, reply)
 */

import crypto from 'crypto'

// ─── Sucesso ──────────────────────────────────────────────────────────────────

/**
 * Formata resposta de sucesso.
 * @param {*} data - Dados a retornar
 * @param {string} [message] - Mensagem opcional
 */
export function ok(data, message = null) {
  return {
    success: true,
    ...(message && { message }),
    data,
  }
}

/**
 * Resposta de sucesso para listagem com paginacao.
 * @param {Array} items
 * @param {{ total: number, pagina: number, limite: number }} paginacao
 */
export function okLista(items, { total, pagina, limite }) {
  return {
    success: true,
    data: items,
    meta: {
      total,
      pagina,
      limite,
      totalPaginas: Math.ceil(total / limite),
    },
  }
}

// ─── Erros de cliente (4xx) ───────────────────────────────────────────────────

/**
 * Formata resposta de erro esperado (4xx).
 * @param {string} code - Codigo legivel por maquina (UPPER_SNAKE_CASE)
 * @param {string} message - Mensagem humana generica
 * @param {Array} [details] - Detalhes de validacao por campo (apenas para 400)
 */
export function fail(code, message, details = null) {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
    },
  }
}

// ─── Erro interno (5xx) ───────────────────────────────────────────────────────

/**
 * Trata erros internos inesperados.
 * - Loga o erro completo (stack trace) internamente
 * - Retorna mensagem generica ao cliente
 * - Gera error_id para correlacao entre cliente e log
 *
 * @param {Error} err - Erro capturado
 * @param {FastifyRequest} req
 * @param {FastifyReply} reply
 */
export function erroInterno(err, req, reply) {
  const errorId = crypto.randomUUID()

  // Log completo para investigacao — nunca enviado ao cliente
  req.log.error({
    evento: 'erro_interno',
    error_id: errorId,
    message: err.message,
    stack: err.stack,
    rota: req.url,
    metodo: req.method,
    usuario_id: req.usuario?.id ?? null,
  })

  return reply.status(500).send({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Ocorreu um erro interno. Tente novamente.',
      error_id: errorId, // cliente pode informar ao suporte para correlacao
    },
  })
}

// ─── Codigos de erro padrao ───────────────────────────────────────────────────
// Centralizar para evitar strings magicas espalhadas no codigo

export const CODIGOS = {
  // 400
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DADOS_INVALIDOS: 'DADOS_INVALIDOS',
  DUPLICADO: 'DUPLICADO',

  // 401
  TOKEN_AUSENTE: 'TOKEN_AUSENTE',
  TOKEN_INVALIDO: 'TOKEN_INVALIDO',
  TOKEN_EXPIRADO: 'TOKEN_EXPIRADO',
  CREDENCIAIS_INVALIDAS: 'CREDENCIAIS_INVALIDAS',

  // 403
  SEM_PERMISSAO: 'SEM_PERMISSAO',

  // 404
  NAO_ENCONTRADO: 'NAO_ENCONTRADO',

  // 409
  CONFLITO: 'CONFLITO',

  // 429
  RATE_LIMIT: 'RATE_LIMIT',

  // 500
  INTERNAL_ERROR: 'INTERNAL_ERROR',
}
