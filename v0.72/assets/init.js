const renderers = {
  intro: introScreen,
  course: courseScreen,
  discountScan: discountRegistrationScreen,
  discountUse: discountUseScreen,
  payment: paymentScreen,
  cardPay: cardPayScreen,
  paymentComplete: () => paymentCompleteScreen('',false)
};
const v06Intro = introScreen;
const v06Course = courseScreen;
const v06Payment = paymentScreen;
const v06Scan = scanScreen;
const v06Completion = completionContent;
applyIntroScreens();
applyCourseScreens();
applyPaymentScreens();
applyCompletionScreens();
for (const key of Object.keys(renderers)) if (!Object.hasOwn(screenMeta,key)) delete renderers[key];

const testFlow = Object.keys(screenMeta);
const motionEase = 'cubic-bezier(.16,1,.3,1)';
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let navigationVersion = 0;
let transitionBusy = false;
let processing = false;
let processingTimer = null;
let noticeTimer = null;
let feedbackMessage = '';
let amountBeforeDiscount = null;

function animateTest(node, frames, options = {}) {
  if (!node || reduceMotion.matches) return Promise.resolve();
  return node.animate(frames,{duration:360,easing:motionEase,...options}).finished.catch(() => {});
}

function testContent() {
  return kiosk.querySelector('.design-intro-body,.design-course-body,.design-payment-body,.design-scan-body,.design-card-body,.design-complete-body,.main-zone');
}

async function paintTestChoice(source, instant = false) {
  if (!source) return;
  const layer = document.createElement('span');
  layer.className = 'test-paint-layer';
  layer.setAttribute('aria-hidden','true');
  layer.inert = true;
  const copy = document.createElement('span');
  copy.className = `${source.className} test-paint-copy`;
  copy.innerHTML = source.innerHTML;
  copy.querySelectorAll('[data-action],[id]').forEach(node => {
    node.removeAttribute('data-action');
    node.removeAttribute('id');
  });
  const style = getComputedStyle(source);
  for (const key of ['display','flexDirection','alignItems','justifyContent','gap','padding','fontSize','fontWeight','lineHeight','textAlign']) copy.style[key] = style[key];
  layer.append(copy);
  source.append(layer);
  if (instant || reduceMotion.matches) {
    layer.style.setProperty('--test-paint-progress','132%');
  } else {
    await animateTest(layer,[{'--test-paint-progress':'0%'},{'--test-paint-progress':'132%'}],{duration:520,easing:'cubic-bezier(.3,0,.25,1)',fill:'forwards'});
  }
  layer.classList.add('test-paint-done');
}

function animateTestEntrance(previous, backwards = false) {
  const dialog = kiosk.querySelector('.design-discount-dialog');
  if (dialog) {
    return Promise.all([
      animateTest(kiosk.querySelector('.design-dialog-dim'),[{opacity:0},{opacity:1}],{duration:240}),
      animateTest(dialog,[{opacity:0,translate:'0 24px'},{opacity:1,translate:'0 0'}],{duration:320})
    ]);
  }
  const animations = [animateTest(testContent(),[
    {opacity:0,translate:`0 ${backwards ? -16 : 20}px`},
    {opacity:1,translate:'0 0'}
  ])];
  kiosk.querySelectorAll('.design-vehicle,.design-course-card').forEach((card,index) => {
    animations.push(animateTest(card,[{opacity:0,translate:'0 24px'},{opacity:1,translate:'0 0'}],{duration:300,delay:35 * index}));
  });
  return Promise.all(animations);
}

function focusTestScreen() {
  const target = kiosk.querySelector('.design-discount-dialog button') || kiosk.querySelector('.test-card-reader') || kiosk.querySelector('h2');
  if (!target) return;
  if (!target.matches('button,[role="button"]')) target.tabIndex = -1;
  target.focus({preventScroll:true});
}

function animateDiscountAmount() {
  if (amountBeforeDiscount === null || state.screen !== 'payment') return;
  const node = kiosk.querySelector('.design-amounts .total strong');
  amountBeforeDiscount = null;
  if (!node || reduceMotion.matches) return;
  animateTest(node,[{opacity:0,translate:'0 18px'},{opacity:1,translate:'0 0'}],{duration:320});
}

function prepareTestControls() {
  if (state.screen === 'discountScan') {
    const background = kiosk.querySelector('.design-course-body');
    background.inert = true;
    background.setAttribute('aria-hidden','true');
    paintTestChoice(kiosk.querySelector(`.design-course-card[data-course="${state.selectedCourse.id}"]`),true);
  }
  kiosk.querySelectorAll('[data-action="admin-entry-tap"]').forEach(node => node.remove());
  kiosk.querySelectorAll('[data-action]').forEach(node => {
    const action = node.dataset.action;
    const supported = ['start','select-course','skip-discount','discount-use','discount-validate','pay-method','back','choose-course','course-home'].includes(action);
    if (!supported || action === 'pay-method' && !['card','discount'].includes(node.dataset.method)) {
      node.disabled = true;
      node.setAttribute('aria-disabled','true');
      if (node.classList.contains('design-app-banner')) node.classList.add('test-static');
      else node.title = '이번 인터랙션 테스트에서 제외된 기능입니다.';
    }
  });
  if (state.screen === 'cardPay') {
    const reader = kiosk.querySelector('.design-card-reader');
    reader.classList.add('test-card-reader');
    reader.dataset.action = 'test-card-submit';
    reader.setAttribute('role','button');
    reader.setAttribute('aria-label','카드 인식 체험');
    reader.tabIndex = 0;
  }
  if (state.screen === 'paymentComplete') {
    kiosk.querySelectorAll('.design-payment-footer button').forEach(node => {
      node.disabled = true;
      node.classList.add('test-static');
      node.setAttribute('aria-disabled','true');
      node.title = '이번 테스트는 결제완료에서 종료됩니다. 테스트 패널에서 다시 시작하세요.';
    });
  }
}

render = function() {
  if (!Object.hasOwn(screenMeta,state.screen)) state.screen = 'intro';
  kiosk.className = `kiosk test-kiosk height-${state.height}`;
  kiosk.dataset.screen = state.screen;
  kiosk.innerHTML = renderers[state.screen]();
  prepareTestControls();
  const meta = screenMeta[state.screen];
  document.getElementById('currentScreenName').textContent = meta.label;
  document.getElementById('currentScreenReq').textContent = meta.id;
  document.getElementById('currentScreenNote').textContent = meta.note;
  document.querySelectorAll('[data-test-route]').forEach(node => {
    node.classList.toggle('active',node.dataset.testRoute === state.screen);
    if (node.dataset.testRoute === state.screen) node.setAttribute('aria-current','step');
    else node.removeAttribute('aria-current');
  });
  document.querySelectorAll('[data-test-height]').forEach(node => node.setAttribute('aria-pressed',String(node.dataset.testHeight === state.height)));
  if (feedbackMessage && state.screen === 'payment') {
    const toast = document.createElement('div');
    toast.className = 'test-discount-feedback';
    toast.setAttribute('role','status');
    toast.innerHTML = '<b aria-hidden="true">✓</b><span></span>';
    toast.querySelector('span').textContent = feedbackMessage;
    kiosk.append(toast);
    animateTest(toast,[{opacity:0,scale:'.88 1'},{opacity:1,scale:'1 1'}],{duration:280});
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(async () => {
      feedbackMessage = '';
      await animateTest(toast,[{opacity:1},{opacity:0}],{duration:180});
      toast.remove();
    },1800);
  }
  animateDiscountAmount();
  if (!embedMode) fitKiosk();
};

go = async function(next,push = true,{backwards = false,source = null} = {}) {
  if (!Object.hasOwn(screenMeta,next) || transitionBusy || processing) return false;
  const version = ++navigationVersion, previous = state.screen;
  transitionBusy = true;
  kiosk.inert = true;
  kiosk.setAttribute('aria-busy','true');
  if (source) {
    await paintTestChoice(source);
    if (version !== navigationVersion) return false;
  }
  const dialog = kiosk.querySelector('.design-discount-dialog');
  const outgoing = dialog || testContent();
  if (!(previous === 'course' && next === 'discountScan')) {
    await Promise.all([
      animateTest(outgoing,[{opacity:1},{opacity:0}],{duration:160}),
      dialog ? animateTest(kiosk.querySelector('.design-dialog-dim'),[{opacity:1},{opacity:0}],{duration:160}) : Promise.resolve()
    ]);
  }
  if (version !== navigationVersion) return false;
  clearTimers();
  clearTimeout(noticeTimer);
  if (next !== 'payment') feedbackMessage = '';
  if (push && previous !== next) state.history.push(previous);
  state.screen = next;
  render();
  await animateTestEntrance(previous,backwards);
  if (version !== navigationVersion) return false;
  transitionBusy = false;
  kiosk.inert = false;
  kiosk.setAttribute('aria-busy','false');
  focusTestScreen();
  return true;
};

function beginTestProcessing(kind) {
  if (processing || transitionBusy) return;
  processing = true;
  const version = navigationVersion;
  kiosk.classList.add(kind === 'scan' ? 'test-is-scanning' : 'test-is-paying');
  kiosk.setAttribute('aria-busy','true');
  kiosk.inert = true;
  if (kind === 'card') {
    const status = document.createElement('span');
    status.className = 'test-reader-status';
    status.setAttribute('role','status');
    status.innerHTML = '<strong>결제 확인 중</strong><span class="test-approval-progress" aria-hidden="true"><i></i></span><span class="test-approval-done" aria-hidden="true">✓</span>';
    kiosk.querySelector('.test-card-reader').append(status);
  }
  processingTimer = setTimeout(() => {
    if (version !== navigationVersion) return;
    processing = false;
    if (kind === 'scan') {
      amountBeforeDiscount = payableAmount();
      state.discountApplied = true;
      feedbackMessage = `${formatPrice(configuredDiscountAmount())} 할인이 적용되었습니다.`;
      go('payment');
    } else go('paymentComplete');
  },kind === 'scan' ? 650 : 1000);
}

function resetTest(next = 'intro') {
  if (!Object.hasOwn(screenMeta,next)) next = 'intro';
  navigationVersion++;
  clearTimeout(processingTimer);
  clearTimeout(noticeTimer);
  clearTimers();
  kiosk.getAnimations({subtree:true}).forEach(animation => animation.cancel());
  transitionBusy = false;
  processing = false;
  feedbackMessage = '';
  amountBeforeDiscount = null;
  resetPaymentAdjustments();
  state.selectedCourse = courses[2];
  state.frontCar = false;
  state.communicationError = false;
  state.timeoutVisible = false;
  state.history = [];
  state.screen = next;
  kiosk.inert = false;
  kiosk.setAttribute('aria-busy','false');
  render();
  animateTestEntrance('');
}

handleAction = function(target) {
  if (target.disabled || transitionBusy || processing) return;
  const action = target.dataset.action;
  if (action === 'start') {
    state.height = target.dataset.height === 'high' ? 'high' : 'low';
    return go('course',true,{source:target});
  }
  if (action === 'select-course') {
    const course = courses.find(item => item.id === target.dataset.course);
    if (!course) return;
    state.selectedCourse = course;
    resetPaymentAdjustments();
    return go('discountScan',true,{source:target});
  }
  if (action === 'skip-discount') return go('payment');
  if (action === 'discount-use') return go('discountUse');
  if (action === 'discount-validate' && state.screen === 'discountUse') return beginTestProcessing('scan');
  if (action === 'test-card-submit' && state.screen === 'cardPay') return beginTestProcessing('card');
  if (action === 'pay-method' && state.screen === 'payment') {
    if (target.dataset.method === 'card') return go('cardPay',true,{source:target});
    if (target.dataset.method === 'discount' && !state.discountApplied) return go('discountUse',true,{source:target});
    return;
  }
  if (action === 'choose-course' || action === 'course-home') {
    resetPaymentAdjustments();
    return go('course',false,{backwards:true});
  }
  if (action === 'back') {
    return go(state.screen === 'cardPay' || state.screen === 'discountUse' ? 'payment' : 'course',false,{backwards:true});
  }
};

document.getElementById('testFlow').innerHTML = testFlow.map((key,index) => `<button data-test-route="${key}"><span>${String(index+1).padStart(2,'0')}</span><strong>${screenMeta[key].label}</strong></button>`).join('');
document.addEventListener('click',event => {
  if (event.target.closest('[data-test-restart]')) return resetTest();
  const jump = event.target.closest('[data-test-route]');
  if (jump) return resetTest(jump.dataset.testRoute);
  const height = event.target.closest('[data-test-height]');
  if (height) {
    if (processing || transitionBusy) return;
    state.height = height.dataset.testHeight === 'high' ? 'high' : 'low';
    render();
    return;
  }
  const target = event.target.closest('#kiosk [data-action]');
  if (target) handleAction(target);
});
document.addEventListener('keydown',event => {
  const reader = event.target.closest('.test-card-reader');
  if (reader && ['Enter',' '].includes(event.key)) {event.preventDefault();return handleAction(reader);}
  const dialog = kiosk.querySelector('.design-discount-dialog');
  if (!dialog) return;
  const buttons = [...dialog.querySelectorAll('button')];
  if (event.key === 'Escape') {event.preventDefault();return handleAction(buttons[0]);}
  if (event.key !== 'Tab') return;
  const index = buttons.indexOf(document.activeElement);
  if (index < 0 || event.shiftKey && index === 0 || !event.shiftKey && index === buttons.length-1) {
    event.preventDefault();buttons[event.shiftKey ? buttons.length-1 : 0].focus();
  }
});
window.addEventListener('resize',() => {if (!embedMode) fitKiosk();});
if (embedMode) document.body.classList.add('embed');
resetTest(Object.hasOwn(screenMeta,state.screen) ? state.screen : 'intro');
console.assert(Object.keys(renderers).length === 7 && Object.keys(renderers).every(key => Object.hasOwn(screenMeta,key)),'테스트는 지정한 7개 화면으로 제한합니다.');
