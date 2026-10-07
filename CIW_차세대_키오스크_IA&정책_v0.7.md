# 컴인워시 차세대 키오스크 IA·정책 v0.7

- 기준일: 2026-10-07
- 기준 디자인: [Eojin_CIW_KIOSK — (작업용) v0.7](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-7859)
- 문서 역할: Figma에 배치된 키오스크 화면의 IA, 화면 변형 및 운영 정책 관리
- 이전 문서: [IA·정책 v0.6](../v0.6/CIW_차세대_키오스크_IA&정책_v0.6.md)
- 화면 ID·화면명·표현 유형은 해당 페이지의 screen 프레임과 IA 정책표를 기준으로 관리한다. 설명의 이전 ID와 프레임 ID가 다른 경우 현재 프레임 ID를 기록하고 차이를 확인 필요 항목에 남긴다.
- 기본 screen과 `-W`, `-v1`, `-v2` 변형은 각각 별도 집계한다. 기본 이름으로 등록된 프레임은 실제 운영 노출 여부와 구분하여 집계한다.
- 인트라넷 `INT-*` 화면은 같은 페이지의 별도 서비스 참고 목록으로 관리한다.
- Figma 내부에서 서로 다른 정책은 확인 필요로 표시한다. 이 문서의 화면 목록 갱신이 프로토타입·기능명세서의 구현 완료를 의미하지 않는다.

## 화면 집계

| 대상 | 프레임 수 | 고유 화면 ID 수 | 비고 |
| --- | --- | --- | --- |
| 키오스크 기본 screen | 43 | 42 | KIO-CMP-002 동일 이름 2개 |
| 키오스크 -W | 40 | 40 | 가로형 변형 |
| 키오스크 -v1 | 3 | 3 | CRS-001 / PAY-001 / ADM-002 |
| 키오스크 -v2 | 1 | 1 | CRS-001 |
| 키오스크 합계 | 87 | 86 | 기본 ID와 변형 ID는 별도 |
| 인트라넷 기본 screen | 10 | 6 | 일부 ID 중복 배치 |
| 인트라넷 -v1 | 2 | 1 | INT-009-402-v1 중복 배치 |
| 인트라넷 합계 | 12 | 7 | 키오스크 IA와 별도 |
| 페이지 전체 screen 합계 | 99 | 93 | 현재 확인된 키오스크·인트라넷 프레임 합산 |

`Section`, `description`, `validation`, `policy`, 문서 이력, 일반 텍스트·도형은 화면 집계에서 제외한다. 화면 ID 중복은 개수만 합치며 Figma 원본 프레임은 변경하지 않는다.

## IA 목록

기본 screen의 고유 ID **42개**를 등록한다. 기존 NO·서비스 구분·구분·depth·화면 ID·화면명·표현 유형·비고 구조를 유지하며 화면 ID를 Figma 원본에 연결했다. 팝업·Alert·Toast도 각각 하나의 IA 항목이다.

| NO | 서비스 구분 | 구분 | 1depth | 2depth | 3depth | 화면 ID | 화면명 | 표현 유형 | 비고 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | 사용자 | 인트로 | 인트로 |  |  | [KIO-INT-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11301) | 인트로 | 페이지 |  |
| 2 | 사용자 | 코스선택 | 코스 선택 |  |  | [KIO-CRS-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-7863) | 코스 선택 | 페이지 |  |
| 3 | 사용자 | 코스선택 | 세차 코스 설명 |  |  | [KIO-CRS-002](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8097) | 세차코스 설명 | 팝업 | 코스 상세 설명·데이터 제공 방식 보완 필요 |
| 4 | 사용자 | 할인 등록 | 세차 할인권 등록 |  |  | [KIO-DSC-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8109) | 세차 할인권 등록 | 팝업 |  |
| 5 | 사용자 | 할인 등록 | 세차 할인권 등록 | 세차 할인권 사용 |  | [KIO-DSC-002](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8302) | 세차 할인권 사용 | 페이지 | 바코드 인식·할인 적용 후 결제수단선택 이동 |
| 6 | 사용자 | 결제수단선택 | 결제수단선택 |  |  | [KIO-PAY-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11415) | 결제수단선택 | 페이지 |  |
| 7 | 사용자 | 결제하기 | 결제수단선택 | 카드결제 |  | [KIO-PAY-101](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8219) | 카드결제 | 페이지 |  |
| 8 | 사용자 | 결제하기 | 결제수단선택 | 카드결제 | 카드결제 (외부 팝업) | [KIO-PAY-102](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8385) | 카드결제 (외부 팝업) | 외부 팝업 |  |
| 9 | 사용자 | 결제하기 | 결제수단선택 | 컴인워시 앱 결제 |  | [KIO-PAY-201](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8467) | 컴인워시 앱 결제 | 페이지 |  |
| 10 | 사용자 | 결제하기 | 결제수단선택 | 모바일 상품권 결제 |  | [KIO-PAY-301](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8550) | 모바일 상품권 결제 | 페이지 |  |
| 11 | 사용자 | 결제하기 | 결제수단선택 | 모바일 상품권 결제 | 모바일 상품권 사용 | [KIO-PAY-302](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8633) | 모바일 상품권 사용 | 팝업 |  |
| 12 | 사용자 | 결제하기 | 결제수단선택 | 모바일 상품권 결제 | 모바일 상품권 사용 (추가결제) | [KIO-PAY-303](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8732) | 모바일 상품권 사용 (추가결제) | 팝업 |  |
| 13 | 사용자 | 결제하기 | 결제수단선택 | 할인 쿠폰 결제 |  | [KIO-PAY-401](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8831) | 할인 쿠폰 결제 | 페이지 |  |
| 14 | 사용자 | 결제하기 | 결제수단선택 | 할인 쿠폰 결제 | 할인 쿠폰 사용 | [KIO-PAY-402](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8914) | 할인 쿠폰 사용 | 팝업 |  |
| 15 | 사용자 | 결제하기 | 결제수단선택 | 할인 쿠폰 결제 | 할인 쿠폰 사용 (추가 결제) | [KIO-PAY-403](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9013) | 할인 쿠폰 사용 (추가 결제) | 팝업 |  |
| 16 | 사용자 | 결제하기 | 결제수단선택 | 현금결제 | 현금결제 | [KIO-PAY-501](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9112) | 현금결제 | 페이지 | 가로형 전용·작성 보류. 기본 이름 프레임은 집계에 포함 |
| 17 | 사용자 | 결제완료 | 결제완료 (세차중) |  |  | [KIO-CMP-002](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15324) | 결제완료 (세차중) | 페이지 | 동일 ID 프레임 2개. 대기중·세차중 안내가 다름; 명칭 확인 필요 |
| 18 | 사용자 | 결제완료 | 세차권 사용 완료 |  |  | [KIO-CMP-003](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15223) | 세차권 사용 완료 | 페이지 |  |
| 19 | 사용자 | 결제완료 | 세차권 사용 완료 (세차중) |  |  | [KIO-CMP-004](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15249) | 세차권 사용 완료 (세차중) | 페이지 |  |
| 20 | 사용자 | 결제완료 | 세차권 사용 완료 | 영수증 발급 |  | [KIO-CMP-005](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9202) | 영수증 발급 | 팝업 |  |
| 21 | 사용자 | 결제완료 | 세차권 사용 완료 | 영수증 발급 | 영수증 발급 (성공) | [KIO-CMP-005A](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9270) | 영수증 발급 (성공) | Alert |  |
| 22 | 사용자 | 오토패스 | 비회원 |  |  | [KIO-AUT-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9302) | (비회원) 웰컴메시지 | 페이지 |  |
| 23 | 사용자 | 오토패스 | 회원 |  |  | [KIO-AUT-002](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9368) | (회원) 웰컴 메시지 | 페이지 |  |
| 24 | 사용자 | 오토패스 | 세차권 자동 선택 |  |  | [KIO-AUT-003](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9531) | 세차권 자동 선택 | 페이지 | 세차권 1개·자동 사용 ON; 7초 후 자동 사용 |
| 25 | 사용자 | 오토패스 | 세차권 자동 선택 |  |  | [KIO-AUT-004](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9490) | 세차권 자동 선택(수동 사용) | 페이지 | 세차권 1개·자동 사용 OFF; 7초 카운트 미노출 |
| 26 | 사용자 | 오토패스 | 세차권 수동 선택 |  |  | [KIO-AUT-005](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9434) | 세차권 수동 선택 | 페이지 | 사용 가능한 세차권 2개 이상 |
| 27 | 사용자 | 공통 | 컴인워시 이용 안내 |  |  | [KIO-COM-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-16433) | 컴인워시 이용 안내 | 팝업 |  |
| 28 | 사용자 | 공통 | 화면 높이 설정 |  |  | [KIO-COM-002](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9636) | 화면 높이 설정 | 팝업 |  |
| 29 | 사용자 | 공통 | 타임아웃 |  |  | [KIO-COM-003](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9743) | 타임아웃 | 팝업 | 5초 카운트 종료 후 이동 위치 상충; 확인 필요 |
| 30 | 사용자 | 공통 | 시스템 상태 | 로딩 |  | [KIO-COM-004](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9838) | 로딩 | 페이지 |  |
| 31 | 사용자 | 공통 | 시스템 상태 | 점검 중 |  | [KIO-COM-005](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9845) | 점검 중 | 페이지 |  |
| 32 | 사용자 | 공통 | 시스템 상태 | 세차 이용 불가 |  | [KIO-COM-006](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9852) | 세차 이용 불가 | 페이지 |  |
| 33 | 사용자 | 공통 | 시스템 상태 | 공통 alert |  | [KIO-COM-007](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9872) | 공통 alert | Alert | 타임아웃: IA 정책표 30초와 공통 Alert 정책 5초 상충 |
| 34 | 사용자 | 공통 | 시스템 상태 | 공통 Toast |  | [KIO-COM-008](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9961) | 공통 Toast | Toast | 2초 후 Toast만 종료; 오류·성공 적용 범위 확인 필요 |
| 35 | 사용자 | 공통 | 시스템 상태 | 네트워크 오류 |  | [KIO-COM-009](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-9862) | 네트워크 오류 | 페이지 | 네트워크 오류 전용 상태 페이지 |
| 36 | 사용자 | 세차권 QR | 세차권 인식 (성공) |  |  | [KIO-TQR-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10189) | 세차권 인식 (성공) | Toast | 완료 화면 위 Toast; 2초 후 Toast만 종료 |
| 37 | 사용자 | 세차권 QR | 세차권 QR 사용 안내 |  |  | [KIO-TQR-002](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10044) | 세차권 QR 사용 안내 | 팝업 |  |
| 38 | 사용자 | 세차권 QR | 세차권 코스 불일치 |  |  | [KIO-TQR-003](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10117) | 세차권 코스 불일치 | 팝업 | 사용 안함 / 세차권 사용으로 분기 |
| 39 | 관리자 | 관리자 | 관리자 로그인 |  |  | [KIO-ADM-001](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14865) | 관리자 로그인 | 팝업 | 기본 비밀번호 1234; 실패 제한 시간·횟수 정책 상충 |
| 40 | 관리자 | 관리자 | 관리자 설정 | 키오스크 설정 |  | [KIO-ADM-002](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14991) | 키오스크 설정 | 페이지 | 관리자 무조작 타임아웃 미적용 |
| 41 | 관리자 | 관리자 | 관리자 설정 | 시스템 설정 |  | [KIO-ADM-003](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15125) | 시스템 설정 | 페이지 | 프레임 ID는 ADM-003, 설명 제목은 ADM-005; ID 통일 필요 |
| 42 | 관리자 | 관리자 | 관리자 설정 | 키오스크 설정 | 변경사항 저장 확인 | [KIO-ADM-004](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15171) | 변경사항 저장 확인 | 팝업 | 설정 변경 상태에서 메인으로 이동할 때 저장 확인 |

### 기본 screen이 없는 논리 화면

| 화면 ID | 화면명 | 현재 Figma 근거 | 관리 방식 |
| --- | --- | --- | --- |
| KIO-CMP-001 | 결제완료 | [KIO-CMP-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15316) 및 [화면 설명](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15276), [IA 정책표](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-13774) 존재 | 기본 42개에는 미포함. 논리 화면과 가로형 변형은 유지; 기본 프레임의 누락 또는 CMP-002 오명명 여부 확인 |

## 화면 변형 목록

### 가로형 -W

`screen(W)/` 프레임 **40개**를 별도 등록한다. 전부 1280 × 800이다. 프레임 존재만으로 해당 기능의 운영 활성화를 확정하지 않는다.

| NO | 변형 화면 ID | 기본 연결 ID | 화면명 | 비고 |
| --- | --- | --- | --- | --- |
| 1 | [KIO-INT-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11047) | KIO-INT-001 | 인트로 |  |
| 2 | [KIO-CRS-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11049) | KIO-CRS-001 | 코스 선택 |  |
| 3 | [KIO-DSC-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11094) | KIO-DSC-001 | 세차 할인권 등록 |  |
| 4 | [KIO-DSC-002-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11097) | KIO-DSC-002 | 세차 할인권 사용 |  |
| 5 | [KIO-PAY-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11299) | KIO-PAY-001 | 결제수단선택 |  |
| 6 | [KIO-PAY-101-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11099) | KIO-PAY-101 | 카드결제 |  |
| 7 | [KIO-PAY-102-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11103) | KIO-PAY-102 | 카드결제 (외부 팝업) |  |
| 8 | [KIO-PAY-201-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11105) | KIO-PAY-201 | 컴인워시 앱 결제 |  |
| 9 | [KIO-PAY-301-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11109) | KIO-PAY-301 | 모바일 상품권 결제 |  |
| 10 | [KIO-PAY-302-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11112) | KIO-PAY-302 | 모바일 상품권 사용 |  |
| 11 | [KIO-PAY-303-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11114) | KIO-PAY-303 | 모바일 상품권 사용 (추가결제) |  |
| 12 | [KIO-PAY-401-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11116) | KIO-PAY-401 | 할인 쿠폰 결제 |  |
| 13 | [KIO-PAY-402-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11120) | KIO-PAY-402 | 할인 쿠폰 사용 |  |
| 14 | [KIO-PAY-403-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11122) | KIO-PAY-403 | 할인 쿠폰 사용 (추가 결제) |  |
| 15 | [KIO-PAY-501-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11125) | KIO-PAY-501 | 현금결제 | 가로형 전용·작성 보류 |
| 16 | [KIO-CMP-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15316) | KIO-CMP-001 | 결제완료 | 기본 screen 없음 |
| 17 | [KIO-CMP-002-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15318) | KIO-CMP-002 | 결제완료 (세차중) |  |
| 18 | [KIO-CMP-003-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15320) | KIO-CMP-003 | 세차권 사용 완료 |  |
| 19 | [KIO-CMP-004-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15322) | KIO-CMP-004 | 세차권 사용 완료 (세차중) |  |
| 20 | [KIO-CMP-005-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11073) | KIO-CMP-005 | 영수증 발급 |  |
| 21 | [KIO-CMP-005A-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11129) | KIO-CMP-005A | 영수증 발급 (성공) |  |
| 22 | [KIO-AUT-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11052) | KIO-AUT-001 | (비회원) 웰컴메시지 |  |
| 23 | [KIO-AUT-002-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11055) | KIO-AUT-002 | (회원) 웰컴 메시지 |  |
| 24 | [KIO-AUT-003-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11057) | KIO-AUT-003 | 세차권 자동 선택 |  |
| 25 | [KIO-AUT-004-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11060) | KIO-AUT-004 | 세차권 자동 선택(수동 사용) |  |
| 26 | [KIO-AUT-005-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11063) | KIO-AUT-005 | 세차권 수동 선택 |  |
| 27 | [KIO-COM-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11075) | KIO-COM-001 | 컴인워시 이용 안내 |  |
| 28 | [KIO-COM-002-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11077) | KIO-COM-002 | 화면 높이 설정 | 설명에 가로형 제외 명시; 프레임 존재와 상충 |
| 29 | [KIO-COM-003-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11079) | KIO-COM-003 | 타임아웃 |  |
| 30 | [KIO-COM-004-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11084) | KIO-COM-004 | 로딩 |  |
| 31 | [KIO-COM-005-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11086) | KIO-COM-005 | 점검 중 |  |
| 32 | [KIO-COM-006-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11082) | KIO-COM-006 | 세차 이용 불가 |  |
| 33 | [KIO-COM-007-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11090) | KIO-COM-007 | 공통 alert |  |
| 34 | [KIO-COM-008-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11092) | KIO-COM-008 | 공통 Toast |  |
| 35 | [KIO-COM-009-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11088) | KIO-COM-009 | 네트워크 오류 |  |
| 36 | [KIO-TQR-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11131) | KIO-TQR-001 | 세차권 인식 (성공) |  |
| 37 | [KIO-TQR-002-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11127) | KIO-TQR-002 | 세차권 QR 사용 안내 |  |
| 38 | [KIO-ADM-001-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14769) | KIO-ADM-001 | 관리자 로그인 |  |
| 39 | [KIO-ADM-002-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14773) | KIO-ADM-002 | 키오스크 설정 |  |
| 40 | [KIO-ADM-003-W](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14771) | KIO-ADM-003 | 시스템 설정 |  |

기본 screen에 있으나 -W 프레임이 없는 ID는 `KIO-CRS-002`, `KIO-TQR-003`, `KIO-ADM-004`이다. 가로형 지원 여부는 이 목록만으로 확정하지 않는다.

### 버전 변형

| NO | 변형 화면 ID | 기본 연결 ID | 화면명 | 프레임 크기 | 비고 |
| --- | --- | --- | --- | --- | --- |
| 1 | [KIO-ADM-002-v1](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14775) | KIO-ADM-002-v1 |  | 1199 × 1200 | 대안 프레임; 최종 채택 여부 미명시 |
| 2 | [KIO-CRS-001-v1](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-8019) | KIO-CRS-001-v1 |  | 1080 × 1920 | 대안 프레임; 최종 채택 여부 미명시 |
| 3 | [KIO-CRS-001-v2](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-7947) | KIO-CRS-001-v2 |  | 1080 × 1920 | 대안 프레임; 최종 채택 여부 미명시 |
| 4 | [KIO-PAY-001-v1](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11492) | KIO-PAY-001-v1 |  | 1080 × 1920 | 대안 프레임; 최종 채택 여부 미명시 |

Figma의 실제 접미사는 `-v1`, `-v2`이다. v1·v2를 서로 합치거나 기본 화면에 포함하여 세지 않는다.

## 화면별 바코드·세차권 QR·타임아웃 정책

사용자 화면의 정책값은 [Figma IA 정책표](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-13774)를 기준으로 기록한다. 아래 값 중 공통 정책 또는 화면 설명과 다른 항목은 뒤의 확인 필요 목록에서 관리한다. 바코드 리더기 활성화와 세차권 QR 사용 가능 여부는 서로 다른 항목이다.

| 화면 ID | 바코드 리더기 | 세차권 QR 인식 | 타임아웃 |
| --- | --- | --- | --- |
| KIO-INT-001 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 미적용 |
| KIO-CRS-001 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-CRS-002 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 5초 무응답 시 팝업 닫기 |
| KIO-DSC-001 | 활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-DSC-002 | 활성화 | 인식 불가 | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-PAY-001 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-PAY-101 | 비활성화 | 인식 불가 | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-PAY-102 | 비활성화 | 인식 불가 | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-PAY-201 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-PAY-301 | 활성화 | 인식 불가 | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-PAY-302 | 활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-PAY-303 | 활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-PAY-401 | 활성화 | 인식 불가 | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-PAY-402 | 활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-PAY-403 | 활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-PAY-501 | 비활성화 | 인식 불가 | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-CMP-002 | 비활성화 | 인식 불가 | 미적용 (별도 정책 사용) |
| KIO-CMP-003 | 비활성화 | 인식 불가 | 미적용 (별도 정책 사용) |
| KIO-CMP-004 | 비활성화 | 인식 불가 | 미적용 (별도 정책 사용) |
| KIO-CMP-005 | 비활성화 | 인식 불가 | 미적용 (별도 정책 사용) |
| KIO-CMP-005A | 비활성화 | 인식 불가 | 미적용 (별도 정책 사용) |
| KIO-AUT-001 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-AUT-002 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-AUT-003 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-AUT-004 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-AUT-005 | 활성화 | 사용 가능 (세차권 QR 유효성 검사 진행) | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-COM-001 | 비활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-COM-002 | 비활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-COM-003 | 비활성화 | 인식 불가 | 미적용 |
| KIO-COM-004 | 비활성화 | 인식 불가 | 미적용 |
| KIO-COM-005 | 비활성화 | 인식 불가 | 미적용 |
| KIO-COM-006 | 비활성화 | 인식 불가 | 미적용 |
| KIO-COM-007 | 비활성화 | 인식 불가 | 30초 무응답 시 <타임아웃> 팝업 노출 |
| KIO-COM-008 | 비활성화 | 인식 불가 | 미적용 |
| KIO-COM-009 | 비활성화 | 인식 불가 | 미적용 |
| KIO-TQR-001 | 활성화 | 인식 불가 | 미적용 |
| KIO-TQR-002 | 활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-TQR-003 | 활성화 | 인식 불가 | 5초 무응답 시 팝업 닫기 |
| KIO-ADM-001 | 확인 필요 | 확인 필요 | 확인 필요 |
| KIO-ADM-002 | 확인 필요 | 확인 필요 | 미적용 (화면 설명 명시) |
| KIO-ADM-003 | 확인 필요 | 확인 필요 | 미적용 (관리자 설정 공통 적용; 개별 설명 미명시) |
| KIO-ADM-004 | 확인 필요 | 확인 필요 | 확인 필요 |

기본 screen이 없는 `KIO-CMP-001`의 IA 정책표 값은 바코드 리더기 **비활성화**, 세차권 QR **인식 불가**, 타임아웃 **미적용 (별도 정책 사용)**이다. 가로형 변형별 독립 정책표는 없으므로 프레임 존재와 별개로 가로형 제외·전용 조건을 함께 확인한다.

## 화면 및 상태 운영 정책

### 코스 선택·할인·결제

- `KIO-INT-001`에서 화면 높이를 선택하면 `KIO-CRS-001`로 이동한다. 가로형 인트로는 이미지 광고를 전체 화면에 표시하고 터치 시 코스 선택으로 이동한다.
- 코스 설명 버튼은 `KIO-CRS-002` 팝업을 연다. 코스 상세 내용과 데이터 제공 방식은 화면 설명에 보완 필요로 남아 있다.
- 주유 세차 할인 사용 매장에서 코스를 선택하면 `KIO-DSC-001` 등록 팝업을 연다. [사용]은 `KIO-DSC-002`로 이동하며, [사용 안함]은 할인 미적용 후 `KIO-PAY-001`로 이동한다. 주유 세차 할인 미사용 매장은 등록 팝업을 건너뛴다.
- `KIO-DSC-002`에서 할인권을 인식하고 유효성 검사에 통과하면 할인 금액 Toast를 표시한 뒤 결제수단선택으로 이동한다. 뒤로가기·코스 재선택은 코스 선택 정보를 초기화하고 코스 선택으로 이동한다.
- `KIO-PAY-001`은 코스 금액과 적용된 세차 할인·모바일 상품권·할인 쿠폰 금액, 잔여 결제금액을 표시한다. 주유 세차 할인권과 할인 쿠폰은 중복 적용하지 않는다. 이미 적용된 모바일 상품권·할인 쿠폰은 재사용 버튼을 비활성화한다.
- 카드결제는 `KIO-PAY-101`에서 외부 결제 모듈 `KIO-PAY-102`를 호출한다. 승인·실패·요청취소 안내는 외부 모듈 지원 범위와 응답을 따른다.
- 컴인워시 앱 결제는 `KIO-PAY-201`, 모바일 상품권 결제는 `KIO-PAY-301`, 할인 쿠폰 결제는 `KIO-PAY-401`로 연결한다. 설명 본문에 남아 있는 다른 ID는 현재 프레임명에 맞춰 해석하고 확인 필요 목록에 기록한다.
- 모바일 상품권의 잔액에 따라 `KIO-PAY-302` 또는 `KIO-PAY-303`을 표시한다. 할인 쿠폰은 `KIO-PAY-402` 또는 `KIO-PAY-403`을 표시한다. 충분한 잔액 사용 후에는 완료 화면으로 이동하고, 부족한 잔액 적용 후에는 결제수단선택에서 나머지 금액을 결제한다.
- 결제 상세 화면의 뒤로가기는 코스·할인 정보를 유지하고 결제수단선택으로 이동한다. 코스 재선택은 코스·할인 정보를 초기화하고 코스 선택으로 이동한다.
- `KIO-PAY-501` 현금결제는 화면 설명상 **가로형 전용·작성 보류**이다. 기본 이름의 1080 × 1920 프레임과 -W 프레임 모두 존재하지만 세로형 운영 화면으로 활성화하지 않는다. 관리자 설명에서도 세로형 현금결제 설정을 숨긴다.

근거: [코스 선택](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10225), [할인권 사용](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10255), [결제수단선택](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11289), [현금결제](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10355).

### 결제완료·세차권 사용 완료·영수증

- 결제 완료는 세차기 대기중일 때 `KIO-CMP-001`, 세차중일 때 `KIO-CMP-002`로 분기한다. `KIO-CMP-001` 기본 프레임은 현재 없어 논리 화면으로만 기록한다.
- 오토패스·세차권 QR 사용 완료는 세차기 상태에 따라 `KIO-CMP-003` 또는 `KIO-CMP-004`로 이동한다.
- 완료 화면은 일반 30초 타임아웃 대신 PLC·각 화면별 정책을 적용한다. 대기중 기준 도어 오픈 요청은 5초 후 최초 1회, 코스 선택 복귀는 15초 후로 설명되어 있다.
- 결제완료(세차중)는 세차 완료 신호를 기다리고, 신호 수신 후 안내 문구를 바꾸며 5초 도어 오픈·15초 코스 선택 복귀를 적용한다.
- 선결제 금지 매장은 PLC 세차 완료 신호 수신까지 화면을 유지하고 신호 수신 시 코스 선택으로 이동한다. 이 조건과 일반 5초·15초 동작의 우선순위는 확인 필요이다.
- 결제완료 화면에서 영수증 발급 팝업을 열면 진행 중인 도어 오픈·복귀 카운트를 초기화·중지하고 팝업을 닫은 시점부터 다시 시작한다. 도어 오픈 요청은 재요청하지 않는다는 조건과 함께 적용 범위를 확인한다.
- 영수증 발급은 `KIO-CMP-005`에서 진행한다. 휴대폰 번호는 기본 010, 최대 11자리, 하이픈 자동 표시이며 약관 동의와 유효성 검사를 거쳐 발송한다. [취소]는 입력값을 폐기하고 팝업을 닫는다.
- 발송 성공은 `KIO-CMP-005A` Alert로 표시하고 [확인] 시 완료 화면으로 복귀한다. 발급 완료 또는 관리자 영수증 발급 OFF 설정이면 완료 화면의 발급 버튼을 숨긴다.

근거: [결제완료 설명](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15276), [결제완료(세차중) 설명](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15286), [세차권 사용 완료 설명](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15296), [세차권 사용 완료(세차중) 설명](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15306), [영수증 발급](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10405).

### 오토패스·세차권 QR

- 비회원은 `KIO-AUT-001`, 회원이나 사용 가능한 세차권이 없는 고객은 `KIO-AUT-002`로 진입한다. 회원 웰컴은 마스킹 차량번호와 마스킹 닉네임을 표시한다.
- 사용 가능한 세차권 1개·자동 사용 ON은 `KIO-AUT-003`이다. 7초 후 자동 사용하거나 [선택한 세차권 사용]으로 즉시 사용한다.
- 사용 가능한 세차권 1개·자동 사용 OFF는 `KIO-AUT-004`이다. 7초 카운트·자동 사용 안내를 숨기고 수동 사용한다.
- 사용 가능한 세차권 2개 이상은 `KIO-AUT-005`에서 선택한다. [사용 안 함]은 코스 선택으로 이동하며 사용 실패는 오류 Alert 후 코스 선택으로 이동한다.
- QR 사용 성공은 `KIO-TQR-001` Toast를 세차권 사용 완료 화면 위에 표시하고 2초 후 Toast만 닫는다.
- QR 사용 불가 화면의 QR 스캔 안내는 `KIO-TQR-002` 팝업이다. [닫기]는 현재 화면을 유지하고 [코스 선택으로 이동]은 할인·코스 정보를 초기화하고 코스 선택으로 이동한다. 리더기 비활성화 화면에서 안내를 트리거할 수 있는지는 확인 필요이다.
- 선택 코스와 QR 세차권 코스가 다르면 `KIO-TQR-003`을 표시한다. [사용 안함]은 닫기, [세차권 사용]은 기존 할인·코스를 초기화하고 인식된 세차권을 사용한다. v0.6의 [닫기]·[코스 선택 취소] 동작을 갱신한다.

근거: [자동 사용](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10445), [수동 사용](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10455), [세차권 선택](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10465), [QR 성공](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11133), [QR 사용 안내](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11276), [코스 불일치](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10565).

### 타임아웃·시스템 상태

- [공통 정책](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14513)은 일반 페이지 30초 무응답 시 타임아웃 팝업, Alert·팝업 5초 무응답 시 열려 있는 Alert·팝업 닫기를 명시한다. 타임아웃 팝업과 완료 화면은 예외이다.
- `KIO-COM-003`은 5초 카운트를 표시한다. [계속 이용]은 현재 화면을 유지하고 무조작 타이머를 초기화한다. 카운트 종료 후 목적지는 공통 정책의 코스 선택과 개별 설명의 인트로가 서로 달라 **확인 필요**이다. [처음으로]도 개별 설명상 인트로 이동으로 기록하되 목적지 통일이 필요하다.
- `KIO-COM-004`는 처리 대기 로딩, `KIO-COM-005`는 점검 중, `KIO-COM-006`는 세차 이용 불가, `KIO-COM-009`는 네트워크 오류 상태이다.
- 화면별 IA 정책표와 공통 정책이 다른 경우 IA 정책표 값을 원문대로 보존하고 정책 차이를 별도로 기록한다.

### 관리자

- 인트로 또는 코스 선택 좌상단을 5초 이내 4회 선택하면 `KIO-ADM-001` 로그인 팝업을 연다. 인증 성공 전 관리자 설정으로 진입할 수 없다.
- 서버의 지점별 비밀번호와 대조하며 기본 비밀번호는 1234이다. 5회 연속 실패 후 제한은 명시되어 있으나 제한 시간·무기한 제한 여부가 정책과 설명에서 상충하므로 확정하지 않는다.
- `KIO-ADM-002`는 지점·기기·PLC/결제·카메라·자동 사용·주유 할인·영수증 등 키오스크 설정을 관리한다. 무조작 타임아웃은 미적용이다.
- `KIO-ADM-003` 프레임은 시스템 설정 탭이다. 화면에는 로그·통신 소켓 초기화·로그 삭제·세차 종료·PLC INIT 기능이 있으며 설명 제목은 ADM-005로 남아 있다. 현재 프레임 ID에 맞춰 ADM-003으로 기록하되 ID 통일과 상세 기능 보완이 필요하다.
- 설정값을 변경한 상태에서 [메인으로]를 선택하면 `KIO-ADM-004` 저장 확인 팝업을 연다. [저장 안 함]은 저장 없이 사용자 화면으로 이동하고, [설정 저장]은 유효성 검사·저장 성공 Alert 후 사용자 화면으로 이동한다. 실패 시 관리자 화면을 유지한다.
- 설정 기본값은 차량 인식 카메라 미사용, 세차권 자동 사용 사용, 현금결제 미사용, 주유 세차 할인 미사용, 할인 금액 2,000원, 직영점 할인 조건 50,000원, 영수증 발급 사용이다. 할인 조건 0은 조건 없이 통과한다.
- 카드리더기 리셋·로그 전송의 적용 여부와 시스템 설정 상세는 개발 협의·내용 보완 대상으로 남아 있다.

근거: [관리자 로그인](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14741), [키오스크 설정](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14749), [시스템 설정 프레임](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15125), [시스템 설정 설명](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14761), [저장 확인](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15179).

## 공통 Alert·Toast 정책

- `KIO-COM-007`은 유효성 검사 실패·시스템 오류 시 현재 화면 위에 지정된 오류 문구와 오류코드를 표시한다. [확인]은 현재 화면을 유지한다. 자동 닫힘은 정책표의 30초와 공통 정책의 5초가 상충한다.
- `KIO-COM-008`은 지정 문구를 현재 화면 위에 표시하며 2초 후 Toast만 종료한다. 해당 설명은 오류 상황을, 할인 사용 설명은 성공 Toast를 명시하므로 적용 메시지 범위는 확인 필요이다.
- `KIO-TQR-001`은 QR 사용 성공, `KIO-CMP-005A`는 영수증 발송 성공 전용 상태로 유지한다.
- Figma에 배치된 전용 화면·상태는 이 IA에 등록한다. v0.6의 별도 오류 화면 제거 원칙을 이유로 DSC-002·COM-009 등의 현행 프레임을 삭제하지 않는다.

근거: [공통 Alert](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10545), [공통 Toast](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10555), [QR 성공 Toast](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-11133), [영수증 성공 Alert](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10415).

## 변경 이력

| 변경 대상 | v0.6 또는 사용자 제공 목록 | v0.7 반영 |
| --- | --- | --- |
| 관리 형식 | Markdown IA·정책 | Markdown 유지; v0.6 보관, v0.7 신규 파일 |
| 기본 IA 수 | v0.6 39행 | Figma 기본 42개 고유 ID로 갱신 |
| 기본 목록 추가 | v0.6 없음 | CRS-002 / DSC-002 / COM-009 / ADM-003 / ADM-004 추가 (5개) |
| 기본 목록 이관 | CMP-001 / ADM-005 | CMP-001은 기본 미배치 논리 화면으로 별도 기록; ADM-005는 현행 ADM-003에 대응하여 이력 관리 (2개) |
| 사용자 제공 34개와 비교 | 기본 screen과 33개 일치 | 누락 9개: DSC-002 / COM-009 / TQR-001~003 / ADM-001~004 반영; CMP-001은 기본 목록 밖에 기록 |
| 결제 용어 | 지류쿠폰 결제·사용 | Figma 기준 할인 쿠폰 결제·사용으로 갱신 |
| 공통 화면명 | 첫 화면 이동 안내 / 공통 Toast 메시지 | 타임아웃 / 공통 Toast로 갱신 |
| 할인권 사용 | 등록 팝업 중심으로 기술 | DSC-001 등록과 DSC-002 인식·사용 단계 구분 |
| 코스 불일치 | 닫기 / 코스 선택 취소 | 사용 안함 / 세차권 사용 동작으로 갱신 |
| 변형 관리 | 기본 IA 중심 | W 40개·v1 3개·v2 1개 및 원본 링크 추가 |
| 정책 관리 | 별도 화면별 정책표 없음 | 바코드·QR·타임아웃 표 추가 및 상충 정책 표시 |
| 인트라넷 | 키오스크 IA 범위 밖 | 현재 동일 페이지 INT-* 12프레임을 별도 참고 목록에 기록 |

## 확인 필요 항목

| NO | 대상 | 확인된 차이 | 확인할 내용 |
| --- | --- | --- | --- |
| 1 | CMP-001 / CMP-002 | [CMP-002 첫 프레임](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15192)은 입장 안내, [CMP-002 둘째 프레임](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-15324)은 앞차 대기 안내. CMP-001은 W·설명·정책만 존재 | 첫 프레임이 CMP-001인지, CMP-002 내 상태 변형인지 확인; 원본 ID·프레임명은 변경하지 않음 |
| 2 | 타임아웃 목적지 | [공통 정책](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14513): 5초 후 코스 선택 / [개별 설명](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=602-10495): 5초 후 인트로 | 카운트 종료·처음으로 버튼 목적지 통일 |
| 3 | 공통 Alert 시간 | IA 정책표 COM-007 30초 / 공통 정책 Alert 5초 | Alert 자동 닫기와 타임아웃 팝업의 우선순위·예외 확정 |
| 4 | 외부 결제 팝업 시간 | IA 정책표 PAY-102 30초 / 일반 팝업 공통 정책 5초 | 승인 중 외부 모듈과 타임아웃 제어·취소 지원 범위 확인 |
| 5 | 관리자 로그인 제한 | [정책](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14513): 1분→5분→10분→60분→무기한 / [설명](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=620-14741): 1차 5분·계속 5분·무기한 없음 메모와 단계 증가 문구 공존 | 연속 실패·차단 해제 조건 및 제한 시간 최종 확정 |
| 6 | 관리자 시스템 설정 ID | 프레임 ADM-003 / 설명 프레임명 ADM-003 / 본문 제목 ADM-005 | ADM-003으로 기록; 최종 ID와 기능 상세 통일 |
| 7 | 가로형 화면 높이 | COM-002-W 프레임 존재 / COM-002 설명 가로형 제외 | 가로형 사용 여부 또는 참고 프레임 여부 확인 |
| 8 | 현금결제 | PAY-501 기본 이름 프레임 존재 / 설명 가로형 전용·작성 보류 | 세로형 미노출 조건 유지; 가로형 화면·정책 완성 여부 확인 |
| 9 | QR 안내 트리거 | QR 인식 불가 화면에서 TQR-002 호출 / 일부 화면 리더기 비활성화 | 비활성화 시 QR 입력 감지 가능 여부 및 대상 화면 확정 |
| 10 | 공통 Toast | COM-008 설명은 오류 / 할인 사용 설명은 성공 Toast | 성공·오류 메시지 범위 및 호출 조건 확정 |
| 11 | 완료 화면 PLC | 5초 도어 오픈·15초 복귀 / 선결제 금지는 완료 신호까지 대기 / 영수증 팝업은 카운트 재시작 | 조건 우선순위, 도어 요청 1회 보장, CMP-004 대기중 전환 시 타이머 기산점 확인 |
| 12 | 설명 프레임명 | 602:10235 이름 CRS-001·본문 CRS-002 / 602:10535 이름 COM-006·본문 COM-009 | IA는 본문의 실제 화면명을 반영; Figma 설명 프레임명 통일 |
| 13 | 설명의 이전 ID·복사 문구 | PMT-001, PAY-002·202·203, CIW-CRS-001, KIO-CIW-001, TQR-001A 및 결제수단별 잘못된 참조 | 이름이 일치하는 현행 PAY-001·102·302·303, CRS-001, TQR-001로 문서 참조 정리. 할인 쿠폰은 PAY-401·402·403, 영수증 팝업은 CMP-005; Figma 본문 교정 필요 |
| 14 | 관리자 입력·인식 정책 | Figma 사용자 IA 정책표에 ADM 항목 없음 | ADM 로그인·저장 팝업 타임아웃 및 바코드·QR 정책 명시 필요 |

## 제외·통합 항목

- 기본 IA에는 Figma 기본 screen 고유 ID 42개만 등록한다. 중복 CMP-002는 한 행으로 관리하고 각 원본은 확인 필요 목록에 연결한다.
- CMP-001은 기본 미배치 논리 화면·W 변형으로 보존한다. 현재 기본 목록에서 빠졌다는 이유로 결제완료 흐름을 삭제하지 않는다.
- ADM-005는 현재 기본 프레임이 없어 기본 IA에서 제외하고 ADM-003 설명의 이전 ID로 기록한다.
- v0.6의 DSC-001A·DSC-001T, PMT-002~004, PAY-005A·009A, CMP-005B, AUT-003A, COM-007A는 현재 페이지의 screen 프레임에 없으므로 독립 IA에 추가하지 않는다.
- CMP-005A는 현재 영수증 발급 성공 프레임이므로 유지한다. 과거 동일 ID의 오류 상태와 혼동하지 않는다.
- 프로토타입·전체 화면 모아보기와 문서용 프레임은 IA 화면으로 세지 않는다.

## 동일 페이지 인트라넷 참고 화면

키오스크 화면 ID `KIO-*`와 다른 서비스의 `INT-*` 화면이다. 현재 **12프레임·7개 고유 ID**가 있으며 별도 표로 보존한다. 운영 정책·기능명세는 키오스크 정책을 자동 적용하지 않는다.

| 화면 ID | 화면명 | 프레임 수 | 원본 프레임 |
| --- | --- | --- | --- |
| INT-009-401 | 광고 관리 | 2 | [643:11382](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=643-11382) / [644:12133](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=644-12133) |
| INT-009-402 | 광고 등록 | 2 | [643:11265](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=643-11265) / [644:12016](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=644-12016) |
| INT-009-402-v1 | 광고 등록 변형 | 2 | [643:11528](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=643-11528) / [644:12279](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=644-12279) |
| INT-009-403 | 광고 상세/수정 | 2 | [643:11184](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=643-11184) / [644:11935](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=644-11935) |
| INT-009-501 | 키오스크 관리 | 1 | [643:11550](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=643-11550) |
| INT-009-502 | 키오스크 상세/수정 | 1 | [643:11354](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=643-11354) |
| INT-025-008 | 지점 선택 팝업 | 2 | [643:11112](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=643-11112) / [644:11863](https://www.figma.com/design/rpAk7c9wxxP5rAcrgPLy3l?node-id=644-11863) |

광고 등록·수정 등 동일 ID가 두 벌 배치되어 있으며 일부 설명의 광고 지면 설정도 다르다. 최종 채택안은 이 IA에서 임의로 선택하지 않는다.

