// store/config.js — persiste configuração no localStorage

const KEY = 'concierge:config'

export function getConfig() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) ?? {}
  } catch {
    return {}
  }
}

export function saveConfig(cfg) {
  localStorage.setItem(KEY, JSON.stringify(cfg))
}

export function clearConfig() {
  localStorage.removeItem(KEY)
}

export function hasConfig() {
  const cfg = getConfig()
  return Boolean(cfg.token && cfg.owner && cfg.repo && cfg.branch)
}
