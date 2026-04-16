/**
 * plugins/security-headers.js
 *
 * Padrao [6] — Comunicacao Segura: Headers HTTP de Seguranca
 *
 * Plugin Fastify que adiciona todos os headers de seguranca obrigatorios
 * em todas as respostas e remove headers que revelam a stack tecnologica.
 *
 * USO em server.js:
 *   import securityHeaders from './plugins/security-headers.js'
 *   await fastify.register(securityHeaders)
 */

import fp from 'fastify-plugin'
import env from '../config/env.js'

async function securityHeadersPlugin(fastify) {
  fastify.addHook('onSend', async (req, reply) => {
    // ── Headers obrigatorios ──────────────────────────────────────────────

    // Forca HTTPS por 2 anos + subdominios
    // Ativar preload apenas quando todos os subdominios suportarem HTTPS
    reply.header(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains'
    )

    // Impede MIME sniffing — navegador respeita o Content-Type declarado
    reply.header('X-Content-Type-Options', 'nosniff')

    // Impede clickjacking — pagina nao pode ser carregada em iframe
    reply.header('X-Frame-Options', 'DENY')

    // Controla informacoes de referrer enviadas em requests cross-origin
    reply.header('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Desabilita recursos do dispositivo nao usados pela aplicacao
    reply.header(
      'Permissions-Policy',
      'geolocation=(), camera=(), microphone=(), payment=()'
    )

    // Desabilitar o filtro XSS legado do IE — pode criar vulnerabilidades em browsers modernos
    reply.header('X-XSS-Protection', '0')

    // ── CSP — ajustar conforme o projeto ─────────────────────────────────
    // Para API pura (sem HTML): remover ou simplificar
    // Para frontend servido pelo mesmo servidor: ajustar origens
    if (!req.url.startsWith('/api/')) {
      reply.header(
        'Content-Security-Policy',
        [
          "default-src 'self'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'", // unsafe-inline necessario para Tailwind inline styles
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; ')
      )
    }

    // ── Remover headers que revelam a stack ───────────────────────────────
    reply.removeHeader('X-Powered-By')
    reply.removeHeader('Server')

    // ── Cache para respostas de API com dados financeiros ─────────────────
    // Apenas para rotas de API — assets estaticos nao devem ter no-store
    if (req.url.startsWith('/api/')) {
      reply.header('Cache-Control', 'no-store')
    }
  })
}

export default fp(securityHeadersPlugin, {
  name: 'security-headers',
  fastify: '4.x',
})
