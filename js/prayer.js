/* BUGUN.UZ — prayer.js */
const PCITIES=[
  {id:'urgench',latn:'Urganch',kril:'Урганч',lat:41.55,lon:60.63},
  {id:'tashkent',latn:'Toshkent',kril:'Тошкент',lat:41.2995,lon:69.2401},
  {id:'samarkand',latn:'Samarqand',kril:'Самарқанд',lat:39.6542,lon:66.9597},
  {id:'bukhara',latn:'Buxoro',kril:'Бухоро',lat:39.768,lon:64.4219},
  {id:'andijan',latn:'Andijon',kril:'Андижон',lat:40.7821,lon:72.3442},
  {id:'namangan',latn:'Namangan',kril:'Наманган',lat:41.0011,lon:71.6727},
  {id:'fergana',latn:"Farg'ona",kril:'Фарғона',lat:40.3864,lon:71.7864},
  {id:'nukus',latn:'Nukus',kril:'Нукус',lat:42.46,lon:59.61},
  {id:'navoi',latn:'Navoiy',kril:'Навоий',lat:40.0849,lon:65.3792},
  {id:'qarshi',latn:'Qarshi',kril:'Қарши',lat:38.86,lon:65.79},
  {id:'termiz',latn:'Termiz',kril:'Термиз',lat:37.2242,lon:67.2783},
  {id:'jizzakh',latn:'Jizzax',kril:'Жиззах',lat:40.1158,lon:67.8422}
];
const PORDER=['Fajr','Sunrise','Dhuhr','Asr','Maghrib','Isha'];

// SVG icons for prayers
function pIcon(type){
  const icons={
    Fajr:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 4C8.477 4 4 8.477 4 14s4.477 10 10 10 10-4.477 10-10" stroke="#818cf8" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M14 4C16 8 16 10 14 14" stroke="#818cf8" stroke-width="1.5" stroke-linecap="round"/>
      <circle cx="22" cy="6" r="2.5" fill="#f59e0b"/>
    </svg>`,
    Sunrise:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="16" r="5" fill="#f59e0b" opacity=".9"/>
      <g stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round">
        <line x1="14" y1="6" x2="14" y2="9"/>
        <line x1="22" y1="16" x2="25" y2="16"/>
        <line x1="3" y1="16" x2="6" y2="16"/>
        <line x1="19.8" y1="10.2" x2="17.7" y2="12.3"/>
        <line x1="8.2" y1="10.2" x2="10.3" y2="12.3"/>
      </g>
      <line x1="6" y1="22" x2="22" y2="22" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`,
    Dhuhr:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="6" fill="#f59e0b"/>
      <g stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round">
        <line x1="14" y1="3" x2="14" y2="6"/><line x1="14" y1="22" x2="14" y2="25"/>
        <line x1="3" y1="14" x2="6" y2="14"/><line x1="22" y1="14" x2="25" y2="14"/>
        <line x1="6.5" y1="6.5" x2="8.6" y2="8.6"/><line x1="19.4" y1="19.4" x2="21.5" y2="21.5"/>
        <line x1="21.5" y1="6.5" x2="19.4" y2="8.6"/><line x1="8.6" y1="19.4" x2="6.5" y2="21.5"/>
      </g>
    </svg>`,
    Asr:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <circle cx="18" cy="14" r="5" fill="#f59e0b" opacity=".8"/>
      <g stroke="#f59e0b" stroke-width="1.6" stroke-linecap="round" opacity=".6">
        <line x1="18" y1="6" x2="18" y2="8"/>
        <line x1="25" y1="14" x2="23" y2="14"/>
        <line x1="22.9" y1="9.1" x2="21.4" y2="10.6"/>
      </g>
      <line x1="4" y1="22" x2="20" y2="22" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M4 22 L10 14 L16 18 L20 14" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`,
    Maghrib:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M22 14A8 8 0 1 1 14 6a6 6 0 0 0 8 8z" fill="#f97316" opacity=".9"/>
      <line x1="5" y1="22" x2="23" y2="22" stroke="#f97316" stroke-width="1.8" stroke-linecap="round"/>
      <g stroke="#f97316" stroke-width="1.5" stroke-linecap="round" opacity=".5">
        <line x1="14" y1="3" x2="14" y2="5"/>
        <line x1="25" y1="14" x2="23" y2="14"/>
      </g>
    </svg>`,
    Isha:`<svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M14 5C9 5 5 9 5 14s4 9 9 9 9-4 9-9" stroke="#818cf8" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M22 5L20 9 24 9z" fill="#f59e0b" opacity=".8"/>
      <circle cx="20" cy="10" r="1.5" fill="#f59e0b" opacity=".6"/>
      <circle cx="24" cy="8" r="1" fill="#f59e0b" opacity=".4"/>
    </svg>`,
  };
  return icons[type]||icons.Fajr;
}

function initPrayerSelect(){
  const s=document.getElementById('prayerCitySelect');if(!s)return;
  PCITIES.forEach((c,i)=>{
    const o=document.createElement('option');
    o.value=i;o.textContent=c[getLang()]||c.latn;s.appendChild(o);
  });
  s.addEventListener('change',()=>loadPrayer(PCITIES[s.value]));
}

async function fetchPrayer(city){
  const d=new Date();
  const dd=String(d.getDate()).padStart(2,'0');
  const mm=String(d.getMonth()+1).padStart(2,'0');
  const yy=d.getFullYear();
  const r=await fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yy}?latitude=${city.lat}&longitude=${city.lon}&method=3`);
  if(!r.ok)throw new Error('API');
  const data=await r.json();
  return data.data.timings;
}

function fmt24(t){
  const[h,m]=t.split(':').map(Number);
  return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}
// kept for backward compat
function fmt12(t){return fmt24(t);}
function parseT(t){
  const[h,m]=t.split(':').map(Number);
  const n=new Date();
  return new Date(n.getFullYear(),n.getMonth(),n.getDate(),h,m,0);
}
function timeDiff(a,b){
  let d=b-a;if(d<0)d+=864e5;
  return{h:Math.floor(d/36e5),m:Math.floor((d%36e5)/6e4)};
}

function renderPrayer(timings){
  const l=getLang();
  const names=TR[l]?.prayers||TR.latn.prayers;
  const now=new Date();
  let nextKey=null,nextTime=null;
  for(const k of PORDER){
    if(!timings[k])continue;
    const t=parseT(timings[k]);
    if(t>now){nextKey=k;nextTime=t;break;}
  }
  if(!nextKey){
    // all prayers passed today — next is Fajr tomorrow
    const firstKey=PORDER.find(k=>timings[k]);
    if(firstKey){
      nextKey=firstKey;
      nextTime=parseT(timings[firstKey]);
      nextTime.setDate(nextTime.getDate()+1);
    }
  }

  let html='';
  PORDER.forEach(k=>{
    html+=`<div class="prayer-card ${k===nextKey?'active':''}">
      <div class="prayer-icon">${pIcon(k)}</div>
      <div class="prayer-name">${names[k]||k}</div>
      <div class="prayer-time">${fmt24(timings[k])}</div>
    </div>`;
  });
  document.getElementById('prayerGrid').innerHTML=html;

  const df=timeDiff(now,nextTime);
  const rem=l==='kril'?'қолди':'qoldi';
  const nl=l==='kril'?'Кейинги намоз':'Keyingi namoz';
  document.getElementById('nextPrayer').innerHTML=`
    <h4>${nl}</h4>
    <div class="next-prayer-info">${pIcon(nextKey)} ${names[nextKey]||nextKey} — ${df.h}s ${df.m}d ${rem}</div>
  `;
  if(window._pi)clearInterval(window._pi);
  window._pi=setInterval(()=>{
    const nw=new Date();const df2=timeDiff(nw,nextTime);
    const el=document.querySelector('#nextPrayer .next-prayer-info');
    if(el)el.innerHTML=`${pIcon(nextKey)} ${names[nextKey]||nextKey} — ${df2.h}s ${df2.m}d ${rem}`;
  },30000);
}

async function loadPrayer(city){
  document.getElementById('prayerGrid').innerHTML='<div class="loading-box" style="grid-column:1/-1"><div class="spinner"></div></div>';
  try{
    const t=await fetchPrayer(city);
    renderPrayer(t);
  }catch(e){
    document.getElementById('prayerGrid').innerHTML='<div class="error-msg" style="grid-column:1/-1">⚠️ Yuklanmadi</div>';
  }
}

document.addEventListener('DOMContentLoaded',()=>{initPrayerSelect();loadPrayer(PCITIES[0]);});
