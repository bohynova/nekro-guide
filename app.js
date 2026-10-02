const main=document.getElementById('main');
const navLinks=[...document.querySelectorAll('[data-route]')];
function route(){
  const [raw,sub] = location.hash.slice(1).split('/');
  const key=Object.hasOwn(PAGES,raw)?raw:'turn';
  const page=PAGES[key];
  const subkey=page.tabs && Object.hasOwn(page.tabs,sub)?sub:Object.keys(page.tabs||{})[0];
  let tabs='';
  if(page.tabs){tabs=`<div class="tabs" role="tablist" aria-label="Темы раздела">${Object.entries(page.tabs).map(([id,data])=>`<button type="button" id="tab-${id}" role="tab" aria-selected="${id===subkey}" aria-controls="topic" tabindex="${id===subkey?0:-1}" data-sub="${id}" data-parent="${key}">${data.label}</button>`).join('')}</div>`;}
  main.innerHTML=`<div class="page-head"><div><div class="eyebrow">${page.kicker}</div><h1>${page.title}</h1>${page.intro?`<p>${page.intro}</p>`:''}</div><span class="tag ${page.kind||''}">${page.kind==='advice'?'СТРАТЕГИЧЕСКИЕ СОВЕТЫ':'ПАМЯТКА'}</span></div>${tabs}<div id="topic" ${page.tabs?`role="tabpanel" aria-labelledby="tab-${subkey}"`:''}>${page.tabs?page.tabs[subkey].html:page.html}</div>`;
  navLinks.forEach(a=>{const active=a.dataset.route===key;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.title=`${page.title} · Некровирус`;
}
window.addEventListener('hashchange',()=>{route();window.scrollTo({top:0,behavior:'instant'});});
document.addEventListener('click',e=>{
  const tab=e.target.closest('[data-sub]');
  if(tab){location.hash=`${tab.dataset.parent}/${tab.dataset.sub}`;requestAnimationFrame(()=>document.getElementById(`tab-${tab.dataset.sub}`)?.focus({preventScroll:true}));}
});
document.addEventListener('keydown',e=>{
  const current=e.target.closest('[role=tab]');
  if(!current||!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;
  e.preventDefault();const buttons=[...current.parentElement.querySelectorAll('[role=tab]')];const index=buttons.indexOf(current);const next=e.key==='Home'?0:e.key==='End'?buttons.length-1:(index+(e.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[next].click();
});
route();
