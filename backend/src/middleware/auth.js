/**
 * middleware/auth.js
 *
 * Padrao [1] — Autenticacao e JWT
 *
 * Hook Fastify que verifica o JWT em toda rota protegida.
 * Extrai o usuario do token e injeta em req.usuario.
 * O usuario_id vem SEMPRE do token — nunca do body ou params.
 *
 * USO em rotas protegidas:
 *   fastify.get('/rota', { preHandler: [autenticar] }, handler)
 *
 * USO global (todas as rotas protegidas por padrao):
 *   fastify.addHook('preHandler', autenticar)
 *   // Rotas publicas precisam ser registradas ANTES do hook global
 */

import jwt from 'jsonwebtoken'
import env from '../config/env.js'

/**
 * Verifica o JWT Bearer no header Authorization.
 * Injeta req.usuario = { id, email, perfil } se valido.
 * Retorna 401 se ausente, invalido ou expirado.
 */
export async function autenticar(req, reply) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({
      status: 401,
      code: 'TOKEN_AUSENTE',
      message: 'Autenticacao necessaria.',
    })
  }

  const token = authHeader.substring(7) // remove 'Bearer '

  try {
    // Algoritmo fixo no servidor — nunca aceitar o alg do proprio token
    const payload = jwt.verify(token, env.JWT_SECRET, {
      algorithms: ['HS256'],
      issuer: env.JWT_ISSUER || 'app',
    })

    // Injetar usuario no request — disponivel em todos os handlers seguintes
    req.usuario = {
      id: payload.sub,
      email: payload.email,
      perfil: payload.perfil,
    }
  } catch (err) {
    const code =
      err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRADO' : 'TOKEN_INVALIDO'

    // Log para deteccao de tentativas — sem logar o token
    req.log.warn({
      evento: 'token_invalido',
      motivo: err.message,
      ip: req.ip,
      rota: req.url,
    })

    return reply.status(401).send({
      status: 401,
      code,
      message: 'Autenticacao invalida ou expirada.',
    })
  }
}

/**
 * Gera um par access token + refresh token para um usuario autenticado.
 * Chamar apos validar senha com bcrypt.
 *
 * @param {{ id: string, email: string, perfil: string }} usuario
 * @returns {{ accessToken: string, refreshToken: string }}
 */
export function gerarTokens(usuario) {
  const agora = Math.floor(Date.now() / 1000)

  const accessToken = jwt.sign(
    {
      sub: usuario.id,
      email: usuario.email,
      perfil: usuario.perfil,
      iss: env.JWT_ISSUER || 'app',
      iat: agora,
      // jti unico por token — necessario para denylist de logout
      jti: crypto.randomUUID(),
    },
    env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '30m', // access token: 15-30 minutos
    }
  )

  const refreshToken = jwt.sign(
    {
      sub: usuario.id,
      tipo: 'refresh',
      iss: env.JWT_ISSUER || 'app',
      iat: agora,
      jti: crypto.randomUUID(),
    },
    env.JWT_SECRET,
    {
      algorithm: 'HS256',
      expiresIn: '7d', // refresh token: 7-30 dias
    }
  )

  return { accessToken, refreshToken }
}

/**
 * Configura o refresh token como cookie HttpOnly.
 * Chamar no handler de login/refresh antes de retornar.
 *
 * @param {FastifyReply} reply
 * @param {string} refreshToken
 */
export function setRefreshTokenCookie(reply, refreshToken) {
  reply.setCookie('refresh_token', refreshToken, {
    httpOnly: true,           // inacessivel via JS — previne XSS
    secure: true,             // apenas HTTPS
    sameSite: 'Strict',       // previne CSRF
    path: '/api/v1/auth',     // apenas rotas de auth podem ler
    maxAge: 60 * 60 * 24 * 7, // 7 dias em segundos
  })
}
