export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-2">개인정보처리방침</h1>
      <p className="text-sm text-muted-foreground mb-8">최종 수정일: 2026년 7월 1일</p>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">1. 수집하는 개인정보 항목</h2>
        <p className="leading-relaxed">
          World Cup Archives(이하 "서비스")는 구글 소셜 로그인을 통해 아래 정보를
          수집합니다.
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>이메일 주소</li>
          <li>이름</li>
          <li>프로필 사진 URL</li>
          <li>구글 계정 고유 식별자(Google Sub ID)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">2. 개인정보 수집 및 이용 목적</h2>
        <p className="leading-relaxed">
          수집한 정보는 아래 목적으로만 사용되며, 명시된 목적 외 다른 용도로
          사용되지 않습니다.
        </p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>회원 식별 및 로그인 상태 유지</li>
          <li>팀/선수 즐겨찾기 기능 제공</li>
          <li>댓글 작성자 식별 및 댓글 기능 제공</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">3. 개인정보 보유 및 이용 기간</h2>
        <p className="leading-relaxed">
          회원 탈퇴 또는 계정 삭제 요청 시 지체 없이 파기합니다. 별도의 탈퇴
          절차를 이용할 수 없는 경우, 아래 문의처로 요청해 주시면 처리해
          드립니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">4. 제3자 제공</h2>
        <p className="leading-relaxed">
          서비스는 수집한 개인정보를 외부에 제공하거나 판매하지 않습니다.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-2">5. 문의처</h2>
        <p className="leading-relaxed">
          개인정보 관련 문의사항은 아래 이메일로 연락해 주시기 바랍니다.
          <br />
          이메일: your-email@example.com
        </p>
      </section>
    </div>
  )
}