import { atom, read, update } from 'claude-code'
import type { Register, SessionRateLimit, SessionCost } from 'claude-code'

import type { UsageFigures } from '../types'

const EMPTY: UsageFigures = {
  fiveHourPercent: null,
  fiveHourResetsAt: null,
  weekPercent: null,
  weekResetsAt: null,
  costUsd: null,
}

const figures = atom({ plugin: 'usage-band', key: 'figures' } as const, EMPTY)

function merge(
  prev: UsageFigures,
  rateLimits: readonly SessionRateLimit[],
  cost: SessionCost | undefined,
): UsageFigures {
  const fiveHour = rateLimits.find(r => r.kind === 'five_hour')
  const week = rateLimits.find(r => r.kind === 'seven_day')

  return {
    fiveHourPercent: fiveHour ? Math.round(fiveHour.percentUsed) : prev.fiveHourPercent,
    fiveHourResetsAt: fiveHour?.resetsAt ?? prev.fiveHourResetsAt,
    weekPercent: week ? Math.round(week.percentUsed) : prev.weekPercent,
    weekResetsAt: week?.resetsAt ?? prev.weekResetsAt,
    costUsd: cost ? cost.usd : prev.costUsd,
  }
}

function formatResetsIn(resetsAt: string | null, nowMs: number): string {
  if (!resetsAt) {
    return '--'
  }

  let minutes = Math.round((Date.parse(resetsAt) - nowMs) / 60000)

  if (minutes <= 0) {
    return '0m'
  }

  const days = Math.floor(minutes / 1440)
  minutes -= days * 1440
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (days > 0) {
    return `${days}d ${hours}h`
  }

  if (hours > 0) {
    return `${hours}h ${mins}m`
  }

  return `${mins}m`
}

const BAR_WIDTH = 6
const SEPARATOR = '──'

function bar(percent: number | null): string {
  if (percent === null) {
    return '·'.repeat(BAR_WIDTH)
  }

  const filled = Math.max(0, Math.min(BAR_WIDTH, Math.round((percent / 100) * BAR_WIDTH)))

  return '█'.repeat(filled) + '░'.repeat(BAR_WIDTH - filled)
}

function formatStatus(f: UsageFigures, nowMs: number): string | undefined {
  if (f.fiveHourPercent === null && f.weekPercent === null && f.costUsd === null) {
    return undefined
  }

  const fiveHourPct = f.fiveHourPercent === null ? '--' : `${f.fiveHourPercent}%`
  const weekPct = f.weekPercent === null ? '--' : `${f.weekPercent}%`
  const cost = f.costUsd === null ? '--' : `$${f.costUsd.toFixed(2)}`

  const part1 = `5h ${bar(f.fiveHourPercent)} ${fiveHourPct} (${formatResetsIn(f.fiveHourResetsAt, nowMs)})`
  const part2 = `7d ${bar(f.weekPercent)} ${weekPct} (${formatResetsIn(f.weekResetsAt, nowMs)})`

  return `${part1} ${SEPARATOR} ${part2} ${SEPARATOR} ${cost}`
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    $.ui.status(undefined)

    const usage = await $.session.usage()
    await update($, figures, prev => merge(prev, usage.rateLimits, usage.cost))

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    await update($, figures, prev => merge(prev, e.rateLimits, e.cost))

    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) {
      return next(e)
    }

    const f = await read($, figures)
    const text = formatStatus(f, await $.clock.now())

    if (text === undefined) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)

    return (
      <Box flexDirection="row" justifyContent="flex-end" width="100%">
        <Text dimColor>{text}</Text>
      </Box>
    )
  })
}
