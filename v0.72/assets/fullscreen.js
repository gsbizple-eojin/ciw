const fullscreenStart=document.querySelector('[data-test-fullscreen]');
const fullscreenExit=document.querySelector('[data-test-fullscreen-exit]');
const panelFitKiosk=fitKiosk;
fitKiosk=function(){
  if(!document.body.classList.contains('test-fullscreen'))return panelFitKiosk();
  const scale=Math.min(stage.clientWidth/1080,stage.clientHeight/1920);
  kioskShell.style.transform='scale('+scale+')';
  kioskShell.style.margin=(-(1920*(1-scale))/2)+'px '+(-(1080*(1-scale))/2)+'px';
};
function exitTestFullscreen(){
  document.body.classList.remove('test-fullscreen');
  fullscreenStart.setAttribute('aria-pressed','false');
  if(!embedMode)fitKiosk();
}
fullscreenStart.onclick=async()=>{
  document.body.classList.add('test-fullscreen');
  fullscreenStart.setAttribute('aria-pressed','true');
  fitKiosk();
  try{if(!document.fullscreenElement&&document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();}catch{/* Keep the window-filling view when the host does not allow browser fullscreen. */}
  fitKiosk();
};
fullscreenExit.onclick=async()=>{
  if(document.fullscreenElement)await document.exitFullscreen();
  exitTestFullscreen();
  fullscreenStart.focus();
};
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)exitTestFullscreen();else fitKiosk();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!document.fullscreenElement&&document.body.classList.contains('test-fullscreen')){exitTestFullscreen();fullscreenStart.focus();}});
