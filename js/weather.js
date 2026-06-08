/* KUNLIK.UZ — weather.js  (Open-Meteo, no API key) */

const CITIES=[
  {id:'urgench',   latn:'Urganch',   kril:'Урганч',   lat:41.55,  lon:60.63},
  {id:'tashkent',  latn:'Toshkent',  kril:'Тошкент',  lat:41.2995,lon:69.2401},
  {id:'samarkand', latn:'Samarqand', kril:'Самарқанд',lat:39.6542,lon:66.9597},
  {id:'bukhara',   latn:'Buxoro',    kril:'Бухоро',   lat:39.768, lon:64.4219},
  {id:'andijan',   latn:'Andijon',   kril:'Андижон',  lat:40.7821,lon:72.3442},
  {id:'namangan',  latn:'Namangan',  kril:'Наманган', lat:41.0011,lon:71.6727},
  {id:'fergana',   latn:"Farg'ona",  kril:'Фарғона',  lat:40.3864,lon:71.7864},
  {id:'nukus',     latn:'Nukus',     kril:'Нукус',    lat:42.46,  lon:59.61},
  {id:'navoi',     latn:'Navoiy',    kril:'Навоий',   lat:40.0849,lon:65.3792},
  {id:'qarshi',    latn:'Qarshi',    kril:'Қарши',    lat:38.86,  lon:65.79},
  {id:'termiz',    latn:'Termiz',    kril:'Термиз',   lat:37.2242,lon:67.2783},
  {id:'jizzakh',   latn:'Jizzax',    kril:'Жиззах',   lat:40.1158,lon:67.8422}
];

const WC={
  0: {l:'Ochiq',     k:'Очиқ',        svg:'sun'},
  1: {l:'Asosan ochiq',k:'Асосан очиқ',svg:'sun'},
  2: {l:'Qisman bulutli',k:'Қисман булутли',svg:'cloud-sun'},
  3: {l:'Bulutli',   k:'Булутли',     svg:'cloud'},
  45:{l:'Tumanli',   k:'Туманли',     svg:'fog'},
  48:{l:'Tumanli',   k:'Туманли',     svg:'fog'},
  51:{l:'Yomg\'ir',  k:'Ёмғир',       svg:'rain'},
  53:{l:'Yomg\'ir',  k:'Ёмғир',       svg:'rain'},
  55:{l:'Kuchli yomg\'ir',k:'Кучли ёмғир',svg:'rain'},
  61:{l:'Yomg\'ir',  k:'Ёмғир',       svg:'rain'},
  63:{l:'Yomg\'ir',  k:'Ёмғир',       svg:'rain'},
  71:{l:'Qor',       k:'Қор',         svg:'snow'},
  73:{l:'Qor',       k:'Қор',         svg:'snow'},
  80:{l:'Jala',      k:'Жала',        svg:'rain'},
  95:{l:'Momaqaldiroq',k:'Момақалдироқ',svg:'storm'},
  99:{l:'Momaqaldiroq',k:'Момақалдироқ',svg:'storm'},
};

// --- SVG ICONS (custom, no emoji) ---
function wIcon(type, size=56){
  const s=size, h=s, w=s;
  const icons={
    sun:`<svg width="${w}" height="${h}" viewBox="0 0 56 56" fill="none" class="sun-icon">
      <circle cx="28" cy="28" r="11" fill="#f59e0b" opacity=".95"/>
      <g stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round">
        <line x1="28" y1="8" x2="28" y2="14"/>
        <line x1="28" y1="42" x2="28" y2="48"/>
        <line x1="8" y1="28" x2="14" y2="28"/>
        <line x1="42" y1="28" x2="48" y2="28"/>
        <line x1="14.5" y1="14.5" x2="18.7" y2="18.7"/>
        <line x1="37.3" y1="37.3" x2="41.5" y2="41.5"/>
        <line x1="41.5" y1="14.5" x2="37.3" y2="18.7"/>
        <line x1="18.7" y1="37.3" x2="14.5" y2="41.5"/>
      </g>
    </svg>`,

    'cloud-sun':`<svg width="${w}" height="${h}" viewBox="0 0 56 56" fill="none" class="cloud-icon">
      <circle cx="34" cy="20" r="8" fill="#f59e0b" opacity=".85"/>
      <g stroke="#f59e0b" stroke-width="2" stroke-linecap="round" opacity=".6">
        <line x1="34" y1="8" x2="34" y2="11"/>
        <line x1="44" y1="20" x2="47" y2="20"/>
        <line x1="40.9" y1="13.1" x2="43" y2="11"/>
      </g>
      <path d="M14 36a8 8 0 0 1 1-15.96A10 10 0 1 1 32 36H14z" fill="#94a3b8" opacity=".9"/>
    </svg>`,

    cloud:`<svg width="${w}" height="${h}" viewBox="0 0 56 56" fill="none" class="cloud-icon">
      <path d="M12 38a10 10 0 0 1 2-19.8A12 12 0 1 1 38 38H12z" fill="#94a3b8" opacity=".9"/>
    </svg>`,

    rain:`<svg width="${w}" height="${h}" viewBox="0 0 56 56" fill="none" class="rain-icon">
      <path d="M12 32a10 10 0 0 1 2-19.8A12 12 0 1 1 38 32H12z" fill="#64748b" opacity=".9"/>
      <g stroke="#38bdf8" stroke-width="2" stroke-linecap="round" class="rain-drops">
        <line x1="20" y1="38" x2="18" y2="46"/>
        <line x1="28" y1="38" x2="26" y2="46"/>
        <line x1="36" y1="38" x2="34" y2="46"/>
      </g>
    </svg>`,

    snow:`<svg width="${w}" height="${h}" viewBox="0 0 56 56" fill="none" class="snow-icon">
      <path d="M12 32a10 10 0 0 1 2-19.8A12 12 0 1 1 38 32H12z" fill="#94a3b8" opacity=".8"/>
      <g stroke="#e2e8f0" stroke-width="2" stroke-linecap="round">
        <line x1="20" y1="37" x2="20" y2="47"/>
        <line x1="17" y1="40" x2="23" y2="44"/>
        <line x1="23" y1="40" x2="17" y2="44"/>
        <line x1="28" y1="37" x2="28" y2="47"/>
        <line x1="25" y1="40" x2="31" y2="44"/>
        <line x1="31" y1="40" x2="25" y2="44"/>
        <line x1="36" y1="37" x2="36" y2="47"/>
        <line x1="33" y1="40" x2="39" y2="44"/>
        <line x1="39" y1="40" x2="33" y2="44"/>
      </g>
    </svg>`,

    storm:`<svg width="${w}" height="${h}" viewBox="0 0 56 56" fill="none" class="storm-icon">
      <path d="M10 32a10 10 0 0 1 2-19.8A12 12 0 1 1 36 32H10z" fill="#475569" opacity=".9"/>
      <path d="M28 32l-5 9h5l-5 9" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`,

    fog:`<svg width="${w}" height="${h}" viewBox="0 0 56 56" fill="none" class="cloud-icon">
      <g stroke="#94a3b8" stroke-width="2.5" stroke-linecap="round" opacity=".7">
        <line x1="10" y1="22" x2="46" y2="22"/>
        <line x1="14" y1="30" x2="42" y2="30"/>
        <line x1="18" y1="38" x2="38" y2="38"/>
      </g>
    </svg>`,
  };
  return icons[type]||icons.cloud;
}

// Small icon for forecast/regions
function wIconSm(type){return wIcon(type,36)}

function getWC(code){
  const l=window.currentLang||'latn';
  const d=WC[code]||WC[0];
  return {svg:d.svg, desc:d[l==='kril'?'k':'l']||d.l};
}

function cityName(c){const l=getLang();return c[l]||c.latn}

function fmtDate(date){
  const l=getLang();
  const months=TR[l]?.months||TR.latn.months;
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function windDir(deg){
  return ['N','NE','E','SE','S','SW','W','NW'][Math.round(deg/45)%8];
}

// ===== FETCH =====
async function fetchWeather(city){
  const url=`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=Asia/Tashkent&forecast_days=7`;
  const r=await fetch(url);
  if(!r.ok)throw new Error('API');
  return r.json();
}

// ===== RENDER =====
function renderWeather(data,city){
  const l=getLang();
  const c=data.current;
  const w=getWC(c.weather_code);
  const days=TR[l]?.days||TR.latn.days;

  // Current
  document.getElementById('weatherMain').innerHTML=`
    <div class="weather-layout">
      <div class="weather-left">
        <div class="w-icon">${wIcon(w.svg,72)}</div>
        <div class="w-temp">${Math.round(c.temperature_2m)}°C</div>
        <div class="w-desc">${w.desc}</div>
        <div class="w-feels">${l==='kril'?'Сезилади':'Seziladi'}: ${Math.round(c.apparent_temperature)}°C</div>
      </div>
      <div>
        <div class="w-city">${cityName(city)}</div>
        <div class="w-date">${fmtDate(new Date())}</div>
        <div class="w-stats">
          <div class="w-stat">
            <div class="w-stat-label">${l==='kril'?'Намлик':'Namlik'}</div>
            <div class="w-stat-val">${c.relative_humidity_2m}%</div>
          </div>
          <div class="w-stat">
            <div class="w-stat-label">${l==='kril'?'Шамол':'Shamol'}</div>
            <div class="w-stat-val">${Math.round(c.wind_speed_10m)} km/h ${windDir(c.wind_direction_10m)}</div>
          </div>
        </div>
      </div>
    </div>`;

  // Forecast
  const d=data.daily;
  let fc='';
  for(let i=0;i<7;i++){
    const dt=new Date(d.time[i]);
    const fw=getWC(d.weather_code[i]);
    const dayLabel=i===0?(l==='kril'?'Бугун':'Bugun'):i===1?(l==='kril'?'Эртага':'Ertaga'):days[dt.getDay()];
    fc+=`<div class="forecast-card">
      <div class="fc-day">${dayLabel}</div>
      <div class="fc-icon">${wIconSm(fw.svg)}</div>
      <div class="fc-high">${Math.round(d.temperature_2m_max[i])}°</div>
      <div class="fc-low">${Math.round(d.temperature_2m_min[i])}°</div>
      ${d.precipitation_sum[i]>0?`<div class="fc-rain">💧${d.precipitation_sum[i]}mm</div>`:''}
    </div>`;
  }
  document.getElementById('forecastGrid').innerHTML=fc;
}

// ===== REGIONS =====
async function loadRegions(){
  const grid=document.getElementById('regionsGrid');
  const results=await Promise.allSettled(CITIES.map(c=>fetchWeather(c).then(d=>({city:c,data:d}))));
  let html='';
  results.forEach(r=>{
    if(r.status!=='fulfilled')return;
    const {city,data}=r.value;
    const temp=Math.round(data.current.temperature_2m);
    const w=getWC(data.current.weather_code);
    const tc=temp>=35?'hot':temp>=20?'warm':temp>=5?'cool':'cold';
    html+=`<div class="region-card">
      <div class="region-icon">${wIconSm(w.svg)}</div>
      <div class="region-name">${cityName(city)}</div>
      <div class="region-temp ${tc}">${temp}°C</div>
      <div class="region-desc">${w.desc}</div>
    </div>`;
  });
  grid.innerHTML=html||'<div class="error-msg">Xatolik</div>';
}

// ===== CITY TABS =====
let activeCity=CITIES[0];

function initCityTabs(){
  const ct=document.getElementById('cityTabs');
  CITIES.forEach((city,i)=>{
    const btn=document.createElement('button');
    btn.className='city-tab'+(i===0?' active':'');
    btn.textContent=cityName(city);
    btn.dataset.cityId=city.id;
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.city-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      activeCity=city;
      loadCurrentCity(city);
    });
    ct.appendChild(btn);
  });
}

async function loadCurrentCity(city){
  document.getElementById('weatherMain').innerHTML='<div class="loading-box"><div class="spinner"></div></div>';
  document.getElementById('forecastGrid').innerHTML='';
  try{
    const data=await fetchWeather(city);
    renderWeather(data,city);
  }catch(e){
    document.getElementById('weatherMain').innerHTML='<div class="error-msg">⚠️ Internet aloqasini tekshiring</div>';
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  initCityTabs();
  loadCurrentCity(CITIES[0]);
  loadRegions();
});
