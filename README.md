# MCP News Server

뉴스 헤드라인을 가져오고, 요약하고, 한국어로 번역하는 Model Context Protocol (MCP) 서버입니다.

## 기능

이 MCP 서버는 다음 4가지 도구를 제공합니다:

### 1. `get_top_headlines`
미국의 상위 10개 뉴스 헤드라인을 가져옵니다.
- **파라미터**: 
  - `category` (선택): business, entertainment, general, health, science, sports, technology
- **반환값**: 제목, 출처, 발행 시간

### 2. `get_news_details`
특정 뉴스 기사의 상세 정보를 가져옵니다.
- **파라미터**: 
  - `title` (필수): 뉴스 기사의 정확한 제목
- **반환값**: 제목, 출처, 발행 시간, 설명, URL, 작성자

### 3. `summarize_news`
AI를 사용하여 뉴스 기사를 요약합니다.
- **파라미터**: 
  - `text` (필수): 요약할 뉴스 텍스트
  - `maxLength` (선택): 요약 최대 단어 수 (기본값: 100)
- **반환값**: 요약된 텍스트

### 4. `translate_to_korean`
영어 뉴스 텍스트를 고품질 한국어로 번역합니다.
- **파라미터**: 
  - `text` (필수): 번역할 영어 텍스트
- **반환값**: 한국어 번역

## 설치 방법

### 1. 프로젝트 클론 및 의존성 설치

```bash
cd c:\Users\ekfak\git-repositories\ai\mcp-news-server
npm install
```

### 2. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 API 키를 설정합니다:

```bash
cp .env.example .env
```

`.env` 파일을 열고 다음 값을 설정하세요:

```env
# News API Key - https://newsapi.org/에서 무료로 발급받을 수 있습니다
NEWS_API_KEY=your_actual_news_api_key

# OpenAI API Key - https://platform.openai.com/api-keys에서 발급받을 수 있습니다
OPENAI_API_KEY=your_actual_openai_api_key
```

#### API 키 발급 방법:

**News API:**
1. https://newsapi.org/ 방문
2. "Get API Key" 클릭하여 무료 계정 생성
3. API 키 복사

**OpenAI API:**
1. https://platform.openai.com/ 방문
2. 계정 생성 또는 로그인
3. API Keys 섹션에서 새 키 생성
4. API 키 복사

### 3. 빌드

```bash
npm run build
```

## Claude Desktop에서 사용하기

Claude Desktop 설정 파일에 다음을 추가합니다:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "mcp-news-server": {
      "command": "node",
      "args": ["c:\\Users\\ekfak\\git-repositories\\ai\\mcp-news-server\\dist\\index.js"],
      "env": {
        "NEWS_API_KEY": "your_news_api_key",
        "OPENAI_API_KEY": "your_openai_api_key"
      }
    }
  }
}
```

또는 `.env` 파일을 사용하는 경우:

```json
{
  "mcpServers": {
    "mcp-news-server": {
      "command": "node",
      "args": ["c:\\Users\\ekfak\\git-repositories\\ai\\mcp-news-server\\dist\\index.js"],
      "cwd": "c:\\Users\\ekfak\\git-repositories\\ai\\mcp-news-server"
    }
  }
}
```

설정 후 Claude Desktop을 재시작하세요.

## 사용 예시

Claude Desktop에서 다음과 같이 요청할 수 있습니다:

1. **오늘의 헤드라인 가져오기:**
   > "오늘의 미국 주요 뉴스 헤드라인 10개를 가져와줘"

2. **기술 뉴스 가져오기:**
   > "오늘의 기술 관련 뉴스를 가져와줘"

3. **특정 뉴스 상세 정보:**
   > "첫 번째 뉴스의 상세 정보를 보여줘"

4. **뉴스 요약:**
   > "이 뉴스를 50단어로 요약해줘"

5. **한국어 번역:**
   > "이 뉴스를 한국어로 번역해줘"

6. **조합 사용:**
   > "오늘의 헤드라인을 가져와서 첫 번째 뉴스의 상세 정보를 한국어로 번역해줘"

## 개발

### 개발 모드로 실행:

```bash
npm run dev
```

### Watch 모드 (자동 재빌드):

```bash
npm run watch
```

## 프로젝트 구조

```
mcp-news-server/
├── src/
│   ├── index.ts              # MCP 서버 메인 파일
│   └── tools/
│       ├── fetchNews.ts      # News API 통합
│       ├── summarize.ts      # AI 요약 기능
│       └── translate.ts      # AI 번역 기능
├── dist/                     # 빌드된 파일
├── package.json
├── tsconfig.json
├── .env                      # API 키 (생성 필요)
└── .env.example              # 환경 변수 예시
```

## 기술 스택

- **TypeScript**: 타입 안전성을 위한 주 개발 언어
- **@modelcontextprotocol/sdk**: MCP 프로토콜 구현
- **axios**: HTTP 요청
- **News API**: 뉴스 헤드라인 소스
- **OpenAI GPT-4o-mini**: 요약 및 번역

## 제한 사항

- News API 무료 플랜은 하루 100개의 요청으로 제한됩니다
- News API는 개발자 계정으로는 최신 뉴스만 제공됩니다 (최근 24시간)
- OpenAI API는 사용량에 따라 과금됩니다

## 문제 해결

### "NEWS_API_KEY is required" 오류
- `.env` 파일이 프로젝트 루트에 있는지 확인하세요
- `.env` 파일에 올바른 API 키가 설정되어 있는지 확인하세요

### "Failed to fetch news" 오류
- News API 키가 유효한지 확인하세요
- 하루 요청 제한을 초과하지 않았는지 확인하세요
- 인터넷 연결을 확인하세요

### Claude Desktop에서 서버가 보이지 않음
- `claude_desktop_config.json` 파일 경로가 올바른지 확인하세요
- 빌드가 완료되었는지 확인하세요 (`npm run build`)
- Claude Desktop을 완전히 재시작하세요
