# todo app with react

- used vite+react

## 기능

### 1차 목표

- [x] 할 일 CRUD
- [x] 할 일은 localstorage에 저장

### 2차 목표

- [x] 할 일 수정 클릭 시 패널 뜨게 하기
  - [ ] 최적화되었는지 체크 필요 / 0704
- [x] 할 일에 날짜 추가
- [x] 완료된 할 일 따로 표시

### 3차 목표

- [ ] 할 일에 카테고리(태그) 만들기, 카테고리(태그) 선택/수정/삭제 기능 추가
- [ ] 카테고리(태그)별 보기 만들기

### 4차 목표

- subtask 기능 만들기

### 5차 목표

- 우선순위 큐 기능 만들기 (min-heap 기반, 우선순위가 heap 비교 index로 들어감)

### 6차 목표

- 서버 연동

## 프로젝트 구조

```
c:\dev\react-todo\
├── src/
│   ├── App.tsx              # 메인 애플리케이션 컴포넌트 (진입점)
│   ├── main.tsx             # Vite 진입점 (App.tsx를 렌더링)
│   ├── components/
│   │   ├── Modal.tsx        # 할 일 상세 편집 모달
│   │   └── Task.tsx         # 개별 할 일 아이템 컴포넌트
│   ├── types/
│   │   └── task.ts          # Task, Modal 타입 정의
│   ├── utils/
│   │   └── storage.ts       # localStorage 관리 유틸리티
│   ├── assets/
│   │   └── icons/
│   │       └── icon.svg     # 앱 아이콘
│   └── css/
│       └── todo.css         # TailwindCSS 커스텀 스타일
├── index.html               # HTML 진입점
├── vite.config.ts           # Vite 설정
├── tailwind.config.js       # TailwindCSS 설정
└── package.json
```

### 주요 진입점

- **HTML 진입점**: `index.html`
- **JavaScript 진입점**: `src/main.tsx`
- **React 앱 진입점**: `src/App.tsx` (모든 상태와 로직이 여기에 집중됨)

### 아키텍처 특징

- **상태 관리**: App.tsx에서 중앙집중식 관리 (useState)
- **데이터 저장**: localStorage를 통한 클라이언트 사이드 저장
- **스타일링**: TailwindCSS + 커스텀 CSS
- **타입 시스템**: TypeScript로 타입 안정성 확보
