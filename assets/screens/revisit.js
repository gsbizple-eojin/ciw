// Duplicate IDs and mislabeled dialogs remain unchanged by user request.
function applyRevisitScreens(){
 const parse=html=>{const el=document.createElement('div');el.innerHTML=html;return el;};
 function bind(el,action,extra={}){if(!el)return;el.dataset.action=action;Object.assign(el.dataset,extra);el.setAttribute('role','button');el.tabIndex=0;}
 const text=(root,label)=>[...root.querySelectorAll('p')].find(e=>e.textContent.replace(/\s/g,'')===label.replace(/\s/g,''));
 function label(root,title,action,extra){const p=text(root,title);if(p)bind(p.closest('[data-name="Label_Kiosk"],[data-name="bt-kiosk"],[data-name="payment_KO"]')||p.parentElement,action,extra);}
 function template(id){
  const source=CIW_REVISIT_DESIGNS.find(s=>s.id===id),root=parse(source.html).firstElementChild;
  root.dataset.revisitNode=id;
  root.querySelectorAll('.rv-timer').forEach(timer=>{timer.classList.add('screen-timeout');if(embedMode)timer.dataset.static='true';timer.querySelectorAll('p').forEach(p=>p.remove());const b=document.createElement('b');b.textContent=state.screenTimeoutSeconds||30;timer.append(b);});
  const header=root.querySelector('.rv-header');if(header){const identity=header.querySelector('[data-name="ssg-landers"]');const ps=identity?.querySelectorAll('p');if(ps?.[0])ps[0].textContent=state.adminSettings.branch;if(ps?.[1])ps[1].textContent=state.adminSettings.machineName.replace(/-/g,' ');const status=text(header,'대기중');if(status){status.textContent=state.communicationError?'통신에러':state.frontCar?'앞차 세차 중':'대기중';status.closest('[data-name="Label_KO"]')?.classList.add('rv-status');}}
  label(root,'이전으로','back');label(root,'이용안내','help');label(root,'코스 재선택','choose-course');
  return root;
 }
 const oldIntro=introScreen,oldPayment=paymentScreen,oldCompletion=testPaymentComplete;
 introScreen=function(overlay='',options={}){
  if(state.screen!=='intro')return oldIntro(overlay,options);
  const root=template('589:12484');root.classList.add('rv-intro');root.querySelector('.rv-main')?.classList.remove('rv-main');root.querySelectorAll('[data-rv-height]').forEach(e=>bind(e.parentElement,'start',{height:e.dataset.rvHeight}));
  bind(root.querySelector('[data-name="app banner_bg"]')?.parentElement,'v07-qr');
  const identity=[...root.querySelectorAll('p')].find(p=>p.textContent.includes('강남 본점'));if(identity)identity.textContent=`${state.adminSettings.branch} / ${state.adminSettings.machineName} / ${state.communicationError?'통신에러':state.frontCar?'앞차 세차 중':'대기중'}`;
  return root.outerHTML+adminEntryHotspot()+overlay;
 };
 courseScreen=function(overlay=''){
  const id=state.courseDisplayVariant==='v1'?'589:12572':state.courseDisplayVariant==='v2'?'589:12590':'589:14114',root=template(id);
  root.querySelectorAll('[data-rv-course]').forEach(e=>{const course=courses.find(c=>c.id===e.dataset.rvCourse);if(!course)return;bind(e,'select-course',{course:course.id});const price=[...e.querySelectorAll('p')].find(p=>/[0-9,]+원/.test(p.textContent));if(price)price.textContent=formatPrice(course.price);});
  label(root,'세차 코스 안내','course-info');bind(root.querySelector('[data-name="app banner_bg_gray_character"]')?.parentElement,'v07-qr');
  // Keep course dialogs inside their positioned screen so the existing overlay styles apply.
  root.classList.add('ciw-design');root.insertAdjacentHTML('beforeend',overlay);
  return root.outerHTML+adminEntryHotspot();
 };
 const oldInfo=renderers.courseInfo;
 renderers.courseInfo=()=>{
  const id=state.courseInfoVariant==='v1'?'589:22249':state.courseInfoVariant==='v2'?'589:22335':'589:22138',source=template(id),popup=source.querySelector('[data-name="popup-kiosk"]');
  popup.classList.add('rv-screen','rv-popup');popup.dataset.revisitNode=id;Object.assign(popup.style,{position:'relative',left:'auto',top:'auto',transform:'none',margin:'0'});popup.setAttribute('role','dialog');popup.setAttribute('aria-modal','true');popup.setAttribute('aria-label','세차 코스 안내');label(popup,'닫기','course-info-close');bind(popup.querySelector('[data-name="ic_close_24px"]'),'course-info-close');
  const old=parse(oldInfo()),existing=old.querySelector('.test-course-info');old.querySelector('.test-course-info-dim')?.remove();
  const layer=document.createElement('div');layer.className='rv-popup-layer';layer.append(popup);existing.replaceWith(layer);return old.innerHTML;
 };
 paymentScreen=function(overlay='',appliedMethod='',includeDiscount=false){
  if(state.screen==='paymentMethods')return oldPayment(overlay,appliedMethod,includeDiscount);
  const old=parse(oldPayment('',appliedMethod,includeDiscount)),mutual=state.paperCouponUsed||state.discountApplied||includeDiscount,root=template(mutual?'589:21988':'589:22010');
  let summary=[...root.querySelectorAll('div')].filter(e=>e.textContent.includes('코스 금액')&&e.textContent.includes('총 결제 금액')).sort((a,b)=>a.textContent.length-b.textContent.length)[0];summary=summary.parentElement;summary.innerHTML=old.querySelector('.design-payment-summary').innerHTML;summary.classList.add('rv-summary');
  const badges=[...root.querySelectorAll('p')].filter(p=>p.textContent.trim()==='적용됨').map(p=>p.parentElement.parentElement),badge=badges[0]?.cloneNode(true);badges.forEach(e=>e.remove());
  for(const [method,title] of [['mobile','모바일 상품권'],['paper','할인쿠폰'],['discount','주유 세차 할인권']]){
   const control=text(root,title)?.parentElement,original=old.querySelector(`[data-method="${method}"]`);if(!control||!original)continue;
   if(original.classList.contains('applied')&&badge)control.append(badge.cloneNode(true));
   if(original.disabled){control.classList.add('rv-disabled');control.setAttribute('aria-disabled','true');}else bind(control,'pay-method',{method});
  }
  const next=old.querySelector('[data-action="payment-next"]');const nextText=text(root,'사용 안함')||text(root,'다음');if(nextText){nextText.textContent=next.textContent;bind(nextText.closest('[data-name="bt-kiosk"]')||nextText.parentElement,'payment-next');}
  return root.outerHTML+overlay;
 };
 testPaymentComplete=function(overlay='',waiting=false,ticket=false){
  if(waiting||ticket)return oldCompletion(overlay,waiting,ticket);
  const root=template('589:12422');const button=root.querySelector('[data-name="bt-kiosk"]');if(state.receiptIssued)button?.parentElement.remove();else bind(button,'receipt-yes');return root.outerHTML+overlay;
 };
 renderers.intro=()=>introScreen();renderers.course=()=>courseScreen();renderers.payment=()=>paymentScreen();renderers.paymentComplete=()=>testPaymentComplete();
 renderers.maintenance=()=>template('589:13088').outerHTML;
 renderers.unavailable=()=>template('589:13090').outerHTML;
 kiosk.addEventListener('keydown',e=>{const target=e.target.closest('.rv-screen [data-action]');if(target&&(e.key==='Enter'||e.key===' ')){e.preventDefault();target.click();}});
}

