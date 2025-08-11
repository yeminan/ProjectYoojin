# Yoojin BioSoft

**Spring + Next.js 기반 관리자 페이지**  
Spring API와 연동하여 **회원가입, 병원 정보 조회, 라이선스 관리 기능**을 제공합니다.

---

## 주요 기능

- ✅ 개인 회원가입 (이메일 인증 포함)
- ✅ 병원 검색 API 연동
- ✅ 라이선스 발급, 만료, 연장 관리
- ✅ 관리자 페이지 UI 구성
- ✅ 환경변수 분리 관리 (`.env.local`, `.env.sample`) 사용
---

## 사용 기술

### Frontend

- React.js (Next.js)
- React Bootstrap (UI 프레임워크)
- React Hooks (useState, useEffect) 기반 상태관리
- 환경변수 관리 (.env.sample 제공)
  
### Backend

- Spring Boot
- Spring Web (REST API 설계)
- Spring Data JPA (User Entity 기반 DB 연동)
- JWT (Json Web Token) 기반 인증 및 HttpOnly Cookie 관리
- Email 인증 프로세스 구현 (토큰 발급 및 메일 발송)
- Exception Handling + ResponseEntity 기반 REST 응답 처리
- Cross-Origin Resource Sharing (CORS) 설정을 통한 Front-Backend 연동 지원

---

## 실행방법

### 프로젝트 클론

```bash
git clone https://github.com/yeminan/ProjectYoojin.git
cd ProjectYoojin
npm install
npm run dev
```

## 라이선스

본 프로젝트는 개인 포트폴리오 및 비상업적 용도로 공개됩니다.  
상업적 사용 및 무단 복제는 허용되지 않습니다.
