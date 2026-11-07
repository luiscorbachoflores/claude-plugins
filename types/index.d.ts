export type UsageFigures = {
  fiveHourPercent: number | null
  fiveHourResetsAt: string | null
  weekPercent: number | null
  weekResetsAt: string | null
  costUsd: number | null
}

declare module 'claude-code' {
  interface PluginState {
    'usage-band': { figures: UsageFigures }
  }
}
