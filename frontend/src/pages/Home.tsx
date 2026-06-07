import { Link } from 'react-router-dom'
import { Users, Shield, Medal, BookOpen, Gamepad2, ArrowRight } from 'lucide-react'

/* ── 홈 페이지 ────────────────────────────────────────────────────────────────
 * 섹션 구성:
 * 1) Hero       — 월드컵을 상징하는 헤드라인 + 서브 문구
 * 2) Stats Bar  — 숫자로 보는 월드컵 역사 요약
 * 3) Highlights — 역대 명장면 카드 3개
 * 4) Quick Links — 각 페이지 바로가기 카드
 * ─────────────────────────────────────────────────────────────────────────── */

// ── Stats Bar 데이터 ──────────────────────────────────────────────────────────
const stats = [
  { label: 'Tournaments', value: '23' },
  { label: 'Nations', value: '80+' },
  { label: 'Goals Scored', value: '2,548' },
  { label: 'Years of History', value: '96' },
]

// ── Highlight 카드 데이터 ─────────────────────────────────────────────────────
const highlights = [
  {
    year: '1986',
    title: 'The Hand of God',
    description:
      "Diego Maradona's infamous goal against England — part fist, part genius — defined an era and sparked one of football's greatest debates.",
    tag: 'Argentina · Mexico',
  },
  {
    year: '2002',
    title: 'The Miracle of Senegal',
    description:
      "Senegal's stunning debut, defeating defending champions France in the group stage, shocked the world and rewrote the rules of World Cup football.",
    tag: 'Senegal · South Korea',
  },
  {
    year: '2014',
    title: '7–1. Das Requiem.',
    description:
      "Germany dismantled host nation Brazil 7–1 in the semi-final. A night so surreal it has its own Wikipedia article — 'Mineirazo'.",
    tag: 'Germany · Brazil',
  },
]

// ── Quick Links 데이터 ────────────────────────────────────────────────────────
const quickLinks = [
  { to: '/players', icon: Users,    label: 'Players',      desc: 'Career stats & rankings' },
  { to: '/teams',   icon: Shield,   label: 'Teams',        desc: 'Nation-by-nation records' },
  { to: '/records', icon: Medal,    label: 'Records',      desc: 'All-time leaderboards' },
  { to: '/history', icon: BookOpen, label: 'History',      desc: 'Tournament by tournament' },
  { to: '/games',   icon: Gamepad2, label: 'Games & Quiz', desc: 'Test your knowledge' },
]

export default function Home() {
  return (
    <div className="flex flex-col gap-0">

      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden bg-gradient-to-b from-background to-muted">
        {/* 배경 장식 — 큰 반투명 원 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-primary/10 opacity-40" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/10 opacity-30" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-primary/5" />
        </div>

        {/* 연도 뱃지 */}
        <span className="relative z-10 mb-4 inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-primary/30 px-3 py-1 rounded-full">
          1930 — 2026
        </span>

        {/* 헤드라인 */}
        <h1 className="relative z-10 text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-3xl">
          Every four years,<br />
          <span className="text-primary">the world stops</span> to watch.
        </h1>

        {/* 서브 문구 */}
        <p className="relative z-10 text-muted-foreground text-lg max-w-xl leading-relaxed">
          The FIFA World Cup — the most watched sporting event on Earth.
          Explore the complete history, statistics, and unforgettable moments
          from every tournament since 1930.
        </p>
      </section>

      {/* 2. Stats Bar */}
      <section className="border-y border-border bg-muted/50">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map(({ label, value }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center py-6 px-4 gap-1
                ${i < stats.length - 1 ? 'border-r border-border' : ''}`}
            >
              <span className="text-3xl font-bold text-primary">{value}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Highlights */}
      <section className="px-6 py-16">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block" />
          Moments That Defined the World Cup
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {highlights.map(({ year, title, description, tag }) => (
            <article
              key={title}
              className="group flex flex-col gap-3 border border-border rounded-xl p-5 bg-card hover:border-primary/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-primary/20 group-hover:text-primary/40 transition-colors">
                  {year}
                </span>
                <span className="text-xs text-muted-foreground border border-border rounded-full px-2 py-0.5">
                  {tag}
                </span>
              </div>
              <h3 className="text-base font-semibold leading-snug">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Quick Links */}
      <section className="px-6 pb-16">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block" />
          Explore the Archives
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {quickLinks.map(({ to, icon: Icon, label, desc }) => (
            <Link
              key={to}
              to={to}
              className="group flex flex-col gap-2 border border-border rounded-xl p-4 bg-card hover:border-primary/50 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center justify-between">
                <Icon className="w-5 h-5 text-primary" />
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
              <span className="font-semibold text-sm">{label}</span>
              <span className="text-xs text-muted-foreground">{desc}</span>
            </Link>
          ))}
        </div>
      </section>

    </div>
  )
}