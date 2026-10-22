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
  return courseScreen(`<div class="design-dialog-layer"><div class="design-dialog-dim"></div><section class="design-discount-dialog" role="dialog" aria-modal="true" aria-labelledby="discountDialogTitle"><div class="design-discount-copy"><h2 id="discountDialogTitle">주유 세차 할인권을 사용하시겠습니까?</h2><p>5만원 이상 주유 시 영수증 하단에<br>세차 할인권이 발급됩니다.</p></div><div class="design-discount-actions"><button data-action="discount-use">사용</button><button data-action="skip-discount">사용 안함</button></div></section></div>`);
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
  '알칼리세제 › 고압세척 › 스노우폼 › 초고압세척 › 강풍건조',
  '하부세차 › 알칼리세제 › 고압세척 › 스노우폼 › 초고압세척 › 강풍건조',
  '하부세차 › 알칼리세제 › 고압세척 › 스노우폼 › 딥클렌징 › 초고압세척 › 왁스코팅 › 강풍건조',
  '하부세차 › 알칼리세제 › 고압세척 › 스노우폼 › 초고압세척 › 딥클렌징 › 초고압세척 › 왁스코팅 › 강풍건조',
];

// 최신 UI 등록. init.js에서 기존 초기화 이후 한 번 호출한다.
function applyCourseScreens() {
// Figma test / screen/KIO-CRS-001 · 557:17026
courseScreen = function(overlay = '') {
  if (!['course','courseInfo','discountScan','qrMismatch','commonToast','timeout'].includes(state.screen)) return v06Course(overlay);
  const descriptions = {ultimate:'최고급 풀코스 세차 코스', premium:'베이직 + 하부 + 중성 + 왁스 코팅', deluxe:'베이직 + 하부 세차 추가', basic:'컴인워시 기본 세차코스'};
  const cards = ['ultimate','premium','deluxe','basic'].map(id => {
    const index = courses.findIndex(course => course.id === id);
    const course = courses[index];
    return `<button class="design-course-card ${id}" data-action="select-course" data-course="${id}"><span class="design-course-card-top"><span class="design-course-name"><strong>${course.name}</strong><small>${courseEnglish[index]}</small></span><span class="design-course-price"><b>${course.price.toLocaleString('ko-KR')}</b>원</span></span><span class="design-course-card-bottom"><span class="design-course-description">${descriptions[id]}</span>${id === 'ultimate' ? '<span class="design-recent-tag">최근이용</span>' : ''}</span></button>`;
  }).join('');
  return `<div class="ciw-design design-course" data-design-node="557:17026">${testBackground('course')}${designDisplay()}${designHeader(true)}<main class="design-course-body"><header><h2>세차 코스를 선택해 주세요</h2><button class="design-course-info" data-action="course-info"><img src="${testAsset('8563-imgIcon')}" alt="" />세차 코스 안내</button></header><div class="design-course-cards">${cards}</div>${testCourseBanner()}</main>${testFooter(true)}${adminEntryHotspot()}${overlay}</div>`;
};
function courseInfoScreen() {
  const processes=courseProcesses.map(p=>p.split(' › '));
  return courseScreen(`<div class="test-course-info-dim"></div><section class="test-course-info" role="dialog" aria-modal="true" aria-labelledby="courseInfoTitle" data-design-node="543:9511"><header><h2 id="courseInfoTitle">세차 코스 안내</h2><button data-action="course-info-close" aria-label="닫기"><img src="${testAsset('9511-imgIcClose24Px')}" alt="" /></button></header><div class="test-course-info-list">${courses.map((c,i)=>`<article><h3>${c.name}<small>${courseEnglish[i]}</small><b>${formatPrice(c.price)}</b></h3><div class="test-processes">${processes[i].map((step,j)=>`<span><b class="${['하부세차','딥클렌징','왁스코팅'].includes(step)?'highlight':''}">${step}</b>${j<processes[i].length-1?`<img src="${testAsset('9511-imgIcArrowRight24Px')}" alt="" />`:''}</span>`).join('')}</div></article>`).join('')}</div><footer><button class="v07-red" data-action="course-info-close">닫기</button></footer></section>`);
}


renderers.course = () => courseScreen();

renderers.courseInfo = courseInfoScreen;

}

function testCourseBanner() {
  return `<button class="test-course-banner" data-action="v07-qr"><img class="test-banner-bg" src="${testAsset('8563-imgAppBannerBgGrayCharacter')}" alt="" /><svg class="test-banner-character" width="168" height="168" aria-hidden="true"><defs><mask id="test-banner-mask" style="mask-type:alpha"><image href="${testAsset('course-character-mask')}" width="168" height="168" /></mask></defs><image href="${testAsset('course-character')}" y="19" width="168" height="201" mask="url(#test-banner-mask)" /></svg><span>앱에서 세차권을 미리 구매하신 고객님은 바로<br>QR 인식기에 세차권 QR코드를 스캔하세요</span></button>`;
}
