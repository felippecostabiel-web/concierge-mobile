/**
 * middleware/authorize.js
 *
 * Padrao [3] — Controle de Acesso e Autorizacao
 *
 * Fabrica de middlewares de autorizacao por perfil.
 * Deny by default — acesso negado a menos que perfil esteja na lista permitida.
 *
 * IMPORTANTE: sempre usar APOS autenticar() — depende de req.usuario.
 *
 * USO:
 *   import { autenticar } from './auth.js'
 *   import { autorizar } from './authorize.js'
 *
 *   // Apenas admins
 *   fastify.delete('/usuarios/:id', {
 *     preHandler: [autenticar, autorizar('admin')]
 *   }, handler)
 *
 *   // Admin ou operador
 *   fastify.post('/ctes', {
 *     preHandler: [autenticar, autorizar('admin', 'operador')]
 *   }, handler)
 */

/**
 * Retorna um middleware que verifica se req.usuario.perfil
 * esta entre os perfis permitidos.
 *
 * @param {...string} perfisPermitidos
 * @returns {Function} preHandler do Fastify
 */
export function autorizar(...perfisPermitidos) {
  return async function (req, reply) {
    // req.usuario e garantido pelo autenticar() que roda antes
    const perfil = req.usuario?.perfil

    if (!perfil || !perfisPermitidos.includes(perfil)) {
      // Log de acesso negado — util para deteccao de tentativas
      req.log.warn({
        evento: 'acesso_negado',
        usuario_id: req.usuario?.id ?? null,
        perfil_atual: perfil ?? null,
        perfis_exigidos: perfisPermitidos,
        rota: req.url,
        metodo: req.method,
        ip: req.ip,
      })

      // 403 apenas quando autenticado mas sem permissao de rota
      // Para IDOR (recurso de outro usuario): usar 404 no handler
      return reply.status(403).send({
        status: 403,
        code: 'SEM_PERMISSAO',
        message: 'Voce nao tem permissao para realizar esta acao.',
      })
    }
  }
}

/**
 * Verifica ownership de um recurso buscado do banco.
 * Usar dentro do route handler apos buscar o recurso.
 *
 * Retorna 404 (nao 403) para nao revelar que o recurso existe.
 *
 * USO:
 *   const conta = await db.query('SELECT * FROM contas WHERE id = $1', [id])
 *   verificarOwnership(conta.rows[0], req.usuario.id, reply)
 *
 * @param {object|null} recurso - Objeto do banco com campo usuario_id ou empresa_id
 * @param {string} usuarioId - ID do usuario autenticado (req.usuario.id)
 * @param {FastifyReply} reply
 * @param {string} campoOwner - Campo de ownership no recurso (padrao: 'usuario_id')
 * @returns {boolean} true se tem acesso, false se nao (ja enviou resposta 404)
 */
export function verificarOwnership(recurso, usuarioId, reply, campoOwner = 'usuario_id') {
  if (!recurso || recurso[campoOwner] !== usuarioId) {
    reply.status(404).send({
      status: 404,
      code: 'NAO_ENCONTRADO',
      message: 'Recurso nao encontrado.',
    })
    return false
  }
  return true
}

// ─── Perfis disponiveis ───────────────────────────────────────────────────────
// Centralizar aqui para evitar strings magicas espalhadas no codigo

export const PERFIS = {
  ADMIN: 'admin',
  OPERADOR: 'operador',
  // Adicionar perfis conforme o projeto
}
