# Girl Scout Reddit Analyzer (Devvit)

r/girlscouts 서브레딧 데이터를 Reddit 안에서 분석하는 Devvit 앱입니다.

## 기능

- r/girlscouts Hot / New / Top(1년) 게시글 수집
- KPI: 전체 게시글, 평균 업보트, 평균 댓글, 가장 활발한 월
- 월별 차트, 키워드 분석, 카테고리 분류, 워드클라우드
- Redis 캐싱 (6시간)
- 모더레이터 전용 데이터 새로고침

## 시작하기

### 요구사항

- Node.js 22.2.0+
- Reddit 계정

### 설치

```bash
cd devvit-app
npm install
npm run login
npm run dev
```

브라우저에서 Playtest URL을 열고 **Launch Dashboard**를 클릭하세요.

### r/girlscouts에서 테스트 (모더레이터 권한 필요)

`package.json`의 dev 스크립트를 수정:

```json
"dev": "devvit playtest r/girlscouts"
```

## 사용 방법

### 모더레이터

1. 서브레딧 메뉴(⋯) → **Create Analyzer Dashboard** → 분석 포스트 생성
2. **Refresh r/girlscouts Data** → 최신 데이터 수집
3. 포스트에서 **Launch Dashboard** 클릭

### 일반 사용자

- 대시보드 포스트를 열어 커뮤니티 인사이트 확인

## 배포

```bash
npm run deploy    # 업로드
npm run launch    # Reddit 심사 제출
```

r/girlscouts에 정식 배포하려면 모더레이터의 앱 설치 승인이 필요합니다.

## 프로젝트 구조

```
devvit-app/
├── devvit.json           # 앱 설정
├── src/
│   ├── client/           # React 대시보드 UI
│   ├── server/           # Reddit API + Redis 캐시
│   └── shared/           # 키워드/분류 로직
```

## 참고

- OAuth 앱 등록 불필요 (Devvit가 인증 처리)
- 외부 웹사이트 없이 Reddit 안에서만 동작
- AI 인사이트는 향후 OpenAI settings 연동으로 확장 가능
