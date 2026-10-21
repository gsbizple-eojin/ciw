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

function designDiscountScan(overlay = '') {
  const asset = name => designAsset(`v03-scan-${name}`);
  return `<div class="ciw-design design-discount-scan" data-design-node="817:9498">${designBackground('scan')}${designDisplay('scan')}${designHeader(true,'scan')}<main class="design-scan-body"><header><p>주유 세차 할인권</p><h2>주유 세차 할인권 바코드를<br>바코드 인식기에 스캔하세요</h2></header><button class="design-scan-illustration" data-action="discount-validate" aria-label="세차 할인권 바코드 인식"><span class="design-qr-art" aria-hidden="true"><span class="design-reader"><span class="design-reader-face"></span><span class="design-reader-lens"><i></i></span><img class="design-reader-highlight top" src="${asset('imgRectangle1430106603')}" alt="" /><img class="design-reader-highlight bottom" src="${asset('imgRectangle1430106604')}" alt="" /></span><span class="design-scan-phone" data-node-id="817:9527"><img src="${asset('imgIPhone16Pro')}" alt="" /></span><span class="design-scan-beam" data-node-id="817:9528"><img src="${asset('imgRectangle1430106605')}" alt="" /></span><span class="design-scan-success" data-node-id="817:9529"><img src="${asset('imgFillIcon')}" alt="" /><img class="design-scan-check" data-node-id="817:9531" src="${asset('imgCheckStroke')}" alt="" /></span></span></button><div class="design-scan-warnings">${['바코드 인식기에서 10cm 정도 떨어져서 스캔하세요','인식이 잘 안될 경우 햇빛을 가리고 스캔하세요','30초 이내로 스캔 하지 않으면 자동 취소됩니다.'].map(text=>`<p><img src="${asset('imgLabelBaseKiosk')}" alt="" />${text}</p>`).join('')}</div></main>${designPaymentFooter('scan')}${overlay}</div>`;
}


function cardPayScreen(overlay = "") {
  const warnings = ['결제가 끝날 때까지 카드를 빼지 마세요.','30초 이내로 결제하지 않으면 자동 취소됩니다.'];
  return `<div class="ciw-design design-card-payment" data-design-node="920:4089">${designBackground('card')}${designDisplay('card')}${designHeader(true,'card')}<main class="design-card-body"><header><p>카드결제</p><h2>카드를 그림과 같이<br>IC카드 리더기에 꽂아주세요</h2></header><div class="design-card-reader" data-node-id="920:4106"></div><div class="design-scan-warnings">${warnings.map(text => `<p><img src="${designAsset('v03-card-imgLabelBaseKiosk')}" alt="" />${text}</p>`).join('')}</div></main>${designPaymentFooter('card')}${overlay}</div>`;
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
  if (!['payment','discountScan','discountApplied','paymentMobileApplied','paymentPaperApplied','paymentDiscountMobileApplied'].includes(state.screen)) return v06Payment(overlay,appliedMethod,includeDiscount);
  const kind = state.screen === 'discountScan' ? 'popup' : 'payment';
  const adjustments = paymentAdjustments();
  if (includeDiscount && !state.discountApplied) adjustments.unshift(['할인 금액', configuredDiscountAmount()]);
  const appliedLabel = {mobile:'모바일 상품권',paper:'할인 쿠폰'}[appliedMethod];
  if (appliedLabel && !adjustments.some(([label]) => label === appliedLabel)) adjustments.push([appliedLabel, Math.min(4000, state.selectedCourse.price)]);
  const total = Math.max(0, state.selectedCourse.price - adjustments.reduce((sum,[,amount]) => sum + amount,0));
  const method = ([key,label]) => {
    const used = key === appliedMethod || key === 'mobile' && state.mobileVoucherUsed || key === 'paper' && (state.paperCouponUsed || state.discountApplied) || key === 'discount' && (state.discountApplied || state.paperCouponUsed);
    if (key === 'discount' && !state.savedAdminSettings.discountEnabled) return '';
    const icon = key === 'card' ? `<span class="design-pay-icon card"><img src="${designAsset(`v03-${kind}-imgLineIcon`)}" alt="" /></span>` : key === 'app' ? `<svg class="design-pay-icon" width="64" height="64" aria-hidden="true"><defs><mask id="design-app-icon-mask" maskUnits="userSpaceOnUse" x="1.5" y="4.167" width="61.167" height="47.667" style="mask-type:alpha"><image href="${designAsset(`v03-${kind}-imgGroup48096042`)}" x="1.5" y="4.167" width="61.1667" height="47.6667" /></mask></defs><image href="${designAsset(`v03-${kind}-imgGroup48096043`)}" x="10.33" y="9.33" width="43.5" height="66.34" mask="url(#design-app-icon-mask)" /></svg>` : '';
    return `<button class="design-pay-method ${key}" data-action="pay-method" data-method="${key}" ${used?'disabled':''}>${icon}<strong>${label}</strong></button>`;
  };
  const index = courses.indexOf(state.selectedCourse);
  return `<div class="ciw-design design-payment" data-design-node="${kind === 'popup' ? '817:8612' : '837:10147'}">${designBackground(kind)}${designDisplay(kind)}${designHeader(true,kind)}<main class="design-payment-body"><h2>결제 수단을 선택해 주세요</h2><div class="design-payment-columns"><section class="design-payment-summary"><div><h3>${state.selectedCourse.name} 코스</h3><p>${courseProcesses[index].replaceAll(' › ',' > ')}</p></div><div class="design-amounts"><p>코스 금액<b>${state.selectedCourse.price.toLocaleString('ko-KR')}</b></p>${adjustments.map(([label,amount])=>`<p>${label}<b>-${amount.toLocaleString('ko-KR')}</b></p>`).join('')}<img class="design-amount-divider" src="${designAsset(`v03-${kind}-imgLine4`)}" alt="" /><p class="total">총 결제 금액<strong>${total.toLocaleString('ko-KR')}<span>원</span></strong></p></div></section><div class="design-payment-methods"><section><h3>할인 및 보조 결제수단 선택</h3><div class="design-discount-methods">${[['mobile','모바일<br>상품권'],['paper','할인<br>쿠폰'],['discount','주유 세차<br>할인권']].map(method).join('')}</div></section><section><h3>결제수단 선택</h3><div class="design-primary-methods">${[['app','컴인워시 앱결제'],['card','카드 결제']].map(method).join('')}</div></section></div></div></main>${designPaymentFooter(kind)}${overlay}</div>`;
};
scanScreen = function(kind, action, caption, overlay = '') {
  if (!['appPay','mobileVoucher','paperCoupon','discountUse'].includes(state.screen)) return v06Scan(kind,action,caption,overlay);
  if (kind === 'discount') return designDiscountScan(overlay);
  const label={app:'컴인워시 앱결제',mobile:'모바일 상품권 결제',paper:'할인 쿠폰 결제',discount:'주유 세차 할인권'}[kind];
  const lead={app:'앱 화면의 바코드를',mobile:'모바일 상품권 바코드를',paper:'할인 쿠폰 바코드를',discount:'주유 세차 할인권 바코드를'}[kind];
  const warnings = kind==='app' ? ['스마트폰의 화면 밝기를 최대로 해 주세요','인식이 잘 안될 경우 햇빛을 가리고 스캔하세요','결제가 완료될 때까지 QR을 대주세요','30초 이내로 스캔 하지 않으면 자동 취소됩니다.'] : ['바코드 인식기에서 10cm 정도 떨어져서 스캔하세요','인식이 잘 안될 경우 햇빛을 가리고 스캔하세요','30초 이내로 스캔 하지 않으면 자동 취소됩니다.'];
  return standardScreen({title:'',reachable:false,classes:'mobile-voucher-screen v07-scan',status:kioskInfoBar(),content:`<div class="scan-wrap mobile-voucher-scan"><span class="selected-payment-method">${label}</span><strong class="mobile-voucher-title">${lead}<span>바코드 인식기에 스캔하세요</span></strong><div class="scan-device"><span class="mobile-voucher-device-label">${kind==='discount'?'IC카드 리더기':'바코드 인식기'}<br>IMG</span></div><div class="v07-scan-warnings">${warnings.map(x=>`<p>${x}</p>`).join('')}</div><button class="scan-simulator" data-action="${action}" aria-label="${caption}"></button></div>`,overlay});
};
renderers.discountUse = () => scanScreen('discount','discount-validate','세차 할인권 바코드 인식',state.discountValidationMessage ? alertPopup({type:'error',title:state.discountValidationMessage,action:'discount-retry',showCode:false}):'');

renderers.payment = () => paymentScreen();

renderers.cashPay = () => `<div class="v07-no-screen">화면 없음(기능 미제공)</div>`;

}
