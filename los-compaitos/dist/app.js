(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const money = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n);
  const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const read = (k,f) => {try{return JSON.parse(localStorage.getItem(k))??f;}catch{return f;}};
  const save = (k,v) => {try{localStorage.setItem(k,JSON.stringify(v));}catch{/* Navigation still works without storage. */}};
  const themes = {halloween:{banner:'EDICIÓN HALLOWEEN',word:'MIEDO.',tagline:'EL SUSTO ES QUEDARTE CON EL ANTOJO'},original:{banner:'EL BUEN SABOR SE COMPARTE',word:'VERDAD.',tagline:'CON HAMBRE Y CON LOS COMPAS'},navidad:{banner:'EDICIÓN NAVIDAD',word:'FIESTA.',tagline:'EL MEJOR REGALO ES COMPARTIR'}};
  function applyTheme(theme){
    const t=themes[theme]||themes[BUSINESS.theme];
    document.documentElement.dataset.theme=themes[theme]?theme:BUSINESS.theme;
    $$('[data-season-banner]').forEach(el=>el.textContent=t.banner);
    if($('[data-season-word]')) $('[data-season-word]').textContent=t.word;
    if($('.bar-center')) $('.bar-center').textContent=t.tagline;
    if($('#theme-select')) $('#theme-select').value=document.documentElement.dataset.theme;
  }
  applyTheme(read('compaitos-theme',BUSINESS.theme));
  $('#theme-select')?.addEventListener('change',e=>{applyTheme(e.target.value);save('compaitos-theme',e.target.value);});
  let toastTimer;
  function toast(message){if(!$('#toast'))return;$('#toast').textContent=message;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2200);}
  function whatsapp(message){const url=`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;const tab=window.open(url,'_blank');if(tab)tab.opener=null;else window.location.href=url;}
  if($('#branch-cards')) $('#branch-cards').innerHTML=BUSINESS.branches.map((b,i)=>`<article class="branch-card"><span class="branch-number">0${i+1} / LOS COMPAITOS</span><h3>${escapeHTML(b.name)}</h3><p>${escapeHTML(b.address)}</p><p class="branch-hours">Llámanos para consultar el horario de hoy.</p><div class="branch-links"><a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.map)}" target="_blank" rel="noopener">Buscar en Maps ↗</a><a href="tel:+52${b.phone}">Llamar ${b.phone.replace(/(\d{3})(\d{3})(\d{4})/,'$1 $2 $3')} ↗</a></div></article>`).join('');
  const eventForm=$('#event-form');
  if(eventForm){const now=new Date();const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');eventForm.elements.date.min=today;eventForm.addEventListener('submit',e=>{e.preventDefault();const f=new FormData(eventForm);const location=String(f.get('location')).trim();if(!location){eventForm.elements.location.setCustomValidity('Escribe la ubicación del evento.');eventForm.elements.location.reportValidity();return;}const date=String(f.get('date')).split('-').reverse().join('/');whatsapp(`¡Hola, Los Compaitos! Quisiera cotizar una taquiza a domicilio.\nFecha: ${date}\nPersonas: ${f.get('guests')}\nUbicación: ${location}\n¿Me comparten disponibilidad, opciones y precio?`);});eventForm.elements.location.addEventListener('input',()=>eventForm.elements.location.setCustomValidity(''));}
  $('#print-qr')?.addEventListener('click',()=>window.print());
  const hero=$('.hero-art');
  if(hero && matchMedia('(hover:hover) and (prefers-reduced-motion:no-preference)').matches){hero.addEventListener('pointermove',e=>{const r=hero.getBoundingClientRect();$('.hero-food').style.transform=`scale(1.07) translate(${(e.clientX-r.left-r.width/2)*.018}px,${(e.clientY-r.top-r.height/2)*.018}px)`;});hero.addEventListener('pointerleave',()=>$('.hero-food').style.transform='scale(1.03)');setTimeout(()=>{if($('.hero-food'))$('.hero-food').style.animation='none';},1600);}
  if(!$('#menu-results')) return;
  const params=new URLSearchParams(location.search);
  const categories=[...new Set(MENU.map(p=>p.category))];
  let category=categories.includes(params.get('categoria'))?params.get('categoria'):'Todo';
  const normal=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
  let branch=params.get('sucursal')||read('compaitos-branch',BUSINESS.branches[0].id);
  if(!BUSINESS.branches.some(b=>b.id===branch))branch=BUSINESS.branches[0].id;
  const byWeight=p=>p.category==='Por kilo';
  const step=p=>byWeight(p)?0.5:1;
  const weightName=p=>p.name.replace(/^Kilo de /i,'');
  const orderLine=p=>byWeight(p)?`${p.quantity} kg de ${weightName(p)}`:`${p.quantity} × ${p.name}`;
  const rawCart=read('compaitos-cart',{});
  let cart={};
  if(rawCart && typeof rawCart==='object'&&!Array.isArray(rawCart)) for(const p of MENU){const q=rawCart[p.id];if(typeof q==='number'&&Number.isInteger(q/step(p))&&q>0&&q<=99)cart[p.id]=q;}
  for(const selector of ['#branch-select','#order-branch']){$(selector).innerHTML=BUSINESS.branches.map(b=>`<option value="${b.id}">${escapeHTML(b.name)}</option>`).join('');$(selector).value=branch;$(selector).addEventListener('change',e=>{branch=e.target.value;$('#branch-select').value=branch;$('#order-branch').value=branch;save('compaitos-branch',branch);});}
  function renderMenu(){
    $('#categories').innerHTML=['Todo',...categories].map(c=>`<button class="category-button ${category===c?'active':''}" data-category="${escapeHTML(c)}" aria-pressed="${category===c}">${escapeHTML(c)}</button>`).join('');
    const query=normal($('#menu-search').value.trim());
    const products=MENU.filter(p=>(category==='Todo'||p.category===category)&&normal(`${p.name} ${p.description}`).includes(query));
    $('#menu-results').innerHTML=categories.map(c=>{const items=products.filter(p=>p.category===c);if(!items.length)return '';return `<section class="menu-category"><h2>${escapeHTML(c)}</h2><div class="menu-list">${items.map(p=>`<article class="menu-item"><h3>${escapeHTML(p.name)}</h3>${p.description?`<p>${escapeHTML(p.description)}</p>`:''}<div class="menu-item-bottom"><strong>${money(p.price)}${byWeight(p)?'<small> / kg</small>':''}</strong>${byWeight(p)?`<div class="weight-options"><button class="add-button" data-add="${p.id}" data-amount="0.5" aria-label="Agregar medio kilo de ${escapeHTML(weightName(p))}">½ kg · ${money(p.price/2)} <span>+</span></button><button class="add-button" data-add="${p.id}" data-amount="1" aria-label="Agregar un kilo de ${escapeHTML(weightName(p))}">1 kg · ${money(p.price)} <span>+</span></button></div>`:`<button class="add-button" data-add="${p.id}" aria-label="Agregar ${escapeHTML(p.name)}">Agregar <span>+</span></button>`}</div></article>`).join('')}</div></section>`;}).join('');
    $('#menu-empty').hidden=products.length>0;
  }
  $('#categories').addEventListener('click',e=>{const b=e.target.closest('[data-category]');if(!b)return;category=b.dataset.category;const oldScroll=$('#categories').scrollLeft;renderMenu();$('#categories').scrollLeft=oldScroll;const current=$$('[data-category]').find(el=>el.dataset.category===category);current?.focus({preventScroll:true});});
  $('#menu-search').addEventListener('input',renderMenu);
  $('#clear-search').addEventListener('click',()=>{category='Todo';$('#menu-search').value='';renderMenu();$('#menu-search').focus();});
  function items(){return MENU.filter(p=>cart[p.id]).map(p=>({...p,quantity:cart[p.id]}));}
  function total(){return items().reduce((sum,p)=>sum+p.price*p.quantity,0);}
  function shipping(){return count() && $('#order-method').value==='delivery' ? BUSINESS.deliveryFee : 0;}
  function count(){return items().reduce((sum,p)=>sum+(byWeight(p)?1:p.quantity),0);}
  function updateCart(){
    save('compaitos-cart',cart);
    $('#cart-count').textContent=count();$('#cart-bar').hidden=!count();$('#cart-bar-label').textContent=`${count()} ${count()===1?'producto':'productos'}`;$('#cart-bar-total').textContent=money(total()+shipping());$('#cart-subtotal').textContent=money(total());$('#cart-shipping').textContent=shipping()?money(shipping()):'Sin cargo';$('#cart-total').textContent=money(total()+shipping());
    $('#order-form').hidden=!count();
    $('#cart-items').innerHTML=count()?items().map(p=>`<div class="cart-item"><div><h3>${escapeHTML(byWeight(p)?weightName(p):p.name)}</h3><p>${money(p.price*p.quantity)}</p></div><div class="quantity-controls"><button data-quantity="${p.id}" data-delta="${-step(p)}" aria-label="Quitar ${byWeight(p)?'medio kilo':'uno'} de ${escapeHTML(p.name)}">−</button><span aria-label="Cantidad">${p.quantity}${byWeight(p)?' kg':''}</span><button data-quantity="${p.id}" data-delta="${step(p)}" aria-label="Añadir ${byWeight(p)?'medio kilo':'uno'} de ${escapeHTML(p.name)}" ${p.quantity>=99?'disabled':''}>+</button></div></div>`).join(''):'<div class="empty-cart"><p>Tu pedido está esperando un buen antojo.</p><button class="button" id="back-to-menu">Explorar el menú ↗</button></div>';
    $('#back-to-menu')?.addEventListener('click',closeCart);
  }
  function changeQuantity(id,delta){if(!MENU.some(p=>p.id===id))return;const n=(cart[id]||0)+delta;if(n>99){toast('Máximo 99 por producto. Para eventos, cotiza una taquiza.');return;}if(n<=0)delete cart[id];else cart[id]=n;updateCart();}
  $('#menu-results').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(!b)return;changeQuantity(b.dataset.add,Number(b.dataset.amount||1));toast('Agregado a tu pedido');});
  $('#cart-items').addEventListener('click',e=>{const b=e.target.closest('[data-quantity]');if(!b)return;const id=b.dataset.quantity;const delta=b.dataset.delta;changeQuantity(id,Number(delta));const next=$$('[data-quantity]').find(el=>el.dataset.quantity===id&&el.dataset.delta===delta);(next||$('#close-cart')).focus({preventScroll:true});});
  const dialog=$('#cart-dialog');
  function openCart(){updateCart();dialog.showModal();document.body.style.overflow='hidden';}
  function closeCart(){dialog.close();}
  dialog.addEventListener('close',()=>document.body.style.overflow='');
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeCart();}});
  $('#open-cart').addEventListener('click',openCart);$('#cart-bar').addEventListener('click',openCart);$('#close-cart').addEventListener('click',closeCart);
  $('#order-method').addEventListener('change',()=>{const delivery=$('#order-method').value==='delivery';$('#address-field').hidden=!delivery;$('#order-address').disabled=!delivery;$('#order-address').required=delivery;$('#order-address').setCustomValidity('');updateCart();});
  $('#order-address').addEventListener('input',()=>$('#order-address').setCustomValidity(''));
  $('#order-form').addEventListener('submit',e=>{e.preventDefault();if(!count())return;const name=$('#customer-name').value.trim();if(!name){$('#customer-name').setCustomValidity('Escribe tu nombre.');$('#customer-name').reportValidity();return;}const delivery=$('#order-method').value==='delivery';const address=$('#order-address').value.trim();if(delivery&&!address){$('#order-address').setCustomValidity('Escribe la dirección de entrega.');$('#order-address').reportValidity();return;}const notes=$('#order-notes').value.trim();const chosen=BUSINESS.branches.find(b=>b.id===branch);const message=`¡Hola, Los Compaitos! Quiero solicitar un pedido ${delivery?'a domicilio':'para recoger en sucursal'}.\n\nSucursal: ${chosen.name}\nNombre: ${name}${delivery?`\nDirección: ${address}`:''}\n\n${items().map(p=>`${orderLine(p)} — ${money(p.price*p.quantity)}`).join('\n')}\n\nTotal de productos: ${money(total())} MXN\nEnvío: ${delivery?money(shipping())+' MXN':'sin cargo (recoger)'}\nTotal del pedido: ${money(total()+shipping())} MXN${notes?`\nNotas: ${notes}`:''}\n\n¿Me confirman disponibilidad${delivery?', cobertura':''}, precio y tiempo de ${delivery?'entrega':'preparación'}?`;whatsapp(message);});
  $('#customer-name').addEventListener('input',()=>$('#customer-name').setCustomValidity(''));
  renderMenu();updateCart();
})();
