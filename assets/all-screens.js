const catalog = Object.entries(window.CIW_SCREEN_CATALOG);
const V07_TARGETS = new Set(["intro", "course", "courseInfo", "discountUse", "payment", "appPay", "mobileVoucher", "paperCoupon", "paymentComplete", "paymentCompleteWaiting", "commonComplete", "commonCompleteWaiting", "autoWelcomeNonmember", "autoWelcomeMember", "help", "adminHome", "adminSystem", "adminSaveConfirm", "networkError", "cashPay", "qrMismatch"]);
const gallery = document.querySelector("#screenGallery");
const summary = document.querySelector("#gallerySummary");
const selectedHeight = new URLSearchParams(window.location.search).get("height") === "high" ? "high" : "low";
const captureMode = new URLSearchParams(window.location.search).get("capture") === "figma";
const FLOW_GROUPS = [
  ["인트로", ["intro"]],
  ["코스선택", ["course", "courseInfo"]],
  ["주유세차 할인", ["discountScan", "discountUse", "discountApplied"]],
  ["결제수단선택", ["payment", "paymentMobileApplied", "paymentPaperApplied", "paymentDiscountMobileApplied"]],
  ["결제하기", ["cardPay", "cardPayExternal", "appPay", "mobileVoucher", "voucherUse", "voucherAdditional", "voucherError", "paperCoupon", "paperUse", "paperAdditional", "paperError", "cashPay"]],
  ["결제완료 / 영수증", ["paymentComplete", "paymentCompleteWaiting", "commonComplete", "commonCompleteWaiting", "receipt", "receiptError", "receiptSent"]],
  ["오토패스", ["autoWelcomeNonmember", "autoWelcomeMember", "autoSingle", "autoManual", "autoMultiple", "autoError"]],
  ["공통", ["help", "heightSettings", "loading", "maintenance", "unavailable", "error", "commonToast", "timeout", "networkError"]],
  ["세차권 QR", ["ticketDone", "qrGuide", "qrMismatch"]],
  ["관리자", ["adminLogin", "adminHome", "adminSystem", "adminSaveConfirm"]],
];

console.assert(
  catalog.every(([id]) => FLOW_GROUPS.filter(([, ids]) => ids.includes(id)).length === 1),
  "전체 화면 플로우 그룹을 확인해 주세요.",
);

function screenUrl(id, standalone = false) {
  const params = new URLSearchParams({ screen: id, height: selectedHeight });
  if (standalone) params.set("embed", "1");
  return `./index.html?${params}`;
}

function updateSummary() {
  summary.textContent = `총 ${catalog.length}개 화면 (기본 42개 + 완료 플로우 1개) · v0.7 변경·추가 ${V07_TARGETS.size}개 · ${selectedHeight === "low" ? "기본 화면 (세단)" : "높은 화면 (SUV)"}`;
}

function renderGallery() {
  let number = 0;
  updateSummary();
  gallery.innerHTML = FLOW_GROUPS.map(([flow, ids]) => {
    const screens = ids.map((id) => catalog.find(([screenId]) => screenId === id)).filter(Boolean);
    if (!screens.length) return "";
    const cards = screens.map(([id, meta]) => {
      number += 1;
      const changed = V07_TARGETS.has(id);
      return `<article class="screen-card ${changed ? "v06-updated" : ""}" data-screen="${id}">
        <header><div class="screen-meta-row"><span class="screen-number">NO. ${String(number).padStart(2, "0")} · ${meta.type}${changed ? '<b class="version-badge">v0.7 변경·추가</b>' : ""}</span><button class="screen-copy" type="button" data-copy aria-label="${meta.label} 화면 정보 복사">복사</button></div><h3>${meta.label}</h3><p>${meta.req}</p></header>
        <div class="preview-pair"><div class="preview-window"><iframe title="${meta.label} 미리보기" loading="${captureMode ? "eager" : "lazy"}" src="${screenUrl(id, true)}"></iframe></div></div>
        <footer><span class="screen-note" title="${meta.note}">${meta.note}</span><div class="screen-actions"><button type="button" data-reset>원래 화면으로</button><a href="${screenUrl(id, true)}" target="_blank" rel="noreferrer">단독 보기</a></div></footer>
      </article>`;
    }).join("");
    return `<section class="screen-group"><div class="group-heading"><h2>${flow}</h2><span>${screens.length}개</span></div><div class="screen-grid">${cards}</div></section>`;
  }).join("");
}

async function copyScreenInfo(button, card) {
  const copyText = `${card.querySelector(".screen-number").textContent}\n${card.querySelector("h3").textContent}`;
  let copied = false;

  try {
    await navigator.clipboard.writeText(copyText);
    copied = true;
  } catch {
    const field = document.createElement("textarea");
    field.value = copyText;
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    copied = document.execCommand("copy");
    field.remove();
  }

  button.textContent = copied ? "복사 완료" : "복사 실패";
  window.setTimeout(() => { button.textContent = "복사"; }, 1200);
}

document.querySelectorAll("[data-height]").forEach((item) => item.classList.toggle("active", item.dataset.height === selectedHeight));
renderGallery();

gallery.addEventListener("click", async (event) => {
  const card = event.target.closest("[data-screen]");
  if (!card) return;

  const copy = event.target.closest("[data-copy]");
  if (copy) {
    await copyScreenInfo(copy, card);
    return;
  }

  const reset = event.target.closest("[data-reset]");
  if (!reset) return;
  card.querySelector("iframe").src = screenUrl(card.dataset.screen, true);
});
