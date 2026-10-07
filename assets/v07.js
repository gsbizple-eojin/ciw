// v0.6의 동작을 재사용하고 Figma v0.7에서 변경된 화면만 교체한다.
const v07Asset = (name) => `assets/figma-v07/${name}`;
const v06Intro = introScreen;
const v06Course = courseScreen;
const v06Payment = paymentScreen;
const v06Scan = scanScreen;
const v06Completion = completionContent;
const v06AdminDialog = adminDialogPopup;
const courseEnglish = ['Basic', 'Deluxe', 'Premium', 'Ultimate'];
const courseProcesses = [
  '고압세척 › 알칼리세제 › 스노우폼 › 초고압세척 › 건조',
  '하부세차 › 고압세척 › 알칼리세제 › 스노우폼 › 초고압세척 › 건조',
  '하부세차 › 고압세척 › 알칼리세제 › 중성세제 › 스노우폼 › 초고압세척 › 왁스코팅제 › 건조',
  '하부세차 › 고압세척 › 알칼리세제 › 스노우폼 › 초고압세척 › 중성세제 › 초고압세척 › 왁스코팅제 › 건조',
];
state.adminCredential = '1234';
Object.assign(state.adminSettings, {machineType:'포세이돈2 울트라', discountCondition:'0', cashEnabled:false, cameraId:'CAM 01', cameraIp:'192.168.00.000', autoUse:true});
state.savedAdminSettings = {...state.adminSettings};
NO_SCREEN_TIMEOUT.add('networkError');
NO_SCREEN_TIMEOUT.add('cashPay');
NO_SCREEN_TIMEOUT.add('adminSaveConfirm');

introScreen = function(overlay = '', options = {}) {
  if (state.screen !== 'intro') return v06Intro(overlay, options);
  const choice = (high) => `<button class="v07-vehicle" data-action="start" data-height="${high?'high':'low'}"><span class="v07-vehicle-image"><img src="${v07Asset('intro-imgFrame1772515413.svg')}" alt="" /></span><strong>${high?'SUV':'세단'}</strong><span>${high?'SUV / RV / 대형차량':'일반승용차 / 소형차량'}</span><small>${high?'화면을 높게':'화면을 낮게'} 조정합니다.</small></button>`;
  return `<div class="v07-intro">${courseStatusBar()}<main class="v07-intro-body"><header><p>WEL<b>COME IN WASH</b></p><h2>차종을 선택해 주세요</h2><span>선택한 차종에 따라 키오스크 화면 높이가 변경됩니다.</span></header><div class="v07-vehicles">${choice(true)}${choice(false)}<button class="v07-intro-qr" data-action="v07-qr"><span class="v07-phone-qr"><img src="${v07Asset('intro-imgImage1.png')}" alt="" /><span><img src="${v07Asset('intro-imgImage2.png')}" alt="" /></span></span><span><strong>앱에서 세차권을 미리 구매하셨나요?</strong><span>앱에서 세차권을 미리 구매하신 고객님은 바로 QR 인식기에 세차권 QR코드를 스캔하세요.</span></span></button></div></main>${adminEntryHotspot()}${overlay}</div>`;
};
courseScreen = function(overlay = '') {
  if (state.screen !== 'course' && state.screen !== 'courseInfo') return v06Course(overlay);
  return `<div class="v07-course">${adZone()}<section class="v07-course-main">${courseStatusBar()}<header class="v07-course-heading"><h2>이용하실 코스를 선택해 주세요</h2><button data-action="course-info">세차 코스 설명</button></header><div class="v07-course-cards">${courses.map((c,i)=>`<button data-action="select-course" data-course="${c.id}"><strong>${c.name} <small>${courseEnglish[i]}</small></strong><p>코스 설명</p>${c.recent?'<span class="v07-recent">최근 이용</span>':''}<b>${formatPrice(c.price)}</b></button>`).join('')}</div><button class="v07-course-qr" data-action="v07-qr">${qrMini()}<span><strong>앱에서 세차권을 미리 구매하셨나요?</strong><span>앱에서 세차권을 미리 구매하신 고객님은 바로 QR 인식기에 세차권 QR코드를 인식하세요</span></span></button>${footer('course')}</section>${adminEntryHotspot()}${overlay}</div>`;
};
function courseInfoScreen() {
  return courseScreen(`<div class="v07-course-info-dim"></div><section class="v07-course-info" role="dialog" aria-modal="true" aria-labelledby="courseInfoTitle"><header><h2 id="courseInfoTitle">세차 코스 정보</h2><button data-action="course-info-close" aria-label="닫기">×</button></header>${courses.map((c,i)=>`<article><h3>${c.name} <small>${courseEnglish[i]}</small><b>${formatPrice(c.price)}</b></h3><p>${courseProcesses[i]}</p></article>`).join('')}<button class="v07-red" data-action="course-info-close">닫기</button></section>`);
}
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
completionContent = function(message, waiting, receipt = false) {
  if (!['paymentComplete','paymentCompleteWaiting','commonComplete','commonCompleteWaiting'].includes(state.screen)) return v06Completion(message,waiting,receipt);
  return `<div class="v07-completion"><h2>${receipt?'결제가 완료되었습니다.':message}</h2><div class="v07-entry-notice"><strong>${waiting?'앞차 세차가 진행중입니다.':'잠시 후 세차장 문이 열립니다.'}</strong><hr><p>${waiting?'잠시 대기해 주세요.':'문이 열리면 유도등 지시에 따라 천천히 입장해 주세요.'}</p></div><div class="v07-entry-image" role="img" aria-label="차량 진입 안내 모션 GIF 예시 이미지">차량 진입 안내 모션/GIF<br>예시 이미지</div>${receipt && !state.receiptIssued?'<button class="v07-red v07-receipt-button" data-action="receipt-yes">영수증 발급 (카카오톡 발송)</button>':''}</div>`;
};
function welcomeV07(member) {
  return `<div class="v07-welcome ${member?'member':''}">${courseStatusBar()}<p class="v07-welcome-brand">WEL<b>COME IN WASH</b></p><h2>${member?'이용하실 화면 높이를 선택해 주세요.':'차종을 선택하고<br>세차를 시작하세요'}</h2>${member?'<p class="v07-welcome-description">차량에 맞는 화면 높이를 선택하면 바로 이용을 시작합니다.</p>':''}<div class="v07-welcome-badge"><strong>12나 12**</strong><span>${member?'컴인***님 반갑습니다.':'고객님, 반갑습니다.'}</span></div><div class="v07-welcome-choices"><button data-action="start" data-height="high">${vehicleIcon('suv')}<strong>높은 화면으로 시작</strong></button><button data-action="start" data-height="low">${vehicleIcon('sedan')}<strong>기본 화면으로 시작</strong></button></div><button class="v07-welcome-qr" data-action="v07-qr">${qrMini()}<span><strong>앱에서 세차권을 미리 구매하셨나요?</strong><span>앱의 세차권 QR을 바코드 인식기에 바로 인식해 주세요.</span></span></button></div>`;
}
function helpV07() {
  const steps=[['세차권 구매','키오스크에서 원하는 코스를 선택하고<br>결제를 진행해 주세요.','help-imgIconTicket.svg'],['입장','문이 열리면 세차장 안으로 천천히 진입해 주세요. (카스토퍼를 밟지 않도록 주의)','help-imgIconStep2.svg'],['정차','유도등이 ‘진입’에서 ‘정지’로 바뀌면 정차 후 기어를 ‘P’로 유지해 주세요.','help-imgIconStep3.svg'],['세차 진행','세차가 끝날 때까지 사이드미러는 접은 상태로 대기해 주세요.','help-imgAssetStep4Washing.png'],['완료 및 이동','출구가 열리면 천천히 출차한 뒤 드라잉 존으로 이동해 잔여 물기를 닦아 주세요.','help-imgAssetStep5Complete.png']];
  const warnings=['높이 2.1m 이상 또는 길이 5.6m 이상 차량은 이용할 수 없습니다.','차량 진입 시 카스토퍼를 밟거나 넘어가지 마세요.','세차 시작 전 창문과 선루프를 모두 닫아 주세요.','에어컨·히터 사용 시 ‘내기 순환’ 모드를 선택해 주세요.','기어를 반드시 ‘P’로 유지해 주세요.','물기 제거용 타월 제공 여부는 지점에 따라 다를 수 있습니다.'];
  return `<div class="v07-help-dim"></div><section class="v07-help" role="dialog" aria-modal="true" aria-labelledby="helpTitle"><header><span class="v07-info-badge"><img src="${v07Asset('help-imgIconInfo.svg')}" alt="" /></span><h2 id="helpTitle">컴인워시 이용 안내</h2><button data-action="back" aria-label="닫기"><img src="${v07Asset('help-imgIconCloseX.svg')}" alt="" /></button></header><div class="v07-help-steps"><h3>컴인워시 이용 방법</h3>${steps.map(([title,desc,icon],i)=>`<article><span class="v07-help-step-icon"><img src="${v07Asset(icon)}" alt="" /></span><div><h4><b>${i+1}</b>${title}</h4><p>${desc}</p>${i===0?`<aside><img src="${v07Asset('help-imgAssetAppTicketQr.png')}" alt="" /><p><strong>앱에서 세차권을 구매하셨나요?</strong><br>앱 화면의 세차권 QR을<br>QR 인식기에 바로 스캔하세요.</p></aside>`:''}</div></article>`).join('')}</div><section class="v07-help-notice"><h3><img src="${v07Asset('help-imgAssetCaution.png')}" alt="" />이용 전 꼭 확인해 주세요</h3><ul>${warnings.map(x=>`<li>${x}</li>`).join('')}</ul></section><section class="v07-help-video"><img src="${v07Asset('help-imgQrVideoGuide.svg')}" alt="컴인워시 이용 안내 영상 QR" /><div><h3>컴인워시 이용 안내 영상</h3><p>휴대폰 카메라로 QR을 스캔하면<br>컴인워시 이용 안내 영상으로 연결됩니다.</p></div></section><footer><button class="v07-red" data-action="back">닫기</button></footer></section>`;
}
function adminSaveV07() {
  return `<div class="v07-save-dim"></div><section class="v07-save-dialog" role="dialog" aria-modal="true" aria-label="변경사항 저장 확인"><p>변경된 정보가 있습니다.<br>변경사항을 저장한 후<br>메인 화면으로 이동하시겠습니까?</p><div><button data-action="admin-exit-discard">저장 안함</button><button class="v07-red" data-action="admin-exit-save">설정 저장</button></div></section>`;
}
adminDialogPopup = function(name) { return name==='exit-save' ? adminSaveV07() : v06AdminDialog(name); };
function adminV07(system = false) {
  const header=`<header class="v07-admin-head"><strong>키오스크 관리자</strong><span>(앱 버전 ${system?':':'·'} v2.0.0)</span></header>`;
  const tabs=`<nav class="v07-admin-tabs"><button class="${system?'':'active'}" data-admin-tab="kiosk">키오스크 설정</button><button class="${system?'active':''}" data-admin-tab="system">시스템 설정</button></nav>`;
  const actions=(items)=>items.map(([label,action])=>`<button data-admin-setting-action="${action}">${label}</button>`).join('');
  const device=[{label:'기계명',type:'select',key:'machineName',options:['키오스크-01','키오스크-02']},{label:'기계 종류',type:'select',key:'machineType',options:['포세이돈2 울트라','포세이돈2']},{label:'PLC IP',type:'input',key:'plcIp'},{label:'CAT ID',type:'input',key:'catId'},{label:'VAN TID',type:'input',key:'vanTid'}];
  const operations=[{label:'현금결제 기능',type:'value',value:'미사용'},{label:'주유 세차 할인',type:'toggle',key:'discountEnabled'},{label:'할인 금액',type:'input',key:'discountAmount'},{label:'할인 조건',type:'input',key:'discountCondition',note:'(0 입력 시 조건 없음)'},{label:'영수증 발급 기능',type:'toggle',key:'cardReceipt'}];
  const camera=[{label:'차량 인식 카메라',type:'toggle',key:'lprEnabled'},{label:'LPR CAM ID',type:'input',key:'cameraId'},{label:'LPR IP',type:'input',key:'cameraIp'},{label:'세차권 자동 사용',type:'toggle',key:'autoUse',note:'(차량 인식 시)'}];
  const body=system?`<div class="v07-plc"><img src="${v07Asset('adminSystem-img84tab21.png')}" alt="PLC 번지별 상태 확인 표. 프로토타입 예시 데이터." /></div><div class="v07-system-log">${adminRows([{label:'로그 사용',type:'toggle',key:'logSave'}])}</div><div class="v07-system-actions">${actions([['PLC INIT','plc-init'],['통신 소켓 초기화','socket-init'],['전송완료 로그 삭제','delete-sent'],['로그 전체 삭제','delete-all'],['세차 종료','wash-end']])}</div>`:`<div class="v07-admin-branch">${adminRows([{label:'지점명',type:'select',key:'branch',options:['강남본점','직영점 A','가맹점 B']}])}</div><div class="v07-admin-columns"><div><div class="v07-admin-spacer"></div>${adminRows(device)}<div class="v07-admin-spacer"></div>${adminRows(operations)}</div><div><div class="v07-admin-spacer"></div>${adminRows(camera)}</div></div><div class="v07-admin-actions">${actions([['앱 업데이트','app-update'],['비밀번호 변경','password-change'],['카드리더기 리셋','card-reset'],['로그 전송','log-send'],['앱 종료','app-exit']])}</div>`;
  return `<div class="v07-admin ${system?'v07-admin-system':''}">${header}<main>${tabs}${body}</main><footer><button data-action="admin-exit">${system?'관리자 화면 닫기':'메인으로'}</button><button class="v07-red" data-admin-setting-action="save">설정 저장</button></footer>${state.adminDialog?adminDialogPopup(state.adminDialog):''}</div>`;
}
renderers.intro = () => introScreen();
renderers.course = () => courseScreen();
renderers.courseInfo = courseInfoScreen;
renderers.payment = () => paymentScreen();
renderers.autoWelcomeNonmember = () => welcomeV07(false);
renderers.autoWelcomeMember = () => welcomeV07(true);
renderers.help = helpV07;
renderers.adminHome = () => {state.adminTab='kiosk';return adminV07(false);};
renderers.adminSystem = () => {state.adminTab='system';return adminV07(true);};
renderers.adminSaveConfirm = () => `${adminV07(false)}${adminSaveV07()}`;
renderers.networkError = () => `<div class="v07-network"><div class="v07-network-icon" role="img" aria-label="캐릭터 활용 자리 표시"><span>캐릭터 활용</span></div><h2>네트워크에 연결할 수 없어요</h2></div>`;
function completionV07(waiting, ticket) {return `<div class="v07-completion-screen">${adZone()}<div class="v07-completion-status">${kioskInfoBar(waiting)}</div>${completionContent(ticket?'세차권 사용이 완료되었습니다.':'결제가 완료되었습니다.',waiting,!ticket)}</div>`;}
renderers.paymentComplete = () => completionV07(false,false);
renderers.paymentCompleteWaiting = () => completionV07(true,false);
renderers.commonComplete = () => completionV07(false,true);
renderers.commonCompleteWaiting = () => completionV07(true,true);
renderers.cashPay = () => `<div class="v07-no-screen">화면 없음(기능 미제공)</div>`;
// 미배치 화면의 번호를 임의로 확정하지 않고 완료 동작에만 CMP-001을 유지한다.
renderers.qrMismatch = () => v06Intro(modalPopup({title:'인식된 세차권의 코스 정보가<br>현재 선택된 코스와 일치하지 않습니다.',content:'<p>그래도 사용하시겠습니까?<br><br>인식된 세차권 코스 : <strong>스탠다드</strong></p>',className:'qr-guide-modal',actions:[{label:'세차권 사용',action:'v07-mismatch-use'}],secondary:{label:'사용 안함',action:'qr-mismatch-close'}}));
const v06HandleAction = handleAction;
function leaveAdmin(save) {
  if (save) {
    const amount=Number(String(state.adminSettings.discountAmount).replace(/[^0-9]/g,''));
    if(state.adminSettings.discountEnabled && amount<=0){state.adminDialog='save-invalid-discount';if(state.screen==='adminSaveConfirm')state.screen='adminHome';return render();}
    state.savedAdminSettings={...state.adminSettings};
  } else state.adminSettings={...state.savedAdminSettings};
  state.adminDialog=null;state.adminAuthenticated=false;state.history=[];go('intro',false);
}
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
// 두 HTML이 공유하는 카탈로그로 선택 목록을 한 번만 만든다.
const v07Select=document.getElementById('screenSelect');
if(v07Select){v07Select.innerHTML=Object.entries(screenMeta).map(([id,meta])=>`<option value="${id}">${meta.label}</option>`).join('');v07Select.value=state.screen;}
render();
