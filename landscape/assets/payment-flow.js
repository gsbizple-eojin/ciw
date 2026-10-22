/* Transaction behavior shared by the updated W payment screens. */
const wideTransaction={course:{name:'프리미엄',price:13000,process:'하부세차 > 알칼리세제 > 고압세척 > 스노우폼 > 딥클렌징 > 초고압세척 > 왁스코팅 > 강풍건조'},mobile:0,paper:0,discount:0,frontCar:false,receiptSent:false};
const wideCourses=[['울티메이트',15000],['프리미엄',13000],['디럭스',12000],['베이직',11000]];
function wideReset(){wideTransaction.mobile=wideTransaction.paper=wideTransaction.discount=0;wideTransaction.receiptSent=false;}
function wideBalance(){return Math.max(0,wideTransaction.course.price-wideTransaction.mobile-wideTransaction.paper-wideTransaction.discount);}
function wideComplete(){return wideTransaction.frontCar?'956:6237':'956:5815';}
function wideText(root,pattern){return [...root.querySelectorAll('p')].find(p=>pattern.test(p.textContent.trim()));}
function wideControl(el,action,label){if(!el)return;el.setAttribute('role','button');el.tabIndex=0;el.setAttribute('aria-label',label||el.textContent.trim());el.style.cursor='pointer';el.onclick=action;el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();action();}};}
function wideRender(id,html){
  if(id==='1061:5043')html=SCREENS.find(s=>s.id==='956:3815').html;
  if(id==='956:2641')html=SCREENS.find(s=>s.id==='1011:5475').html+html.replace('wide-updated ','wide-updated wide-overlay ');
  if(['956:9404','1011:9615','1011:9415'].includes(id))html=SCREENS.find(s=>s.id==='1011:5475').html+html.replace('wide-updated ',id==='1011:9415'?'wide-updated wide-overlay wide-toast-layer ':'wide-updated wide-overlay ');
  if(['956:5170','956:5203'].includes(id))html=SCREENS.find(s=>s.id==='956:5019').html+html.replace('wide-updated ','wide-updated wide-overlay ');
  if(['956:5570','956:5638'].includes(id))html=SCREENS.find(s=>s.id==='956:5404').html+html.replace('wide-updated ','wide-updated wide-overlay ');
  if(['956:7197','1011:10740'].includes(id))html=SCREENS.find(s=>s.id===wideComplete()).html+html.replace('wide-updated ','wide-updated wide-overlay ');
  const root=document.createElement('div');root.innerHTML=html;
  if(['956:3815','1061:5043','543:8780'].includes(id)){
    const summary=[...root.querySelectorAll('[data-name="payment_KO"],[data-node-id="541:14498"],#node-541_14498')].find(e=>e.textContent.includes('코스 금액'));summary.classList.add('wide-summary');
    summary.innerHTML=`<div><h2>${wideTransaction.course.name} 코스</h2><p>${wideTransaction.course.process}</p></div><div class="wide-amounts"><p><span>코스 금액</span><b>${wideTransaction.course.price.toLocaleString('ko-KR')}</b></p>${[['할인 금액',wideTransaction.discount],['모바일 상품권',wideTransaction.mobile],['할인 쿠폰',wideTransaction.paper]].filter(x=>x[1]).map(([l,v])=>`<p><span>${l}</span><b>-${v.toLocaleString('ko-KR')}</b></p>`).join('')}<p class="wide-total"><span>총 결제 금액</span><b>${wideBalance().toLocaleString('ko-KR')}원</b></p></div>`;
    if(id!=='543:8780'){
      const applied=wideText(root,/^적용됨$/);let appliedBadge=applied;
      while(appliedBadge?.parentElement&&appliedBadge.parentElement.textContent.trim()==='적용됨')appliedBadge=appliedBadge.parentElement;
      const badge=appliedBadge?.outerHTML||'<span class="wide-applied-label">✓ 적용됨</span>';appliedBadge?.remove();
      for(const [label,key,blocked]of [['모바일 상품권','mobile',false],['할인 쿠폰','paper',!!wideTransaction.discount],['주유 세차 할인권','discount',!!wideTransaction.paper]]){
        const p=wideText(root,new RegExp('^'+label.replaceAll(' ','\\s*')+'$')),button=p?.closest('[data-name="payment_KO"],[data-node-id="541:14522"],#node-541_14522');if(!button)continue;
        button.classList.add('wide-payment-option');button.dataset.method=key;button.dataset.label=label;
        const fill=button.querySelector(':scope>[aria-hidden]');
        if(wideTransaction[key]||blocked){button.classList.add('wide-method-disabled');if(fill)fill.style.background='rgba(255,255,255,.12)';if(wideTransaction[key])button.insertAdjacentHTML('beforeend',badge);button.setAttribute('aria-disabled','true');}
      }
      const next=wideText(root,/^사용 안함$/);if(next)next.textContent=wideTransaction.mobile||wideTransaction.paper||wideTransaction.discount?'다음':'사용 안함';
    }
  }
  if(['956:5170','956:5203','956:5570','956:5638'].includes(id)){
    const partial=['956:5203','956:5638'].includes(id),overlay=root.querySelector('.wide-overlay'),ps=[...overlay.querySelectorAll('p')];const amount=wideBalance(),credit=partial?Math.min(4000,amount):id==='956:5170'?20000:amount;
    const values=ps.filter(p=>/^[\d,]+원$|^없음$/.test(p.textContent.trim()));if(values[0])values[0].textContent=amount.toLocaleString('ko-KR')+'원';if(values[1])values[1].textContent=credit.toLocaleString('ko-KR')+'원';if(values[2])values[2].textContent=partial?Math.max(0,amount-credit).toLocaleString('ko-KR')+'원':'없음';
  }
  if(id==='956:2641'){
    const overlay=root.querySelector('.wide-overlay'),use=wideText(overlay,/^사용$/)?.closest('[data-name="bt-kiosk"]'),skip=wideText(overlay,/^사용 안함$/)?.closest('[data-name="bt-kiosk"]');if(use&&skip)skip.before(use);
  }
  if(wideTransaction.receiptSent&&['956:5815','956:6237'].includes(id)){const p=wideText(root,/영수증 받기/);p?.closest('[data-name="bt-kiosk"]')?.remove();}
  return root.innerHTML;
}
function wideWire(){
  if(current===initial&&kiosk.querySelector('.wide-intro-updated')){
    const root=kiosk.querySelector('.wide-intro-updated');
    const start=()=>{wideReset();history=[];go('1011:5475',false);};
    root.onclick=e=>{if(!e.target.closest('.wide-intro-admin,[role="button"]'))start();};
    const p=wideText(root,/^세차 시작하기$/);wideControl(p?.closest('[data-name="bt-kiosk"]')||p?.parentElement,e=>start(),'세차 시작하기');
    const admin=document.createElement('button');admin.className='wide-intro-admin';admin.setAttribute('aria-label','관리자 로그인');let taps=0,first=0;
    admin.onclick=e=>{e.stopPropagation();const now=Date.now();if(now-first>5000){first=now;taps=0;}if(++taps===4)go('1011:9690');};root.append(admin);return true;
  }
  if(!kiosk.querySelector('.wide-updated'))return false;
  const bind=(pattern,action,min=55)=>textTarget(pattern,action,min);
  bind(/^이전으로$/,()=>{if(current==='543:8780')go('956:3815');else if(['956:4171','956:4598'].includes(current))go('543:8780');else if(['956:5019','956:5404','956:2823'].includes(current))go('956:3815');else if(['956:3815','1061:5043'].includes(current)){wideReset();history=[];go('1011:5475',false);}else back();});
  bind(/^코스 재선택$/,()=>{wideReset();history=[];go('1011:5475',false);});bind(/^이용안내$/,()=>go('1061:5268'));
  if(current==='1011:5475'){
    for(const [name,price]of wideCourses)bind(new RegExp('^'+name+'$'),()=>{wideReset();wideTransaction.course={name,price,process:name==='베이직'?'알칼리세제 > 고압세척 > 스노우폼 > 초고압세척 > 강풍건조':name==='디럭스'?'하부세차 > 알칼리세제 > 고압세척 > 스노우폼 > 초고압세척 > 강풍건조':name==='울티메이트'?'하부세차 > 알칼리세제 > 고압세척 > 스노우폼 > 초고압세척 > 딥클렌징 > 초고압세척 > 왁스코팅 > 강풍건조':'하부세차 > 알칼리세제 > 고압세척 > 스노우폼 > 딥클렌징 > 초고압세척 > 왁스코팅 > 강풍건조'};go('956:2641');},150);
    bind(/^세차 코스 안내$/,()=>go('1049:8219'));return true;
  }
  if(current==='1049:8219'){const close=kiosk.querySelector('[data-name="ic_close_24px"]');wideControl(close,()=>go('1011:5475'),'닫기');return true;}
  if(current==='956:2641'){bind(/^사용$/,()=>go('956:2823'));bind(/^사용 안함$/,()=>go('956:3815'));return true;}
  if(['956:3815','1061:5043'].includes(current)){
    const routes={mobile:'956:5019',paper:'956:5404',discount:'956:2823'};kiosk.querySelectorAll('[data-method]').forEach(e=>{if(e.getAttribute('aria-disabled')!=='true')wideControl(e,()=>go(routes[e.dataset.method]),e.dataset.label);});bind(/^(사용 안함|다음)$/,()=>go(wideBalance()===0?wideComplete():'543:8780'));return true;
  }
  if(current==='543:8780'){bind(/^현금 결제$/,()=>notify('현금 결제는 실제 장치 연동 후 이용할 수 있습니다.'));bind(/^카드 결제$/,()=>go('956:4171'));bind(/^컴인워시 앱결제$/,()=>go('956:4598'));return true;}
  if(current==='956:2823'){hotspot('바코드 인식 시뮬레이션',48,256,744,424,()=>{wideTransaction.discount=Math.min(2000,wideBalance());go(wideBalance()===0?wideComplete():'956:3815');notify('주유 세차 할인권이 적용되었습니다.');});return true;}
  const scans={'956:4171':()=>go(wideComplete()),'956:4598':()=>go(wideComplete()),'956:5019':()=>go('956:5170'),'956:5404':()=>go('956:5570')};
  if(scans[current]){hotspot('인식 / 승인 완료 시뮬레이션',48,256,744,424,scans[current]);return true;}
  if(['956:5170','956:5203','956:5570','956:5638'].includes(current)){const id=current;bind(/^사용 안함$/,()=>go('956:3815'));bind(/^사용$|^잔액 추가결제$/,()=>{wideTransaction[['956:5170','956:5203'].includes(id)?'mobile':'paper']=['956:5203','956:5638'].includes(id)?Math.min(4000,wideBalance()):wideBalance();go(wideBalance()===0?wideComplete():'956:3815');});return true;}
  if(['956:5815','956:6237'].includes(current)){bind(/영수증 받기/,()=>{wideReceiptReturn=current;go('956:7197');});return true;}
  if(current==='956:9404'){bind(/^처음으로$/,()=>{wideReset();go(initial,false);});bind(/^계속 이용$/,back);return true;}
  if(current==='1011:9615'){bind(/^사용 안함$/,back);bind(/^세차권 사용$/,()=>go('956:6504'));return true;}
  if(current==='1011:10740'){bind(/^확인$/,()=>go(wideReceiptReturn||wideComplete()));return true;}
  return false;
}
let wideReceiptReturn='956:5815';
