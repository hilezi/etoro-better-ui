import { exchange } from './exchange'
import toast from 'cogo-toast'

export type BetterEtoroUIConfig = {
  listCompactOn: boolean
  executionMacroEnabled: boolean
  executionAmount: number[]
  executionLever: number[]
  selectedExchange: 'NTD' | 'MYR'
}

const findLegacyConfig = () => {
  const rawEtoroBetterUiExecutionMacroEnabled = globalThis.localStorage.getItem(
    'etoro_better_ui_execution_macro_enabled',
  ) as 'false' | 'true' | null
  const rawSelectedExchange = globalThis.localStorage.getItem(
    'selected_exchange',
  ) as 'NTD' | 'MYR' | null

  const config = {
    executionMacroEnabled: JSON.parse(
      rawEtoroBetterUiExecutionMacroEnabled || 'false',
    ) as boolean,
    selectedExchange: rawSelectedExchange || 'NTD',
  }

  return config
}

const DEFAULT_CONFIG: BetterEtoroUIConfig = {
  listCompactOn: false,
  executionMacroEnabled: findLegacyConfig().executionMacroEnabled ?? false,
  executionAmount: [50, 100, 200, 300, 500],
  executionLever: [1, 2, 5, 10, 20],
  selectedExchange: findLegacyConfig().selectedExchange ?? 'NTD',
}

const CONFIG_STORAGE_KEY = 'better_etoro_ui_config'

export const storage = {
  findConfig: (): typeof DEFAULT_CONFIG => {
    const _config = globalThis.localStorage.getItem(CONFIG_STORAGE_KEY)

    try {
      if (_config) {
        return {
          ...DEFAULT_CONFIG,
          ...JSON.parse(_config),
        } as BetterEtoroUIConfig
      } else {
        return DEFAULT_CONFIG
      }
    } catch (error) {
      error instanceof Error &&
        toast.error(error.message, {
          position: 'bottom-left',
        })
      return DEFAULT_CONFIG
    }
  },
  saveConfig: (config: Partial<BetterEtoroUIConfig>): boolean => {
    const _config = JSON.stringify({
      ...storage.findConfig(),
      ...config,
    })

    try {
      // remove legacies
      globalThis.localStorage.removeItem(
        'etoro_better_ui_execution_macro_enabled',
      )
      globalThis.localStorage.removeItem('selected_exchange')
      //

      globalThis.localStorage.setItem(CONFIG_STORAGE_KEY, _config)
      return true
    } catch (error) {
      error instanceof Error &&
        toast.error(error.message, {
          position: 'bottom-left',
        })
      return false
    }
  },
}