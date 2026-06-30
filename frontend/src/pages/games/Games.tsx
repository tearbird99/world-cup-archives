import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { GAMES } from './games.config'

export default function Games() {
  const { t } = useTranslation('games')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">{t('hub.title')}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">{t('hub.subtitle')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {GAMES.map((game) => {
          const isAvailable = game.status === 'available'

          // 게임 카드 UI는 미리 만들어두고, available 여부에 따라 Link로 감쌀지만 결정
          const card = (
            <div
              className={`h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 transition-all duration-200 ${
                isAvailable
                  ? 'hover:border-lime-500 dark:hover:border-lime-500 hover:shadow-lg'
                  : 'opacity-60'
              }`}
            >
              <p className="font-bold text-zinc-900 dark:text-zinc-100 mb-1">{t(game.nameKey)}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-3">{t(game.descriptionKey)}</p>
              <span
                className={`inline-block text-xs font-bold px-3 py-1.5 rounded-lg ${
                  isAvailable
                    ? 'bg-lime-100 dark:bg-lime-900/30 text-lime-800 dark:text-lime-400'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {isAvailable ? t('hub.play') : t('hub.comingSoon')}
              </span>
            </div>
          )

          // 준비 중인 게임은 클릭 불가능하도록 Link 대신 div로 렌더링
          return isAvailable ? (
            <Link key={game.id} to={game.path}>
              {card}
            </Link>
          ) : (
            <div key={game.id}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}