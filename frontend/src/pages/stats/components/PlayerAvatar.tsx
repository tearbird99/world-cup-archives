// 선수 아바타 공용 컴포넌트 — 선수 사진(/players/{id}.webp) + 배경에 팀 국기 워터마크
// (/teams/{teamCode}.webp)를 겹쳐서 표시. StatCard, StatsDetail에서 공용으로 사용.

interface PlayerAvatarProps {
  id: number
  name: string
  teamCode: string | null
  className?: string
}

export default function PlayerAvatar({ id, name, teamCode, className = 'w-8 h-8' }: PlayerAvatarProps) {
  return (
    <div className={`relative shrink-0 rounded-full overflow-hidden bg-muted ${className}`}>
      {teamCode && (
        <img
          src={`/teams/${teamCode.toUpperCase()}.webp`}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-30 scale-110"
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
      )}
      <img
        src={`/players/${id}.webp`}
        alt={name}
        className="relative z-10 w-full h-full object-cover"
        onError={(e) => {
          const img = e.currentTarget
          if (img.src.endsWith('/players/default.webp')) return
          img.src = '/players/default.webp'
        }}
      />
    </div>
  )
}