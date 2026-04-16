/**
 * middleware/validate.js
 *
 * Padrao [2] — Input Validation
 *
 * Hook Fastify para validar body, params e querystring com Zod
 * antes de qualquer logica de negocio no handler.
 *
 * USO em rota especifica:
 *   import { validar } from './validate.js'
 *   import { z } from 'zod'
 *
 *   const schema = z.object({ nome: z.string().min(1).max(200) })
 *
 *   fastify.post('/clientes', {
 *     preHandler: [autenticar, validar({ body: schema })]
 *   }, handler)
 *
 * USO com body + params + query:
 *   validar({
 *     body: z.object({ ... }),
 *     params: z.object({ id: z.string().uuid() }),
 *     query: z.object({ pagina: z.coerce.number().min(1).default(1) }),
 *   })
 */

import { ZodError } from 'zod'

/**
 * Fabrica de middleware de validacao Zod para Fastify.
 *
 * @param {{ body?: ZodSchema, params?: ZodSchema, query?: ZodSchema }} schemas
 * @returns {Function} preHandler do Fastify
 */
export function validar(schemas) {
  return async function (req, reply) {
    const erros = []

    if (schemas.body) {
      const resultado = schemas.body.safeParse(req.body)
      if (!resultado.success) {
        erros.push(...formatarErrosZod(resultado.error, 'body'))
      } else {
        req.body = resultado.data // dados coercidos e validados
      }
    }

    if (schemas.params) {
      const resultado = schemas.params.safeParse(req.params)
      if (!resultado.success) {
        erros.push(...formatarErrosZod(resultado.error, 'params'))
      } else {
        req.params = resultado.data
      }
    }

    if (schemas.query) {
      const resultado = schemas.query.safeParse(req.query)
      if (!resultado.success) {
        erros.push(...formatarErrosZod(resultado.error, 'query'))
      } else {
        req.query = resultado.data
      }
    }

    if (erros.length > 0) {
      return reply.status(400).send({
        status: 400,
        code: 'VALIDATION_ERROR',
        message: 'Os dados enviados sao invalidos.',
        details: erros,
      })
    }
  }
}

/**
 * Converte erros Zod para o formato padrao de details.
 * Nunca expoe o valor submetido — apenas o campo e a mensagem.
 */
function formatarErrosZod(zodError, origem) {
  return zodError.errors.map((e) => ({
    field: [origem, ...e.path].join('.'),
    message: e.message,
  }))
}

// ─── Schemas reutilizaveis ────────────────────────────────────────────────────
// Importar e compor em schemas de rota especificos

import { z } from 'zod'

export const schemas = {
  // ID UUID em params
  paramId: z.object({
    id: z.string().uuid({ message: 'ID invalido' }),
  }),

  // Paginacao padrao em query
  paginacao: z.object({
    pagina: z.coerce.number().int().min(1).default(1),
    limite: z.coerce.number().int().min(1).max(100).default(20),
  }),

  // CPF — 11 digitos, sem mascara
  cpf: z
    .string()
    .regex(/^\d{11}$/, 'CPF deve conter 11 digitos numericos'),

  // CNPJ — 14 digitos, sem mascara
  cnpj: z
    .string()
    .regex(/^\d{14}$/, 'CNPJ deve conter 14 digitos numericos'),

  // CPF ou CNPJ
  cpfCnpj: z
    .string()
    .regex(/^\d{11}$|^\d{14}$/, 'Documento deve ser CPF (11 digitos) ou CNPJ (14 digitos)'),

  // Email
  email: z
    .string()
    .email('Email invalido')
    .max(254, 'Email muito longo'),

  // Data ISO (YYYY-MM-DD)
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD'),

  // Valor monetario
  valorMonetario: z
    .number()
    .positive('Valor deve ser maior que zero')
    .multipleOf(0.01, 'Valor deve ter no maximo 2 casas decimais'),

  // Placa de veiculo (padrao antigo e Mercosul)
  placa: z
    .string()
    .regex(/^[A-Z]{3}\d{4}$|^[A-Z]{3}\d[A-Z]\d{2}$/, 'Placa invalida'),

  // UF brasileira
  uf: z
    .string()
    .length(2, 'UF deve ter 2 caracteres')
    .toUpperCase(),
}
