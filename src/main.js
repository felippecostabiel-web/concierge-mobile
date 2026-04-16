// main.js — entry point e orquestrador

import './style.css'
import { initShell, showTab, showErrorBanner, hideErrorBanner } from './components/shell.js'
import { hasConfig, getConfig } from './store/config.js'
import { getTree } from './api/github.js'
import { buildVaultIndex } from './api/vault.js'
import { initHoje,      resetHoje }      from './screens/hoje.js'
import { initPendentes, resetPendentes } from './screens/pendentes.js'
import { initDiarios,   resetDiarios }   from './screens/diarios.js'
import { initPlanners,  resetPlanners }  from './screens/planners.js'
import { initConfig }                    from './screens/config.js'

let vaultIndex = null
const initialized = new Set()

async function boot() {
  initShell({ onTabChange: handleTabChange })

  // tela de config sempre disponível
  initConfig({
    onSave: async (cfg) => {
      // após salvar, reinicia tudo
      vaultIndex = null
      initialized.clear()
      resetHoje(); resetPendentes(); resetDiarios(); resetPlanners()
      await loadVaultAndStart(cfg)
    },
  })

  if (!hasConfig()) {
    showTab('config')
    return
  }

  await loadVaultAndStart(getConfig())
}

async function loadVaultAndStart(config) {
  showTab('hoje')
  document.getElementById('screen-hoje').innerHTML =
    '<div style="padding:20px 20px 0"><div class="sk" style="height:120px;margin-bottom:16px"></div><div style="display:flex;gap:8px"><div class="sk" style="height:80px;flex:1"></div><div class="sk" style="height:80px;flex:1"></div><div class="sk" style="height:80px;flex:1"></div></div></div>'

  try {
    hideErrorBanner()
    const tree = await getTree(config)
    vaultIndex = buildVaultIndex(tree)
    await initHoje(vaultIndex, config)
  } catch (e) {
    const msg = e.message === 'TOKEN_INVALID'
      ? 'Token inválido — verifique nas configurações.'
      : 'Erro ao conectar ao vault. Tente novamente.'
    showErrorBanner(msg, () => loadVaultAndStart(config))
  }
}

async function handleTabChange(tab) {
  if (!vaultIndex || tab === 'config') return
  if (initialized.has(tab)) return
  initialized.add(tab)

  const config = getConfig()
  if (tab === 'pendentes') await initPendentes(vaultIndex, config)
  if (tab === 'diarios')   initDiarios(vaultIndex, config)
  if (tab === 'planners')  await initPlanners(vaultIndex, config)
}

// registrar service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/concierge-mobile/sw.js').catch(() => {})
}

boot()
