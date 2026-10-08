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


function leaveAdmin(save) {
  if (save) {
    const amount=Number(String(state.adminSettings.discountAmount).replace(/[^0-9]/g,''));
    if(state.adminSettings.discountEnabled && amount<=0){state.adminDialog='save-invalid-discount';if(state.screen==='adminSaveConfirm')state.screen='adminHome';return render();}
    state.savedAdminSettings={...state.adminSettings};
  } else state.adminSettings={...state.savedAdminSettings};
  state.adminDialog=null;state.adminAuthenticated=false;state.history=[];go('intro',false);
}

// 최신 UI 등록. init.js에서 기존 초기화 이후 한 번 호출한다.
function applyAdminScreens() {
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

renderers.adminHome = () => {state.adminTab='kiosk';return adminV07(false);};

renderers.adminSystem = () => {state.adminTab='system';return adminV07(true);};

renderers.adminSaveConfirm = () => `${adminV07(false)}${adminSaveV07()}`;

}
