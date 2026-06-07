export default function Games() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Games & Quiz</h1>

      {/* 퀴즈 더미데이터 */}
      {Array.from({ length: 30 }, (_, i) => (
        <div key={i} className="mb-4 p-4 border border-border rounded-lg">
          <h2 className="font-semibold mb-1">Quiz #{i + 1}</h2>
          <p className="text-muted-foreground text-sm">
            Which player scored the most goals in the {1966 + (i % 15) * 4} FIFA World Cup?
          </p>
        </div>
      ))}
    </div>
  )
}