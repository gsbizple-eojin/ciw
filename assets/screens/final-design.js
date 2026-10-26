/* Exact, unique portrait IDs approved for the final-design update. */
function applyFinalDesigns(){
 const ids=['discountUse','appPay','mobileVoucher','paperCoupon','cardPay','commonComplete','discountScan','receiptSent','error','voucherAdditional','paperAdditional','loading','networkError','timeout','commonToast','ticketDone','qrGuide','qrMismatch','paymentMethods'];
 const actions={discountUse:['discount-validate','589:10456'],appPay:['complete-payment','589:10353'],mobileVoucher:['voucher-use','589:10368'],paperCoupon:['paper-use','589:10413'],cardPay:['complete-payment','589:10609']};
 const popupActions={discountScan:{'사용':'discount-use','사용 안함':'skip-discount'},receiptSent:{'확인':'receipt-sent-close'},error:{'확인':'close-alert'},voucherAdditional:{'사용 안함':'voucher-cancel','잔액 추가결제':'voucher-partial','취소':'voucher-cancel','추가 결제':'voucher-partial','확인':'voucher-partial'},paperAdditional:{'사용 안함':'paper-cancel','잔액 추가결제':'paper-partial','취소':'paper-cancel','추가 결제':'paper-partial','확인':'paper-partial'},timeout:{'처음으로':'timeout-home','계속 이용':'timeout-continue','계속 이용하기':'timeout-continue'},qrGuide:{'닫기':'qr-guide-close','코스 선택':'qr-guide-course'},qrMismatch:{'취소':'qr-mismatch-close','닫기':'qr-mismatch-close','사용':'v07-mismatch-use'}};
 const normalize=s=>s.replace(/\s/g,'');
 function bind(el,action){if(!el)return;el.dataset.action=action;el.setAttribute('role','button');el.tabIndex=0;}
 function label(root,text,action){const p=[...root.querySelectorAll('p')].find(p=>normalize(p.textContent)===normalize(text));if(p&&(!root.classList.contains('final-popup')||p.closest('[data-name="bt-kiosk"]')))bind(p.closest('[data-name="bt-kiosk"],[data-name="Label_KO"],[data-name="payment_KO"]')||p.parentElement,action);}
 window.CIW_FINAL_DESIGNS.forEach((design,i)=>{
  const key=ids[i],original=renderers[key];if(!original)return;
  renderers[key]=()=>{
   const old=document.createElement('div');old.innerHTML=original();
   const holder=document.createElement('div');holder.innerHTML=design.html;let root=holder.firstElementChild;
   root.dataset.finalScreenId=design.screenId;
   const popup=root.querySelector('[data-name="dialog-kiosk"]');
   if(popup){
    popup.classList.add('final-design','final-popup');popup.dataset.finalScreenId=design.screenId;
    Object.assign(popup.style,{position:'relative',left:'auto',top:'auto',transform:'none',margin:'0'});
    popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','true');
    const target=old.querySelector('.design-discount-dialog,.test-dialog,.qr-guide-modal');
    if(!target)return old.innerHTML;
    for(const [text,action] of Object.entries(popupActions[key]||{}))label(popup,text,action);
    const oldButtons=[...target.querySelectorAll('[data-action]')],newButtons=[...popup.querySelectorAll('[data-name="bt-kiosk"]')];
    newButtons.forEach((b,j)=>{if(!b.dataset.action&&oldButtons[j])bind(b,oldButtons[j].dataset.action)});
    if(key==='timeout'){const p=[...popup.querySelectorAll('p')].find(e=>/^00:0[0-9]$/.test(e.textContent.trim()));if(p){p.classList.add('timeout-countdown');p.innerHTML='<strong>00:05</strong>';}}
    if(key==='error'){const title=target.querySelector('h3');const p=[...popup.querySelectorAll('p')].find(e=>e.textContent.includes('오류'));if(title&&p)p.textContent=title.textContent;}
    if(key==='voucherAdditional'||key==='paperAdditional'){
     const values=[...target.querySelectorAll('.test-voucher-amounts strong')].map(e=>e.textContent);
     const prices=[...popup.querySelectorAll('p')].filter(e=>/^[\d,]+원$/.test(e.textContent.trim()));values.forEach((v,j)=>{if(prices[j])prices[j].textContent=v});
    }
    target.replaceWith(popup);return old.innerHTML;
   }
   if(key==='commonToast'||key==='ticketDone'){
    const toast=old.querySelector('.test-toast,.toast-message');if(!toast)return old.innerHTML;
    let content=root.querySelector('[data-name="toast_kiosk"]');
    if(!content){const p=[...root.querySelectorAll('p')].find(e=>e.textContent.trim());content=p?.parentElement;}
    if(content){content.classList.add('final-design','final-toast');content.dataset.finalScreenId=design.screenId;toast.replaceWith(content);}return old.innerHTML;
   }
   if(actions[key])bind(root.querySelector('[data-node-id="'+actions[key][1]+'"]'),actions[key][0]);
   label(root,'이전으로','back');label(root,'코스 재선택','choose-course');label(root,'이용안내','help');
   if(key==='paymentMethods'){
    label(root,'컴인워시 앱결제','pay-method');label(root,'카드 결제','pay-method');
    root.querySelectorAll('[data-action="pay-method"]').forEach(e=>e.dataset.method=e.textContent.includes('앱')?'app':'card');
    let summary=old.querySelector('.design-payment-summary'),dest=[...root.querySelectorAll('div')].filter(e=>e.textContent.includes('코스 금액')&&e.textContent.includes('총 결제 금액')).sort((a,b)=>a.textContent.length-b.textContent.length)[0];
    if(summary&&dest){dest=dest.parentElement;dest.innerHTML=summary.innerHTML;dest.classList.add('design-payment-summary','final-summary');}
   }
   root.querySelectorAll('.final-timer').forEach(timer=>{timer.classList.add('screen-timeout');timer.querySelectorAll('p').forEach(p=>p.remove());const b=document.createElement('b');b.textContent='30';timer.append(b);});
   const header=root.querySelector('.final-header');if(header){const ps=header.querySelectorAll('p');if(ps[0])ps[0].textContent=state.adminSettings.branchName||ps[0].textContent;if(ps[1])ps[1].textContent=state.adminSettings.machineName||ps[1].textContent;}
   return root.outerHTML;
  };
 });
 kiosk.addEventListener('keydown',event=>{const button=event.target.closest('.final-design [data-action]');if(button&&(event.key==='Enter'||event.key===' ')){event.preventDefault();button.click();}});
}
