# 걸스카우트 Reddit 분석기 (Girl Scout Reddit Analyzer)

r/girlscouts 서브레딧 데이터를 분석하는 **Reddit Devvit 인앱**입니다.

> **현재 활성 프로젝트:** [`devvit-app/`](./devvit-app/) — Reddit 안에서 동작하는 분석 대시보드  
> 루트의 Next.js 코드는 초기 프로토타입이며, 외부 사이트 방식은 사용하지 않습니다.

## 빠른 시작 (Devvit)

```bash
cd devvit-app
npm install
npm run login
npm run dev
```

자세한 내용은 [devvit-app/README.md](./devvit-app/README.md)를 참고하세요.

---

## Devvit 앱 기능

- **Reddit 데이터 수집**: Hot / Top(1년) / New 게시글 수집 및 중복 제거
- **대시보드**: KPI 카드, 월별 차트, 키워드/주제 분포 시각화
- **키워드 분석**: 불용어 제거, 상위 50개 키워드, 워드클라우드
- **자동 분류**: 11개 카테고리 규칙 기반 분류
- **AI 인사이트**: OpenAI GPT 기반 커뮤니티 분석 (캐싱)
- **혁신 연구 모드**: 회원 감소, 배지 아이디어, 한국 부흥 전략 등
- **게시글 검색**: 키워드/카테고리/날짜 필터
- **국가별 비교**: 미국 vs 한국 (확장 가능 설계)
- **관리자 인증**: 로그인한 사용자만 데이터 수집 가능

## 프로젝트 구조

```
scoutapi/
├── prisma/
│   ├── schema.prisma          # DB 스키마
│   ├── seed.ts                # 시드 데이터
│   └── migrations/            # 마이그레이션
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   ├── dashboard/         # 대시보드 페이지
│   │   ├── search/            # 검색 페이지
│   │   ├── insights/          # AI 인사이트
│   │   ├── innovation/        # 혁신 연구 모드
│   │   ├── compare/           # 국가별 비교
│   │   └── login/             # 관리자 로그인
│   ├── components/
│   │   ├── ui/                # shadcn/ui 컴포넌트
│   │   ├── layout/            # 레이아웃
│   │   └── dashboard/         # 차트 컴포넌트
│   ├── lib/
│   │   ├── auth.ts            # NextAuth 설정
│   │   ├── prisma.ts          # Prisma 클라이언트
│   │   ├── reddit.ts          # Reddit API 서비스
│   │   ├── openai.ts          # OpenAI 서비스
│   │   ├── keywords.ts        # 키워드 추출
│   │   ├── categorizer.ts     # 게시글 분류
│   │   └── dashboard.ts       # 대시보드 통계
│   └── types/                 # TypeScript 타입
├── .env.example
└── README.md
```

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경변수 설정

`.env.example`을 복사하여 `.env` 파일을 생성합니다.

```bash
cp .env.example .env
```

필수 환경변수:

```env
REDDIT_CLIENT_ID=your_reddit_client_id
REDDIT_CLIENT_SECRET=your_reddit_client_secret
REDDIT_USER_AGENT=GirlScoutRedditAnalyzer/1.0

OPENAI_API_KEY=your_openai_api_key

DATABASE_URL=postgresql://user:password@localhost:5432/girlscout_analyzer

NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-secure-password
```

### 3. Reddit API 설정

1. [Reddit Apps](https://www.reddit.com/prefs/apps)에서 **script** 타입 앱 생성
2. Client ID와 Client Secret을 `.env`에 설정
3. User-Agent는 `앱이름/버전` 형식으로 설정

### 4. 데이터베이스 설정

```bash
# PostgreSQL 데이터베이스 생성 후
npm run db:migrate
npm run db:seed
```

### 5. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인합니다.

## 사용 방법

1. `/login`에서 관리자 계정으로 로그인
2. 대시보드에서 **"최신 데이터 가져오기"** 클릭하여 Reddit 데이터 수집
3. 차트와 KPI로 커뮤니티 현황 확인
4. **AI 인사이트** / **혁신 연구 모드**에서 GPT 분석 생성
5. **게시글 검색**에서 필터링 검색
6. **국가별 비교**에서 미국/한국 비교 확인

## API 엔드포인트

| Method | Endpoint | 설명 | 인증 |
|--------|----------|------|------|
| POST | `/api/reddit/fetch` | Reddit 데이터 수집 | 필요 |
| GET | `/api/dashboard/stats` | 대시보드 통계 | - |
| GET | `/api/keywords` | 상위 키워드 | - |
| GET | `/api/posts/search` | 게시글 검색 | - |
| GET/POST | `/api/analysis` | AI 일반 분석 | POST: 필요 |
| GET/POST | `/api/analysis/innovation` | 혁신 연구 분석 | POST: 필요 |
| GET | `/api/compare` | 국가별 비교 | - |

## Vercel 배포

1. GitHub 저장소 연결
2. Vercel 프로젝트 생성
3. 환경변수 설정 (위 `.env` 항목 모두)
4. PostgreSQL 데이터베이스 연결 (Vercel Postgres, Neon, Supabase 등)
5. 배포 후 `npx prisma migrate deploy` 실행

## 라이선스

MIT
