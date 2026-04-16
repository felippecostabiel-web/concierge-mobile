// screens/config.js — tela Configuração (US-05)

import { getConfig, saveConfig, clearConfig, hasConfig } from '../store/config.js'
import { testConnection } from '../api/github.js'
import { createIcons, Eye, EyeOff, CheckCircle2, AlertTriangle } from 'lucide'

const ICONS = { Eye, EyeOff, CheckCircle2, AlertTriangle }

let _onSave = null

export function initConfig({ onSave } = {}) {
  _onSave = onSave
  const screen = document.getElementById('screen-config')
  screen.innerHTML = renderConfig()
  createIcons({ icons: ICONS })
  registerListeners()
}

// ── render ────────────────────────────────────────────────────────────────────

function renderConfig() {
  const cfg = getConfig()
  return `
    <div class="cfg-section">
      <div class="cfg-section-title">Acesso ao Vault</div>

      <div class="cfg-field">
        <label class="cfg-label" for="cfg-token">GitHub Token (PAT)</label>
        <div class="cfg-input-wrap">
          <input type="password" class="cfg-input" id="cfg-token"
            value="${escAttr(cfg.token ?? '')}" placeholder="ghp_..." autocomplete="off" spellcheck="false">
          <span class="cfg-eye" id="cfg-eye-btn" aria-label="Mostrar/ocultar token">
            <i data-lucide="eye"></i>
          </span>
        </div>
      </div>

      <div class="cfg-field">
        <label class="cfg-label" for="cfg-owner">Owner (usuário ou organização)</label>
        <input type="text" class="cfg-input" id="cfg-owner"
          value="${escAttr(cfg.owner ?? '')}" placeholder="felippeabielcosta">
      </div>

      <div class="cfg-field">
        <label class="cfg-label" for="cfg-repo">Repositório</label>
        <input type="text" class="cfg-input" id="cfg-repo"
          value="${escAttr(cfg.repo ?? '')}" placeholder="concierge">
      </div>

      <div class="cfg-field">
        <label class="cfg-label" for="cfg-branch">Branch</label>
        <input type="text" class="cfg-input" id="cfg-branch"
          value="${escAttr(cfg.branch ?? 'main')}" placeholder="main">
      </div>

      <button class="btn-main" id="cfg-test-btn">Testar Conexão</button>
      <div class="cfg-status" id="cfg-status" style="display:none"></div>
      <button class="btn-main" id="cfg-save-btn">Salvar</button>
    </div>

    <hr class="cfg-divider">
    <button class="btn-ghost" id="cfg-clear-btn">Limpar configuração</button>
    <div style="height:20px"></div>
  `
}

// ── listeners ─────────────────────────────────────────────────────────────────

function registerListeners() {
  // toggle visibilidade do token
  let tokenVisible = false
  document.getElementById('cfg-eye-btn').addEventListener('click', () => {
    tokenVisible = !tokenVisible
    const inp = document.getElementById('cfg-token')
    inp.type = tokenVisible ? 'text' : 'password'
    document.getElementById('cfg-eye-btn').innerHTML =
      `<i data-lucide="${tokenVisible ? 'eye-off' : 'eye'}"></i>`
    createIcons({ icons: ICONS })
  })

  // testar conexão
  document.getElementById('cfg-test-btn').addEventListener('click', async () => {
    const cfg    = readForm()
    const status = document.getElementById('cfg-status')
    const btn    = document.getElementById('cfg-test-btn')

    btn.disabled   = true
    btn.textContent = 'Testando…'
    status.style.display = 'none'

    try {
      const count = await testConnection(cfg)
      status.className   = 'cfg-status ok'
      status.innerHTML   = `<i data-lucide="check-circle-2"></i> Conectado — ${count} arquivos encontrados`
      status.style.display = 'flex'
      createIcons({ icons: ICONS })
    } catch (e) {
      const msg = e.message === 'TOKEN_INVALID'
        ? 'Token inválido ou sem permissão de leitura'
        : 'Não foi possível conectar. Verifique owner e repositório.'
      status.className   = 'cfg-status err'
      status.innerHTML   = `<i data-lucide="alert-triangle"></i> ${msg}`
      status.style.display = 'flex'
      createIcons({ icons: ICONS })
    } finally {
      btn.disabled    = false
      btn.textContent = 'Testar Conexão'
    }
  })

  // salvar
  document.getElementById('cfg-save-btn').addEventListener('click', () => {
    const cfg = readForm()
    if (!cfg.token || !cfg.owner || !cfg.repo || !cfg.branch) {
      alert('Preencha todos os campos antes de salvar.')
      return
    }
    saveConfig(cfg)
    _onSave?.(cfg)
  })

  // limpar
  document.getElementById('cfg-clear-btn').addEventListener('click', () => {
    if (confirm('Remover configuração? O app precisará ser reconfigurado.')) {
      clearConfig()
      location.reload()
    }
  })
}

function readForm() {
  return {
    token:  document.getElementById('cfg-token').value.trim(),
    owner:  document.getElementById('cfg-owner').value.trim(),
    repo:   document.getElementById('cfg-repo').value.trim(),
    branch: document.getElementById('cfg-branch').value.trim() || 'main',
  }
}

function escAttr(s) { return s.replace(/"/g, '&quot;') }
