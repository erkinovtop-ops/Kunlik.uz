/* KUNLIK.UZ — main.js */

// ===== LANGUAGE =====
const TR = {
  latn:{
    loading:'Yuklanmoqda...',copy:'Nusxalandi!',
    days:['Yak','Du','Se','Cho','Pa','Ju','Sha'],
    months:['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'],
    prayers:{Fajr:'Bomdod',Sunrise:'Quyosh',Dhuhr:'Peshin',Asr:'Asr',Maghrib:'Shom',Isha:'Xufton'},
    nextPrayer:'Keyingi namoz',remaining:"qoldi",
    ishlash:'Ishlash',dam:'Dam olish',uzunDam:'Uzoq dam',
    harf:"harf",soz:"so'z",qator:"qator",daq:"daq",
  },
  kril:{
    loading:'Юкланмоқда...',copy:'Нусхаланди!',
    days:['Якш','Душ','Се','Чор','Па','Жу','Ша'],
    months:['Январ','Феврал','Март','Апрел','Май','Июн','Июл','Август','Сентабр','Октабр','Ноябр','Декабр'],
    prayers:{Fajr:'Бомдод',Sunrise:'Қуёш',Dhuhr:'Пешин',Asr:'Аср',Maghrib:'Шом',Isha:'Хуфтон'},
    nextPrayer:'Кейинги намоз',remaining:"қолди",
    ishlash:'Ишлаш',dam:'Дам олиш',uzunDam:'Узоқ дам',
    harf:"ҳарф",soz:"сўз",qator:"қатор",daq:"дақ",
  }
};

let currentLang = localStorage.getItem('kunlik_lang') || null;
window.currentLang = currentLang;

function setLang(lang){
  currentLang=lang;
  window.currentLang=lang;
  localStorage.setItem('kunlik_lang',lang);
  document.documentElement.setAttribute('data-lang',lang);
  document.getElementById('langModal').style.display='none';
  applyLang();
  // Refresh city tabs text
  document.querySelectorAll('.city-tab').forEach(btn=>{
    const cid=btn.dataset.cityId;
    if(!cid||typeof CITIES==='undefined')return;
    const city=CITIES.find(c=>c.id===cid);
    if(city)btn.textContent=city[lang]||city.latn;
  });
  // Refresh prayer city select
  const ps=document.getElementById('prayerCitySelect');
  if(ps&&typeof PCITIES!=='undefined'){
    Array.from(ps.options).forEach((opt,i)=>{
      if(PCITIES[i])opt.textContent=PCITIES[i][lang]||PCITIES[i].latn;
    });
  }
  // Re-render weather if active
  if(typeof activeCity!=='undefined'&&activeCity){
    loadCurrentCity(activeCity);
    loadRegions();
  }
  // Re-render prayer
  const pci=ps?parseInt(ps.value):0;
  if(typeof PCITIES!=='undefined')loadPrayer(PCITIES[pci]||PCITIES[0]);
}
function openLangModal(){document.getElementById('langModal').style.display='flex'}
function applyLang(){
  if(!currentLang)return;
  document.querySelectorAll('[data-'+currentLang+']').forEach(el=>{
    const v=el.getAttribute('data-'+currentLang);
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA')el.placeholder=v;
    else el.textContent=v;
  });
}
function t(k){const l=window.currentLang||'latn';return (TR[l]&&TR[l][k]!==undefined)?TR[l][k]:k}
function getLang(){return window.currentLang||localStorage.getItem('kunlik_lang')||'latn'}

// ===== SECTION NAVIGATION =====
function showSection(name, btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const sec=document.getElementById('section-'+name);
  if(sec)sec.classList.add('active');
  if(btn)btn.classList.add('active');
  // sync mobile nav
  document.querySelectorAll('.mobile-nav .nav-btn').forEach(b=>{
    b.classList.toggle('active',b.dataset.section===name);
  });
  // mobile nav is always visible as tab bar on mobile
  window.scrollTo({top:0,behavior:'smooth'});
}

// ===== THEME =====
let theme=localStorage.getItem('kunlik_theme')||'dark';
function initTheme(){
  document.documentElement.setAttribute('data-theme',theme);
  const icon=document.getElementById('themeIcon');
  if(icon){
    if(theme==='dark'){
      icon.innerHTML='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
    } else {
      icon.innerHTML='<circle cx="12" cy="12" r="5"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>';
    }
  }
}
document.getElementById('themeToggle').addEventListener('click',()=>{
  theme=theme==='dark'?'light':'dark';
  localStorage.setItem('kunlik_theme',theme);
  initTheme();
});

// ===== REGIONS TOGGLE =====
let regionsOpen = false;
function toggleRegions(){
  regionsOpen = !regionsOpen;
  const grid = document.getElementById('regionsGrid');
  const btn  = document.getElementById('regionsToggleBtn');
  const arrow = btn.querySelector('.regions-toggle-arrow');
  if(regionsOpen){
    grid.classList.remove('regions-grid-collapse');
    arrow.style.transform = 'rotate(180deg)';
    btn.classList.add('active');
  } else {
    grid.classList.add('regions-grid-collapse');
    arrow.style.transform = '';
    btn.classList.remove('active');
  }
}
// ===== BURGER — removed =====

// Build mobile nav clone
function buildMobileNav(){
  const mn=document.getElementById('mobileNav');
  const mainNav=document.getElementById('mainNav');
  if(!mn||!mainNav)return;
  mn.innerHTML='';
  mainNav.querySelectorAll('.nav-btn').forEach(btn=>{
    const clone=btn.cloneNode(true);
    clone.addEventListener('click',()=>{
      const sec=btn.dataset.section;
      showSection(sec,btn);
    });
    mn.appendChild(clone);
  });
}

// ===== HEADER SCROLL =====
window.addEventListener('scroll',()=>{
  document.getElementById('header').classList.toggle('scrolled',window.scrollY>10);
});

// ===== PARTICLES =====
function initParticles(){
  // Particles disabled — keeping function to avoid errors
  const c=document.getElementById('particles');
  if(c) c.style.display='none';
}

// ===== TILT CARDS — disabled =====
function initTilt(){}

// ===== TOAST =====
function showToast(msg){
  document.querySelectorAll('.toast').forEach(t=>t.remove());
  const t=document.createElement('div');
  t.className='toast';t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.opacity='0';t.style.transition='opacity .3s';setTimeout(()=>t.remove(),300);},2500);
}

// ===== CONTACT FORM =====
function sendTelegram(){
  const name=document.getElementById('contactName').value.trim();
  const msg=document.getElementById('contactMsg').value.trim();
  if(!name||!msg){showToast('❌ Ism va xabarni kiriting!');return;}
  const text=encodeURIComponent(`👤 ${name}\n💬 ${msg}\n\n📌 Kunlik.uz`);
  window.open(`https://t.me/ErkinovTOP?text=${text}`,'_blank');
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded',()=>{
  if(!currentLang){
    document.getElementById('langModal').style.display='flex';
  } else {
    document.getElementById('langModal').style.display='none';
    applyLang();
  }
  initTheme();
  initParticles();
  buildMobileNav();
  setTimeout(initTilt,600);
});
