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


function ticketDoneScreen() {
  return commonCompleteScreen(state.frontCar, commonToastMessage("세차권 사용을 완료했습니다."));
}


// 최신 UI 등록. init.js에서 기존 초기화 이후 한 번 호출한다.
function applyCompletionScreens() {
completionContent = function(message, waiting, receipt = false) {
  if (!['paymentComplete','paymentCompleteWaiting','commonComplete','commonCompleteWaiting'].includes(state.screen)) return v06Completion(message,waiting,receipt);
  return `<div class="v07-completion"><h2>${receipt?'결제가 완료되었습니다.':message}</h2><div class="v07-entry-notice"><strong>${waiting?'앞차 세차가 진행중입니다.':'잠시 후 세차장 문이 열립니다.'}</strong><hr><p>${waiting?'잠시 대기해 주세요.':'문이 열리면 유도등 지시에 따라 천천히 입장해 주세요.'}</p></div><div class="v07-entry-image" role="img" aria-label="차량 진입 안내 모션 GIF 예시 이미지">차량 진입 안내 모션/GIF<br>예시 이미지</div>${receipt && !state.receiptIssued?'<button class="v07-red v07-receipt-button" data-action="receipt-yes">영수증 발급 (카카오톡 발송)</button>':''}</div>`;
};

function completionV07(waiting, ticket) {return `<div class="v07-completion-screen">${adZone()}<div class="v07-completion-status">${kioskInfoBar(waiting)}</div>${completionContent(ticket?'세차권 사용이 완료되었습니다.':'결제가 완료되었습니다.',waiting,!ticket)}</div>`;}

renderers.paymentComplete = () => completionV07(false,false);

renderers.paymentCompleteWaiting = () => completionV07(true,false);

renderers.commonComplete = () => completionV07(false,true);

renderers.commonCompleteWaiting = () => completionV07(true,true);

}
