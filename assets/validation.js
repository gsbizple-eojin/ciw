function installValidation() {
  (() => {
    const validationRows = `VA-001\tdiscountScan\t이미 사용 처리된 할인권인 경우\t이미 사용된 할인권 입니다.\tAlert\tdiscountScan
VA-002\tdiscountScan\t할인권 유효기간이 지난 경우\t유효기간이 만료되어 사용이 불가합니다.<br>유효기간({n}일)이 경과되었습니다.\tAlert\tdiscountScan
VA-003\tdiscountScan\t현재 지점에서 사용할 수 없는 할인권인 경우\t이 지점에서는 사용할 수 없는 할인권입니다.\tAlert\tdiscountScan
VA-004\tdiscountScan\t25자 이상 바코드 인식된 경우\t사용할 수 없는 할인권입니다.<br>QR코드가 아닌 바코드를 스캔해주세요\tAlert\tdiscountScan
VA-005\tdiscountScan\t바코드 정상 인식에 실패한 경우\t유효하지 않은 바코드 입니다.<br>주유할인 바코드는 가장 하단에 있습니다.\tAlert\tdiscountScan
VA-006\tdiscountScan\t사용 중지된 카앤앱 쿠폰인 경우\tHD현대오일뱅크의 카앤앱에서 발급받은 세차쿠폰은 2025년3월1일부터 이용이 불가합니다.<br>문의 1588-5189\tAlert\tdiscountScan
VA-007\tcardPayExternal\t카드결제 승인 실패 시\t승인 실패 시, 안내 문구는 외부 결제 모듈 응답 기준 적용\tAlert\tcardPay
VA-008\tappPay\t사용할 수 없는 바코드\t유효하지 않은 바코드 입니다.\tAlert\tappPay
VA-009\tappPay\t선불카드 잔액 부족\t앱결제 충전 잔액이 부족합니다.\tAlert\tappPay
VA-010\tappPay\t카드 사용 인증 실패\t앱결제 인증에 실패하여 사용할 수 없습니다. <br>고객센터 : 1688-5794\tAlert\tappPay
VA-011\tappPay\t카드 승인 연동 오류\t앱결제 승인중 오류가 발생 하여 사용할수 없습니다.\tAlert\tappPay
VA-012\tmobileVoucher\t모바일 상품권 스캔 완료\t[상품권 인식]이 완료되었습니다.\tToast\tvoucherUse
VA-013\tmobileVoucher\t외부 오류 코드 반환\t[상품권 인식]에 실패했습니다.<br>[오류-{ErrorCode}]{처리 구분} {ErrorMessage}\tAlert\tmobileVoucher
VA-014\tmobileVoucher\t외부 서버 HTTP 오류\t[상품권 인식]에 실패했습니다.<br>[오류-{HTTP 상태}]\tAlert\tmobileVoucher
VA-015\tvoucherUse\t모바일 상품권 사용 처리 실패\t{머니콘 ErrorMessage}\tAlert\tmobileVoucher
VA-016\tvoucherAdditional\t모바일 상품권 잔액 추가결제 실패\t{머니콘 ErrorMessage}\tAlert\tmobileVoucher
VA-017\tpaperCoupon\t이미 사용 처리된 쿠폰인 경우\t이미 사용된 쿠폰 입니다.\tAlert\tpaperCoupon
VA-018\tpaperCoupon\t쿠폰 유효기간이 지난 경우\t유효기간이 만료되어 사용이 불가합니다.<br>유효기간({n}일)이 경과되었습니다.\tAlert\tpaperCoupon
VA-019\tpaperCoupon\t현재 지점에서 사용할 수 없는 쿠폰인 경우\t이 지점에서는 사용할 수 없는 쿠폰입니다.\tAlert\tpaperCoupon
VA-020\tpaperCoupon\t바코드 정상 인식에 실패한 경우\t유효하지 않은 쿠폰입니다.\tAlert\tpaperCoupon
VA-021\tpaperAdditional\t지류쿠폰 잔액 추가결제 실패\t[쿠폰 사용]에 실패했습니다. \tAlert\tpaperCoupon
VA-022\tpaperUse\t지류쿠폰 사용 실패\t[쿠폰 사용]에 실패했습니다. \tAlert\tpaperCoupon
VA-023\treceipt\t휴대폰 번호 미입력 시\t휴대폰 번호를 입력해 주세요.\tAlert\treceipt
VA-024\treceipt\t휴대폰 번호가 10자리 미만인 경우\t올바른 휴대폰 번호를 입력해 주세요.\tAlert\treceipt
VA-025\treceipt\t첫자리 숫자가 0이 아닌 경우\t올바른 휴대폰 번호를 입력해 주세요.\tAlert\treceipt
VA-026\treceipt\t세차중·휴대폰 번호 미입력 시\t휴대폰 번호를 입력해 주세요.\tAlert\treceipt
VA-027\treceipt\t세차중·휴대폰 번호가 10자리 미만인 경우\t올바른 휴대폰 번호를 입력해 주세요.\tAlert\treceipt
VA-028\treceipt\t세차중·첫자리 숫자가 0이 아닌 경우\t올바른 휴대폰 번호를 입력해 주세요.\tAlert\treceipt
VA-029\tintro\tQR 정상 인식에 실패한 경우\t유효하지 않은 바코드 입니다.\tAlert\tintro
VA-030\tintro\t정기권 사용 가능 지점이 아닌 경우\t정기구독권 사용 가능 지점이 아닙니다.<br>사용 가능한 지점을 확인해 주세요.\tAlert\tintro
VA-031\tintro\t세차권 사용 가능 지점이 아닌 경우\t이 지점에서는 사용할 수 없는 세차권입니다.<br>사용 가능한 지점을 확인해 주세요.\tAlert\tintro
VA-032\tintro\t세차권이 사용 가능 기간이 아닌 경우\t사용할 수 없는 기간 입니다.\tAlert\tintro
VA-033\tintro\t세차권이 사용 가능한 시간이 아닌 경우\t사용할 수 없는 시간 입니다.\tAlert\tintro
VA-034\tintro\t동일한 정기권을 하루 1회 초과 사용한 경우\t하루 1회까지만 사용 가능한 세차권 입니다 (정기권 1일 중복사용 불가)\tAlert\tintro
VA-035\tintro\t동일한 다회권을 하루 1회 초과 사용한 경우\t하루 1회까지만 사용 가능한 세차권 입니다. (다회권 1일 중복사용 불가)\tAlert\tintro
VA-036\tadminHome\t필수 값을 입력하지 않은 경우\tparam error [device uuid] 필수값 입니다.\tAlert\tadminHome`;
    const validations = Object.fromEntries(validationRows.trim().split("\n").map((row) => {
      const [id, screen, name, message, type, returnScreen] = row.split("\t");
      return [id, { id, screen, name, message, type, returnScreen }];
    }));

    Object.assign(DISCOUNT_VALIDATION_RESULTS, {
      "dc-used": { message: validations["VA-001"].message },
      "dc-expired-236": { message: validations["VA-002"].message.replace("<br>", "\n") },
      "dc-expired-234": { message: validations["VA-002"].message.replace("<br>", "\n") },
      "dc-expired-262": { message: validations["VA-002"].message.replace("<br>", "\n") },
      "dc-expired-309": { message: validations["VA-002"].message.replace("<br>", "\n") },
      "hd-branch": { message: validations["VA-003"].message },
      "hd-qr": { message: validations["VA-004"].message.replace("<br>", "\n") },
      "dc-invalid": { message: validations["VA-005"].message.replace("<br>", "\n") },
      "hd-invalid": { message: validations["VA-005"].message.replace("<br>", "\n") },
      "hd-discontinued": { message: validations["VA-006"].message.replace("<br>", "\n") }
    });

    state.validationCase = null;
    screenMeta.timeout = { label: "KIO-COM-003 첫 화면 이동 안내", req: "기능명세 v0.7", note: "5초 카운트다운·처음으로·계속 이용", type: "팝업" };
    screenMeta.qrGuide = { label: "KIO-TQR-002 세차권 QR 사용 안내", req: "기능명세 v0.7", note: "세차권 QR을 인식할 수 없는 화면에서 코스 선택으로 안내", type: "팝업" };
    screenMeta.qrMismatch = { label: "KIO-TQR-003 세차권 코스 불일치", req: "기능명세 v0.7", note: "선택 코스와 세차권 코스 정보가 일치하지 않는 경우 안내", type: "팝업" };
    renderers.timeout = () => courseScreen(timeoutPopup());
    renderers.qrGuide = () => introScreen(modalPopup({
      title: "이 화면에서는 세차권 QR을<br>사용할 수 없어요",
      content: "<p>세차권 QR은 코스 선택 화면에서 스캔할 수 있습니다.</p>",
      className: "qr-guide-modal",
      actions: [{ label: "코스 선택으로 이동", action: "qr-guide-course" }],
      secondary: { label: "닫기", action: "qr-guide-close" }
    }));
    renderers.qrMismatch = () => introScreen(modalPopup({
      title: "선택한 코스와 세차권 정보가<br>일치하지 않습니다.",
      content: "<p>코스 선택을 취소하고 세차권 QR을 다시 스캔해 주세요.</p>",
      className: "qr-guide-modal",
      actions: [{ label: "코스 선택 취소", action: "qr-mismatch-cancel" }],
      secondary: { label: "닫기", action: "qr-mismatch-close" }
    }));
    if (!embedMode) {
      const select = document.getElementById("screenSelect");
      ["qrGuide", "qrMismatch"].forEach((id) => {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = screenMeta[id].label;
        select.appendChild(option);
      });
    }
    renderers.error = () => courseScreen(alertPopup({
      type: "error",
      title: "안내 메시지",
      message: "유효성 검사 결과에 따라 공통 Alert로 표시합니다.",
      showCode: false
    }));
    renderers.voucherAdditional = () => scanScreen("mobile", "voucher-use", "상품권 사용", modalPopup({
      title: "모바일 상품권을 사용하시겠습니까?",
      className: "voucher-use-modal",
      content: additionalPaymentContent("mobile"),
      actions: [{ label: "잔액 추가결제", action: "voucher-partial" }],
      secondary: { label: "사용안함", action: "close-dialog" }
    }));
    renderers.paperUse = () => scanScreen("paper", "paper-use", "할인 쿠폰 사용", modalPopup({
      title: "할인 쿠폰을 사용하시겠습니까?",
      className: "voucher-use-modal",
      content: fullPaymentContent("paper", "voucher-use-summary"),
      actions: [{ label: "사용", action: "paper-complete" }],
      secondary: { label: "사용 안 함", action: "close-dialog" }
    }));
    renderers.paperAdditional = () => scanScreen("paper", "paper-use", "할인 쿠폰 사용", modalPopup({
      title: "할인 쿠폰을 사용하시겠습니까?",
      className: "voucher-use-modal",
      content: additionalPaymentContent("paper"),
      actions: [{ label: "잔액 추가결제", action: "paper-partial" }],
      secondary: { label: "사용안함", action: "close-dialog" }
    }));
    renderers.receiptSent = () => paymentCompleteScreen(alertPopup({
      title: "입력하신 휴대폰 번호로 영수증을 발송 했습니다.",
      action: "receipt-sent-close"
    }));
    renderers.ticketDone = () => commonCompleteScreen(state.frontCar, commonToastMessage("세차권 사용을 완료했습니다."));

    const baseRender = render;
    render = function () {
      baseRender();
      const item = state.validationCase;
      if (!item) return;
      const markup = item.type === "Toast"
        ? commonToastMessage(item.message)
        : alertPopup({ type: "error", title: item.message, action: "validation-confirm", showCode: false });
      kiosk.insertAdjacentHTML("beforeend", markup);
    };

    function showValidation(id) {
      const item = validations[id];
      if (!item) return;
      clearTimers();
      state.frontCar = ["VA-026", "VA-027", "VA-028"].includes(id);
      state.screen = item.screen;
      state.validationCase = item;
      render();
      if (item.type === "Toast" && !embedMode) {
        state.qrTimer = window.setTimeout(() => {
          state.validationCase = null;
          go(state.voucherAdditionalPayment ? "voucherAdditional" : item.returnScreen, false);
        }, 1600);
      }
    }

    if (!embedMode) {
      const anchor = document.querySelector(".review-section.current-review");
      const timeoutOption = document.createElement("option");
      timeoutOption.value = "timeout";
      timeoutOption.textContent = screenMeta.timeout.label;
      document.getElementById("screenSelect").appendChild(timeoutOption);
      const section = document.createElement("section");
      section.className = "review-section validation-review";
      section.innerHTML = `<h2>유효성 검사</h2><label class="review-label" for="validationCaseSelect">검증 케이스</label><select id="validationCaseSelect">${Object.values(validations).map((item) => `<option value="${item.id}">${item.id} · ${item.name}</option>`).join("")}</select><div class="review-grid one compact"><button type="button" data-validation-run>선택 케이스 실행</button></div>`;
      anchor.before(section);
    }

    document.addEventListener("click", (event) => {
      const introQr = event.target.closest('[data-action="intro-qr"]');
      const qrGuideClose = event.target.closest('[data-action="qr-guide-close"]');
      const qrGuideCourse = event.target.closest('[data-action="qr-guide-course"]');
      const qrMismatchClose = event.target.closest('[data-action="qr-mismatch-close"]');
      const qrMismatchCancel = event.target.closest('[data-action="qr-mismatch-cancel"]');
      if (introQr) {
        event.preventDefault();
        event.stopImmediatePropagation();
        state.qrGuideReturnScreen = state.screen;
        return go("qrGuide");
      }
      if (qrGuideClose) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return go(state.qrGuideReturnScreen || "intro", false);
      }
      if (qrGuideCourse) {
        event.preventDefault();
        event.stopImmediatePropagation();
        resetPaymentAdjustments();
        state.selectedCourse = courses[2];
        state.history = [];
        return go("course", false);
      }
      if (qrMismatchClose) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return go("course", false);
      }
      if (qrMismatchCancel) {
        event.preventDefault();
        event.stopImmediatePropagation();
        resetPaymentAdjustments();
        state.selectedCourse = courses[2];
        state.history = [];
        return go("course", false);
      }
      const run = event.target.closest("[data-validation-run]");
      const confirm = event.target.closest('[data-action="validation-confirm"]');
      if (run) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return showValidation(document.getElementById("validationCaseSelect").value);
      }
      if (confirm) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const item = state.validationCase;
        state.validationCase = null;
        return go(item?.returnScreen || state.screen, false);
      }
      const send = event.target.closest('[data-action="send-receipt"]');
      if (send && (!state.phone || state.phone.length < 10 || state.phone[0] !== "0")) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const prefix = state.frontCar ? 26 : 23;
        const offset = !state.phone ? 0 : state.phone.length < 10 ? 1 : 2;
        return showValidation(`VA-${String(prefix + offset).padStart(3, "0")}`);
      }
      const save = event.target.closest('[data-admin-setting-action="save"]');
      if (save && (!state.adminSettings.machineName || !state.adminSettings.branch)) {
        event.preventDefault();
        event.stopImmediatePropagation();
        return showValidation("VA-036");
      }
    }, true);

    if (new URLSearchParams(location.search).get("screen") === "timeout") {
      state.screen = "timeout";
      render();
    }
    const requestedScreen = new URLSearchParams(location.search).get("screen");
    if (["qrGuide", "qrMismatch"].includes(requestedScreen)) go(requestedScreen, false);
    const requestedValidation = new URLSearchParams(location.search).get("validation");
    if (requestedValidation && validations[requestedValidation]) showValidation(requestedValidation);
  })();
  

}
