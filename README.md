# CIW 키오스크 프로토타입 v0.7

Figma `(작업용) v0.7`의 세로형 기본 화면을 기준으로 한다. 기본 IA 42개와 결제완료 흐름용 CMP-001을 포함해 43개 화면을 제공한다.

## 실행

- [index.html](index.html): 조작 가능한 프로토타입. 브라우저에서 직접 열면 된다.
- [전체화면 HTML](CIW_차세대_키오스크_전체화면_v0.7.html): 43개 화면 모아보기.
- 서버 설치나 빌드 없이 실행한다. 두 HTML과 `assets/`의 상대 위치를 유지한다.

## 수정할 파일

| 변경 내용 | 파일 |
|---|---|
| 화면 이름·ID·설명·목록 | `assets/screen-catalog.js` |
| 인트로·차종 선택 | `assets/screens/intro.js` |
| 코스 선택·설명·할인권 등록 | `assets/screens/course.js` |
| 결제·상품권·쿠폰·할인권 인식 | `assets/screens/payment.js` |
| 결제완료·세차권 사용완료·영수증 | `assets/screens/completion.js` |
| 오토패스·세차권 선택 | `assets/screens/autopass.js` |
| 이용 안내·높이·상태·공통 팝업 | `assets/screens/common.js` |
| 관리자 로그인·설정·저장 | `assets/screens/admin.js` |
| 공통 상태·금액 계산·이동·버튼 동작 | `assets/app.js` |
| 화면 등록·초기 실행·이벤트 연결 | `assets/init.js` |
| 유효성 검사 메시지·검토 조작 | `assets/validation.js` |
| 프로토타입 디자인 | `assets/styles.css` — 화면별 주석·클래스로 검색 |
| 전체화면 모아보기 | `assets/all-screens.js`, `assets/all-screens.css` |
| 이미지·아이콘 원본 | `assets/images/` |
| 완성 디자인의 글꼴·라이선스 | `assets/fonts/` |
| IA·정책·Figma 대응 | [IA·정책 MD](CIW_차세대_키오스크_IA&정책_v0.7.md) |

공통 상태는 `app.js`, 화면별 HTML은 `screens/`에서 수정한다. 기존 화면 함수와 v0.7 UI 적용 부분을 같은 기능 파일에 보관한다. 카탈로그는 두 HTML이 공유하며 이미지는 필요한 원본만 둔다.

## 완료 디자인 반영 — 2026-10-08

- 인트로: [Design/screen/KIO-INT-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=674-4749)
- 코스 선택: [Design/screen/KIO-CRS-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=674-4771)
- 동일 ID의 `Design/screen/*` 프레임은 완료된 디자인 작업물이며 해당 화면의 UI 기준으로 우선 적용한다. 화면 ID·카탈로그 수·이용 흐름은 유지한다. 전체화면 HTML에도 같은 디자인이 표시된다.
- 두 화면의 원본 이미지와 [Pretendard](https://github.com/orioncactus/pretendard)·[Montserrat](https://github.com/google/fonts/tree/main/ofl/montserrat) 글꼴을 로컬에서 사용한다. 글꼴 라이선스는 `assets/fonts/`에 보관한다.
- 인트로·코스선택은 240ms 진입 효과와 차량·코스 버튼의 터치 피드백을 제공한다. 전체화면 모아보기에서는 진입 효과를 생략하며, 브라우저의 동작 줄이기 설정을 따른다. 효과는 `styles.css`의 해당 주석 구간에서 수정한다.

## 관리 기준

- Git에는 이 폴더의 HTML·MD·`assets/`·`.gitignore`를 함께 올린다. QA·임시 파일은 제외한다.
- 최신 작업본은 이 폴더에서 수정하고 변경 이력은 Git으로 관리한다. 이전 버전은 보존한다.
- AI 수정 규칙은 [AGENTS.md](AGENTS.md)를 따른다.
- 영수증 발급 성공 후 해당 결제의 발급 버튼을 숨긴다. 취소·실패 시 유지하고 새 결제에서는 다시 표시한다.
- 관리자 예시 비밀번호는 `1234`이며 장치·결제 연동은 시뮬레이션이다. 상세 조건은 IA 문서에 기록한다.
