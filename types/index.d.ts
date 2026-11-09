export type Figures = {
  fiveHourPercent: number | null
  fiveHourResetsAt: string | null
  weekPercent: number | null
  weekResetsAt: string | null
  costUsd: number | null
  contextPercent: number | null
}

declare module 'claude-code' {
  interface PluginState {
    'status-band': { figures: Shaped<Figures> }
  }
}
