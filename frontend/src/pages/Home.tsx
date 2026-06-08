import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, Shield, Medal, BookOpen, Gamepad2, ArrowRight } from 'lucide-react'

export default function Home() {
  const { t } = useTranslation()

  // Stats Bar 데이터
  const stats = [
    { label: t('home.stats.tournaments'), value: '23' },
    { label: t('home.stats.nations'), value: '80+' },
    { label: t('home.stats.goals'), value: '2,548' },
    { label: t('home.stats.years'), value: '96' },
  ]

  // Highlight 카드 데이터
  const highlights = t('home.highlights', { returnObjects: true }) as {
    year: string
    title: string
    description: string
    tag: string
  }[]

  // Quick Links 데이터
  const quickLinks = [
    { to: '/players', icon: Users, label: t('nav.players'), desc: t('home.quicklinks.players') },
    { to: '/teams', icon: Shield, label: t('nav.teams'), desc: t('home.quicklinks.teams') },
    { to: '/records', icon: Medal, label: t('nav.records'), desc: t('home.quicklinks.records') },
    { to: '/history', icon: BookOpen, label: t('nav.history'), desc: t('home.quicklinks.history') },
    { to: '/games', icon: Gamepad2, label: t('nav.games'), desc: t('home.quicklinks.games') },
  ]

  return (
    <div className="flex flex-col gap-0 -m-6">

      {/* 1. Hero Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden bg-gradient-to-b from-background to-muted">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full border border-primary/10 opacity-40" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-primary/10 opacity-30" />
          <div className="absolute w-[200px] h-[200px] rounded-full bg-primary/5" />
        </div>

        {/* 연도 뱃지 */}
        <span className="relative z-10 mb-4 inline-block text-xs font-semibold tracking-widest uppercase text-primary border border-primary/30 px-3 py-1 rounded-full">
          {t('home.badge')}
        </span>

        {/* 헤드라인 */}
        <h1 className="relative z-10 text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-3xl">
          {t('home.headline1')}<br />
          <span className="text-primary">{t('home.headline2')}</span> {t('home.headline3')}
        </h1>

        {/* 서브 문구 */}
        <p className="relative z-10 text-muted-foreground text-lg max-w-xl leading-relaxed">
          {t('home.subtext')}
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
          {t('home.highlights_title')}
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
          {t('home.quicklinks_title')}
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