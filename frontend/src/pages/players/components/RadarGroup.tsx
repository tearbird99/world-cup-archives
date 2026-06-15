import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip
} from 'recharts'
import { useTranslation } from 'react-i18next'
import type { SeasonStats, StatMode } from '../types'
import { RADAR_MAX } from '../constants'
import { buildRadar } from '../utils'

interface RadarGroupProps {
  s: SeasonStats
  mode: StatMode
  minutes: number
  maxMaps: typeof RADAR_MAX.career_total
}

// 레이더 차트 4개 묶음 — Attacking / Passing / Dribbling·Duels / Defending
// 각 항목은 constants.ts의 RADAR_MAX 상한 대비 0~100으로 정규화
// 툴팁에는 raw(원래 값)를 표시
export default function RadarGroup({ s, mode, minutes, maxMaps }: RadarGroupProps) {
  const { t } = useTranslation('players')

  // 차트별 설정 — titleKey: 번역 키, mapKey: RADAR_MAX 카테고리
  const charts: {
    titleKey: string
    mapKey: keyof typeof RADAR_MAX.career_total
    items: { labelKey: string; value: number }[]
  }[] = [
    {
      titleKey: 'detail.chart_attacking',
      mapKey: 'attacking',
      items: [
        { labelKey: 'detail.radar_goals',           value: s.goals },
        { labelKey: 'detail.radar_total_shots',     value: s.totalShots },
        { labelKey: 'detail.radar_shots_on_target', value: s.shotsOnTarget },
        { labelKey: 'detail.radar_goals_inside',    value: s.goalsFromInsideTheBox },
        { labelKey: 'detail.radar_goals_outside',   value: s.goalsFromOutsideTheBox },
      ],
    },
    {
      titleKey: 'detail.chart_passing',
      mapKey: 'passing',
      items: [
        { labelKey: 'detail.radar_assists',          value: s.assists },
        { labelKey: 'detail.radar_key_passes',       value: s.keyPasses },
        { labelKey: 'detail.radar_big_chances',      value: s.bigChancesCreated },
        { labelKey: 'detail.radar_accurate_passes',  value: s.accuratePasses },
        { labelKey: 'detail.radar_long_balls',       value: s.accurateLongBalls },
      ],
    },
    {
      titleKey: 'detail.chart_dribbling',
      mapKey: 'dribbling',
      items: [
        { labelKey: 'detail.radar_dribbles',     value: s.successfulDribbles },
        { labelKey: 'detail.radar_ground_duels', value: s.groundDuelsWon },
        { labelKey: 'detail.radar_aerial_duels', value: s.aerialDuelsWon },
        { labelKey: 'detail.radar_total_duels',  value: s.totalDuelsWon },
        { labelKey: 'detail.radar_was_fouled',   value: s.wasFouled },
      ],
    },
    {
      titleKey: 'detail.chart_defending',
      mapKey: 'defending',
      items: [
        { labelKey: 'detail.radar_tackles',       value: s.tackles },
        { labelKey: 'detail.radar_tackles_won',   value: s.tacklesWon },
        { labelKey: 'detail.radar_interceptions', value: s.interceptions },
        { labelKey: 'detail.radar_clearances',    value: s.clearances },
        { labelKey: 'detail.radar_blocked_shots', value: s.blockedShots },
      ],
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {charts.map(({ titleKey, mapKey, items }) => {
        const radarItems = items.map(({ labelKey, value }) => ({
          label: t(labelKey),
          value,
        }))
        // RADAR_MAX의 키(영문 camelCase)를 번역된 label로 매핑
        const translatedMaxMap = Object.fromEntries(
          items.map(({ labelKey }, i) => [
            t(labelKey),
            Object.values(maxMaps[mapKey])[i] ?? 1,
          ])
        )
        const data = buildRadar(radarItems, translatedMaxMap, mode, minutes)

        return (
          <div key={titleKey} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2 text-center">
              {t(titleKey)}
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={data}>
                <PolarGrid stroke="#e4e4e7" />
                <PolarAngleAxis dataKey="label" tick={{ fill: '#71717a', fontSize: 11 }} />
                <Radar dataKey="value" stroke="#65a30d" fill="#65a30d" fillOpacity={0.3} />
                {/* 툴팁: 정규화된 value 대신 raw(원래 값) 표시 */}
                <Tooltip
                  formatter={(_: unknown, __: unknown, props: { payload?: { raw?: number; label?: string } }) => [
                    props.payload?.raw ?? 0, props.payload?.label ?? '',
                  ]}
                  contentStyle={{
                    backgroundColor: '#18181b', border: 'none',
                    borderRadius: '8px', color: '#f4f4f5', fontSize: '11px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )
      })}
    </div>
  )
}