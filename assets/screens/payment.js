function scanScreen(kind, action, caption, overlay = "") {
  const titles = {
    discount: ["주유 세차 할인권 바코드를 바코드 인식기에 대주세요.", ""],
    app: ["앱 화면의 바코드를 바코드 인식기에 대주세요.", ""],
    mobile: ["모바일 상품권 바코드를 바코드 인식기에 대주세요.", ""],
    paper: ["할인 쿠폰 바코드를 바코드 인식기에 대주세요.", ""],
  };
  const legacyGuide = {
    mobile: ["상품권의 바코드를", "바코드 인식기에 대주세요!"],
    paper: ["쿠폰의 바코드를", "바코드 인식기에 대주세요!"],
  }[kind];
  const [title, subtitle] = titles[kind];
  const voucherGuide = {
    app: ["앱 화면의 바코드를", "결제가 완료될 때까지 QR을 대주세요!"],
    mobile: ["모바일 상품권 바코드를", "할인이 적용될 때까지 바코드를 대주세요!"],
    paper: ["할인 쿠폰 바코드를", "쿠폰 인증이 완료될 때까지 바코드를 대주세요!"],
  }[kind];
  const paymentMethod = { app: "컴인워시 앱 결제", mobile: "모바일 상품권 결제", paper: "할인 쿠폰 결제" }[kind];
  const content = voucherGuide ? `
      <div class="scan-wrap mobile-voucher-scan">
        <span class="selected-payment-method${kind === "mobile" || kind === "paper" ? " voucher-payment-method" : ""}">${paymentMethod}</span>
        <strong class="mobile-voucher-title">${voucherGuide[0]}<span>바코드 인식기에 대주세요.</span></strong>
        <div class="scan-device"><span class="mobile-voucher-device-label">바코드 인식기<br>IMG</span></div>
        <p class="mobile-voucher-warning">${voucherGuide[1]}</p>
        <p class="mobile-voucher-warning">30초 이내로 인식하지 않으면 자동 취소됩니다.</p>
        <button class="scan-simulator" data-action="${action}" aria-label="${caption}"></button>
      </div>` : `
      <div class="scan-wrap ${legacyGuide ? "legacy-payment-scan" : ""}">
        ${legacyGuide ? `<div class="scan-instruction"><strong>${legacyGuide[0]}<span>${legacyGuide[1]}</span></strong><p>할인이 적용될 때까지 바코드를 대주세요!</p><p>30초 이내로 인식하지 않으면 자동 취소됩니다.</p></div>` : ""}
        <div class="scan-device"><div class="scan-code"></div>${legacyGuide ? `<span class="scan-reader-label">바코드<br>인식기</span>` : ""}</div>
        <h3>인식 대기 중</h3>
        <button class="scan-simulator" data-action="${action}" aria-label="${caption}"></button>
      </div>
      ${kind === "discount" ? `<button class="large-button light skip-discount" data-action="skip-discount">할인 없이 결제</button>` : ""}`;
  return standardScreen({
    title: voucherGuide ? "" : title,
    subtitle,
    reachable: false,
    classes: voucherGuide ? "mobile-voucher-screen" : "",
    status: voucherGuide ? kioskInfoBar() : undefined,
    content,
    overlay,
  });
}


function paymentScreen(overlay = "", appliedMethod = "", includeDiscount = false) {
  const discountItems = [["mobile", "모바일 상품권"], ["paper", "할인 쿠폰"], ["discount", "주유 세차 할인권"]];
  const paymentItems = [["app", "컴인워시 앱결제"], ["card", "카드결제"]];
  const methodButton = ([type, label]) => {
    const used = type === appliedMethod || (type === "mobile" && state.mobileVoucherUsed) || (type === "paper" && state.paperCouponUsed);
    return `<button class="payment-card ${used ? "used" : ""}" data-action="pay-method" data-method="${type}" ${used ? "disabled" : ""}><span class="pay-icon">${paymentIcon(type)}</span><strong>${label}</strong></button>`;
  };
  return standardScreen({
    title: "결제 수단을 선택해 주세요.",
    classes: "payment-selection",
    status: state.screen === "paymentMobileApplied" ? kioskInfoBar() : undefined,
    content: `
      ${selectedSummary(appliedMethod, includeDiscount)}
      <section class="payment-method-section payment-discount-section"><h3><b>Step1</b>할인수단을 선택해 주세요.</h3><div class="payment-grid payment-discount-grid">${discountItems.map(methodButton).join("")}</div></section>
      <section class="payment-method-section payment-methods-section"><h3><b>Step2</b>결제수단을 선택해 주세요.</h3><div class="payment-grid payment-method-grid">${paymentItems.map(methodButton).join("")}</div></section>`,
    overlay,
  });
}


function paymentAppliedScreen(method) {
  return paymentScreen("", method);
}


function cardPayScreen(overlay = "") {
  return standardScreen({
    title: "",
    reachable: false,
    classes: "mobile-voucher-screen",
    status: kioskInfoBar(),
    content: `
      <div class="scan-wrap mobile-voucher-scan">
        <span class="selected-payment-method">카드결제</span>
        <strong class="mobile-voucher-title">카드를 그림과 같이<span>IC카드 리더기에 꽂아주세요.</span></strong>
        <div class="scan-device"><span class="mobile-voucher-device-label">IC카드 리더기<br>IMG</span></div>
        <p class="mobile-voucher-warning">결제가 끝날 때까지 카드를 빼지 마세요.</p>
        <p class="mobile-voucher-warning">30초 이내로 결제하지 않으면 자동 취소됩니다.</p>
      </div>`,
    overlay,
  });
}


function externalPaymentPopup() {
  return `<div class="external-payment-overlay"><section class="external-payment-popup legacy-card-popup" role="dialog" aria-modal="true"><img src="${CIW_ASSETS['assets/asis-card-payment-popup.png']}" alt="신용카드 결제 안내. 카드를 IC카드 리더기에 꽂고 결제가 완료될 때까지 빼지 마세요. 30초 안에 결제하지 않으면 자동 취소됩니다. 요청취소 버튼." /></section></div>`;
}


function additionalPaymentContent(kind) {
  const label = kind === "mobile" ? "상품권" : "쿠폰";
  const balance = Math.min(4000, payableAmount());
  return `
      <div class="amount-card voucher-use-summary">
        <div class="amount-row"><span>결제금액</span><strong>${formatPrice(payableAmount())}</strong></div>
        <div class="amount-row"><span>${label} 잔액</span><strong>${formatPrice(balance)}</strong></div>
        <div class="amount-row total"><span>추가 결제</span><strong>${formatPrice(Math.max(0, payableAmount() - balance))}</strong></div>
      </div>`;
}


function fullPaymentContent(kind, className = "") {
  const label = kind === "mobile" ? "상품권" : "쿠폰";
  const amount = payableAmount();
  const balance = kind === "mobile" ? 20000 : amount;
  return `
      <div class="amount-card ${className}">
        <div class="amount-row"><span>결제금액</span><strong>${formatPrice(amount)}</strong></div>
        <div class="amount-row"><span>${label} 잔액</span><strong>${formatPrice(balance)}</strong></div>
        <div class="amount-row total"><span>추가 결제</span><strong class="no-amount">없음</strong></div>
      </div>`;
}


function mobileVoucherUseScreen() {
  return scanScreen("mobile", "voucher-use", "상품권 사용", modalPopup({
    title: "모바일 상품권을 사용하시겠습니까?",
    className: "voucher-use-modal",
    content: fullPaymentContent("mobile", "voucher-use-summary"),
    actions: [{ label: "사용", action: "voucher-complete" }],
    secondary: { label: "사용 안 함", action: "close-dialog" },
  }));
}


function mobileVoucherAdditionalScreen() {
  return scanScreen("mobile", "voucher-use", "상품권 사용", modalPopup({ title: "모바일 상품권을 사용하시겠습니까?", className: "voucher-use-modal", content: additionalPaymentContent("mobile"), actions: [{ label: "추가 결제", action: "voucher-partial" }], secondary: { label: "사용안함", action: "close-dialog" } }));
}


function paperCouponUseScreen() {
  return scanScreen("paper", "paper-use", "할인 쿠폰 사용", modalPopup({ title: "할인 쿠폰을 사용하시겠습니까?", className: "voucher-use-modal", content: fullPaymentContent("paper", "voucher-use-summary"), actions: [{ label: "사용", action: "paper-complete" }], secondary: { label: "사용안함", action: "close-dialog" } }));
}


function paperCouponAdditionalScreen() {
  return scanScreen("paper", "paper-use", "할인 쿠폰 사용", modalPopup({ title: "할인 쿠폰을 사용하시겠습니까?", className: "voucher-use-modal", content: additionalPaymentContent("paper"), actions: [{ label: "추가 결제", action: "paper-partial" }], secondary: { label: "사용안함", action: "close-dialog" } }));
}


function voucherCaseScreen(kind) {
  return state.voucherAdditionalPayment ? `${kind}Additional` : `${kind}Use`;
}


// 최신 UI 등록. init.js에서 기존 초기화 이후 한 번 호출한다.
function applyPaymentScreens() {
paymentScreen = function(overlay = '', appliedMethod = '', includeDiscount = false) {
  if (!['payment','discountApplied','paymentMobileApplied','paymentPaperApplied','paymentDiscountMobileApplied'].includes(state.screen)) return v06Payment(overlay,appliedMethod,includeDiscount);
  const method = ([key,label]) => {const used = key === appliedMethod || key === 'mobile' && state.mobileVoucherUsed || key === 'paper' && state.paperCouponUsed; return `<button data-action="pay-method" data-method="${key}" ${used?'disabled':''}><span class="v07-placeholder-icon">icon</span><strong>${label}</strong></button>`;};
  return `<div class="v07-payment"><div class="v07-payment-status">${courseStatusBar()}</div><section class="v07-payment-summary"><div><h2>${state.selectedCourse.name} 코스</h2><p>하부세차 &gt; 알칼리 세제 &gt; 고압세척 &gt; 스노우폼 &gt; 초고압 세척 &gt; 중성 세제 &gt; 초고압 세척 &gt; 왁스 코팅 &gt; 강풍건조</p></div><div>${paymentAdjustments().map(([label,amount])=>`<p class="v07-discount-line">${label}<b>-${formatPrice(amount)}</b></p>`).join('')}<strong>총 결제금액 <b>${formatPrice(payableAmount())}</b></strong></div></section><section class="v07-methods v07-discounts"><h3><b>STEP 1</b>할인 수단을 선택해 주세요.</h3><div>${[['mobile','모바일 상품권'],['paper','할인 쿠폰'],['discount','주유 세차 할인권']].map(method).join('')}</div></section><section class="v07-methods v07-payments"><h3><b>STEP 2</b>결제 수단을 선택해 주세요.</h3><div>${[['app','컴인워시 앱결제'],['card','카드결제']].map(method).join('')}</div></section>${footer()}${overlay}</div>`;
};
scanScreen = function(kind, action, caption, overlay = '') {
  if (!['appPay','mobileVoucher','paperCoupon','discountUse'].includes(state.screen)) return v06Scan(kind,action,caption,overlay);
  const label={app:'컴인워시 앱결제',mobile:'모바일 상품권 결제',paper:'할인 쿠폰 결제',discount:'주유 세차 할인권'}[kind];
  const lead={app:'앱 화면의 바코드를',mobile:'모바일 상품권 바코드를',paper:'할인 쿠폰 바코드를',discount:'주유 세차 할인권 바코드를'}[kind];
  const warnings = kind==='app' ? ['스마트폰의 화면 밝기를 최대로 해 주세요','인식이 잘 안될 경우 햇빛을 가리고 스캔하세요','결제가 완료될 때까지 QR을 대주세요','30초 이내로 스캔 하지 않으면 자동 취소됩니다.'] : ['바코드 인식기에서 10cm 정도 떨어져서 스캔하세요','인식이 잘 안될 경우 햇빛을 가리고 스캔하세요','30초 이내로 스캔 하지 않으면 자동 취소됩니다.'];
  return standardScreen({title:'',reachable:false,classes:'mobile-voucher-screen v07-scan',status:kioskInfoBar(),content:`<div class="scan-wrap mobile-voucher-scan"><span class="selected-payment-method">${label}</span><strong class="mobile-voucher-title">${lead}<span>바코드 인식기에 스캔하세요</span></strong><div class="scan-device"><span class="mobile-voucher-device-label">${kind==='discount'?'IC카드 리더기':'바코드 인식기'}<br>IMG</span></div><div class="v07-scan-warnings">${warnings.map(x=>`<p>${x}</p>`).join('')}</div><button class="scan-simulator" data-action="${action}" aria-label="${caption}"></button></div>`,overlay});
};
renderers.discountUse = () => scanScreen('discount','discount-validate','세차 할인권 바코드 인식',state.discountValidationMessage ? alertPopup({type:'error',title:state.discountValidationMessage,action:'discount-retry',showCode:false}):'');

renderers.payment = () => paymentScreen();

renderers.cashPay = () => `<div class="v07-no-screen">화면 없음(기능 미제공)</div>`;

}
