export default function Footer() {
  const currentYear = new Date().getFullYear()
 
  return (
    <footer className="w-full shrink-0 border-t border-border bg-background text-muted-foreground text-xs">
      {/* 헤더와 동일한 너비 제한 */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-6 py-3">
 
        {/* 좌 — 브랜딩 + 데이터 출처 */}
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-foreground/70 tracking-wide uppercase text-[11px]">
            Worldcup Archives
          </span>
          <span className="text-[11px] opacity-60">
            Data sourced from{' '}
            <a
              href="https://www.sofascore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors duration-150"
            >
              Sofascore
            </a>
            {' · '}1966 – 2026
          </span>
        </div>
 
        {/* 우 — 기술 스택 + 저작권 */}
        <span className="text-[11px] opacity-60">
          Built with React · TypeScript · Tailwind CSS · © {currentYear}
        </span>
 
      </div>
    </footer>
  )
}