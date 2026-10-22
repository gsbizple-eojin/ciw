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



// 화면설계서 (KIOSK)_v0.3_Design · 지정된 다섯 화면의 원본 자산.
function designAsset(name) { return CIW_ASSETS[name]; }

function designBackground(kind) {
  return `<div class="design-background" aria-hidden="true">${[2,3,0,1].map(index => `<span class="design-glow ${index > 1 ? 'upper' : 'lower'} ${index % 2 ? 'light' : ''}"><img src="${designAsset(`v03-${kind}-imgElement${index || ''}`)}" alt="" /></span>`).join('')}${kind === 'intro' ? `<img class="design-texture" src="${designAsset('v03-intro-imgRectangle39592066')}" alt="" />` : ''}</div>`;
}

function designHeader(timer = false, kind = 'course') {
  const status = state.communicationError ? '통신에러' : state.frontCar ? '앞차 세차 중' : '대기중';
  return `<header class="design-header"><div class="design-identity"><strong>${state.adminSettings.branch}</strong><i></i><strong>${state.adminSettings.machineName.replace(/-/g,' ')}</strong></div><span class="design-status">${status}</span>${timer ? `<span class="screen-timeout design-timer" style="--timer-elapsed:-${SCREEN_TIMEOUT_SECONDS-state.screenTimeoutSeconds}s"><img class="design-timer-track" src="${designAsset(`v03-${kind}-imgTrackStroke`)}" alt="" /><svg preserveAspectRatio="none" overflow="visible" class="design-timer-ring" aria-hidden="true" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M24 1.6C11.6288 1.6 1.6 11.6288 1.6 24C1.6 36.3712 11.6288 46.4 24 46.4C36.3712 46.4 46.4 36.3712 46.4 24C46.4 14.2957 40.1513 5.69512 30.922 2.69633" pathLength="1" stroke="white" stroke-width="3.2" stroke-linecap="round" stroke-dasharray="0.85 1"/>
</svg><b>${state.screenTimeoutSeconds}</b></span>` : ''}</header>`;
}

function designDisplay(kind = 'course') {
  return `<section class="design-display" aria-label="컴인워시 광고"><img class="design-display-image" src="${designAsset(`v03-${kind}-imgSample01`)}" alt="" /><span></span><img class="design-display-logo" src="${designAsset(`v03-${kind}-imgLogo`)}" alt="COME IN WASH" /></section>`;
}

function designPaymentFooter(kind = 'payment') {
  return `<footer class="design-payment-footer"><button data-action="back"><img src="${designAsset(`v03-${kind}-imgIcBack24Px`)}" alt="" />이전으로</button><button data-action="choose-course">코스 재선택</button></footer>`;
}

function designAppBanner(kind) {
  const main = kind === 'intro';
  const width = main ? 200 : 140, height = main ? 200 : 168;
  // SVG image로 원본 마스크를 적용해 file:// 실행 시 CSS 마스크의 CORS 제한을 피한다.
  const phone = `<svg class="design-phone-art" width="${width}" height="${height}" aria-hidden="true"><defs><mask id="design-phone-mask-${kind}" maskUnits="userSpaceOnUse" x="0" y="0" width="${width}" height="${height}" style="mask-type:alpha"><image href="${designAsset(`v03-${kind}-imgShadow`)}" width="${width}" height="${height}" /></mask><linearGradient id="design-phone-shadow-${kind}" x1="0" x2="0" y1="0" y2="1"><stop stop-color="black" stop-opacity="${main ? .5 : .6}" /><stop offset="1" stop-color="black" stop-opacity="${main ? .1 : .2}" /></linearGradient></defs><g mask="url(#design-phone-mask-${kind})"><rect x="${main ? 29 : 20}" y="${main ? 62 : 57}" width="${main ? 118 : 90}" height="${main ? 178 : 163}" rx="12" fill="url(#design-phone-shadow-${kind})" /><image href="${designAsset(main ? 'v03-intro-imgQrL' : 'v03-course-imgQrS')}" x="${main ? 36 : 25}" y="${main ? 28 : 27}" width="${main ? 128 : 104}" height="${main ? 233 : 190}" /></g></svg>`;
  return `<button class="design-app-banner ${main ? 'main' : 'sub'}" data-action="v07-qr"><img class="design-banner-bg" src="${designAsset(main ? 'v03-intro-imgAppBannerBg' : 'v03-course-imgAppBannerBgGray')}" alt="" />${phone}<span class="design-banner-copy"><strong>앱에서 세차권을 미리 구매하셨나요?</strong><span>${main ? '앱에서 세차권을 미리 구매하신 고객님은 바로<br>QR 인식기에 ' : '앱에서 세차권을 미리 구매하신 고객님은 바로 QR 인식기에<br>'}<b>세차권 QR코드를 스캔</b>하세요</span></span></button>`;
}

function applyIntroScreens() {
  introScreen = function(overlay = '', options = {}) {
    if (state.screen !== 'intro') return v06Intro(overlay, options);
    const choice = high => `<button class="design-vehicle" data-action="start" data-height="${high ? 'high' : 'low'}"><span class="design-vehicle-glass"><strong>${high ? 'SUV / RV / 대형차량' : '일반승용차 / 소형차량'}</strong><small>화면을 ${high ? '높게' : '낮게'} 조정합니다.</small></span><img src="${designAsset(high ? 'v03-intro-imgTypeSuvSizeLarge' : 'v03-intro-imgTypeSedanSizeLarge')}" alt="${high ? 'SUV' : 'SEDAN'}" /></button>`;
    return `<div class="ciw-design design-intro" data-design-node="887:11933">${designBackground('intro')}<header class="design-intro-info">${state.adminSettings.branch} / ${state.adminSettings.machineName.replace(/-/g,' ')} / ${state.communicationError?'통신에러':state.frontCar?'앞차 세차 중':'대기중'}</header><main class="design-intro-body"><header><h2>차종을 선택해 주세요</h2><p>선택한 차종에 따라 키오스크 화면 높이가 변경됩니다.</p></header><div class="design-intro-content"><div class="design-vehicles">${choice(true)}${choice(false)}</div>${designAppBanner('intro')}</div><p class="design-welcome-brand">WEL<b>COME IN WASH</b></p></main>${adminEntryHotspot()}${overlay}</div>`;
  };
  renderers.intro = () => introScreen();
}
