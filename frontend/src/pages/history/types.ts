// 목록(/api/history)에서 내려오는 아티클 요약 정보
export interface HistorySummary {
  year: number
  title: string
  host: string
  champion: string
  summary: string
  cover_image?: string
}

// 상세(/api/history/{year})에서 내려오는 전체 아티클 (마크다운 본문 포함)
export interface HistoryArticle extends HistorySummary {
  content: string
}