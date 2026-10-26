window.CIW_SCREEN_CATALOG={
  "intro": {
    "label": "KIO-INT-001 인트로",
    "req": "최종 디자인 업데이트 · 589:12484",
    "note": "차종별 높이 선택·QR 인식·관리자 진입 유지",
    "type": "페이지"
  },
  "course": {
    "label": "KIO-CRS-001 코스 선택",
    "req": "최종 디자인 업데이트 · 589:14114",
    "note": "v1(589:12572) 2개 / v2(589:12590) 1개 코스 상태 시안 포함",
    "type": "페이지"
  },
  "courseInfo": {
    "label": "KIO-CRS-002 세차코스 설명",
    "req": "최종 디자인 업데이트 · 589:22138",
    "note": "v1(589:22249)·v2(589:22335) 코스 구성·강조 시안 포함",
    "type": "팝업"
  },
  "discountScan": {
    "label": "KIO-DSC-001 세차 할인권 등록",
    "req": "최종 디자인 업데이트 · 589:12671",
    "note": "코스 선택 위 팝업 · 왼쪽 사용 / 오른쪽 사용 안함",
    "type": "팝업"
  },
  "discountUse": {
    "label": "KIO-DSC-002 세차 할인권 사용",
    "req": "최종 디자인 업데이트 · 589:12342",
    "note": "바코드 인식 후 할인 적용",
    "type": "페이지"
  },
  "payment": {
    "label": "KIO-PAY-001 할인 및 보조 결제수단 선택",
    "req": "최종 디자인 업데이트 · 589:22010",
    "note": "v1(589:21988) 적용·선택 불가 상태 / 실제 적용 여부·계산값 반영",
    "type": "페이지"
  },
  "paymentMethods": {
    "label": "KIO-PAY-002 결제수단 선택",
    "req": "최종 디자인 업데이트 · 589:22032",
    "note": "이전으로: 할인 및 보조 결제수단 선택으로 복귀",
    "type": "페이지"
  },
  "cardPay": {
    "label": "KIO-PAY-101 카드결제",
    "req": "최종 디자인 업데이트 · 589:12406",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "페이지"
  },
  "cardPayExternal": {
    "label": "KIO-PAY-102 카드결제 (외부 팝업)",
    "req": "Figma test · 기존 외부 제공 시안",
    "note": "새 카드 안내 화면 위에 외부 제공 창 유지",
    "type": "외부 팝업"
  },
  "appPay": {
    "label": "KIO-PAY-201 컴인워시 앱 결제",
    "req": "최종 디자인 업데이트 · 589:12358",
    "note": "앱 바코드 인식 후 결제 완료",
    "type": "페이지"
  },
  "mobileVoucher": {
    "label": "KIO-PAY-301 모바일 상품권 결제",
    "req": "최종 디자인 업데이트 · 589:12374",
    "note": "상품권 인식 후 사용 확인",
    "type": "페이지"
  },
  "voucherUse": {
    "label": "KIO-PAY-302 모바일 상품권 사용",
    "req": "Figma test · 543:8681",
    "note": "추가 결제 없으면 바로 결제 완료",
    "type": "팝업"
  },
  "voucherAdditional": {
    "label": "KIO-PAY-303 모바일 상품권 사용 (추가결제)",
    "req": "최종 디자인 업데이트 · 589:12689",
    "note": "잔액이 남으면 PAY-001, 없으면 바로 완료",
    "type": "팝업"
  },
  "paperCoupon": {
    "label": "KIO-PAY-401 할인 쿠폰 결제",
    "req": "최종 디자인 업데이트 · 589:12390",
    "note": "쿠폰 인식 후 사용 확인",
    "type": "페이지"
  },
  "paperUse": {
    "label": "KIO-PAY-402 할인 쿠폰 사용",
    "req": "Figma test · 543:8693",
    "note": "추가 결제 없으면 바로 완료 · Figma PAY-302 중복 대지 대응",
    "type": "팝업"
  },
  "paperAdditional": {
    "label": "KIO-PAY-403 할인 쿠폰 사용 (추가 결제)",
    "req": "최종 디자인 업데이트 · 589:12692",
    "note": "잔액이 남으면 PAY-001, 없으면 바로 완료",
    "type": "팝업"
  },
  "cashPay": {
    "label": "KIO-PAY-501 현금결제",
    "req": "Figma test · 기능 미제공",
    "note": "현금 결제는 제공하지 않음",
    "type": "페이지"
  },
  "paymentComplete": {
    "label": "KIO-CMP-001 결제완료",
    "req": "최종 디자인 업데이트 · 589:12422",
    "note": "영수증 발급 후 버튼 숨김 유지",
    "type": "페이지"
  },
  "paymentCompleteWaiting": {
    "label": "KIO-CMP-002 결제완료 (세차중)",
    "req": "Figma test · 543:8431",
    "note": "앞차 세차 중 대기 안내",
    "type": "페이지"
  },
  "commonComplete": {
    "label": "KIO-CMP-003 세차권 사용 완료",
    "req": "최종 디자인 업데이트 · 589:12469",
    "note": "세차권 사용 완료 및 진입 안내",
    "type": "페이지"
  },
  "commonCompleteWaiting": {
    "label": "KIO-CMP-004 세차권 사용 완료 (세차중)",
    "req": "Figma test · 543:8446",
    "note": "세차권 사용 완료 · 앞차 세차 중 대기",
    "type": "페이지"
  },
  "receipt": {
    "label": "KIO-CMP-005 영수증 발급",
    "req": "Figma test · 543:8690",
    "note": "번호 검증 후 발급 · 성공 시 발급 버튼 숨김",
    "type": "팝업"
  },
  "receiptSent": {
    "label": "KIO-CMP-005A 영수증 발급 (성공)",
    "req": "최종 디자인 업데이트 · 589:12677",
    "note": "발송 완료 확인 후 완료 화면 복귀",
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
    "req": "최종 디자인 업데이트 · 589:13429",
    "note": "5초 카운트다운 · 처음으로 / 계속 이용",
    "type": "팝업"
  },
  "loading": {
    "label": "KIO-COM-004 로딩",
    "req": "최종 디자인 업데이트 · 589:13084",
    "note": "미적용",
    "type": "페이지"
  },
  "maintenance": {
    "label": "KIO-COM-005 점검 중",
    "req": "최종 디자인 업데이트 · 589:13088",
    "note": "동일 ID가 하나로 정리되어 최신 디자인 적용",
    "type": "페이지"
  },
  "unavailable": {
    "label": "KIO-COM-006 세차 이용 불가",
    "req": "최종 디자인 업데이트 · 589:13090",
    "note": "별도 ID 확인 후 최신 디자인 적용",
    "type": "페이지"
  },
  "error": {
    "label": "KIO-COM-007 공통 alert",
    "req": "최종 디자인 업데이트 · 589:12680",
    "note": "30초 무응답 시 <타임아웃> 팝업 노출",
    "type": "Alert"
  },
  "commonToast": {
    "label": "KIO-COM-008 공통 Toast",
    "req": "최종 디자인 업데이트 · 589:13481",
    "note": "처리 완료 Toast",
    "type": "Toast"
  },
  "networkError": {
    "label": "KIO-COM-009 네트워크 오류",
    "req": "최종 디자인 업데이트 · 589:13092",
    "note": "네트워크 연결 오류",
    "type": "페이지"
  },
  "ticketDone": {
    "label": "KIO-TQR-001 세차권 인식 (성공)",
    "req": "최종 디자인 업데이트 · 589:13484",
    "note": "미적용",
    "type": "Toast"
  },
  "qrGuide": {
    "label": "KIO-TQR-002 세차권 QR 사용 안내",
    "req": "최종 디자인 업데이트 · 589:13499",
    "note": "5초 무응답 시 팝업 닫기",
    "type": "팝업"
  },
  "qrMismatch": {
    "label": "KIO-TQR-003 세차권 코스 불일치",
    "req": "최종 디자인 업데이트 · 589:13502",
    "note": "코스 불일치 안내 · 사용 안함 / 세차권 사용",
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
    "req": "Figma kio-bo · 594:17521 / kio-bo v2 · 606:8452",
    "note": "왼쪽 관리자 레이아웃 선택으로 기존·v2 비교 / 두 버전의 입력값은 별도 유지 / 실제 장비 미연동",
    "type": "페이지"
  },
  "adminSystem": {
    "label": "KIO-ADM-003 세차기 관리",
    "req": "Figma kio-bo2 · 594:17578",
    "note": "코스 선택·장비 제어 버튼 시안, 실제 장비 미연동",
    "type": "페이지"
  },
  "adminSaveConfirm": {
    "label": "KIO-ADM-004 변경사항 저장 확인",
    "req": "IA·Figma v0.7",
    "note": "확인 필요",
    "type": "팝업"
  }
};
