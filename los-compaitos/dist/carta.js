(() => {
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const money=n=>`$${n.toFixed(2)}`;
 const product=id=>MENU.find(p=>p.id===id);
 function rows(products,short=false){return `<dl class="printed-prices">${products.map(p=>`<div><dt>${esc(short?p.name.replace(/^Queso fundido /,'').replace(/^./,c=>c.toUpperCase()):p.name)}</dt><dd>${money(p.price)}</dd></div>`).join('')}</dl>`;}
 document.querySelectorAll('[data-carta-category]').forEach(el=>{el.innerHTML=rows(MENU.filter(p=>p.category===el.dataset.cartaCategory),el.dataset.short==='cheese');});
 document.querySelectorAll('[data-carta-ids]').forEach(el=>{el.innerHTML=rows(el.dataset.cartaIds.split(',').map(product));});
 document.querySelectorAll('[data-carta-specials]').forEach(el=>{el.innerHTML=el.dataset.cartaSpecials.split(',').map(product).map(p=>`<div class="printed-special"><h3>${esc(p.name)} <span>· ${money(p.price)}</span></h3><p>${esc(p.description)}</p></div>`).join('');});
 document.querySelectorAll('[data-price-id]').forEach(el=>{el.textContent=money(product(el.dataset.priceId).price);});
 document.querySelector('[data-carta-rows="kilos"]').innerHTML=rows([{name:'Carne al pastor o árabe',price:product('p37').price},{name:'Carne al pastor o árabe con queso',price:product('p39').price}]);
 document.querySelector('[data-delivery-price]').textContent=money(BUSINESS.deliveryFee);
 document.querySelector('#carta-branches').innerHTML=BUSINESS.branches.map(b=>`<div><h3>${esc(b.name)}</h3><p>${esc(b.address)}</p><a href="tel:+52${b.phone}">${b.phone.replace(/(\d{3})(\d{3})(\d{4})/,'$1 $2 $3')}</a></div>`).join('');
})();
