import { useTranslation } from 'react-i18next'
import { MODE_KEYS } from '../constants'
import type { StatMode } from '../types'

// 스탯 모드 전환 버튼 (Total / Per 90)
export default function ModeToggle({ mode, onChange }: { mode: StatMode; onChange: (m: StatMode) => void }) {
  const { t } = useTranslation('teams')

  return (
    <div className="flex rounded-lg overflow-hidden border border-blue-200 dark:border-blue-800 text-xs font-medium">
      {MODE_KEYS.map((key) => (
        <button key={key} onClick={() => onChange(key)}
          className={`px-3 py-1 transition-colors ${mode === key
            ? 'bg-blue-600 text-white'
            : 'bg-white dark:bg-zinc-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950'
          }`}
        >
          {t(`mode_${key}`)}
        </button>
      ))}
    </div>
  )
}