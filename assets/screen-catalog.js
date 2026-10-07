// 세로형 기본 IA 42개 + 완료 플로우용 CMP-001 1개. W/v1/v2는 포함하지 않는다.
window.CIW_SCREEN_CATALOG = {
  "intro": {
    "label": "KIO-INT-001 인트로",
    "req": "IA·Figma v0.7",
    "note": "미적용",
    "type": "페이지"
  },
  "course": {
    "label": "KIO-CRS-001 코스 선택",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "courseInfo": {
    "label": "KIO-CRS-002 세차코스 설명",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "discountScan": {
    "label": "KIO-DSC-001 세차 할인권 등록",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "discountUse": {
    "label": "KIO-DSC-002 세차 할인권 사용",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "payment": {
    "label": "KIO-PAY-001 결제수단선택",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "cardPay": {
    "label": "KIO-PAY-101 카드결제",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "cardPayExternal": {
    "label": "KIO-PAY-102 카드결제 (외부 팝업)",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "외부 팝업"
  },
  "appPay": {
    "label": "KIO-PAY-201 컴인워시 앱 결제",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "mobileVoucher": {
    "label": "KIO-PAY-301 모바일 상품권 결제",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "voucherUse": {
    "label": "KIO-PAY-302 모바일 상품권 사용",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "voucherAdditional": {
    "label": "KIO-PAY-303 모바일 상품권 사용 (추가결제)",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "paperCoupon": {
    "label": "KIO-PAY-401 할인 쿠폰 결제",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "paperUse": {
    "label": "KIO-PAY-402 할인 쿠폰 사용",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "paperAdditional": {
    "label": "KIO-PAY-403 할인 쿠폰 사용 (추가 결제)",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "cashPay": {
    "label": "KIO-PAY-501 현금결제",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "paymentComplete": {
    "label": "KIO-CMP-001 결제완료",
    "req": "IA·Figma v0.7",
    "note": "Figma의 대기 상태 CMP-002 중복 프레임을 완료 플로우로 연결. ID 확인 필요.",
    "type": "페이지"
  },
  "paymentCompleteWaiting": {
    "label": "KIO-CMP-002 결제완료 (세차중)",
    "req": "IA·Figma v0.7",
    "note": "미적용 (별도 정책 사용)",
    "type": "페이지"
  },
  "commonComplete": {
    "label": "KIO-CMP-003 세차권 사용 완료",
    "req": "IA·Figma v0.7",
    "note": "미적용 (별도 정책 사용)",
    "type": "페이지"
  },
  "commonCompleteWaiting": {
    "label": "KIO-CMP-004 세차권 사용 완료 (세차중)",
    "req": "IA·Figma v0.7",
    "note": "미적용 (별도 정책 사용)",
    "type": "페이지"
  },
  "receipt": {
    "label": "KIO-CMP-005 영수증 발급",
    "req": "IA·Figma v0.7",
    "note": "미적용 (별도 정책 사용)",
    "type": "팝업"
  },
  "receiptSent": {
    "label": "KIO-CMP-005A 영수증 발급 (성공)",
    "req": "IA·Figma v0.7",
    "note": "미적용 (별도 정책 사용)",
    "type": "Alert"
  },
  "autoWelcomeNonmember": {
    "label": "KIO-AUT-001 (비회원) 웰컴메시지",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "autoWelcomeMember": {
    "label": "KIO-AUT-002 (회원) 웰컴 메시지",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "autoSingle": {
    "label": "KIO-AUT-003 세차권 자동 선택",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "autoManual": {
    "label": "KIO-AUT-004 세차권 자동 선택(수동 사용)",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "autoMultiple": {
    "label": "KIO-AUT-005 세차권 수동 선택",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "help": {
    "label": "KIO-COM-001 컴인워시 이용 안내",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "heightSettings": {
    "label": "KIO-COM-002 화면 높이 설정",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "timeout": {
    "label": "KIO-COM-003 타임아웃",
    "req": "IA·Figma v0.7",
    "note": "미적용",
    "type": "팝업"
  },
  "loading": {
    "label": "KIO-COM-004 로딩",
    "req": "IA·Figma v0.7",
    "note": "미적용",
    "type": "페이지"
  },
  "maintenance": {
    "label": "KIO-COM-005 점검 중",
    "req": "IA·Figma v0.7",
    "note": "미적용",
    "type": "페이지"
  },
  "unavailable": {
    "label": "KIO-COM-006 세차 이용 불가",
    "req": "IA·Figma v0.7",
    "note": "미적용",
    "type": "페이지"
  },
  "error": {
    "label": "KIO-COM-007 공통 alert",
    "req": "IA·Figma v0.7",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "Alert"
  },
  "commonToast": {
    "label": "KIO-COM-008 공통 Toast",
    "req": "IA·Figma v0.7",
    "note": "미적용",
    "type": "Toast"
  },
  "networkError": {
    "label": "KIO-COM-009 네트워크 오류",
    "req": "IA·Figma v0.7",
    "note": "미적용",
    "type": "페이지"
  },
  "ticketDone": {
    "label": "KIO-TQR-001 세차권 인식 (성공)",
    "req": "IA·Figma v0.7",
    "note": "미적용",
    "type": "Toast"
  },
  "qrGuide": {
    "label": "KIO-TQR-002 세차권 QR 사용 안내",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "qrMismatch": {
    "label": "KIO-TQR-003 세차권 코스 불일치",
    "req": "IA·Figma v0.7",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "adminLogin": {
    "label": "KIO-ADM-001 관리자 로그인",
    "req": "IA·Figma v0.7",
    "note": "확인 필요",
    "type": "팝업"
  },
  "adminHome": {
    "label": "KIO-ADM-002 키오스크 설정",
    "req": "IA·Figma v0.7",
    "note": "미적용 (화면 설명 명시)",
    "type": "페이지"
  },
  "adminSystem": {
    "label": "KIO-ADM-003 시스템 설정",
    "req": "IA·Figma v0.7",
    "note": "미적용 (관리자 설정 공통 적용; 개별 설명 미명시)",
    "type": "페이지"
  },
  "adminSaveConfirm": {
    "label": "KIO-ADM-004 변경사항 저장 확인",
    "req": "IA·Figma v0.7",
    "note": "확인 필요",
    "type": "팝업"
  }
};
