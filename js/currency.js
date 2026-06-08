/* KUNLIK.UZ — currency.js */
const CURR=[
  {code:'USD',flag:'🇺🇸',latn:'Dollar',kril:'Доллар'},
  {code:'EUR',flag:'🇪🇺',latn:'Yevro',kril:'Евро'},
  {code:'RUB',flag:'🇷🇺',latn:'Rubl',kril:'Рубл'},
  {code:'GBP',flag:'🇬🇧',latn:'Funt',kril:'Фунт'},
  {code:'CNY',flag:'🇨🇳',latn:'Yuan',kril:'Юань'},
  {code:'KZT',flag:'🇰🇿',latn:'Tenge',kril:'Тенге'},
  {code:'TRY',flag:'🇹🇷',latn:'Lira',kril:'Лира'},
  {code:'AED',flag:'🇦🇪',latn:'Dirham',kril:'Дирҳам'},
  {code:'JPY',flag:'🇯🇵',latn:'Yen',kril:'Йена'},
  {code:'SAR',flag:'🇸🇦',latn:'Riyal',kril:'Риял'},
];
let rates={};
async function loadCurrency(){
  try{
    const r=await fetch('https://cbu.uz/oz/arkhiv-kursov-valyut/json/');
    if(!r.ok)throw new Error();
    const data=await r.json();
    data.forEach(x=>{rates[x.Ccy]=parseFloat(x.Rate)/parseFloat(x.Nominal);});
    renderCards();
    fillSelects(data);
  }catch(e){
    document.getElementById('currencyGrid').innerHTML='<div class="error-msg" style="grid-column:1/-1">⚠️ Yuklanmadi</div>';
  }
}

function renderCards(){
  const l=getLang();
  let h='';
  CURR.forEach(c=>{
    const r=rates[c.code];if(!r)return;
    const rf=r>=1000?Math.round(r).toLocaleString('uz'):r.toFixed(2);
    h+=`<div class="currency-card">
      <div class="cc-flag" style="font-size:1.6rem">${c.flag}</div>
      <div class="cc-code">${c.code}</div>
      <div class="cc-name">${c[`name_${l}`]||c[l]||c.latn}</div>
      <div class="cc-rate">${rf}</div>
      <div class="cc-uzs">${l==='kril'?'сўм':"so'm"}</div>
    </div>`;
  });
  document.getElementById('currencyGrid').innerHTML=h;
}

function fillSelects(data){
  const f=document.getElementById('convFrom'),t=document.getElementById('convTo');
  if(!f||!t)return;
  const l=getLang();
  const uzs=`<option value="UZS">UZS — ${l==='kril'?'Сўм':"So'm"}</option>`;
  f.innerHTML=uzs;t.innerHTML=uzs;
  data.forEach(x=>{
    const c=CURR.find(cc=>cc.code===x.Ccy);
    const name=c?c[l]||c.latn:x.CcyNm_UZ;
    const o=`<option value="${x.Ccy}">${x.Ccy} — ${name}</option>`;
    f.innerHTML+=o;t.innerHTML+=o;
  });
  f.value='USD';t.value='UZS';
  [f,t,document.getElementById('convAmount')].forEach(el=>el.addEventListener(el.tagName==='SELECT'?'change':'input',doConvert));
  doConvert();
}

function swapCurrency(){
  const f=document.getElementById('convFrom'),t=document.getElementById('convTo');
  [f.value,t.value]=[t.value,f.value];doConvert();
}

function doConvert(){
  const amt=parseFloat(document.getElementById('convAmount').value)||0;
  const from=document.getElementById('convFrom').value;
  const to=document.getElementById('convTo').value;
  const l=getLang();
  let res;
  if(from===to){res=amt;}
  else if(from==='UZS'){const r=rates[to];if(!r)return;res=amt/r;}
  else if(to==='UZS'){const r=rates[from];if(!r)return;res=amt*r;}
  else{const rf=rates[from],rt=rates[to];if(!rf||!rt)return;res=amt*rf/rt;}
  const fmt=res>=1000?res.toLocaleString('uz',{maximumFractionDigits:2}):res.toFixed(4);
  const el=document.getElementById('convResult');
  if(el)el.innerHTML=`<span style="color:var(--text2);font-size:.9rem">${amt.toLocaleString()} ${from} = </span><span style="color:var(--green)">${fmt} ${to}</span>`;
}

document.addEventListener('DOMContentLoaded',loadCurrency);
