/**
 * services/api.ts
 *
 * Padrao [1] — Autenticacao: Token no cliente
 *
 * Instancia Axios configurada com:
 * - Base URL da API
 * - Interceptor que injeta o access token em todo request
 * - Interceptor que trata 401 (token expirado) e tenta refresh automatico
 * - Token em sessionStorage (nunca localStorage)
 *
 * USO:
 *   import api from '../services/api'
 *   const { data } = await api.get('/clientes')
 *   const { data } = await api.post('/clientes', payload)
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// ─── Instancia principal ──────────────────────────────────────────────────────

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Gerenciamento do access token ───────────────────────────────────────────
// sessionStorage: limpo ao fechar aba, inacessivel por outras abas
// Mais seguro que localStorage — access token de curta duracao nao precisa persistir

const TOKEN_KEY = 'access_token'

export const tokenManager = {
  get(): string | null {
    return sessionStorage.getItem(TOKEN_KEY)
  },
  set(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token)
  },
  remove(): void {
    sessionStorage.removeItem(TOKEN_KEY)
  },
}

// ─── Interceptor de request — injeta token ───────────────────────────────────

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenManager.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Interceptor de response — trata 401 ─────────────────────────────────────

let refreshEmAndamento = false
let filaAguardandoRefresh: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const requestOriginal = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    // Apenas tentar refresh em 401 e apenas uma vez por request
    if (error.response?.status !== 401 || requestOriginal._retry) {
      return Promise.reject(error)
    }

    // Se nao tem token, nao tentar refresh — ir para login
    if (!tokenManager.get()) {
      redirecionarParaLogin()
      return Promise.reject(error)
    }

    if (refreshEmAndamento) {
      // Outros requests aguardam o refresh em andamento
      return new Promise((resolve, reject) => {
        filaAguardandoRefresh.push({
          resolve: (novoToken) => {
            requestOriginal._retry = true
            requestOriginal.headers.Authorization = `Bearer ${novoToken}`
            resolve(api(requestOriginal))
          },
          reject,
        })
      })
    }

    requestOriginal._retry = true
    refreshEmAndamento = true

    try {
      // Refresh token esta em cookie HttpOnly — enviado automaticamente pelo browser
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || '/api/v1'}/auth/refresh`,
        {},
        { withCredentials: true } // necessario para enviar o cookie de refresh
      )

      const novoToken: string = data.data.accessToken
      tokenManager.set(novoToken)

      // Liberar fila de requests que estavam aguardando
      filaAguardandoRefresh.forEach(({ resolve }) => resolve(novoToken))
      filaAguardandoRefresh = []

      requestOriginal.headers.Authorization = `Bearer ${novoToken}`
      return api(requestOriginal)
    } catch {
      // Refresh falhou — sessao expirada, redirecionar para login
      filaAguardandoRefresh.forEach(({ reject }) => reject(error))
      filaAguardandoRefresh = []
      tokenManager.remove()
      redirecionarParaLogin()
      return Promise.reject(error)
    } finally {
      refreshEmAndamento = false
    }
  }
)

function redirecionarParaLogin() {
  // Usar window.location para garantir limpeza completa do estado
  if (window.location.pathname !== '/login') {
    window.location.href = '/login'
  }
}

export default api
