/**
 * plugins/cors.js
 *
 * Padrao [6] — Comunicacao Segura: CORS
 *
 * Configura CORS com whitelist explicita de origens.
 * Nunca usa '*' em APIs autenticadas.
 *
 * USO em server.js:
 *   import corsPlugin from './plugins/cors.js'
 *   await fastify.register(corsPlugin)
 */

import fp from 'fastify-plugin'
import cors from '@fastify/cors'
import env from '../config/env.js'

async function corsPlugin(fastify) {
  // Origens permitidas — definidas em variavel de ambiente
  // CORS_ORIGINS=https://app.dominio.com,https://admin.dominio.com
  const origensPermitidas = env.CORS_ORIGINS ?? []

  await fastify.register(cors, {
    // Validar cada origem contra a whitelist — nunca aceitar '*'
    origin: (origin, callback) => {
      // Permitir requests sem origin (Postman, curl, apps mobile, server-to-server)
      if (!origin) return callback(null, true)

      if (origensPermitidas.includes(origin)) {
        return callback(null, true)
      }

      // Log de origem bloqueada — util para diagnostico
      fastify.log.warn({
        evento: 'cors_bloqueado',
        origem: origin,
      })

      return callback(new Error('Origem nao permitida pelo CORS'), false)
    },

    // Metodos permitidos — apenas os que a API usa
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],

    // Headers que o cliente pode enviar
    allowedHeaders: ['Authorization', 'Content-Type'],

    // Necessario para cookies de refresh token — nunca usar com origin: '*'
    credentials: true,

    // Cache do preflight por 24h — reduz requests OPTIONS desnecessarios
    maxAge: 86400,
  })
}

export default fp(corsPlugin, {
  name: 'cors',
  fastify: '4.x',
})
