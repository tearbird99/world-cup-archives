import type { TeamSeasonStats, StatMode } from '../types'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { fmt, fmtPct } from '../utils'

interface StatTableProps {
  s: TeamSeasonStats
  mode: StatMode
  matches: number
}

// 스탯 테이블 — Matches / Attacking / Passing / Defending / Other 섹션
// 섹션 헤더는 lime 색상으로 강조 (PlayerDetail의 StatTable과 동일한 시각 패턴)
// 번역 키: teams.json > detail.*
export default function StatTable({ s, mode, matches }: StatTableProps) {
  const { t } = useTranslation('teams')

  const sections = [
    {
      title: t('detail.section_matches'),
      rows: [
        { label: t('detail.matches'),       value: fmt(s.matches,        mode, matches, true) },
        { label: t('detail.awarded'),       value: fmt(s.awardedMatches, mode, matches, true) },
        { label: t('detail.rating'),        value: s.avgRating.toFixed(2) },
        { label: t('detail.clean_sheets'),  value: fmt(s.cleanSheets,    mode, matches) },
      ],
    },
    {
      title: t('detail.section_attacking'),
      rows: [
        { label: t('detail.goals_scored'),       value: fmt(s.goalsScored,       mode, matches) },
        { label: t('detail.total_shots'),        value: fmt(s.shots,             mode, matches) },
        { label: t('detail.shots_on_target'),    value: fmt(s.shotsOnTarget,     mode, matches) },
        { label: t('detail.shots_off_target'),   value: fmt(s.shotsOffTarget,    mode, matches) },
        { label: t('detail.big_chances'),        value: fmt(s.bigChances,        mode, matches) },
        { label: t('detail.big_chances_missed'), value: fmt(s.bigChancesMissed,  mode, matches) },
        { label: t('detail.goals_inside_box'),   value: `${s.goalsFromInsideTheBox}/${s.shotsFromInsideTheBox}` },
        { label: t('detail.goals_outside_box'),  value: `${s.goalsFromOutsideTheBox}/${s.shotsFromOutsideTheBox}` },
        { label: t('detail.headed_goals'),       value: fmt(s.headedGoals,       mode, matches) },
        { label: t('detail.left_foot_goals'),    value: fmt(s.leftFootGoals,     mode, matches) },
        { label: t('detail.right_foot_goals'),   value: fmt(s.rightFootGoals,    mode, matches) },
        { label: t('detail.free_kick_goals'),    value: fmt(s.freeKickGoals,     mode, matches) },
        { label: t('detail.penalty_goals'),      value: `${s.penaltyGoals}/${s.penaltiesTaken}` },
        { label: t('detail.hit_woodwork'),       value: fmt(s.hitWoodwork,       mode, matches) },
        { label: t('detail.fast_breaks'),        value: fmt(s.fastBreaks,        mode, matches) },
        { label: t('detail.corners'),            value: fmt(s.corners,           mode, matches) },
        { label: t('detail.offsides'),           value: fmt(s.offsides,          mode, matches) },
      ],
    },
    {
      title: t('detail.section_passing'),
      rows: [
        { label: t('detail.assists'),                value: fmt(s.assists,             mode, matches) },
        { label: t('detail.possession'),             value: `${s.averageBallPossession.toFixed(1)}%` },
        { label: t('detail.big_chances_created'),    value: fmt(s.bigChancesCreated,   mode, matches) },
        { label: t('detail.accurate_passes'),        value: fmtPct(s.accuratePasses,          s.totalPasses,             mode, matches) },
        { label: t('detail.accurate_own_half'),      value: fmtPct(s.accurateOwnHalfPasses,   s.totalOwnHalfPasses,      mode, matches) },
        { label: t('detail.accurate_opp_half'),      value: fmtPct(s.accurateOppositionHalfPasses, s.totalOppositionHalfPasses, mode, matches) },
        { label: t('detail.accurate_long_balls'),    value: fmtPct(s.accurateLongBalls,       s.totalLongBalls,          mode, matches) },
        { label: t('detail.accurate_crosses'),       value: fmtPct(s.accurateCrosses,         s.totalCrosses,            mode, matches) },
      ],
    },
    {
      title: t('detail.section_defending'),
      rows: [
        { label: t('detail.goals_conceded'),     value: fmt(s.goalsConceded,        mode, matches) },
        { label: t('detail.tackles'),            value: fmt(s.tackles,              mode, matches) },
        { label: t('detail.interceptions'),      value: fmt(s.interceptions,        mode, matches) },
        { label: t('detail.clearances'),         value: fmt(s.clearances,           mode, matches) },
        { label: t('detail.saves'),              value: fmt(s.saves,                mode, matches) },
        { label: t('detail.error_lead_shot'),    value: fmt(s.errorsLeadingToShot,  mode, matches) },
        { label: t('detail.error_lead_goal'),    value: fmt(s.errorsLeadingToGoal,  mode, matches) },
        { label: t('detail.penalties_committed'),value: fmt(s.penaltiesCommited,    mode, matches) },
        { label: t('detail.last_man_tackles'),   value: fmt(s.lastManTackles,       mode, matches) },
        { label: t('detail.yellow_cards'),       value: fmt(s.yellowCards,          mode, matches) },
        { label: t('detail.red_cards'),          value: fmt(s.redCards,             mode, matches) },
      ],
    },
    {
      title: t('detail.section_other'),
      rows: [
        { label: t('detail.successful_dribbles'),value: fmt(s.successfulDribbles, mode, matches) },
        { label: t('detail.ground_duels'),       value: fmtPct(s.groundDuelsWon,  s.totalGroundDuels, mode, matches) },
        { label: t('detail.aerial_duels'),       value: fmtPct(s.aerialDuelsWon,  s.totalAerialDuels, mode, matches) },
        { label: t('detail.total_duels'),        value: fmtPct(s.duelsWon,        s.totalDuels,       mode, matches) },
        { label: t('detail.possession_lost'),    value: fmt(s.possessionLost,     mode, matches) },
        { label: t('detail.fouls'),              value: fmt(s.fouls,              mode, matches) },
        { label: t('detail.ball_recovery'),      value: fmt(s.ballRecovery,       mode, matches) },
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