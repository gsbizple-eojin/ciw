# CIW 키오스크 프로토타입 v0.7

Figma `(작업용) v0.7`의 세로형 기본 화면을 기준으로 한다. 기본 IA 42개와 결제완료 흐름용 CMP-001을 포함해 43개 화면을 제공한다.

## 실행

- [index.html](index.html): 조작 가능한 프로토타입. 브라우저에서 직접 열면 된다.
- [전체화면 HTML](CIW_차세대_키오스크_전체화면_v0.7.html): 43개 화면 모아보기.
- [가로 화면 보기](landscape/index.html): 1280×800 가로형 42개 화면. `index.html` 왼쪽 패널의 ‘가로 화면 보기’ 버튼으로 연다. 필요한 HTML·이미지·폰트는 `landscape/`에 함께 보관한다. 일부 캐릭터의 SVG 마스크까지 확인하려면 `landscape/미리보기.cmd`로 실행한다.
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

## 지정 디자인 반영 — 2026-10-15

이번 적용 기준은 [화면설계서 (KIOSK)_v0.3_Design](https://www.figma.com/design/pTygpdbWWcya2gW84a6tma?node-id=817-58)의 아래 다섯 화면이다. 동일 이름의 코스 선택 대지 중 화면설계서 본열에 있는 `837:9803`을 사용한다.

| 화면 | 기준 Figma 대지 |
|---|---|
| 인트로 | [screen/KIO-INT-001 · 817:7296](https://www.figma.com/design/pTygpdbWWcya2gW84a6tma?node-id=817-7296) |
| 코스 선택 | [screen/KIO-CRS-001 · 837:9803](https://www.figma.com/design/pTygpdbWWcya2gW84a6tma?node-id=837-9803) |
| 주유 세차 할인권 등록 | [screen/KIO-DSC-001 · 817:8612](https://www.figma.com/design/pTygpdbWWcya2gW84a6tma?node-id=817-8612) |
| 주유 세차 할인권 스캔 | [screen/KIO-DSC-002 · 817:9498](https://www.figma.com/design/pTygpdbWWcya2gW84a6tma?node-id=817-9498) |
| 결제수단 선택 | [screen/KIO-PAY-001 · 837:10147](https://www.figma.com/design/pTygpdbWWcya2gW84a6tma?node-id=837-10147) |

- 배치·색상·문구·원본 자산은 지정 대지를 따른다. 빨간 기능 번호는 설계 주석이므로 이용 화면에 표시하지 않는다. 코스 선택 대지 내부에 없는 하단 버튼은 추가하지 않으며 화면 높이는 기존 검토 패널에서도 변경할 수 있다.
- 코스명·금액·할인 내역·최종 결제금액은 기존 거래 상태를 사용한다. 샘플 금액을 고정하지 않는다.
- 코스 선택 후 할인 팝업은 결제수단 화면 위에 표시한다. 결제수단 화면의 주유 할인 버튼에서는 스캔 화면으로 바로 이동한다. 주유 할인권과 할인 쿠폰은 중복 적용하지 않는다.
- 기본 화면은 광고가 위에, 높은 화면은 광고가 아래에 위치한다. 높이를 바꿔도 거래 상태를 유지한다.
- 화면 진입 280ms, 팝업 진입 320ms, 버튼 누름 150ms의 부드러운 반응을 적용한다. 30초 카운트와 스캔 안내 모션은 Figma 타임라인을 사용한다. 동작 줄이기 설정에서는 장식 모션을 생략하며 카운트 숫자는 계속 갱신한다.
- 할인 팝업은 키보드 포커스를 내부에 유지하고 Esc로 사용하지 않고 닫을 수 있다. 전체화면 모아보기에서는 진입·스캔 모션을 생략해 정지 화면으로 확인한다.
- 다른 화면의 디자인과 실제 장치·결제 연동은 이번 변경 범위에 포함하지 않는다.

## 이전 디자인 반영 — 2026-10-08

- 인트로: [Design/screen/KIO-INT-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=674-4749)
- 코스 선택: [Design/screen/KIO-CRS-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=674-4771)
- 위 인트로·코스 선택의 이전 디자인 기준이다. 현재 다섯 화면은 2026-10-15에 지정한 새 파일을 따른다. 화면 ID·카탈로그 수는 유지하며 전체화면 HTML에도 같은 디자인이 표시된다.
- 두 화면의 원본 이미지와 [Pretendard](https://github.com/orioncactus/pretendard)·[Montserrat](https://github.com/google/fonts/tree/main/ofl/montserrat) 글꼴을 로컬에서 사용한다. 글꼴 라이선스는 `assets/fonts/`에 보관한다.
- 인트로·코스선택은 240ms 진입 효과와 차량·코스 버튼의 터치 피드백을 제공한다. 전체화면 모아보기에서는 진입 효과를 생략하며, 브라우저의 동작 줄이기 설정을 따른다. 효과는 `styles.css`의 해당 주석 구간에서 수정한다.

## 관리 기준

- Git에는 이 폴더의 HTML·MD·`assets/`·`.gitignore`를 함께 올린다. QA·임시 파일은 제외한다.
- 최신 작업본은 이 폴더에서 수정하고 변경 이력은 Git으로 관리한다. 이전 버전은 보존한다.
- AI 수정 규칙은 [AGENTS.md](AGENTS.md)를 따른다.
- 영수증 발급 성공 후 해당 결제의 발급 버튼을 숨긴다. 취소·실패 시 유지하고 새 결제에서는 다시 표시한다.
- 관리자 예시 비밀번호는 `1234`이며 장치·결제 연동은 시뮬레이션이다. 상세 조건은 IA 문서에 기록한다.
