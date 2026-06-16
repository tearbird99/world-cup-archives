import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Users, Shield, Medal, BookOpen, Gamepad2, ArrowRight, BarChart2 } from 'lucide-react'

import main01 from '@/assets/images/home/main-01.jpg'
import main02 from '@/assets/images/home/main-02.jpg'
import main03 from '@/assets/images/home/main-03.jpg'
import main04 from '@/assets/images/home/main-04.jpg'
import main05 from '@/assets/images/home/main-05.jpg'

const mainImages = [main01, main02, main03, main04, main05]

export default function Home() {
  const { t } = useTranslation('home')
  const { t: tNav } = useTranslation('nav')
  const [currentImg, setCurrentImg] = useState(0)

  useEffect(() => {
    const len = mainImages.length
    const timer = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % len)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Stats Bar 데이터
  const stats = [
    { label: t('stats.tournaments'), value: '23' },
    { label: t('stats.nations'), value: '80+' },
    { label: t('stats.goals'), value: '2,548' },
    { label: t('stats.years'), value: '96' },
  ]

  // Quick Links 데이터
  const quickLinks = [
    { to: '/players', icon: Users, label: tNav('players'), desc: t('quicklinks.players') },
    { to: '/teams', icon: Shield, label: tNav('teams'), desc: t('quicklinks.teams') },
    { to: '/records', icon: Medal, label: tNav('records'), desc: t('quicklinks.records') },
    { to: '/history', icon: BookOpen, label: tNav('history'), desc: t('quicklinks.history') },
    { to: '/stats', icon: BarChart2, label: tNav('stats'), desc: t('quicklinks.stats') },
    { to: '/games', icon: Gamepad2, label: tNav('games'), desc: t('quicklinks.games') },
  ]

  return (
    <div className="flex flex-col gap-0 -m-6">

      {/* 1. Main Section */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 min-h-[480px] overflow-hidden">

        {/* 배경 이미지 슬라이드 */}
        {mainImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: i === currentImg ? 1 : 0,
            }}
          />
        ))}

        {/* 어두운 오버레이 — 텍스트 가독성 */}
        <div className="absolute inset-0 bg-black/50" />

        {/* 연도 뱃지 */}
        <span className="relative z-10 mb-4 inline-block text-xs font-semibold tracking-widest uppercase text-white/80 border border-white/30 px-3 py-1 rounded-full">
          {t('badge')}
        </span>

        {/* 헤드라인 */}
        <h1 className="relative z-10 text-5xl md:text-6xl font-bold leading-tight tracking-tight mb-6 max-w-3xl text-white">
          {t('headline1')}<br />
          <span className="text-lime-300">{t('headline2')}</span> {t('headline3')}
        </h1>

        {/* 서브 문구 */}
        <p className="relative z-10 text-white/70 text-lg max-w-xl leading-relaxed">
          {t('subtext')}
        </p>

        {/* 슬라이드 인디케이터 */}
        <div className="relative z-10 flex gap-2 mt-8">
          {mainImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImg(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentImg ? 'bg-white w-6' : 'bg-white/40 w-2'
                }`}
            />
          ))}
        </div>

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

      {/* 3. Quick Links */}
      <section className="px-6 py-16">
        <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
          <span className="w-1 h-5 bg-primary rounded-full inline-block" />
          {t('quicklinks_title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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