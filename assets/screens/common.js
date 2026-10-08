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


function commonToastScreen() {
  return courseScreen(commonToastMessage("처리가 완료되었습니다."));
}


function unavailableScreen() {
  return `<div class="system-state-screen unavailable-state"><div class="system-state-content"><div class="unavailable-icon character-placeholder" role="img" aria-label="캐릭터 활용">캐릭터 활용</div><h2>지금은 세차를 이용할 수 없어요</h2></div></div>`;
}


function statePage(title, message) {
  const maintenance = title.includes("점검");
  return `<div class="system-state-screen ${maintenance ? "maintenance-state" : "loading-state"}"><div class="system-state-content">${maintenance ? `<div class="maintenance-icon">캐릭터 활용</div><h2>지금은 점검 중입니다</h2>` : `<div class="state-spinner"></div>${message ? `<h2>${message}</h2>` : ""}`}</div></div>`;
}


// 최신 UI 등록. init.js에서 기존 초기화 이후 한 번 호출한다.
function applyCommonScreens() {
function helpV07() {
  const steps=[['세차권 구매','키오스크에서 원하는 코스를 선택하고<br>결제를 진행해 주세요.','help-imgIconTicket.svg'],['입장','문이 열리면 세차장 안으로 천천히 진입해 주세요. (카스토퍼를 밟지 않도록 주의)','help-imgIconStep2.svg'],['정차','유도등이 ‘진입’에서 ‘정지’로 바뀌면 정차 후 기어를 ‘P’로 유지해 주세요.','help-imgIconStep3.svg'],['세차 진행','세차가 끝날 때까지 사이드미러는 접은 상태로 대기해 주세요.','help-imgAssetStep4Washing.png'],['완료 및 이동','출구가 열리면 천천히 출차한 뒤 드라잉 존으로 이동해 잔여 물기를 닦아 주세요.','help-imgAssetStep5Complete.png']];
  const warnings=['높이 2.1m 이상 또는 길이 5.6m 이상 차량은 이용할 수 없습니다.','차량 진입 시 카스토퍼를 밟거나 넘어가지 마세요.','세차 시작 전 창문과 선루프를 모두 닫아 주세요.','에어컨·히터 사용 시 ‘내기 순환’ 모드를 선택해 주세요.','기어를 반드시 ‘P’로 유지해 주세요.','물기 제거용 타월 제공 여부는 지점에 따라 다를 수 있습니다.'];
  return `<div class="v07-help-dim"></div><section class="v07-help" role="dialog" aria-modal="true" aria-labelledby="helpTitle"><header><span class="v07-info-badge"><img src="${v07Asset('help-imgIconInfo.svg')}" alt="" /></span><h2 id="helpTitle">컴인워시 이용 안내</h2><button data-action="back" aria-label="닫기"><img src="${v07Asset('help-imgIconCloseX.svg')}" alt="" /></button></header><div class="v07-help-steps"><h3>컴인워시 이용 방법</h3>${steps.map(([title,desc,icon],i)=>`<article><span class="v07-help-step-icon"><img src="${v07Asset(icon)}" alt="" /></span><div><h4><b>${i+1}</b>${title}</h4><p>${desc}</p>${i===0?`<aside><img src="${v07Asset('help-imgAssetAppTicketQr.png')}" alt="" /><p><strong>앱에서 세차권을 구매하셨나요?</strong><br>앱 화면의 세차권 QR을<br>QR 인식기에 바로 스캔하세요.</p></aside>`:''}</div></article>`).join('')}</div><section class="v07-help-notice"><h3><img src="${v07Asset('help-imgAssetCaution.png')}" alt="" />이용 전 꼭 확인해 주세요</h3><ul>${warnings.map(x=>`<li>${x}</li>`).join('')}</ul></section><section class="v07-help-video"><img src="${v07Asset('help-imgQrVideoGuide.svg')}" alt="컴인워시 이용 안내 영상 QR" /><div><h3>컴인워시 이용 안내 영상</h3><p>휴대폰 카메라로 QR을 스캔하면<br>컴인워시 이용 안내 영상으로 연결됩니다.</p></div></section><footer><button class="v07-red" data-action="back">닫기</button></footer></section>`;
}

renderers.help = helpV07;

renderers.networkError = () => `<div class="v07-network"><div class="v07-network-icon" role="img" aria-label="캐릭터 활용 자리 표시"><span>캐릭터 활용</span></div><h2>네트워크에 연결할 수 없어요</h2></div>`;

renderers.qrMismatch = () => v06Intro(modalPopup({title:'인식된 세차권의 코스 정보가<br>현재 선택된 코스와 일치하지 않습니다.',content:'<p>그래도 사용하시겠습니까?<br><br>인식된 세차권 코스 : <strong>스탠다드</strong></p>',className:'qr-guide-modal',actions:[{label:'세차권 사용',action:'v07-mismatch-use'}],secondary:{label:'사용 안함',action:'qr-mismatch-close'}}));

}
