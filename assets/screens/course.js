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


const courseEnglish = ['Basic', 'Deluxe', 'Premium', 'Ultimate'];
const courseProcesses = [
  '고압세척 › 알칼리세제 › 스노우폼 › 초고압세척 › 건조',
  '하부세차 › 고압세척 › 알칼리세제 › 스노우폼 › 초고압세척 › 건조',
  '하부세차 › 고압세척 › 알칼리세제 › 중성세제 › 스노우폼 › 초고압세척 › 왁스코팅제 › 건조',
  '하부세차 › 고압세척 › 알칼리세제 › 스노우폼 › 초고압세척 › 중성세제 › 초고압세척 › 왁스코팅제 › 건조',
];

// 최신 UI 등록. init.js에서 기존 초기화 이후 한 번 호출한다.
function applyCourseScreens() {
// Figma Design/screen/KIO-CRS-001 · 674:4771
courseScreen = function(overlay = '') {
  if (state.screen !== 'course' && state.screen !== 'courseInfo') return v06Course(overlay);
  const descriptions = {ultimate:'최고급 풀코스 세차 코스', premium:'베이직 + 하부 + 중성 + 왁스 코팅', deluxe:'베이직 + 하부 세차 추가', basic:'컴인워시 기본 세차코스'};
  const cards = ['ultimate','premium','deluxe','basic'].map(id => {
    const index = courses.findIndex(course => course.id === id);
    const course = courses[index];
    return `<button class="design-course-card ${id}" data-action="select-course" data-course="${id}"><span class="design-course-card-top"><span class="design-course-name"><strong>${course.name}</strong><small>${courseEnglish[index]}</small></span><span class="design-course-price"><b>${course.price.toLocaleString('ko-KR')}</b>원</span></span><span class="design-course-description">${descriptions[id]}</span></button>`;
  }).join('');
  return `<div class="ciw-design design-course" data-design-node="674:4771">${designBackground('course')}<section class="design-display" aria-label="컴인워시 광고"><img class="design-display-image" src="${designAsset('design-course-imgSample01')}" alt="" /><span></span><img class="design-display-logo" src="${designAsset('design-course-imgLogo')}" alt="COME IN WASH" /></section>${designHeader(true)}<main class="design-course-body"><header><h2>세차 코스를 선택해 주세요</h2><button class="design-course-info" data-action="course-info"><img src="${designAsset('design-course-imgIcon')}" alt="" />세차 코스 안내</button></header><div class="design-course-cards">${cards}</div>${designAppBanner('course')}</main><footer class="design-course-footer"><button data-action="height-select"><img src="${designAsset('design-course-imgIcLowScreen')}" alt="" />화면 높이</button><button data-action="help"><img src="${designAsset('design-course-imgIcFilledInfo24Px')}" alt="" />이용 안내</button></footer>${adminEntryHotspot()}${overlay}</div>`;
};
function courseInfoScreen() {
  return courseScreen(`<div class="v07-course-info-dim"></div><section class="v07-course-info" role="dialog" aria-modal="true" aria-labelledby="courseInfoTitle"><header><h2 id="courseInfoTitle">세차 코스 정보</h2><button data-action="course-info-close" aria-label="닫기">×</button></header>${courses.map((c,i)=>`<article><h3>${c.name} <small>${courseEnglish[i]}</small><b>${formatPrice(c.price)}</b></h3><p>${courseProcesses[i]}</p></article>`).join('')}<button class="v07-red" data-action="course-info-close">닫기</button></section>`);
}

renderers.course = () => courseScreen();

renderers.courseInfo = courseInfoScreen;

}
