const files=['0.png','1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','A0.png','A1.png','A2.png','A3.png','A4.png','A5.png','A6.png','A7.png','A7-1.png'];
const image=document.querySelector('#design'),picker=document.querySelector('#picker'),prev=document.querySelector('#prev'),next=document.querySelector('#next'),full=document.querySelector('#fullscreen');
let current=0,idleTimer;
for(const [i,name] of files.entries()){const option=document.createElement('option');option.value=i;option.textContent=name;picker.append(option);}
function show(index){current=Math.max(0,Math.min(files.length-1,index));document.querySelector('#error').hidden=true;image.src='기타 시안_261021/'+encodeURIComponent(files[current]);image.alt='기타 시안 '+(current+1);picker.value=current;prev.disabled=current===0;next.disabled=current===files.length-1;document.querySelector('#count').textContent=`${current+1} / ${files.length}`;document.title=`CIW · 기타 시안 ${current+1} / ${files.length}`;wake();}
function wake(){document.body.classList.remove('idle');clearTimeout(idleTimer);idleTimer=setTimeout(()=>document.body.classList.add('idle'),3000);}
prev.onclick=()=>show(current-1);next.onclick=()=>show(current+1);picker.onchange=()=>show(Number(picker.value));image.onerror=()=>document.querySelector('#error').hidden=false;
document.addEventListener('keydown',e=>{wake();if(e.target.matches('select'))return;const keys={ArrowLeft:current-1,ArrowRight:current+1,Home:0,End:files.length-1};if(e.key in keys){e.preventDefault();show(keys[e.key]);}});
document.addEventListener('pointermove',wake);document.addEventListener('pointerdown',wake);document.addEventListener('focusin',wake);
full.onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{full.textContent='F11로 전체화면';}};
document.addEventListener('fullscreenchange',()=>{full.textContent=document.fullscreenElement?'전체화면 해제':'전체화면';wake();});show(0);
