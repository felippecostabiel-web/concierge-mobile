/**
 * context/AuthContext.tsx
 *
 * Padrao [1] — Autenticacao: Contexto de autenticacao no frontend
 *
 * Gerencia o estado de autenticacao da aplicacao:
 * - Login: chama API, salva access token em sessionStorage, usuario em estado
 * - Logout: limpa token, chama API para invalidar refresh token
 * - Protecao de rotas: redireciona para /login se nao autenticado
 *
 * USO:
 *   // Envolver a aplicacao com o provider em App.tsx:
 *   <AuthProvider><App /></AuthProvider>
 *
 *   // Usar em qualquer componente:
 *   const { usuario, login, logout, carregando } = useAuth()
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react'
import { useNavigate } from 'react-router-dom'
import api, { tokenManager } from '../services/api'

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Usuario {
  id: string
  email: string
  perfil: 'admin' | 'operador'
}

interface AuthContextValue {
  usuario: Usuario | null
  carregando: boolean
  login: (email: string, senha: string) => Promise<void>
  logout: () => Promise<void>
}

interface LoginResponse {
  data: {
    accessToken: string
    usuario: Usuario
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const navigate = useNavigate()

  // Verificar sessao existente ao carregar a aplicacao
  useEffect(() => {
    const token = tokenManager.get()
    if (token) {
      verificarSessao()
    } else {
      setCarregando(false)
    }
  }, [])

  async function verificarSessao() {
    try {
      const { data } = await api.get('/auth/me')
      setUsuario(data.data)
    } catch {
      // Token invalido ou expirado — limpar e ir para login
      tokenManager.remove()
    } finally {
      setCarregando(false)
    }
  }

  const login = useCallback(async (email: string, senha: string) => {
    const { data } = await api.post<LoginResponse>('/auth/login', {
      email,
      senha,
    })

    tokenManager.set(data.data.accessToken)
    setUsuario(data.data.usuario)
    navigate('/')
  }, [navigate])

  const logout = useCallback(async () => {
    try {
      // Invalidar refresh token no servidor (cookie HttpOnly)
      await api.post('/auth/logout', {}, { withCredentials: true })
    } catch {
      // Continuar logout mesmo se a chamada falhar
    } finally {
      tokenManager.remove()
      setUsuario(null)
      navigate('/login')
    }
  }, [navigate])

  return (
    <AuthContext.Provider value={{ usuario, carregando, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider')
  }
  return ctx
}

// ─── Componente de rota protegida ─────────────────────────────────────────────

export function RotaProtegida({ children }: { children: ReactNode }) {
  const { usuario, carregando } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!carregando && !usuario) {
      navigate('/login', { replace: true })
    }
  }, [usuario, carregando, navigate])

  if (carregando) {
    return <div>Carregando...</div> // substituir por skeleton/spinner do projeto
  }

  if (!usuario) return null

  return <>{children}</>
}
