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
    <img src="${prefix}${sedan ? "sedan-body-outline.svg" : "suv-body-outline.svg"}" alt="" />
    <img src="${prefix}${sedan ? "sedan-body.svg" : "suv-body.svg"}" alt="" />
    <img class="wheel left" src="${prefix}${sedan ? "sedan-wheel.svg" : "suv-wheel.svg"}" alt="" />
    <img class="wheel right" src="${prefix}${sedan ? "sedan-wheel.svg" : "suv-wheel.svg"}" alt="" />
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

function introScreen(overlay = "", { title = "이용하실 화면 높이를 선택해 주세요.", description = "차량에 맞는 화면 높이를 선택하면 바로 이용을 시작합니다.", welcome = "" } = {}) {
  return `
    <div class="intro-screen half ${welcome ? "auto-welcome-intro" : ""}">
      ${adZone()}
      <button class="scan-simulator intro-qr-simulator" data-action="intro-qr" aria-label="세차권 QR 인식"></button>
      <section class="intro-start">
        ${courseStatusBar()}
        ${welcome ? `<p class="intro-welcome">${welcome}</p>` : ""}
        <h3>${title}</h3>
        <p>${description}</p>
        <div class="height-choice">
          <button class="height-button" data-action="start" data-height="high">
            ${vehicleIcon("suv")}<strong>높은 화면으로 시작</strong>
          </button>
          <button class="height-button red" data-action="start" data-height="low">
            ${vehicleIcon("sedan")}<strong>기본 화면으로 시작</strong>
          </button>
        </div>
        <div class="ticket-scan-guide intro-ticket-scan-guide">${qrMini()}<p><strong>앱에서 세차권을 미리 구매하셨나요?</strong><span>앱의 세차권 QR을 바코드 인식기에 바로 인식해 주세요.</span></p></div>
      </section>
      ${adminEntryHotspot()}
      ${overlay}
    </div>`;
}

function courseCards() {
  return courses.map((course) => `
    <button class="course-card ${course.recent ? "recommended" : ""}" data-action="select-course" data-course="${course.id}">
      <span>
        <span class="course-name">${course.name}${course.recent ? `<span class="course-tag">최근&nbsp;이용</span>` : ""}</span>
        <span class="course-desc">${course.desc}</span>
      </span>
      <span class="course-price">${formatPrice(course.price)}</span>
    </button>`).join("");
}

function courseScreen(overlay = "") {
  const isCoursePage = ["course", "discountScan", "heightSettings", "error", "autoError", "qrMismatch"].includes(state.screen);
  return standardScreen({
    title: "이용하실 코스를 선택해 주세요.",
    content: `<div class="course-list">${courseCards()}</div>
      <div class="ticket-scan-guide">${qrMini()}<p><strong>앱에서 세차권을 미리 구매하셨나요?</strong><span>앱의 세차권 QR을 바코드 인식기에 바로 인식해 주세요.</span></p></div>`,
    overlay: `${adminEntryHotspot()}${overlay}`,
    classes: `course-reference${isCoursePage ? " course-page-layout" : ""}`,
    status: courseStatusBar(),
    footerType: "course",
  });
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

function helpScreen() {
  const helpYoutubeUrl = "https://www.youtube.com/results?search_query=%EC%BB%B4%EC%9D%B8%EC%9B%8C%EC%8B%9C+%EC%9D%B4%EC%9A%A9%EB%B0%A9%EB%B2%95";
  const helpQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&format=svg&data=${encodeURIComponent(helpYoutubeUrl)}`;
  const guide = [
    ["입장", "베이 입구가 열리면 좌우 카스토퍼를 넘지 않도록 베이 안으로 천천히 진입해 주세요."],
    ["정차", "왼쪽 전광판이 ‘진입’에서 ‘정지’로 바뀌면 즉시 정차하고 기어를 ‘P’로 유지해 주세요."],
    ["세차 진행", "세차가 끝날 때까지 창문을 모두 닫고 사이드미러를 접은 상태로 정차해 주세요."],
    ["완료 및 이동", "출구가 열리면 천천히 출차한 뒤 드라잉 존으로 이동해 잔여 물기를 닦아 주세요."],
  ];
  const checks = [
    "높이 2.1m 이상 또는 길이 5.6m 이상 차량은 이용할 수 없습니다.",
    "세차 시작 전 창문과 선루프를 모두 닫아 주세요.",
    "에어컨·히터 사용 시 ‘내기 순환’ 모드를 선택해 주세요.",
    "세차 중 차량이 움직이면 세차기와 충돌할 수 있습니다. 기어를 반드시 ‘P’로 유지해 주세요.",
    "차량 진입 시 카스토퍼를 밟거나 넘어가지 마세요.",
  ];
  const items = guide.map((item, i) => `<div class="guide-item"><span class="guide-num">${i + 1}</span><div><strong>${item[0]}</strong><span>${item[1]}</span></div></div>`).join("");
  return `<div class="help-reference-screen"><section class="help-reference-modal">
    <h2>컴인워시 이용 안내</h2>
    <h3>키오스크 이용 순서</h3>
    <ol class="help-reference-flow"><li><b>1</b><span>코스 선택</span></li><li><b>2</b><span>결제수단 선택</span></li><li><b>3</b><span>결제하기</span></li><li><b>4</b><span>차량 입장</span></li></ol>
    <div class="help-app-tip"><i>▦</i><p><strong>앱에서 세차권을 미리 구매하셨나요?</strong><span>앱의 세차권 QR을 바코드 인식기에 바로 스캔해 주세요.</span></p></div>
    <a class="help-youtube-qr" href="${helpYoutubeUrl}" target="_blank" rel="noopener noreferrer"><img src="${helpQrUrl}" alt="컴인워시 이용 방법 유튜브 QR 코드" /><p><strong>QR을 스캔해 보세요</strong><span>휴대폰으로 스캔하면 유튜브에서<br />컴인워시 이용 방법을 볼 수 있습니다.</span></p></a>
    <h3>세차권 결제 완료 후 이용 순서</h3><div class="guide-list">${items}</div>
    <h3>이용 전 꼭 확인해 주세요</h3><ul class="help-reference-notice">${checks.map((item) => `<li>${item}</li>`).join("")}<li>물기 제거용 타월 제공 여부는 지점에 따라 다를 수 있습니다.</li></ul>
    <div class="help-reference-contact"><span>고객센터</span><strong>1688-5794</strong></div><button class="large-button red" data-action="back">닫기</button>
  </section></div>`;
}

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

function popupActions(actions = [], secondary = { label: "닫기", action: "close-dialog" }) {
  const secondaryButton = secondary ? `<button class="large-button light" data-action="${secondary.action}">${secondary.label}</button>` : "";
  return `<div class="popup-actions ${secondary ? "" : "single"}">${secondaryButton}<div class="popup-cta-group">${actions.map(({ label, action, className = "red", disabled = false }) => `<button class="large-button ${className}" data-action="${action}" ${disabled ? "disabled" : ""}>${label}</button>`).join("")}</div></div>`;
}

function modalPopup({ title, content, className = "", role = "dialog", actions = [], secondary, showActions = true }) {
  return `<div class="modal-overlay"><section class="modal-popup ${className}" role="${role}" aria-modal="true">${title ? `<h3>${title}</h3>` : ""}${content}${showActions ? popupActions(actions, secondary) : ""}</section></div>`;
}

function timeoutPopup() {
  const seconds = String(Math.max(0, state.timeoutSeconds)).padStart(2, "0");
  return `<div class="timeout-overlay"><section class="timeout-popup" role="dialog" aria-modal="true" aria-label="메인화면 이동 안내">
    <h3>계속 이용하시겠습니까?</h3>
    <p>잠시 후 첫 화면으로 이동합니다.</p>
    <div class="timeout-countdown"><span>남은 시간</span><strong>00:${seconds}</strong></div>
    <div class="timeout-actions"><button class="large-button light" data-action="timeout-home">처음으로</button><button class="large-button red" data-action="timeout-continue">계속 이용</button></div>
  </section></div>`;
}

function heightSettingsScreen() {
  const selectedHeight = state.height;
  return courseScreen(modalPopup({
    title: "이용하실 화면 높이를 선택해 주세요.",
    className: "height-settings-modal",
    content: `<div class="height-popup-options" aria-label="화면 높이"><button class="${selectedHeight === "high" ? "selected" : ""}" data-action="height-option" data-height="high" aria-current="${selectedHeight === "high"}">${selectedHeight === "high" ? '<span class="height-selection-status">현재 선택</span>' : ""}${vehicleIcon("suv")}<strong>높은 화면</strong></button><button class="${selectedHeight === "low" ? "selected" : ""}" data-action="height-option" data-height="low" aria-current="${selectedHeight === "low"}">${selectedHeight === "low" ? '<span class="height-selection-status">현재 선택</span>' : ""}${vehicleIcon("sedan")}<strong>기본 화면</strong></button></div>`,
    showActions: false,
  }));
}

function discountRegistrationScreen() {
  return courseScreen(modalPopup({
    title: "주유 세차 할인권을 사용하시겠습니까?",
    className: "discount-registration-modal",
    content: `<p class="discount-registration-intro">5만원 이상 주유 시 영수증 하단에 세차 할인권이 발급됩니다.</p>`,
    actions: [{ label: "사용 안함", action: "skip-discount", className: "light" }, { label: "사용", action: "discount-use" }],
    secondary: null,
  }));
}

function discountUseScreen() {
  const alert = state.discountValidationMessage
    ? alertPopup({ type: "error", title: state.discountValidationMessage, action: "discount-retry", showCode: false })
    : "";
  return standardScreen({
    title: "",
    reachable: false,
    classes: "mobile-voucher-screen discount-use-screen",
    status: kioskInfoBar(),
    content: `<div class="discount-use-guide">
      <span>주유 세차 할인권</span>
      <strong>주유 세차 할인권 바코드를<br>바코드 인식기에 대주세요.</strong>
      <div class="scan-device"><span class="mobile-voucher-device-label">IC카드 리더기<br>IMG</span></div>
      <p>할인이 적용될 때까지 바코드를 대주세요!</p>
      <p>30초 이내로 인식하지 않으면 자동 취소됩니다.</p>
      <button class="scan-simulator" data-action="discount-validate" aria-label="세차 할인권 바코드 인식"></button>
    </div>`,
    overlay: alert,
  });
}

function discountAppliedScreen() {
  return paymentScreen(commonToastMessage(state.discountSuccessMessage));
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
  return `<div class="external-payment-overlay"><section class="external-payment-popup legacy-card-popup" role="dialog" aria-modal="true"><img src="assets/asis-card-payment-popup.png" alt="신용카드 결제 안내. 카드를 IC카드 리더기에 꽂고 결제가 완료될 때까지 빼지 마세요. 30초 안에 결제하지 않으면 자동 취소됩니다. 요청취소 버튼." /></section></div>`;
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

function commonToastMessage(message) {
  return `<div class="toast-dim" aria-hidden="true"></div><div class="toast-message" role="status">${message}</div>`;
}

function commonToastScreen() {
  return courseScreen(commonToastMessage("처리가 완료되었습니다."));
}

function completionRoute(kind) {
  if (kind === "ticket" || kind === "auto") return `commonComplete${state.frontCar ? "Waiting" : ""}`;
  return `${kind}Complete${state.frontCar ? "Waiting" : ""}`;
}

function voucherCaseScreen(kind) {
  return state.voucherAdditionalPayment ? `${kind}Additional` : `${kind}Use`;
}

function completionContent(message, waiting, receipt = false) {
  const title = receipt
    ? `<span><em>결제가 완료</em>되었습니다.</span>`
    : `<span>${message}</span>`;
  return `<div class="ticket-completion ${receipt ? "payment-ticket-completion" : ""}">
      <h2 class="ticket-completion-title">${title}</h2>
      ${waiting ? `<div class="ticket-waiting-notice"><strong>앞차가 세차 진행중입니다.</strong><span>잠시 대기해 주세요.</span></div>` : ""}
      <div class="ticket-entry-guide">
        <div class="wash-bay-wireframe" role="img" aria-label="차량 진입 안내 모션 GIF 예시 이미지">차량 진입 안내 모션/GIF<br>예시 이미지</div>
        <p class="ticket-entry-caption"><span>문이 열리면</span><span>차량 유도등의 지시에 따라</span><span>천천히 입장해 주세요.</span></p>
      </div>
      ${receipt && !state.receiptIssued ? '<button class="large-button light receipt-only" data-action="receipt-yes">영수증 발급</button>' : ""}
    </div>`;
}

function paymentCompleteScreen(overlay = "", waiting = state.frontCar) {
  return standardScreen({
    title: "",
    classes: "ticket-completion-screen payment-completion-screen completion-v06 payment-completion-waiting",
    reachable: false,
    status: kioskInfoBar(waiting),
    content: completionContent("결제가 완료되었습니다.", waiting, true),
    overlay,
    footerType: "none",
  });
}

function commonCompleteScreen(waiting = false, overlay = "") {
  return standardScreen({
    title: "",
    classes: "ticket-completion-screen completion-v06 payment-completion-waiting",
    reachable: false,
    status: kioskInfoBar(waiting),
    content: completionContent("세차권 사용이 완료되었습니다.", waiting),
    overlay,
    footerType: "none",
  });
}

function formattedPhone() {
  const digits = state.phone;
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7, 11)}`;
}

function receiptScreen(extraOverlay = "") {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "전체삭제", "0", "←"];
  return paymentCompleteScreen(modalPopup({
    title: "입력하신 휴대폰 번호로 영수증이 발송됩니다.",
    content: `
      <div class="phone-display">${formattedPhone()}</div>
      <div class="keypad">${keys.map((key) => `<button data-action="key" data-key="${key}">${key}</button>`).join("")}</div>
      <div class="terms-preview" tabindex="0"><strong>휴대폰 번호 수집 및 이용 동의</strong><p>영수증 발송을 위해 휴대폰 번호를 수집합니다.</p><p>수집 항목: 휴대폰 번호<br />이용 목적: 카카오톡 영수증 발송<br />보관 기간: 협의/확인 필요</p><span>동의를 거부할 수 있으며, 동의하지 않으면 카카오톡 영수증 발급을 이용할 수 없습니다.</span><span>※ 처리 위탁 범위와 최종 약관 문구는 협의/확인 필요</span></div>
      ${state.formError ? `<p class="form-error">${state.formError}</p>` : ""}`,
    className: "receipt-modal",
    actions: [{ label: `<span class="receipt-action-label"><small>수집/이용 약관에 동의 후</small><strong>영수증 발급</strong></span>`, action: "send-receipt" }],
    secondary: { label: "취소", action: "close-dialog" },
  }) + extraOverlay);
}

function receiptSentScreen() {
  return paymentCompleteScreen(alertPopup({ title: "입력하신 번호로 영수증을 발송했습니다.", action: "receipt-sent-close" }));
}

function alertPopup({ type = "success", title, message = "", action = "close-alert", button = "확인", showCode = type === "error" }) {
  const copy = [title, message].filter(Boolean).join(" ");
  return `<div class="alert-overlay"><div class="alert-popup" role="alertdialog" aria-modal="true"><div class="result-icon ${type === "error" ? "error" : ""}">${type === "error" ? "!" : "✓"}</div><p class="alert-message">${copy}</p>${showCode ? '<span class="alert-code">[오류코드 0000]</span>' : ""}${popupActions([{ label: button, action }], null)}</div></div>`;
}

function ticketDoneScreen() {
  return commonCompleteScreen(state.frontCar, commonToastMessage("세차권 사용을 완료했습니다."));
}

function alertOnCourse(title, message) {
  return courseScreen(alertPopup({ type: "error", title, message }));
}

function alertOnPayment(title, message) {
  return paymentScreen(alertPopup({ type: "error", title, message, action: "close-dialog" }));
}

function autoWelcomeScreen(member = false) {
  if (!member) return introScreen("", { welcome: "<strong>12나 12**</strong><span>고객님, 반갑습니다.</span>" });

  return introScreen("", { welcome: "<strong>12나 12**</strong><span>컴인***님 반갑습니다.</span>" });
}

function autoSingleScreen() {
  return standardScreen({
    title: "",
    reachable: false,
    classes: "auto-ticket-screen auto-single-screen",
    status: kioskInfoBar(),
    footerType: "none",
    content: `
      <div class="auto-ticket-content auto-reference-content">
        <h2 class="auto-reference-title">보유 세차권으로 이용을 시작하겠습니다.</h2>
        <div class="auto-reference-body">
          <aside class="auto-member-panel auto-member-countdown">
            <p class="auto-member-copy"><strong>12나 12**</strong><span>컴인워시**님</span><span>반갑습니다.</span></p>
            <div class="auto-inline-countdown"><div class="auto-countdown" style="--count-progress:${(state.autoSeconds / AUTO_USE_SECONDS) * 100}%"><span class="count-number">${state.autoSeconds}</span></div><p>잠시 후 이용이<br>시작됩니다.</p></div>
          </aside>
          <section class="auto-ticket-side auto-single-ticket-side">
            <span class="auto-ticket-label">사용 예정 세차권</span>
            <div class="auto-ticket-card selected"><span class="auto-ticket-title"><em class="auto-ticket-tag">BASIC</em><strong>컴인클럽 베이직 정기구독 세차권</strong></span></div>
          </section>
        </div>
        <div class="auto-ticket-actions"><button class="large-button light" data-action="choose-course">사용 안함</button><button class="large-button red" data-action="use-ticket">선택한 세차권 사용</button></div>
      </div>`,
  });
}

function autoManualScreen() {
  return standardScreen({
    title: "",
    reachable: false,
    classes: "auto-ticket-screen auto-single-screen auto-manual-screen",
    status: kioskInfoBar(),
    footerType: "none",
    content: `
      <div class="auto-ticket-content auto-reference-content">
        <h2 class="auto-reference-title">보유하신 세차권을 사용하시겠습니까?</h2>
        <div class="auto-reference-body">
          <aside class="auto-member-panel">
            <p class="auto-member-copy"><strong>12나 12**</strong><span>컴인워시**님</span><span>반갑습니다.</span></p>
            <img class="auto-mascot" src="./assets/auto-mascot.png" alt="컴인워시 캐릭터">
          </aside>
          <section class="auto-ticket-side auto-ticket-panel">
            <span class="auto-ticket-label">보유 세차권</span>
            <div class="auto-ticket-card selected"><span class="auto-ticket-title"><em class="auto-ticket-tag">BASIC</em><strong>컴인클럽 베이직 정기구독 세차권</strong></span></div>
          </section>
        </div>
        <div class="auto-ticket-actions"><button class="large-button light" data-action="choose-course">사용 안함</button><button class="large-button red" data-action="use-ticket">선택한 세차권 사용</button></div>
      </div>`,
  });
}

function autoMultipleScreen() {
  const tickets = [
    ["BASIC", "컴인클럽 베이직 정기구독", "유효기간 2026.09.30 23:59 까지"],
    ["BASIC", "베이직 세차 1회 이용권", "유효기간 2026.10.15 23:59 까지"],
    ["DELUXE", "디럭스 세차 1회 이용권", "유효기간 2026.12.31 23:59 까지"],
    ["PREMIUM", "컴인클럽 프리미엄 정기구독", "유효기간 2026.11.30 23:59 까지"],
  ];
  return standardScreen({
    title: "",
    reachable: false,
    classes: "auto-ticket-screen auto-multiple-screen",
    status: kioskInfoBar(),
    footerType: "none",
    content: `
      <div class="auto-ticket-content auto-reference-content">
        <h2 class="auto-reference-title">사용하실 세차권을 선택해 주세요.</h2>
        <div class="auto-reference-body">
          <aside class="auto-member-panel">
            <p class="auto-member-copy"><strong>12나 12**</strong><span>컴인워시**님</span><span>반갑습니다.</span></p>
            <img class="auto-mascot" src="./assets/auto-mascot.png" alt="컴인워시 캐릭터">
          </aside>
          <section class="auto-ticket-side auto-ticket-panel auto-ticket-list-panel">
            <div class="auto-ticket-list">${tickets.map((ticket, i) => `<button class="auto-ticket-card ${state.selectedAutoTicket === i ? "selected" : ""}" data-action="select-auto-ticket" data-ticket="${i}" aria-pressed="${state.selectedAutoTicket === i}"><span class="auto-ticket-radio"></span><span><span class="auto-ticket-title"><em class="auto-ticket-tag">${ticket[0]}</em><strong>${ticket[1]}</strong></span><small>${ticket[2]}</small></span></button>`).join("")}</div>
          </section>
        </div>
        <div class="auto-ticket-actions"><button class="large-button light" data-action="choose-course">사용 안함</button><button class="large-button red" data-action="use-ticket">선택한 세차권 사용</button></div>
      </div>`,
  });
}

function unavailableScreen() {
  return `<div class="system-state-screen unavailable-state"><div class="system-state-content"><div class="unavailable-icon character-placeholder" role="img" aria-label="캐릭터 활용">캐릭터 활용</div><h2>지금은 세차를 이용할 수 없어요</h2></div></div>`;
}

function statePage(title, message) {
  const maintenance = title.includes("점검");
  return `<div class="system-state-screen ${maintenance ? "maintenance-state" : "loading-state"}"><div class="system-state-content">${maintenance ? `<div class="maintenance-icon">캐릭터 활용</div><h2>지금은 점검 중입니다</h2>` : `<div class="state-spinner"></div>${message ? `<h2>${message}</h2>` : ""}`}</div></div>`;
}

function adminHeader(title) {
  return `<header class="admin-head"><strong>COME IN WASH · ${title}</strong><span>v2.0.0 · 온라인</span></header>`;
}

function adminFooter(back = "adminHome") {
  return `<footer class="admin-footer"><button data-admin-go="${back}">← 이전</button><button class="red" data-action="home">고객 화면으로</button></footer>`;
}

function adminLockSeconds() {
  const remaining = Math.ceil((state.adminLockedUntil - Date.now()) / 1000);
  if (remaining > 0) return remaining;
  if (state.adminLockedUntil) {
    state.adminFailureCount = 0;
    state.adminLockedUntil = 0;
    state.adminLockTimer = null;
    writeAdminSecurity();
  }
  return 0;
}

function adminLoginPopup() {
  const lockSeconds = adminLockSeconds();
  const locked = lockSeconds > 0;
  if (locked && !state.adminLockTimer) {
    state.adminLockTimer = window.setTimeout(() => {
      state.adminLockTimer = null;
      if (state.screen === "adminLogin") render();
    }, lockSeconds * 1000 + 100);
  }
  const dots = "●".repeat(state.adminPassword.length) || "비밀번호 입력";
  const messages = {
    incomplete: ["비밀번호를 확인해 주세요.", "숫자 4자리를 모두 입력해 주세요."],
    invalid: ["관리자 인증에 실패했습니다.", `비밀번호를 확인해 주세요. ${Math.max(0, ADMIN_MAX_FAILURES - state.adminFailureCount)}회 남았습니다.`],
    locked: ["관리자 로그인이 잠겼습니다.", `5회 연속 실패했습니다. ${Math.ceil(lockSeconds / 60)}분 후 다시 시도해 주세요.`],
    changed: ["비밀번호가 변경되었습니다.", "새 비밀번호로 다시 로그인해 주세요."],
  };
  const message = messages[state.adminLoginError];
  const notice = message ? alertPopup({ type: state.adminLoginError === "changed" ? "success" : "error", title: message[0], message: message[1], action: "admin-error-close" }) : "";
  return `${modalPopup({
    title: "관리자 로그인",
    className: "admin-login-modal",
    content: `<div class="admin-login-card"><div class="admin-password ${state.adminPassword ? "filled" : ""}">${locked ? "5분 잠금" : dots}</div><div class="admin-keypad">${[1,2,3,4,5,6,7,8,9,"초기화",0,"←"].map((key) => `<button data-action="admin-key" data-key="${key}" ${locked ? "disabled" : ""}>${key}</button>`).join("")}</div></div>`,
    actions: [{ label: "로그인", action: "admin-login", disabled: locked || state.adminPassword.length !== ADMIN_PASSWORD_LENGTH }],
    secondary: { label: "닫기", action: "close-admin-login" },
  })}${notice}`;
}

function adminLoginScreen() {
  return state.adminLoginReturnScreen === "intro" ? introScreen(adminLoginPopup()) : courseScreen(adminLoginPopup());
}

function adminControl(row) {
  const value = state.adminSettings[row.key];
  if (row.type === "toggle") {
    return `<button class="admin-toggle ${value ? "on" : ""}" type="button" role="switch" aria-checked="${value}" data-admin-toggle="${row.key}"><span>${value ? "사용" : "사용 안 함"}</span><i></i></button>`;
  }
  if (row.type === "input") {
    return `<input class="admin-input" type="text" value="${value}" data-admin-field="${row.key}" aria-label="${row.label}" />`;
  }
  if (row.type === "select") {
    if (row.key === "branch") {
      return `<div class="admin-search-select"><input class="admin-input" type="search" value="${value}" data-branch-search aria-label="${row.label}" autocomplete="off" /><div class="admin-search-options" hidden>${row.options.map((option) => `<button type="button" data-branch-option="${option}">${option}</button>`).join("")}</div></div>`;
    }
    return `<select class="admin-input" data-admin-field="${row.key}" aria-label="${row.label}">${row.options.map((option) => `<option ${option === value ? "selected" : ""}>${option}</option>`).join("")}</select>`;
  }
  if (row.type === "action") {
    return `<button class="admin-action ${row.danger ? "danger" : ""}" type="button" data-admin-setting-action="${row.action}">${row.value}<span>›</span></button>`;
  }
  return `<div class="admin-value ${row.status ? "status" : ""}">${row.value}${row.status ? `<span class="status-dot"></span>` : ""}</div>`;
}

function adminRows(rows) {
  return rows.map((row) => `<div class="admin-row"><div class="admin-label"><strong>${row.label}</strong>${row.note ? `<span>${row.note}</span>` : ""}</div>${adminControl(row)}</div>`).join("");
}

function adminSection(title, rows, note = "") {
  return `<section class="admin-section"><div class="admin-section-head"><h3>${title}</h3>${note ? `<p>${note}</p>` : ""}</div><div class="admin-fields">${adminRows(rows)}</div></section>`;
}

function adminDialogPopup(name) {
  if (name === "password-change") {
    return modalPopup({
      title: "관리자 비밀번호 변경",
      content: `<div class="admin-secret-fields"><label>현재 비밀번호<input type="password" inputmode="numeric" maxlength="4" value="${state.adminPasswordChange.current}" data-admin-secret="current" /></label><label>새 비밀번호<input type="password" inputmode="numeric" maxlength="4" value="${state.adminPasswordChange.next}" data-admin-secret="next" /></label><label>새 비밀번호 확인<input type="password" inputmode="numeric" maxlength="4" value="${state.adminPasswordChange.confirm}" data-admin-secret="confirm" /></label>${state.adminDialogError ? `<p class="form-error">${state.adminDialogError}</p>` : ""}<p>숫자 4자리로 입력해 주세요. 변경 후 다시 로그인합니다.</p></div>`,
      actions: [{ label: "비밀번호 변경", action: "admin-confirm", className: "dark" }],
      secondary: { label: "취소", action: "close-dialog" },
    });
  }
  if (name === "delete-all") {
    return modalPopup({
      title: "전체 로그를 삭제하시겠습니까?",
      content: `<div class="admin-secret-fields"><p>저장된 모든 로그가 삭제되며 복구할 수 없습니다.</p><label>관리자 비밀번호 재입력<input type="password" inputmode="numeric" maxlength="4" value="${state.adminReauthPassword}" data-admin-secret="reauth" /></label>${state.adminDialogError ? `<p class="form-error">${state.adminDialogError}</p>` : ""}</div>`,
      actions: [{ label: "전체 로그 삭제", action: "admin-confirm", className: "red" }],
      secondary: { label: "취소", action: "close-dialog" },
    });
  }
  if (name === "action-result") {
    return modalPopup({ title: state.adminResult.title, content: `<p>${state.adminResult.message}</p>`, actions: [{ label: "확인", action: "admin-confirm", className: "dark" }], secondary: null });
  }
  const dialogs = {
    save: ["설정 변경 내용을 저장하시겠습니까?", "입력값 검증 후 변경 내용을 한 번에 적용합니다.", "저장"],
    "save-success": ["설정이 저장되었습니다.", "운영 설정은 즉시 적용되며 연결 설정은 해당 연결을 다시 시작해 반영합니다.", "확인"],
    "save-invalid-discount": ["할인 금액을 입력해 주세요.", "할인 기능을 사용하려면 0원보다 큰 금액이 필요합니다.", "확인"],
    "card-check": ["카드리더 점검을 실행하시겠습니까?", "상호 인증과 무결성 검사를 실행합니다.", "점검 실행"],
    "card-reset": ["카드리더를 초기화하시겠습니까?", "처리 중에는 카드결제를 사용할 수 없습니다.", "초기화"],
    "log-send": ["운영 로그를 전송하시겠습니까?", "저장된 로그를 운영 시스템으로 전송합니다.", "로그 전송"],
    "app-update": ["앱을 수동 업데이트하시겠습니까?", "업데이트 완료 후 앱이 자동으로 다시 시작됩니다.", "업데이트"],
    "app-exit": ["키오스크 앱을 종료하시겠습니까?", "서비스가 중단될 수 있습니다.", "앱 종료"],
    "plc-init": ["PLC를 초기화하시겠습니까?", "PLC 100→0~10→600→744번지를 초기화합니다.", "PLC INIT"],
    "socket-init": ["통신소켓을 초기화하시겠습니까?", "PLC 0~42, 100번지를 초기화합니다.", "초기화"],
    "delete-sent": ["전송 완료 로그를 삭제하시겠습니까?", "삭제한 로그는 복구할 수 없습니다.", "삭제"],
  };
  const dialog = dialogs[name];
  if (!dialog) return "";
  return modalPopup({
    title: dialog[0],
    content: `<p>${dialog[1]}</p>`,
    actions: [{ label: dialog[2], action: "admin-confirm", className: name.includes("delete") || name.includes("init") || name === "app-exit" ? "red" : "dark" }],
    secondary: name === "save-success" || name === "save-invalid-discount" ? null : { label: name === "app-update" ? "나중에" : "취소", action: "close-dialog" },
  });
}

function adminHomeScreen() {
  const kioskSections = [
    adminSection("기본 설정", [
      { label: "운영 지점", type: "select", key: "branch", options: ["강남본점", "직영점 A", "가맹점 B"] },
      { label: "연결 세차기", type: "select", key: "washer", options: ["POSEIDON-01", "POSEIDON-02"] },
      { label: "기계명", type: "input", key: "machineName" },
      { label: "기계 종류", type: "select", key: "machineType", options: ["터널형", "노터치형"] },
      { label: "PLC IP", type: "input", key: "plcIp" },
    ]),
    adminSection("결제 설정", [
      { label: "CAT ID", type: "input", key: "catId" },
      { label: "VAN TID", type: "input", key: "vanTid" },
      { label: "PG사", type: "select", key: "pg", options: ["NICE", "KSNET"] },
    ], "현금 사용금지는 가로형 전용이며 현재 세로형에는 노출하지 않습니다."),
    adminSection("운영 설정", [
      { label: "최근 이용 코스 안내", type: "toggle", key: "recentCourse" },
    ]),
    adminSection("할인 설정", [
      { label: "주유 세차 할인권 사용", type: "toggle", key: "discountEnabled", note: "사용 안 함이면 고객 할인권 등록 팝업 미노출" },
      ...(state.adminSettings.discountEnabled ? [
        { label: "할인 금액", type: "input", key: "discountAmount", note: "필수 · 기본값 2,000원 · 미입력 또는 0원은 저장 불가" },
      ] : []),
    ], "서버 할인금액이 없거나 0원 이하이면 설정된 할인 금액을 적용합니다."),
    adminSection("관리 기능", [
      { label: "카드리더 상호 인증·무결성 검사", type: "action", action: "card-check", value: "점검 실행" },
      { label: "카드리더 리셋", type: "action", action: "card-reset", value: "초기화", danger: true },
      { label: "관리자 비밀번호", type: "action", action: "password-change", value: "비밀번호 변경" },
      { label: "운영 로그", type: "action", action: "log-send", value: "로그 전송" },
      { label: "앱 버전", type: "value", value: "2.0.0" },
      { label: "앱 업데이트", type: "action", action: "app-update", value: "수동 업데이트" },
      { label: "키오스크 앱", type: "action", action: "app-exit", value: "앱 종료", danger: true },
    ]),
  ];
  const systemSections = [
    adminSection("운영·영수증", [
      { label: "카드 영수증 발급", type: "toggle", key: "cardReceipt" },
      { label: "세차 종료", type: "toggle", key: "washShutdown", note: "외부 선결제 금지와의 우선순위는 협의/확인 필요" },
      { label: "로그 저장", type: "toggle", key: "logSave" },
    ], "현금 영수증은 가로형 전용이며 현재 세로형에는 노출하지 않습니다."),
    adminSection("PLC·통신", [
      { label: "PLC 주소", type: "input", key: "plcAddress" },
      { label: "PLC 상태", type: "value", value: "정상", status: true },
      { label: "PLC 제어", type: "action", action: "plc-init", value: "PLC INIT", danger: true, note: "100→0~10→600→744번지 초기화" },
      { label: "통신 상태", type: "value", value: "정상", status: true },
      { label: "통신소켓", type: "action", action: "socket-init", value: "초기화", danger: true, note: "0~42, 100번지 초기화" },
    ]),
    adminSection("로그 관리", [
      { label: "전송 완료 로그", type: "action", action: "delete-sent", value: "삭제", danger: true },
      { label: "전체 로그", type: "action", action: "delete-all", value: "전체 삭제", danger: true },
    ], "전송 완료 로그는 1회 확인, 전체 로그는 관리자 비밀번호 재입력 후 삭제합니다."),
    adminSection("차량번호 자동인식", [
      { label: "차량번호 자동인식", type: "toggle", key: "lprEnabled" },
      { label: "카메라 연결", type: "value", value: "정상", status: true },
      { label: "마지막 인식", type: "value", value: "12나 12**" },
      { label: "연결 상태", type: "value", value: "정상", status: true },
    ], "독립 메뉴나 탭 없이 시스템 설정에 포함합니다."),
  ];
  const config = state.adminTab === "kiosk"
    ? { title: "키오스크 설정", sections: kioskSections }
    : { title: "시스템 설정", sections: systemSections };
  const tabs = [["kiosk", "키오스크 설정"], ["system", "시스템 설정"]];
  const kioskFooter = `<footer class="admin-footer"><button data-admin-go="course">이전</button><button class="red" data-admin-setting-action="save">설정 저장</button></footer>`;
  const titleRow = `<div class="admin-title-row"><h2 class="admin-title">${config.title}</h2>${state.adminTab === "system" ? `<button class="admin-save" data-admin-setting-action="save">저장</button>` : ""}</div>`;
  return `<div class="admin-screen"><header class="admin-head"><strong>관리자 설정</strong><span>온라인</span></header><main class="admin-content"><div class="admin-tabs">${tabs.map(([id, label]) => `<button class="${state.adminTab === id ? "active" : ""}" data-admin-tab="${id}">${label}</button>`).join("")}</div>${titleRow}<div class="admin-sections">${config.sections.join("")}</div></main>${state.adminTab === "kiosk" ? kioskFooter : adminFooter("course")}${state.adminDialog ? adminDialogPopup(state.adminDialog) : ""}</div>`;
}

const renderers = {
  intro: introScreen,
  course: courseScreen,
  help: helpScreen,
  heightSettings: heightSettingsScreen,
  discountScan: discountRegistrationScreen,
  discountUse: discountUseScreen,
  discountApplied: discountAppliedScreen,
  payment: paymentScreen,
  paymentMobileApplied: () => paymentAppliedScreen("mobile"),
  paymentPaperApplied: () => paymentAppliedScreen("paper"),
  paymentDiscountMobileApplied: () => paymentScreen("", "mobile", true),
  cardPay: cardPayScreen,
  cardPayExternal: () => cardPayScreen(externalPaymentPopup()),
  appPay: () => scanScreen("app", "complete-payment", "컴인워시 앱 결제 승인 완료"),
  mobileVoucher: () => scanScreen("mobile", "voucher-use", "상품권 인식 성공"),
  voucherUse: mobileVoucherUseScreen,
  voucherAdditional: mobileVoucherAdditionalScreen,
  voucherError: () => paymentScreen(alertPopup({ type: "error", title: "[오류-E0006][쿠폰인증] 이미 사용된 쿠폰입니다.", action: "close-dialog", showCode: false })),
  paperCoupon: () => scanScreen("paper", "paper-use", "쿠폰 인식 성공"),
  paperUse: paperCouponUseScreen,
  paperAdditional: paperCouponAdditionalScreen,
  paperError: () => alertOnPayment("할인 쿠폰을 사용할 수 없습니다.", "쿠폰의 사용 조건을 확인해 주세요."),
  paymentComplete: () => paymentCompleteScreen("", false),
  paymentCompleteWaiting: () => paymentCompleteScreen("", true),
  commonComplete: () => commonCompleteScreen(false),
  commonCompleteWaiting: () => commonCompleteScreen(true),
  receipt: receiptScreen,
  receiptError: () => receiptScreen(alertPopup({ type: "error", title: "영수증을 발송할 수 없습니다.", message: "휴대폰 번호를 확인해 주세요.", action: "receipt-edit", button: "확인", showCode: false })),
  receiptSent: receiptSentScreen,
  ticketDone: ticketDoneScreen,
  autoWelcomeNonmember: () => autoWelcomeScreen(false),
  autoWelcomeMember: () => autoWelcomeScreen(true),
  autoSingle: autoSingleScreen,
  autoManual: autoManualScreen,
  autoMultiple: autoMultipleScreen,
  autoError: () => alertOnCourse("세차권 사용에 실패했습니다.", "잠시 후 다시 시도해 주세요."),
  unavailable: unavailableScreen,
  loading: () => statePage("", ""),
  maintenance: () => statePage("현재 점검 중입니다.", "잠시 후 다시 이용해 주세요."),
  error: () => courseScreen(alertPopup({ type: "error", title: "오류가 발생했습니다.", message: "잠시 후 다시 시도해 주세요." })),
  commonToast: commonToastScreen,
  adminLogin: adminLoginScreen,
  adminHome: () => { state.adminTab = "kiosk"; return adminHomeScreen(); },
  adminSystem: () => { state.adminTab = "system"; return adminHomeScreen(); },
};

console.assert(renderers.discountScan && renderers.discountUse && screenMeta.discountUse, "세차 할인권 등록·사용 화면 연결을 확인해 주세요.");

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
  if (counter) counter.querySelector("b").textContent = String(SCREEN_TIMEOUT_SECONDS);
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

document.addEventListener("click", (event) => {
  if (!event.target.closest('[data-action^="timeout-"]')) resetScreenTimeout();
  const screenLink = event.target.closest("[data-screen-link]");
  if (screenLink) return go(screenLink.dataset.screenLink);

  const scenarioButton = event.target.closest("[data-scenario]");
  if (scenarioButton) return scenario(scenarioButton.dataset.scenario);

  const heightButton = event.target.closest("[data-height]");
  if (heightButton && !heightButton.dataset.action) {
    state.height = heightButton.dataset.height;
    return render();
  }

  const adminTabButton = event.target.closest("[data-admin-tab]");
  if (adminTabButton) {
    return go(adminTabButton.dataset.adminTab === "system" ? "adminSystem" : "adminHome", false);
  }

  const branchOption = event.target.closest("[data-branch-option]");
  if (branchOption) {
    state.adminSettings.branch = branchOption.dataset.branchOption;
    return render();
  }

  const branchSearch = event.target.closest("[data-branch-search]");
  if (branchSearch) {
    branchSearch.parentElement.querySelector(".admin-search-options").hidden = false;
    return;
  }

  const adminToggleButton = event.target.closest("[data-admin-toggle]");
  if (adminToggleButton) {
    const key = adminToggleButton.dataset.adminToggle;
    state.adminSettings[key] = !state.adminSettings[key];
    return render();
  }

  const adminSettingButton = event.target.closest("[data-admin-setting-action]");
  if (adminSettingButton) {
    const action = adminSettingButton.dataset.adminSettingAction;
    const amount = Number(String(state.adminSettings.discountAmount).replace(/[^0-9]/g, ""));
    state.adminDialogError = "";
    if (action === "password-change") state.adminPasswordChange = { current: "", next: "", confirm: "" };
    if (action === "delete-all") state.adminReauthPassword = "";
    state.adminDialog = action === "save" && state.adminSettings.discountEnabled && amount <= 0 ? "save-invalid-discount" : action;
    return render();
  }

  const adminButton = event.target.closest("[data-admin-go]");
  if (adminButton) {
    if (state.screen.startsWith("admin") && adminButton.dataset.adminGo === "course") {
      state.adminAuthenticated = false;
      state.adminSettings = { ...state.savedAdminSettings };
    }
    return go(adminButton.dataset.adminGo);
  }

  const actionButton = event.target.closest("[data-action]");
  if (actionButton) handleAction(actionButton);
});

document.addEventListener("change", (event) => {
  const field = event.target.closest("[data-admin-field]");
  if (!field) return;
  state.adminSettings[field.dataset.adminField] = field.value;
  if (field.dataset.adminField === "branch") render();
});

document.addEventListener("input", (event) => {
  const branchSearch = event.target.closest("[data-branch-search]");
  if (branchSearch) {
    const query = branchSearch.value.trim();
    const options = branchSearch.parentElement.querySelector(".admin-search-options");
    options.hidden = false;
    options.querySelectorAll("[data-branch-option]").forEach((option) => {
      option.hidden = !option.textContent.includes(query);
    });
    return;
  }
  const secret = event.target.closest("[data-admin-secret]");
  if (!secret) return;
  const value = secret.value.replace(/\D/g, "").slice(0, ADMIN_PASSWORD_LENGTH);
  secret.value = value;
  if (secret.dataset.adminSecret === "reauth") state.adminReauthPassword = value;
  else state.adminPasswordChange[secret.dataset.adminSecret] = value;
  state.adminDialogError = "";
});

if (!embedMode) {
  const select = document.getElementById("screenSelect");
  Object.entries(screenMeta).forEach(([value, meta]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = meta.label;
    select.appendChild(option);
  });
  select.addEventListener("change", (event) => resetScenario(event.target.value));
  document.getElementById("voucherCaseControl").addEventListener("click", (event) => {
    const button = event.target.closest("[data-voucher-case]");
    if (!button) return;
    state.voucherAdditionalPayment = button.dataset.voucherCase === "additional";
    const kind = state.screen.startsWith("voucher") ? "voucher" : state.screen.startsWith("paper") ? "paper" : "";
    if (kind) go(voucherCaseScreen(kind), false);
    else render();
  });
  document.getElementById("washStatusControl").addEventListener("click", (event) => {
    const button = event.target.closest("[data-wash-status]");
    if (!button) return;
    state.communicationError = button.dataset.washStatus === "error";
    state.frontCar = button.dataset.washStatus === "busy";
    if (state.screen.startsWith("paymentComplete")) go(completionRoute("payment"), false);
    else if (state.screen.startsWith("commonComplete")) go(completionRoute("auto"), false);
    else render();
  });
  window.addEventListener("resize", fitKiosk);
} else {
  document.body.classList.add("embed");
}

render();
if (state.screen === "autoSingle" && !embedMode) startCountdown();
