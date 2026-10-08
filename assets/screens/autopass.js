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
            <img class="auto-mascot" src="${CIW_ASSETS['assets/auto-mascot.png']}" alt="컴인워시 캐릭터">
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
            <img class="auto-mascot" src="${CIW_ASSETS['assets/auto-mascot.png']}" alt="컴인워시 캐릭터">
          </aside>
          <section class="auto-ticket-side auto-ticket-panel auto-ticket-list-panel">
            <div class="auto-ticket-list">${tickets.map((ticket, i) => `<button class="auto-ticket-card ${state.selectedAutoTicket === i ? "selected" : ""}" data-action="select-auto-ticket" data-ticket="${i}" aria-pressed="${state.selectedAutoTicket === i}"><span class="auto-ticket-radio"></span><span><span class="auto-ticket-title"><em class="auto-ticket-tag">${ticket[0]}</em><strong>${ticket[1]}</strong></span><small>${ticket[2]}</small></span></button>`).join("")}</div>
          </section>
        </div>
        <div class="auto-ticket-actions"><button class="large-button light" data-action="choose-course">사용 안함</button><button class="large-button red" data-action="use-ticket">선택한 세차권 사용</button></div>
      </div>`,
  });
}


// 최신 UI 등록. init.js에서 기존 초기화 이후 한 번 호출한다.
function applyAutopassScreens() {
function welcomeV07(member) {
  return `<div class="v07-welcome ${member?'member':''}">${courseStatusBar()}<p class="v07-welcome-brand">WEL<b>COME IN WASH</b></p><h2>${member?'이용하실 화면 높이를 선택해 주세요.':'차종을 선택하고<br>세차를 시작하세요'}</h2>${member?'<p class="v07-welcome-description">차량에 맞는 화면 높이를 선택하면 바로 이용을 시작합니다.</p>':''}<div class="v07-welcome-badge"><strong>12나 12**</strong><span>${member?'컴인***님 반갑습니다.':'고객님, 반갑습니다.'}</span></div><div class="v07-welcome-choices"><button data-action="start" data-height="high">${vehicleIcon('suv')}<strong>높은 화면으로 시작</strong></button><button data-action="start" data-height="low">${vehicleIcon('sedan')}<strong>기본 화면으로 시작</strong></button></div><button class="v07-welcome-qr" data-action="v07-qr">${qrMini()}<span><strong>앱에서 세차권을 미리 구매하셨나요?</strong><span>앱의 세차권 QR을 바코드 인식기에 바로 인식해 주세요.</span></span></button></div>`;
}

renderers.autoWelcomeNonmember = () => welcomeV07(false);

renderers.autoWelcomeMember = () => welcomeV07(true);

}
