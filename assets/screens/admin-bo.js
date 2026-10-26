function applyAdminBoScreens(){
 const values={adminHome:{},adminHomeV2:{},adminSystem:{}};
 function valueKey(key=state.screen){return key==='adminHome'&&state.adminLayout==='v2'?'adminHomeV2':key;}
 function renderBo(key,index){
  const useV2=key==='adminHome'&&state.adminLayout==='v2';
  const holder=document.createElement('div');holder.innerHTML=useV2?CIW_BO_V2_DESIGN.html:CIW_BO_DESIGNS[index].html;
  const root=holder.firstElementChild;root.classList.add('bo-admin');root.dataset.adminLayout=useV2?'v2':'original';if(useV2)root.classList.add('bo-v2');
  root.querySelectorAll('[data-name^="function_number/"]').forEach(e=>e.remove());
  root.querySelector('[data-name="bt-kiosk-system"]')?.classList.add('bo-footer');
  root.querySelector('[data-name="Tab 1depth-kiosk"]')?.parentElement.classList.add('bo-content');
  if(useV2){root.querySelector('[data-name="viewport/설정 내부 스크롤"]').classList.add('bo-v2-scroll');root.querySelectorAll('[data-name^="scrollbar/"]').forEach(e=>e.remove());}
  root.querySelectorAll('[data-name="Tab-Kiosk-element"],[data-name^="tab/"]').forEach((e,i)=>{e.dataset.adminTab=i?'system':'kiosk';e.setAttribute('role','tab');e.tabIndex=0;e.setAttribute('aria-selected',String(i===index));});
  const buttonNodes=root.querySelectorAll('[data-name="bt-kiosk"],[id="node-541_14306"],[id="node-541_14370"]');
  buttonNodes.forEach(e=>{e.dataset.boButton=e.textContent.trim();e.setAttribute('role','button');e.tabIndex=0;if(e.textContent.trim()==='나가기')e.dataset.action='home';});
  let control=0;
  root.querySelectorAll('[data-name="Dropdown_kiosk"],[id="node-500_16861"],[id="node-500_16860"]').forEach(e=>{
   if(!e.querySelector('img'))return;
   const initial=e.querySelector('p')?.textContent.trim()||'',field=String(control++),row=e.closest('[data-name="<set>Input_kiosk"],[data-name^="setting/"]'),label=row?.querySelector('p')?.textContent.trim()||'코스 선택';
   let options=initial.includes('강남')?['강남본점','직영점 A','가맹점 B']:initial.includes('호기')?['1호기','2호기','3호기']:initial.includes('포세이돈')?['포세이돈2 울트라','포세이돈2']:['베이직','디럭스','프리미엄','울티메이트'];
   if(!options.includes(initial))options.unshift(initial);
   const select=document.createElement('select');select.className='bo-select'+(label==='지점명'&&!useV2?' bo-select-branch':'');select.dataset.boField=field;select.setAttribute('aria-label',label);options.forEach(v=>select.add(new Option(v,v)));select.value=values[valueKey(key)][field]??initial;[...select.options].forEach(o=>o.selected?o.setAttribute('selected',''):o.removeAttribute('selected'));
   e.classList.add('bo-select-wrap');e.querySelector('p')?.parentElement.remove();e.prepend(select);
  });
  root.querySelectorAll('[data-name="Text field_kiosk"]').forEach(e=>{
   if(e.querySelector('[id="node-357_27"],[id="node-357_28"]'))return;
   const field=String(control++),initial=e.textContent.trim(),input=document.createElement('input');input.className='bo-input';input.dataset.boField=field;input.setAttribute('value',values[valueKey(key)][field]??initial);input.setAttribute('aria-label',e.closest('[data-name="<set>Input_kiosk"],[data-name^="setting/"]')?.querySelector('p')?.textContent.trim()||'설정값');e.replaceChildren(input);
  });
  root.querySelectorAll('[id="node-357_27"],[id="node-357_28"]').forEach(toggle=>{
   const field=String(control++),parent=toggle.parentElement,on=values[valueKey(key)][field]??toggle.id==='node-357_27';
   parent.classList.add('bo-toggle');parent.dataset.boField=field;parent.dataset.boToggle='';parent.setAttribute('role','switch');parent.setAttribute('aria-label',parent.parentElement.querySelector('[data-name="Label Base_kiosk"],[data-name="label"]')?.textContent.trim()||'설정 사용 여부');parent.setAttribute('aria-checked',String(on));parent.tabIndex=0;toggle.classList.add('bo-knob');const p=parent.querySelector('p');if(p)p.textContent=on?'사용':'미사용';
  });
  return root.outerHTML;
 }
 renderers.adminHome=()=>renderBo('adminHome',0);renderers.adminSystem=()=>renderBo('adminSystem',1);
 kiosk.addEventListener('input',e=>{if(e.target.matches('.bo-admin input,.bo-admin select'))values[valueKey()][e.target.dataset.boField]=e.target.value;});
 kiosk.addEventListener('change',e=>{if(e.target.matches('.bo-admin select'))values[valueKey()][e.target.dataset.boField]=e.target.value;});
 kiosk.addEventListener('keydown',e=>{const el=e.target.closest('.bo-admin [role="button"],.bo-admin [role="switch"],.bo-admin [role="tab"]');if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();el.click();}});
 kiosk.addEventListener('click',e=>{
  const toggle=e.target.closest('.bo-admin [data-bo-toggle]');if(toggle){const on=toggle.getAttribute('aria-checked')!=='true';toggle.setAttribute('aria-checked',String(on));values[valueKey()][toggle.dataset.boField]=on;toggle.querySelector('p').textContent=on?'사용':'미사용';return;}
  const button=e.target.closest('.bo-admin [data-bo-button]');if(!button||button.dataset.action)return;
  kiosk.querySelector('.bo-feedback')?.remove();const feedback=document.createElement('div');feedback.className='bo-feedback';feedback.setAttribute('role','status');feedback.textContent=button.dataset.boButton==='설정 저장'?'설정을 저장했습니다. (화면 검토용)':button.dataset.boButton+' 버튼을 선택했습니다. (화면 검토용)';kiosk.append(feedback);setTimeout(()=>feedback.remove(),2200);
 });
}
