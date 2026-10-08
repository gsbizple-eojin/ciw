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

if (state.screen === "autoSingle" && !embedMode) startCountdown();



installValidation();

const v07Asset = (name) => CIW_ASSETS[`assets/figma-v07/${name}`];
const v06Intro = introScreen;
const v06Course = courseScreen;
const v06Payment = paymentScreen;
const v06Scan = scanScreen;
const v06Completion = completionContent;
const v06AdminDialog = adminDialogPopup;
state.adminCredential = '1234';
Object.assign(state.adminSettings, {machineType:'포세이돈2 울트라', discountCondition:'0', cashEnabled:false, cameraId:'CAM 01', cameraIp:'192.168.00.000', autoUse:true});
state.savedAdminSettings = {...state.adminSettings};
NO_SCREEN_TIMEOUT.add('networkError');
NO_SCREEN_TIMEOUT.add('cashPay');
NO_SCREEN_TIMEOUT.add('adminSaveConfirm');


applyIntroScreens();
applyCourseScreens();
applyPaymentScreens();
applyCompletionScreens();
applyAutopassScreens();
applyCommonScreens();
applyAdminScreens();
applyV07Actions();
// 두 HTML이 공유하는 카탈로그로 선택 목록을 한 번만 만든다.
const v07Select=document.getElementById('screenSelect');
if(v07Select){v07Select.innerHTML=Object.entries(screenMeta).map(([id,meta])=>`<option value="${id}">${meta.label}</option>`).join('');v07Select.value=state.screen;}
render();
