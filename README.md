# Kit de Segurança — Fastify + React + Vite

Arquivos de partida que implementam os 7 padrões de segurança documentados em
`01-Atlas/Padroes/Seguranca/`. Copiar para o projeto e adaptar — não usar no-lugar.

---

## Estrutura

```
kit-seguranca/
├── backend/src/
│   ├── config/
│   │   └── env.js              # [5] Validação fail-fast de variáveis de ambiente
│   ├── middleware/
│   │   ├── auth.js             # [1] Verificação JWT + geração de tokens
│   │   ├── authorize.js        # [3] RBAC + verificação de ownership
│   │   └── validate.js         # [2] Validação de input com Zod
│   ├── plugins/
│   │   ├── security-headers.js # [6] Headers HTTP de segurança
│   │   └── cors.js             # [6] CORS com whitelist explícita
│   └── utils/
│       ├── response.js         # [4] Formato padronizado de resposta RFC 7807
│       └── logger.js           # [4] Logger estruturado com redação de dados sensíveis
├── frontend/src/
│   ├── services/
│   │   └── api.ts              # [1] Axios com interceptors de token e auto-refresh
│   └── context/
│       └── AuthContext.tsx     # [1] Contexto de autenticação + rotas protegidas
├── nginx.conf                  # [6] TLS 1.2/1.3 + headers + proxy para Fastify
└── .env.example                # [5] Todas as variáveis documentadas
```

---

## Como usar em um novo projeto

### 1. Copiar os arquivos

Copiar a estrutura `backend/` e `frontend/` para o repositório do projeto,
respeitando os caminhos relativos.

### 2. Instalar dependências

**Backend:**
```bash
npm install fastify @fastify/jwt @fastify/cors @fastify/cookie \
            fastify-plugin zod argon2 pino pino-pretty
```

**Frontend:**
```bash
npm install axios react-router-dom
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# Preencher JWT_SECRET (mínimo 64 chars) e DATABASE_URL
```

Gerar JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 4. Registrar no server.js

```js
import env from './config/env.js'           // deve ser o primeiro import
import { loggerConfig } from './utils/logger.js'
import corsPlugin from './plugins/cors.js'
import securityHeadersPlugin from './plugins/security-headers.js'

const fastify = Fastify({ logger: loggerConfig })

await fastify.register(corsPlugin)
await fastify.register(securityHeadersPlugin)
```

### 5. Proteger rotas

```js
import { verificarToken } from './middleware/auth.js'
import { autorizar, PERFIS } from './middleware/authorize.js'
import { validar, schemas } from './middleware/validate.js'

// Rota autenticada
fastify.get('/perfil', { preHandler: verificarToken }, handler)

// Rota com autorização por perfil
fastify.delete('/usuarios/:id', {
  preHandler: [verificarToken, autorizar(PERFIS.ADMIN)]
}, handler)

// Rota com validação de input
fastify.post('/clientes', {
  preHandler: [verificarToken, validar({ body: clienteSchema })]
}, handler)
```

### 6. Configurar nginx

Substituir `DOMINIO.COM` pelo domínio real e copiar para o servidor:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/app
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

## Padrões implementados

| # | Padrão | Arquivo(s) | Documento de referência |
|---|--------|-----------|------------------------|
| 1 | Autenticação + JWT | `auth.js`, `api.ts`, `AuthContext.tsx` | `autenticacao-senha-jwt.md` |
| 2 | Input Validation / XSS / Injection | `validate.js` | `input-validation-xss-injection.md` |
| 3 | Controle de Acesso / Autorização | `authorize.js` | `controle-acesso-autorizacao.md` |
| 4 | Tratamento de Erros + Logging | `response.js`, `logger.js` | `tratamento-erros-logging.md` |
| 5 | Secrets + Variáveis de Ambiente | `env.js`, `.env.example` | `secrets-variaveis-ambiente.md` |
| 6 | Comunicação Segura (HTTPS + Headers) | `security-headers.js`, `cors.js`, `nginx.conf` | `comunicacao-segura-https-headers.md` |
| 7 | Código Simples + Reutilizável | estrutura do kit | `codigo-simples-reutilizavel.md` |

Documentos de referência em: `vault-concierge/01-Atlas/Padroes/Seguranca/`

---

## Skills de revisão

Após implementar, usar as skills para revisar o código:

- `/secure-auth-review` — revisa autenticação e tokens
- `/secure-input-review` — revisa validação de inputs
- `/secure-access-review` — revisa controle de acesso
- `/secure-logging-review` — revisa logging e tratamento de erros
- `/secure-secrets-review` — revisa gestão de secrets
- `/secure-headers-review` — revisa headers e configuração de rede
- `/code-quality-review` — revisa qualidade e simplicidade do código
