import type { SeasonStats, StatMode } from '../types'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { fmt, fmtPct } from '../utils'

interface StatTableProps {
  s: SeasonStats
  mode: StatMode
  minutes: number
}

// 스탯 테이블 — Matches / Attacking / Passing / Defending / Other 섹션
// 섹션 헤더는 lime 색상으로 강조
// 번역 키: players.json > detail.*
export default function StatTable({ s, mode, minutes }: StatTableProps) {
  const { t } = useTranslation('players')

  const sections = [
    {
      title: t('detail.section_matches'),
      rows: [
        { label: t('detail.appearances'),  value: fmt(s.appearances,    mode, minutes, true) },
        { label: t('detail.started'),      value: fmt(s.matchesStarted, mode, minutes, true) },
        { label: t('detail.minutes'),      value: fmt(s.minutesPlayed,  mode, minutes, true) },
        { label: t('detail.rating'),       value: s.rating.toFixed(2) },
      ],
    },
    {
      title: t('detail.section_attacking'),
      rows: [
        { label: t('detail.goals'),              value: fmt(s.goals,            mode, minutes) },
        { label: t('detail.total_shots'),        value: fmt(s.totalShots,       mode, minutes) },
        { label: t('detail.shots_on_target'),    value: fmt(s.shotsOnTarget,    mode, minutes) },
        { label: t('detail.big_chances_missed'), value: fmt(s.bigChancesMissed, mode, minutes) },
        { label: t('detail.goals_inside_box'),   value: `${s.goalsFromInsideTheBox}/${s.shotsFromInsideTheBox}` },
        { label: t('detail.goals_outside_box'),  value: `${s.goalsFromOutsideTheBox}/${s.shotsFromOutsideTheBox}` },
        { label: t('detail.headed_goals'),       value: fmt(s.headedGoals,      mode, minutes) },
        { label: t('detail.left_foot_goals'),    value: fmt(s.leftFootGoals,    mode, minutes) },
        { label: t('detail.right_foot_goals'),   value: fmt(s.rightFootGoals,   mode, minutes) },
        { label: t('detail.free_kick_goals'),    value: fmt(s.freeKickGoal,     mode, minutes) },
        { label: t('detail.penalty_goals'),      value: `${s.penaltyGoals}/${s.penaltiesTaken}` },
        { label: t('detail.penalty_won'),        value: fmt(s.penaltyWon,       mode, minutes) },
        { label: t('detail.hit_woodwork'),       value: fmt(s.hitWoodwork,      mode, minutes) },
        { label: t('detail.offsides'),           value: fmt(s.offsides,         mode, minutes) },
      ],
    },
    {
      title: t('detail.section_passing'),
      rows: [
        { label: t('detail.assists'),                value: fmt(s.assists,    mode, minutes) },
        { label: t('detail.key_passes'),             value: fmt(s.keyPasses,  mode, minutes) },
        { label: t('detail.big_chances_created'),    value: fmt(s.bigChancesCreated, mode, minutes) },
        { label: t('detail.accurate_passes'),        value: fmtPct(s.accuratePasses,       s.totalPasses,        mode, minutes) },
        { label: t('detail.accurate_long_balls'),    value: fmtPct(s.accurateLongBalls,    s.totalLongBalls,     mode, minutes) },
        { label: t('detail.accurate_chipped_passes'),value: fmtPct(s.accurateChippedPasses, s.totalChippedPasses, mode, minutes) },
        { label: t('detail.crosses'),                value: fmtPct(s.accurateCrosses,      s.totalCross,         mode, minutes) },
      ],
    },
    {
      title: t('detail.section_defending'),
      rows: [
        { label: t('detail.tackles'),          value: fmt(s.tackles,          mode, minutes) },
        { label: t('detail.tackles_won'),      value: fmt(s.tacklesWon,       mode, minutes) },
        { label: t('detail.interceptions'),    value: fmt(s.interceptions,    mode, minutes) },
        { label: t('detail.clearances'),       value: fmt(s.clearances,       mode, minutes) },
        { label: t('detail.blocked_shots'),    value: fmt(s.blockedShots,     mode, minutes) },
        { label: t('detail.error_lead_shot'),  value: fmt(s.errorLeadToShot,  mode, minutes) },
        { label: t('detail.error_lead_goal'),  value: fmt(s.errorLeadToGoal,  mode, minutes) },
        { label: t('detail.penalty_conceded'), value: fmt(s.penaltyConceded,  mode, minutes) },
        { label: t('detail.yellow_cards'),     value: fmt(s.yellowCards,      mode, minutes) },
        { label: t('detail.red_cards'),        value: fmt(s.redCards,         mode, minutes) },
      ],
    },
    {
      title: t('detail.section_other'),
      rows: [
        { label: t('detail.touches'),          value: fmt(s.touches,          mode, minutes) },
        { label: t('detail.possession_lost'),  value: fmt(s.possessionLost,   mode, minutes) },
        { label: t('detail.dribbles_won'),     value: fmt(s.successfulDribbles,         mode, minutes) },
        { label: t('detail.ground_duels'),     value: fmtPct(s.groundDuelsWon,     s.groundDuels, mode, minutes) },
        { label: t('detail.aerial_duels'),     value: fmtPct(s.aerialDuelsWon,     s.aerialDuels, mode, minutes) },
        { label: t('detail.total_duels'),      value: fmtPct(s.totalDuelsWon,      s.totalDuels,  mode, minutes) },
        { label: t('detail.fouls'),            value: fmt(s.fouls,            mode, minutes) },
        { label: t('detail.was_fouled'),       value: fmt(s.wasFouled,        mode, minutes) },
      ],
    },
  ]

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
      <table className="w-full text-sm">
        <tbody>
          {sections.map(({ title, rows }) => (
            <Fragment key={title}>
              {/* 섹션 헤더 행 */}
              <tr className="bg-lime-50 dark:bg-lime-900/20 border-t border-lime-200 dark:border-lime-800">
                <td colSpan={2} className="px-4 py-2.5 font-semibold text-lime-800 dark:text-lime-400 text-xs uppercase tracking-wide">
                  {title}
                </td>
              </tr>
              {/* 데이터 행 — 짝수, 홀수 줄 배경 교차 */}
              {rows.map(({ label, value }, i) => (
                <tr key={label} className={i % 2 === 0 ? 'bg-white dark:bg-zinc-950' : 'bg-zinc-50/50 dark:bg-zinc-900/50'}>
                  <td className="px-4 py-2.5 text-zinc-500 dark:text-zinc-400">{label}</td>
                  <td className="px-4 py-2.5 text-right font-semibold text-zinc-900 dark:text-zinc-100">{value}</td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}