const CIW_ASSETS = {
  "assets/asis-card-payment-popup.png": "assets/images/asis-card-payment-popup.png",
  "assets/auto-mascot.png": "assets/images/auto-mascot.png",
  "assets/figma-intro/sedan-body-outline.svg": "assets/images/sedan-body-outline.svg",
  "assets/figma-intro/sedan-body.svg": "assets/images/sedan-body.svg",
  "assets/figma-intro/sedan-wheel.svg": "assets/images/sedan-wheel.svg",
  "assets/figma-intro/suv-body-outline.svg": "assets/images/suv-body-outline.svg",
  "assets/figma-intro/suv-body.svg": "assets/images/suv-body.svg",
  "assets/figma-intro/suv-wheel.svg": "assets/images/suv-wheel.svg",
  "assets/figma-v07/adminSystem-img84tab21.png": "assets/images/adminSystem-img84tab21.png",
  "assets/figma-v07/help-imgAssetAppTicketQr.png": "assets/images/help-imgAssetAppTicketQr.png",
  "assets/figma-v07/help-imgAssetCaution.png": "assets/images/help-imgAssetCaution.png",
  "assets/figma-v07/help-imgAssetStep4Washing.png": "assets/images/help-imgAssetStep4Washing.png",
  "assets/figma-v07/help-imgAssetStep5Complete.png": "assets/images/help-imgAssetStep5Complete.png",
  "assets/figma-v07/help-imgIconCloseX.svg": "assets/images/help-imgIconCloseX.svg",
  "assets/figma-v07/help-imgIconInfo.svg": "assets/images/help-imgIconInfo.svg",
  "assets/figma-v07/help-imgIconStep2.svg": "assets/images/help-imgIconStep2.svg",
  "assets/figma-v07/help-imgIconStep3.svg": "assets/images/help-imgIconStep3.svg",
  "assets/figma-v07/help-imgIconTicket.svg": "assets/images/help-imgIconTicket.svg",
  "assets/figma-v07/help-imgQrVideoGuide.svg": "assets/images/help-imgQrVideoGuide.svg",
  "design-intro-imgQrL": "assets/images/design-intro-imgQrL.png",
  "design-intro-imgAppBannerBg": "assets/images/design-intro-imgAppBannerBg.png",
  "design-intro-imgShadow": "assets/images/design-intro-imgShadow.svg",
  "design-intro-imgSedan": "assets/images/design-intro-imgSedan.png",
  "design-intro-imgSuv": "assets/images/design-intro-imgSuv.png",
  "design-intro-imgRectangle39592066": "assets/images/design-intro-imgRectangle39592066.png",
  "design-intro-imgElement": "assets/images/design-intro-imgElement.svg",
  "design-intro-imgElement1": "assets/images/design-intro-imgElement1.svg",
  "design-intro-imgElement2": "assets/images/design-intro-imgElement2.svg",
  "design-intro-imgElement3": "assets/images/design-intro-imgElement3.svg",
  "design-course-imgSample01": "assets/images/design-course-imgSample01.png",
  "design-course-imgLogo": "assets/images/design-course-imgLogo.svg",
  "design-course-imgTrackStroke": "assets/images/design-course-imgTrackStroke.svg",
  "design-course-imgQrS": "assets/images/design-intro-imgQrL.png",
  "design-course-imgAppBannerBgGray": "assets/images/design-course-imgAppBannerBgGray.png",
  "design-course-imgShadow": "assets/images/design-course-imgShadow.svg",
  "design-course-imgElement": "assets/images/design-course-imgElement.svg",
  "design-course-imgElement1": "assets/images/design-course-imgElement1.svg",
  "design-course-imgElement2": "assets/images/design-course-imgElement2.svg",
  "design-course-imgElement3": "assets/images/design-course-imgElement3.svg",
  "design-course-imgIcon": "assets/images/design-course-imgIcon.svg",
  "design-course-imgIcLowScreen": "assets/images/design-course-imgIcLowScreen.svg",
  "design-course-imgIcFilledInfo24Px": "assets/images/design-course-imgIcFilledInfo24Px.svg"
};
const params = new URLSearchParams(window.location.search);
const embedMode = params.get("embed") === "1";
const figmaCaptureMode = params.get("capture") === "figma";
const timeoutPreview = params.get("timeout") === "1";
const ADMIN_PASSWORD_LENGTH = 4;
const ADMIN_MAX_FAILURES = 5;
const ADMIN_LOCK_MS = 5 * 60 * 1000;
const ADMIN_SECURITY_KEY = "ciw-admin-security-v0.5";
const AUTO_USE_SECONDS = 7;
const TOAST_CLOSE_MS = 2000;
const SCREEN_TIMEOUT_SECONDS = 30;

function readAdminSecurity() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ADMIN_SECURITY_KEY) || "{}");
    return { failures: Number(saved.failures) || 0, lockedUntil: Number(saved.lockedUntil) || 0 };
  } catch {
    return { failures: 0, lockedUntil: 0 };
  }
}

function writeAdminSecurity() {
  try {
    window.localStorage.setItem(ADMIN_SECURITY_KEY, JSON.stringify({ failures: state.adminFailureCount, lockedUntil: state.adminLockedUntil }));
  } catch {}
}

const savedAdminSecurity = readAdminSecurity();

const courses = [
  { id: "basic", name: "베이직", price: 11000, desc: "고압수 · 폼 · 건조" },
  { id: "deluxe", name: "디럭스", price: 12000, desc: "베이직 + 하부 세차", recent: true },
  { id: "premium", name: "프리미엄", price: 13000, desc: "디럭스 + 왁스 코팅" },
  { id: "ultimate", name: "울티메이트", price: 15000, desc: "프리미엄 + 집중 세척" },
];

const DISCOUNT_VALIDATION_RESULTS = {
  success: { valid: true, message: "{할인금액}원 할인이 적용되었습니다." },
  "dc-used": { message: "이미 사용된 바코드입니다.[B001:사용 바코드]" },
  "dc-expired-236": { message: "바코드 유효기간(7일)이 경과되었습니다.[B262-01: {경과일}일 유효기간 경과]" },
  "dc-expired-234": { message: "바코드 유효기간(7일)이 경과되었습니다.[B234-01: {경과일}일 유효기간 경과]" },
  "dc-expired-262": { message: "바코드 유효기간(14일)이 경과되었습니다.[B262-01: {경과일}일 유효기간 경과]" },
  "dc-expired-309": { message: "바코드 유효기간(7일)이 경과되었습니다." },
  "dc-invalid": { message: "유효하지 않은 바코드 입니다.\n주유할인 바코드는 가장 하단에 있습니다.[B004:사용불가]" },
  "hd-success-branch": { valid: true, message: "{dc_price}원 할인이 적용됩니다. -HD송파석촌점" },
  "hd-success-barcode": { valid: true, message: "{바코드에서 추출한 금액}원 할인이 적용됩니다." },
  "hd-success-2000": { valid: true, message: "2,000원 할인이 적용됩니다." },
  "hd-success-3000": { valid: true, message: "3,000원 할인이 적용됩니다." },
  "hd-success-4000": { valid: true, message: "4,000원 할인이 적용됩니다." },
  "hd-success-5000": { valid: true, message: "5,000원 할인이 적용됩니다." },
  "hd-expired": { message: "바코드 유효기간(7일)이 경과되었습니다.[B262-01: {경과일}일 유효기간 경과] -HD송파석촌점" },
  "hd-qr": { message: "사용할 수 있는 할인 쿠폰이 아닙니다. QR코드가 아닌 바코드를 스캔해주세요." },
  "hd-discontinued": { message: "\nHD현대오일뱅크의 카앤앱에서 발급받은 세차쿠폰은 \n2025년3월1일부터 이용이 불가합니다.\n문의 1588-5189\n" },
  "hd-used": { message: "이미 사용된 바코드입니다." },
  "hd-branch": { message: "사용할 수 있는 지점이 아닙니다." },
  "hd-expired-coupon": { message: "세차쿠폰의 유효기간이 만료되 이용할수 없습니다.{경과일}" },
  "hd-invalid": { message: "유효하지 않은 바코드 입니다.\n주유할인 바코드는 가장 하단에 있습니다.(0)" },
};

function discountValidationResult(key) {
  return DISCOUNT_VALIDATION_RESULTS[key] || DISCOUNT_VALIDATION_RESULTS.success;
}

console.assert(
  discountValidationResult("success").valid && !discountValidationResult("dc-used").valid && discountValidationResult("unknown").valid,
  "세차 할인권 검증 결과를 확인해 주세요.",
);

const screenMeta = window.CIW_SCREEN_CATALOG;
const NO_SCREEN_TIMEOUT = new Set([
  "intro",
  "paymentComplete",
  "paymentCompleteWaiting",
  "commonComplete",
  "commonCompleteWaiting",
  "loading",
  "maintenance",
  "unavailable",
]);

const state = {
  screen: params.get("screen") && screenMeta[params.get("screen")] ? params.get("screen") : "intro",
  height: params.get("height") === "high" ? "high" : "low",
  selectedCourse: courses[2],
  selectedPayment: "card",
  discountApplied: params.get("screen") === "discountApplied",
  discountResult: params.get("discountResult") || "success",
  discountValidationMessage: "",
  discountSuccessMessage: params.get("screen") === "discountApplied" ? discountValidationResult(params.get("discountResult")).message : "",
  mobileVoucherUsed: false,
  mobileVoucherAmount: 0,
  paperCouponUsed: false,
  paperCouponAmount: 0,
  voucherAdditionalPayment: params.get("voucherCase") === "additional" || ["voucherAdditional", "paperAdditional"].includes(params.get("screen")),
  communicationError: params.get("status") === "error",
  frontCar: params.get("screen")?.endsWith("Waiting") || false,
  phone: "010",
  consent: false,
  receiptIssued: params.get("screen") === "receiptSent",
  formError: "",
  autoSeconds: AUTO_USE_SECONDS,
  selectedAutoTicket: 0,
  history: [],
  helpReturn: "course",
  timer: null,
  qrTimer: null,
  autoTimer: null,
  adminLockTimer: null,
  paymentSeconds: 10,
  adminAuthenticated: false,
  adminTapCount: 0,
  adminTapStartedAt: 0,
  adminPassword: "",
  adminLoginError: "",
  adminLoginReturnScreen: "course",
  adminLoginTarget: "adminHome",
  adminCredential: "0000",
  adminFailureCount: savedAdminSecurity.failures,
  adminLockedUntil: savedAdminSecurity.lockedUntil,
  adminPasswordChange: { current: "", next: "", confirm: "" },
  adminReauthPassword: "",
  adminDialogError: "",
  adminResult: null,
  adminTab: "kiosk",
  adminDialog: null,
  timeoutVisible: timeoutPreview,
  timeoutSeconds: 5,
  timeoutTimer: null,
  screenTimeoutSeconds: SCREEN_TIMEOUT_SECONDS,
  screenTimeoutTimer: null,
  adminSettings: {
    branch: "강남본점",
    washer: "POSEIDON-01",
    machineName: "키오스크-01",
    machineType: "터널형",
    plcIp: "192.168.0.10",
    catId: "CAT-001",
    vanTid: "VAN-001",
    pg: "NICE",
    recentCourse: true,
    discountEnabled: true,
    discountAmount: "2,000원",
    cardReceipt: true,
    washShutdown: false,
    logSave: true,
    plcAddress: "192.168.0.10",
    lprEnabled: true,
  },
};

state.savedAdminSettings = { ...state.adminSettings };

if (!figmaCaptureMode && !embedMode && state.screen.startsWith("admin") && state.screen !== "adminLogin") {
  state.adminLoginTarget = state.screen;
  state.screen = "adminLogin";
}

const kiosk = document.getElementById("kiosk");
const stage = document.getElementById("stage");
const kioskShell = document.getElementById("kioskShell");

function brandMark() {
  return `<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>`;
}


function qrMini() {
  return `<span class="qr-mini" aria-hidden="true">${"<i></i>".repeat(9)}</span>`;
}


function vehicleIcon(type) {
  const prefix = "assets/figma-intro/";
  const sedan = type === "sedan";
  return `<span class="vehicle-icon ${sedan ? "sedan" : "suv"}" aria-hidden="true">
    <img src="${CIW_ASSETS[prefix + (sedan ? "sedan-body-outline.svg" : "suv-body-outline.svg")]}" alt="" />
    <img src="${CIW_ASSETS[prefix + (sedan ? "sedan-body.svg" : "suv-body.svg")]}" alt="" />
    <img class="wheel left" src="${CIW_ASSETS[prefix + (sedan ? "sedan-wheel.svg" : "suv-wheel.svg")]}" alt="" />
    <img class="wheel right" src="${CIW_ASSETS[prefix + (sedan ? "sedan-wheel.svg" : "suv-wheel.svg")]}" alt="" />
    <b>${sedan ? "세단" : "SUV"}</b>
  </span>`;
}


function adZone() {
  return `
    <header class="ad-zone" aria-label="상단 광고 영역">
      <span class="ad-placeholder">광고 영역 · 1080 × 360</span>
    </header>`;
}


function statusStrip() {
  if (!state.frontCar) return "";
  const now = new Date();
  const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  return `<div class="status-strip"><strong>컴인워시 키오스크</strong><span><i class="dot"></i>앞차 세차 중 <b>${time}</b></span></div>`;
}


function kioskInfoBar(forceBusy = null) {
  return courseStatusBar(forceBusy);
}


function footer(type = "course") {
  if (type === "none") return "";
  if (type === "course") return `
    <footer class="kiosk-footer course-footer">
      <button class="footer-btn" data-action="height-select">화면 높이</button>
      <button class="footer-btn" data-action="help">이용 방법</button>
    </footer>`;
  if (type === "help") return `
    <footer class="kiosk-footer single-footer">
      <button class="footer-btn" data-action="back">← 코스 선택으로</button>
    </footer>`;
  return `
    <footer class="kiosk-footer flow-footer">
      <button class="footer-btn" data-action="back">← 뒤로가기</button>
      <button class="footer-btn" data-action="course-home">코스 재선택</button>
    </footer>`;
}


function standardScreen({ title, subtitle = "", content = "", reachable = true, classes = "", overlay = "", footerType = "flow", status = courseStatusBar() }) {
  const shellClass = classes.includes("course-reference") ? "" : " course-shell";
  return `
    <div class="screen ${classes}${shellClass}">
      ${adZone()}
      <section class="main-zone">
        ${status}
        <header class="screen-head ${reachable ? "reachable-head" : ""}">
          <div>
            <h2>${title}</h2>
            ${subtitle ? `<p>${subtitle}</p>` : ""}
          </div>
        </header>
        <div class="content-panel ${reachable ? "reachable" : ""}">${content}</div>
        ${footer(footerType)}
      </section>
      ${overlay}
    </div>`;
}


function formatPrice(value) {
  return `${value.toLocaleString("ko-KR")}원`;
}


function configuredDiscountAmount() {
  const amount = Number(String(state.savedAdminSettings.discountAmount).replace(/[^0-9]/g, ""));
  return amount > 0 ? amount : 2000;
}


function paymentAdjustments() {
  return [
    ["할인 금액", state.discountApplied ? configuredDiscountAmount() : 0],
    ["모바일 상품권", state.mobileVoucherAmount],
    ["할인 쿠폰", state.paperCouponAmount],
  ].filter(([, amount]) => amount > 0);
}


function payableAmount() {
  return Math.max(0, state.selectedCourse.price - paymentAdjustments().reduce((sum, [, amount]) => sum + amount, 0));
}


function resetPaymentAdjustments() {
  state.receiptIssued = false;
  state.discountApplied = false;
  state.discountValidationMessage = "";
  state.discountSuccessMessage = "";
  state.mobileVoucherUsed = false;
  state.mobileVoucherAmount = 0;
  state.paperCouponUsed = false;
  state.paperCouponAmount = 0;
}


function selectedSummary(appliedMethod = "", includeDiscount = false) {
  const adjustments = paymentAdjustments();
  if (includeDiscount && !adjustments.some(([label]) => label === "할인 금액")) adjustments.unshift(["할인 금액", configuredDiscountAmount()]);
  const appliedLabel = appliedMethod === "mobile" ? "모바일 상품권" : appliedMethod === "paper" ? "할인 쿠폰" : "";
  if (appliedLabel && !adjustments.some(([label]) => label === appliedLabel)) adjustments.push([appliedLabel, Math.min(4000, state.selectedCourse.price)]);
  const total = Math.max(0, state.selectedCourse.price - adjustments.reduce((sum, [, amount]) => sum + amount, 0));
  return `
    <div class="summary-bar">
      <div class="summary-row"><span>선택 코스</span><strong>${state.selectedCourse.name}</strong></div>
      <div class="summary-row"><span>코스 금액</span><strong>${formatPrice(state.selectedCourse.price)}</strong></div>
      ${adjustments.map(([label, amount]) => `<div class="summary-row discount"><span>${label}</span><strong>-${formatPrice(amount)}</strong></div>`).join("")}
      <div class="summary-row total"><span>총 결제금액</span><b>${formatPrice(total)}</b></div>
    </div>`;
}


function paymentIcon(type) {
  const icons = {
    mobile: `<rect x="19" y="10" width="62" height="80" rx="9"/><path d="M36 23h28M46 76h8M29 43h42v20H29z"/>`,
    paper: `<path d="M18 22h64v56H18zM28 35h44M28 50h28M28 65h20"/>`,
    discount: `<path d="M13 31h74v38H13zM27 31v38M42 42h30M42 58h18"/><circle cx="27" cy="42" r="2"/><circle cx="27" cy="58" r="2"/>`,
    app: `<rect x="18" y="10" width="64" height="80" rx="10"/><path d="M36 32h28M32 48h36M40 64h20"/>`,
    card: `<rect x="10" y="20" width="80" height="60" rx="8"/><path d="M10 38h80M24 54h18v12H24zM52 58h22"/>`,
  };
  return `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">${icons[type] || ""}</svg>`;
}


function adminEntryHotspot() {
  return `<button class="admin-entry-hotspot" type="button" data-action="admin-entry-tap" aria-label="관리자 로그인 진입"></button>`;
}


function courseStatusBar(forceBusy = null) {
  const isBusy = forceBusy ?? state.frontCar;
  const status = state.communicationError ? "통신에러" : isBusy ? "앞차 세차 중" : "대기중";
  const statusClass = state.communicationError ? "is-error" : isBusy ? "is-busy" : "";
  const identity = `${state.adminSettings.branch} / ${state.adminSettings.machineName}`;
  const seconds = String(Math.max(0, state.screenTimeoutSeconds)).padStart(2, "0");
  const noTimeout = NO_SCREEN_TIMEOUT.has(state.screen);
  const timeout = noTimeout ? "" : `<span class="screen-timeout"><b>${seconds}</b></span>`;
  return `<div class="course-status-bar ${noTimeout ? "no-timeout" : ""}"><div class="kiosk-info"><strong class="kiosk-identity">${identity}</strong><span class="${statusClass}">${status}</span></div>${timeout}</div>`;
}


function popupActions(actions = [], secondary = { label: "닫기", action: "close-dialog" }) {
  const secondaryButton = secondary ? `<button class="large-button light" data-action="${secondary.action}">${secondary.label}</button>` : "";
  return `<div class="popup-actions ${secondary ? "" : "single"}">${secondaryButton}<div class="popup-cta-group">${actions.map(({ label, action, className = "red", disabled = false }) => `<button class="large-button ${className}" data-action="${action}" ${disabled ? "disabled" : ""}>${label}</button>`).join("")}</div></div>`;
}


function modalPopup({ title, content, className = "", role = "dialog", actions = [], secondary, showActions = true }) {
  return `<div class="modal-overlay"><section class="modal-popup ${className}" role="${role}" aria-modal="true">${title ? `<h3>${title}</h3>` : ""}${content}${showActions ? popupActions(actions, secondary) : ""}</section></div>`;
}


function commonToastMessage(message) {
  return `<div class="toast-dim" aria-hidden="true"></div><div class="toast-message" role="status">${message}</div>`;
}


function completionRoute(kind) {
  if (kind === "ticket" || kind === "auto") return `commonComplete${state.frontCar ? "Waiting" : ""}`;
  return `${kind}Complete${state.frontCar ? "Waiting" : ""}`;
}


function alertPopup({ type = "success", title, message = "", action = "close-alert", button = "확인", showCode = type === "error" }) {
  const copy = [title, message].filter(Boolean).join(" ");
  return `<div class="alert-overlay"><div class="alert-popup" role="alertdialog" aria-modal="true"><div class="result-icon ${type === "error" ? "error" : ""}">${type === "error" ? "!" : "✓"}</div><p class="alert-message">${copy}</p>${showCode ? '<span class="alert-code">[오류코드 0000]</span>' : ""}${popupActions([{ label: button, action }], null)}</div></div>`;
}


function alertOnCourse(title, message) {
  return courseScreen(alertPopup({ type: "error", title, message }));
}


function alertOnPayment(title, message) {
  return paymentScreen(alertPopup({ type: "error", title, message, action: "close-dialog" }));
}

function clearTimers() {
  if (state.timer) window.clearInterval(state.timer);
  if (state.qrTimer) window.clearTimeout(state.qrTimer);
  if (state.autoTimer) window.clearTimeout(state.autoTimer);
  if (state.adminLockTimer) window.clearTimeout(state.adminLockTimer);
  if (state.timeoutTimer) window.clearInterval(state.timeoutTimer);
  if (state.screenTimeoutTimer) window.clearInterval(state.screenTimeoutTimer);
  state.timer = null;
  state.qrTimer = null;
  state.autoTimer = null;
  state.adminLockTimer = null;
  state.timeoutTimer = null;
  state.screenTimeoutTimer = null;
}

function resetScreenTimeout() {
  state.screenTimeoutSeconds = SCREEN_TIMEOUT_SECONDS;
  if (state.screenTimeoutTimer) window.clearInterval(state.screenTimeoutTimer);
  state.screenTimeoutTimer = null;
  const counter = kiosk.querySelector(".screen-timeout");
  if (counter) {
    counter.querySelector("b").textContent = String(SCREEN_TIMEOUT_SECONDS);
    counter.querySelectorAll(".design-timer-ring path").forEach(path => path.getAnimations().forEach(animation => { animation.currentTime = 0; }));
  }
}

function startScreenTimeout() {
  if (embedMode || state.timeoutVisible || state.screenTimeoutTimer || !kiosk.querySelector(".screen-timeout")) return;
  state.screenTimeoutTimer = window.setInterval(() => {
    state.screenTimeoutSeconds -= 1;
    const counter = kiosk.querySelector(".screen-timeout");
    if (counter) counter.querySelector("b").textContent = String(Math.max(0, state.screenTimeoutSeconds));
    if (state.screenTimeoutSeconds <= 0) {
      state.timeoutVisible = true;
      state.timeoutSeconds = 5;
      window.clearInterval(state.screenTimeoutTimer);
      state.screenTimeoutTimer = null;
      render();
    }
  }, 1000);
}

function startTimeoutPreview() {
  if (!state.timeoutVisible || state.timeoutTimer) return;
  state.timeoutTimer = window.setInterval(() => {
    state.timeoutSeconds -= 1;
    const counter = kiosk.querySelector(".timeout-countdown strong");
    if (counter) counter.textContent = `00:${String(Math.max(0, state.timeoutSeconds)).padStart(2, "0")}`;
    if (state.timeoutSeconds <= 0) {
      state.timeoutVisible = false;
      clearTimers();
      resetPaymentAdjustments();
      state.history = [];
      go("intro", false);
    }
  }, 1000);
}

function go(screen, push = true) {
  if (!renderers[screen]) return;
  if (screen.startsWith("admin") && screen !== "adminLogin" && !state.adminAuthenticated) {
    state.adminLoginTarget = screen;
    state.adminLoginReturnScreen = ["intro", "course"].includes(state.screen) ? state.screen : "course";
    screen = "adminLogin";
  }
  clearTimers();
  resetScreenTimeout();
  if (push && state.screen !== screen) state.history.push(state.screen);
  state.screen = screen;
  state.formError = "";
  if (screen === "autoSingle") state.autoSeconds = AUTO_USE_SECONDS;
  if (screen.startsWith("autoMultiple")) state.selectedAutoTicket = 0;
  if (screen === "adminHome") state.adminTab = "kiosk";
  if (screen === "adminSystem") state.adminTab = "system";
  if (screen === "cardPayExternal") state.paymentSeconds = 10;
  if (screen === "receiptSent") state.receiptIssued = true;
  if (screen === "discountApplied") {
    state.discountApplied = true;
    if (!state.discountSuccessMessage) state.discountSuccessMessage = DISCOUNT_VALIDATION_RESULTS.success.message;
  }
  render();
  if (screen === "autoSingle" && !embedMode) startCountdown();
  if (!embedMode) startAutomaticFlow(screen);
}

function startAutomaticFlow(screen) {
  const delayedRoutes = {
    discountApplied: ["go-payment", TOAST_CLOSE_MS],
    ticketDone: ["ticket-complete", TOAST_CLOSE_MS],
    appPay: ["complete-payment", 4200],
    mobileVoucher: ["voucher-use", 4200],
    paperCoupon: ["paper-use", 4200],
  };
  if (screen === "cardPay") {
    state.timer = window.setTimeout(() => go("cardPayExternal"), 800);
    return;
  }
  if (screen === "cardPayExternal") {
    state.timer = window.setInterval(() => {
      state.paymentSeconds -= 1;
      const node = kiosk.querySelector(".payment-wait strong");
      if (node) node.textContent = `${state.paymentSeconds}초`;
      if (state.paymentSeconds <= 0) go(completionRoute("payment"));
    }, 1000);
    return;
  }
  const route = delayedRoutes[screen];
  if (!route) return;
  state.autoTimer = window.setTimeout(() => {
    const proxy = document.createElement("button");
    proxy.dataset.action = route[0];
    handleAction(proxy);
  }, route[1]);
}

function startCountdown() {
  state.timer = window.setInterval(() => {
    state.autoSeconds -= 1;
    const number = kiosk.querySelector(".count-number");
    const ring = kiosk.querySelector(".countdown-inline");
    if (number) number.textContent = state.autoSeconds;
    if (ring) ring.style.setProperty("--count-progress", `${(state.autoSeconds / AUTO_USE_SECONDS) * 100}%`);
    if (state.autoSeconds <= 0) go("ticketDone");
  }, 1000);
}

function simulateQr() {
  clearTimers();
  go("ticketDone");
}

function render() {
  // v0.7에서 추가한 렌더러는 변경 화면 스크립트 로딩 후 등록된다.
  if (!renderers[state.screen]) return;
  kiosk.className = `kiosk height-${state.height}`;
  kiosk.dataset.screen = state.screen === "discountApplied" ? "payment" : state.screen;
  kiosk.innerHTML = renderers[state.screen]();
  if (state.timeoutVisible) kiosk.insertAdjacentHTML("beforeend", timeoutPopup());
  updateReviewPanel();
  if (!embedMode) fitKiosk();
  startTimeoutPreview();
  startScreenTimeout();
}

function updateReviewPanel() {
  if (embedMode) return;
  const meta = screenMeta[state.screen] || { label: state.screen, req: "검토용 화면", note: "IA 유형 확인" };
  document.getElementById("currentScreenName").textContent = meta.label;
  document.getElementById("currentScreenReq").textContent = meta.req;
  document.getElementById("currentScreenNote").textContent = meta.note;
  document.getElementById("screenSelect").value = state.screen;
  document.querySelectorAll("[data-height]").forEach((button) => button.classList.toggle("active", button.dataset.height === state.height));
  const washStatus = state.communicationError ? "error" : state.frontCar ? "busy" : "ready";
  document.querySelectorAll("[data-wash-status]").forEach((button) => {
    const selected = button.dataset.washStatus === washStatus;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  document.querySelectorAll("[data-voucher-case]").forEach((button) => {
    const selected = (button.dataset.voucherCase === "additional") === state.voucherAdditionalPayment;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("embed", "1");
  url.searchParams.set("screen", state.screen);
  url.searchParams.set("height", state.height);
  document.getElementById("embedLink").href = url.toString();
}

function fitKiosk() {
  const maxWidth = stage.clientWidth - 56;
  const maxHeight = stage.clientHeight - 56;
  const scale = Math.min(maxWidth / 1080, maxHeight / 1920, 1);
  kioskShell.style.transform = `scale(${scale})`;
  kioskShell.style.margin = `${-(1920 * (1 - scale)) / 2}px ${-(1080 * (1 - scale)) / 2}px`;
}

function resetScenario(screen) {
  const previous = state.screen;
  clearTimers();
  if (["voucherUse", "voucherAdditional", "paperUse", "paperAdditional"].includes(screen)) state.voucherAdditionalPayment = screen.endsWith("Additional");
  state.history = previous === screen ? [] : [previous];
  state.selectedCourse = courses[2];
  state.selectedPayment = "card";
  resetPaymentAdjustments();
  state.phone = "01012345678";
  state.consent = true;
  state.frontCar = screen.endsWith("Waiting");
  state.adminAuthenticated = false;
  state.adminTapCount = 0;
  state.adminTapStartedAt = 0;
  state.adminPassword = "";
  state.adminLoginError = "";
  state.adminLoginTarget = "adminHome";
  if (screen === "adminLogin") state.adminLoginReturnScreen = ["intro", "course"].includes(state.screen) ? state.screen : "course";
  state.adminPasswordChange = { current: "", next: "", confirm: "" };
  state.adminReauthPassword = "";
  state.adminDialogError = "";
  state.adminResult = null;
  state.adminTab = "kiosk";
  state.adminDialog = null;
  state.adminSettings = { ...state.savedAdminSettings };
  go(screen, false);
}

function scenario(name) {
  const scenarios = {
    general: () => resetScenario("intro"),
    qr: () => { resetScenario("course"); simulateQr(); },
    autoSingle: () => resetScenario("autoSingle"),
    autoManual: () => resetScenario("autoManual"),
    autoMultiple: () => resetScenario("autoMultiple"),
    autoNoTicket: () => resetScenario("autoWelcomeMember"),
    admin: () => resetScenario("adminLogin"),
    unavailable: () => resetScenario("unavailable"),
  };
  scenarios[name]?.();
}

function handleAction(target) {
  const action = target.dataset.action;
  if (!action) return;
  if (!action.startsWith("timeout-")) resetScreenTimeout();
  if (action !== "admin-entry-tap") {
    state.adminTapCount = 0;
    state.adminTapStartedAt = 0;
  }

  if (action === "admin-entry-tap") {
    const now = Date.now();
    if (!state.adminTapStartedAt || now - state.adminTapStartedAt > 5000) {
      state.adminTapStartedAt = now;
      state.adminTapCount = 1;
    } else {
      state.adminTapCount += 1;
    }
    if (state.adminTapCount >= 4) {
      state.adminTapCount = 0;
      state.adminTapStartedAt = 0;
      state.adminLoginReturnScreen = state.screen;
      state.adminLoginTarget = "adminHome";
      state.adminPassword = "";
      state.adminLoginError = "";
      go("adminLogin", false);
    }
  } else if (action === "start") {
    state.height = target.dataset.height;
    state.history = [];
    go("course", false);
  } else if (action === "intro-qr") {
    simulateQr();
  } else if (action === "timeout-preview") {
    clearTimers();
    state.timeoutVisible = true;
    state.timeoutSeconds = 5;
    render();
  } else if (action === "timeout-home") {
    state.timeoutVisible = false;
    clearTimers();
    resetPaymentAdjustments();
    state.history = [];
    go("intro", false);
  } else if (action === "timeout-continue") {
    state.timeoutVisible = false;
    state.timeoutSeconds = 5;
    clearTimers();
    resetScreenTimeout();
    render();
  } else if (action === "select-course") {
    state.selectedCourse = courses.find((course) => course.id === target.dataset.course) || courses[0];
    resetPaymentAdjustments();
    go(state.savedAdminSettings.discountEnabled ? "discountScan" : "payment");
  } else if (action === "go-discount-scan") {
    go("discountScan");
  } else if (action === "skip-discount") {
    state.discountApplied = false;
    state.discountValidationMessage = "";
    go("payment");
  } else if (action === "discount-use") {
    state.discountValidationMessage = "";
    go("discountUse");
  } else if (action === "discount-validate") {
    const result = discountValidationResult(state.discountResult);
    clearTimers();
    if (result.valid) {
      state.discountApplied = true;
      state.discountSuccessMessage = result.message;
      go("discountApplied");
    } else {
      state.discountApplied = false;
      state.discountValidationMessage = result.message;
      render();
    }
  } else if (action === "discount-retry") {
    state.discountValidationMessage = "";
    render();
  } else if (action === "go-payment") {
    go("payment");
  } else if (action === "pay-method") {
    state.selectedPayment = target.dataset.method;
    const routes = { card: "cardPay", app: "appPay", mobile: "mobileVoucher", paper: "paperCoupon", discount: "discountScan" };
    go(routes[target.dataset.method]);
  } else if (action === "complete-payment") {
    go(completionRoute("payment"));
  } else if (action === "voucher-use") {
    go(voucherCaseScreen("voucher"));
  } else if (action === "voucher-complete") {
    state.mobileVoucherUsed = true;
    state.mobileVoucherAmount = payableAmount();
    go(completionRoute("payment"));
  } else if (action === "voucher-partial") {
    state.mobileVoucherUsed = true;
    state.mobileVoucherAmount = Math.min(4000, payableAmount());
    go("payment");
  } else if (action === "paper-use") {
    go(voucherCaseScreen("paper"));
  } else if (action === "paper-complete") {
    state.paperCouponUsed = true;
    state.paperCouponAmount = payableAmount();
    go(completionRoute("payment"));
  } else if (action === "paper-partial") {
    state.paperCouponUsed = true;
    state.paperCouponAmount = Math.min(4000, payableAmount());
    go("payment");
  } else if (action === "receipt-yes") {
    state.phone = "010";
    state.consent = false;
    go("receipt");
  } else if (action === "toggle-consent") {
    state.consent = !state.consent;
    render();
  } else if (action === "key") {
    const key = target.dataset.key;
    if (key === "전체삭제") state.phone = "";
    else if (key === "←") state.phone = state.phone.slice(0, -1);
    else if (state.phone.length < 11) state.phone += key;
    state.formError = "";
    render();
  } else if (action === "send-receipt") {
    if (state.phone.length < 10) {
      state.formError = "휴대폰 번호를 확인해 주세요";
      render();
    } else {
      state.consent = true;
      go("receiptSent");
    }
  } else if (action === "cancel-receipt") {
    go(completionRoute("payment"));
  } else if (action === "height-select") {
    go("heightSettings");
  } else if (action === "height-option") {
    state.height = target.dataset.height;
    go("course", false);
  } else if (action === "close-dialog") {
    if (state.screen === "adminHome" && state.adminDialog) {
      state.adminDialog = null;
      state.adminPasswordChange = { current: "", next: "", confirm: "" };
      state.adminReauthPassword = "";
      state.adminDialogError = "";
      render();
      return;
    }
    if (state.screen === "adminLogin" && state.adminLoginError) {
      state.adminPassword = "";
      state.adminLoginError = "";
      render();
      return;
    }
    const returnScreens = {
      heightSettings: "course",
      discountScan: "course",
      discountApplied: "course",
      voucherUse: "mobileVoucher",
      voucherAdditional: "payment",
      voucherError: "payment",
      paperUse: "paperCoupon",
      paperAdditional: "payment",
      paperError: "payment",
      receipt: completionRoute("payment"),
      receiptError: completionRoute("payment"),
      ticketDone: "course",
      autoError: "course",
      error: "course",
    };
    go(returnScreens[state.screen] || "course", false);
  } else if (action === "close-admin-login") {
    const returnScreen = state.adminLoginReturnScreen;
    state.adminPassword = "";
    state.adminLoginError = "";
    go(returnScreen, false);
  } else if (action === "receipt-sent-close") {
    go(completionRoute("payment"), false);
  } else if (action === "course-home" || action === "close-alert" || action === "close-ticket") {
    resetPaymentAdjustments();
    state.history = [];
    go("course", false);
  } else if (action === "home" || action === "choose-course" || action === "dismiss-welcome") {
    if (state.screen.startsWith("admin")) {
      state.adminAuthenticated = false;
      state.adminSettings = { ...state.savedAdminSettings };
    }
    resetPaymentAdjustments();
    state.history = [];
    go("course", false);
  } else if (action === "help") {
    state.helpReturn = state.screen;
    go("help");
  } else if (action === "review-back") {
    clearTimers();
    const previous = state.history.pop() || "intro";
    go(previous, false);
  } else if (action === "back") {
    clearTimers();
    const previous = state.history.pop() || "course";
    go(previous, false);
  } else if (action === "select-auto-ticket") {
    state.selectedAutoTicket = Number(target.dataset.ticket);
    render();
  } else if (action === "use-ticket") {
    go(completionRoute("auto"));
  } else if (action === "ticket-complete") {
    go(completionRoute("ticket"), false);
  } else if (action === "admin-confirm") {
    const dialogName = state.adminDialog;
    if (dialogName === "save") {
      state.savedAdminSettings = { ...state.adminSettings };
      state.adminDialog = "save-success";
    } else if (dialogName === "password-change") {
      const form = state.adminPasswordChange;
      if (form.current !== state.adminCredential) state.adminDialogError = "현재 비밀번호가 일치하지 않습니다.";
      else if (!/^\d{4}$/.test(form.next)) state.adminDialogError = "새 비밀번호는 숫자 4자리여야 합니다.";
      else if (form.next !== form.confirm) state.adminDialogError = "새 비밀번호 확인값이 일치하지 않습니다.";
      else if (form.next === state.adminCredential) state.adminDialogError = "현재 비밀번호와 다른 번호를 입력해 주세요.";
      else {
        state.adminCredential = form.next;
        state.adminAuthenticated = false;
        state.adminFailureCount = 0;
        state.adminLockedUntil = 0;
        writeAdminSecurity();
        state.adminPasswordChange = { current: "", next: "", confirm: "" };
        state.adminDialog = null;
        state.adminLoginError = "changed";
        return go("adminLogin", false);
      }
    } else if (dialogName === "delete-all") {
      if (state.adminReauthPassword !== state.adminCredential) state.adminDialogError = "관리자 비밀번호가 일치하지 않습니다.";
      else {
        state.adminReauthPassword = "";
        state.adminResult = { title: "전체 로그를 삭제했습니다.", message: "삭제 결과는 별도 감사 기록에 남습니다." };
        state.adminDialog = "action-result";
      }
    } else if (["save-success", "save-invalid-discount", "action-result"].includes(dialogName)) {
      state.adminDialog = null;
      state.adminResult = null;
    } else {
      const results = {
        "card-check": ["카드리더 점검을 완료했습니다.", "상호 인증과 무결성 검사 결과가 정상입니다."],
        "card-reset": ["카드리더를 초기화했습니다.", "카드결제를 다시 사용할 수 있습니다."],
        "log-send": ["운영 로그를 전송했습니다.", "전송 결과를 로그 관리에서 확인할 수 있습니다."],
        "app-update": ["앱 업데이트를 완료했습니다.", "변경 사항 적용을 위해 앱을 다시 시작합니다."],
        "app-exit": ["앱 종료를 요청했습니다.", "프로토타입에서는 화면만 유지합니다."],
        "plc-init": ["PLC 초기화를 완료했습니다.", "대상 번지의 초기화 결과가 정상입니다."],
        "socket-init": ["통신소켓을 초기화했습니다.", "연결 상태가 정상으로 복구되었습니다."],
        "delete-sent": ["전송 완료 로그를 삭제했습니다.", "삭제한 로그는 복구할 수 없습니다."],
      };
      const result = results[dialogName];
      state.adminResult = { title: result?.[0] || "작업을 완료했습니다.", message: result?.[1] || "처리 결과가 정상입니다." };
      state.adminDialog = "action-result";
    }
    render();
  } else if (action === "admin-error-close") {
    state.adminPassword = "";
    state.adminLoginError = "";
    render();
  } else if (action === "receipt-edit") {
    go("receipt", false);
  } else if (action === "admin-key") {
    if (adminLockSeconds()) return render();
    const key = target.dataset.key;
    if (key === "초기화") state.adminPassword = "";
    else if (key === "←") state.adminPassword = state.adminPassword.slice(0, -1);
    else if (state.adminPassword.length < ADMIN_PASSWORD_LENGTH) state.adminPassword += key;
    state.adminLoginError = "";
    render();
  } else if (action === "admin-login") {
    if (adminLockSeconds()) {
      state.adminLoginError = "locked";
      render();
    } else if (!/^\d{4}$/.test(state.adminPassword)) {
      state.adminLoginError = "incomplete";
      render();
    } else if (state.adminPassword !== state.adminCredential) {
      state.adminFailureCount += 1;
      if (state.adminFailureCount >= ADMIN_MAX_FAILURES) {
        state.adminLockedUntil = Date.now() + ADMIN_LOCK_MS;
        state.adminLoginError = "locked";
      } else {
        state.adminLoginError = "invalid";
      }
      writeAdminSecurity();
      render();
    } else {
      state.adminAuthenticated = true;
      state.adminFailureCount = 0;
      state.adminLockedUntil = 0;
      writeAdminSecurity();
      state.adminPassword = "";
      state.adminSettings = { ...state.savedAdminSettings };
      go(state.adminLoginTarget || "adminHome", false);
    }
  }
}


function applyV07Actions() {
const v06HandleAction = handleAction;
handleAction = function(target) {
  const action=target.dataset.action;
  if(action==='course-info') {go('courseInfo');if(!embedMode)state.timer=window.setTimeout(()=>{state.history.pop();go('course',false);},5000);return;}
  if(action==='course-info-close') {clearTimers();state.history.pop();return go('course',false);}
  if(action==='v07-qr') return simulateQr();
  if(action==='v07-mismatch-use') {resetPaymentAdjustments();return go('ticketDone');}
  if(action==='admin-exit') {if(JSON.stringify(state.adminSettings)!==JSON.stringify(state.savedAdminSettings)){state.adminDialog='exit-save';return render();}return leaveAdmin(false);}
  if(action==='admin-exit-save') return leaveAdmin(true);
  if(action==='admin-exit-discard') return leaveAdmin(false);
  return v06HandleAction(target);
};
// Figma 시스템 설정의 새 버튼도 기존 확인/결과 팝업을 사용한다.
document.addEventListener('click',event=>{if(event.target.closest('[data-admin-setting-action="wash-end"]')){state.adminResult={title:'세차 종료를 요청하시겠습니까?',message:'프로토타입에서 동작 확인용으로 제공됩니다.'};state.adminDialog='action-result';render();}});

}
