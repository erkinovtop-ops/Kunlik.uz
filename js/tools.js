/* KUNLIK.UZ — tools.js */
function showToastT(m){if(typeof showToast==='function')showToast(m);}

// ===== POMODORO =====
let pomSec=25*60,pomMode='work',pomInt=null,pomDone=0;
const POM={work:25*60,break:5*60,long_break:15*60};
const POM_R=264; // 2πr where r=42

function pomDraw(){
  const el=document.getElementById('pomRingCircle');
  const total=POM[pomMode];
  const prog=(total-pomSec)/total;
  const offset=POM_R-(prog*POM_R);
  if(el)el.style.strokeDashoffset=offset;
  // Add gradient def if not exists
  const svg=document.querySelector('.pom-ring');
  if(svg&&!document.getElementById('pomGrad')){
    const defs=document.createElementNS('http://www.w3.org/2000/svg','defs');
    defs.innerHTML='<linearGradient id="pomGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#6366f1"/><stop offset="100%" stop-color="#a855f7"/></linearGradient>';
    svg.insertBefore(defs,svg.firstChild);
  }
}

function pomDisplay(){
  const m=String(Math.floor(pomSec/60)).padStart(2,'0');
  const s=String(pomSec%60).padStart(2,'0');
  const el=document.getElementById('pomTime');if(el)el.textContent=`${m}:${s}`;
  pomDraw();
  const label={work:getLang()==='kril'?'Ишлаш':'Ishlash',break:getLang()==='kril'?'Дам':'Dam',long_break:getLang()==='kril'?'Узоқ дам':'Uzoq dam'};
  const ll=document.getElementById('pomLabel');if(ll)ll.textContent=label[pomMode];
}

function pomDots(){
  const c=document.getElementById('pomSessions');if(!c)return;
  c.innerHTML='';
  for(let i=0;i<4;i++){const d=document.createElement('div');d.className='pom-dot'+(i<pomDone?' done':'');c.appendChild(d);}
}

function pomStart(){
  const btn=document.getElementById('pomStartBtn');
  const l=getLang();
  if(pomInt){clearInterval(pomInt);pomInt=null;if(btn)btn.textContent=l==='kril'?'Давом':'Davom';return;}
  if(btn)btn.textContent=l==='kril'?'Тўхтатиш':'To\'xtatish';
  pomInt=setInterval(()=>{
    pomSec--;pomDisplay();
    if(pomSec<=0){
      clearInterval(pomInt);pomInt=null;
      if(pomMode==='work'){
        pomDone++;if(pomDone>=4)pomDone=0;
        pomMode=pomDone===0?'long_break':'break';
      } else{pomMode='work';}
      pomSec=POM[pomMode];pomDisplay();pomDots();
      if(btn)btn.textContent=l==='kril'?'Бошлаш':'Boshlash';
      showToastT('✅ '+(pomMode==='work'?(l==='kril'?'Ишлаш вақти!':'Ishlash vaqti!'):(l==='kril'?'Дам олиш вақти!':'Dam olish vaqti!')));
    }
  },1000);
}
function pomReset(){
  if(pomInt){clearInterval(pomInt);pomInt=null;}
  pomMode='work';pomSec=POM.work;pomDone=0;pomDisplay();pomDots();
  const btn=document.getElementById('pomStartBtn');
  if(btn)btn.textContent=getLang()==='kril'?'Бошлаш':'Boshlash';
}

// ===== AGE =====
function calcAge(){
  const v=document.getElementById('ageInput').value;
  const r=document.getElementById('ageResult');
  if(!v)return;
  const born=new Date(v),now=new Date();
  if(born>now){r.textContent='Kelajak sana!';return;}
  let y=now.getFullYear()-born.getFullYear(),mo=now.getMonth()-born.getMonth(),d=now.getDate()-born.getDate();
  if(d<0){mo--;const lm=new Date(now.getFullYear(),now.getMonth(),0);d+=lm.getDate();}
  if(mo<0){y--;mo+=12;}
  const total=Math.floor((now-born)/864e5);
  const l=getLang();
  r.innerHTML=`<div style="color:var(--accent3);font-size:1.3rem;font-weight:800">${y} ${l==='kril'?'ёш':'yosh'}</div><div style="color:var(--text2);font-size:.85rem;margin-top:4px">${y} ${l==='kril'?'ёш':'yosh'}, ${mo} ${l==='kril'?'ой':'oy'}, ${d} ${l==='kril'?'кун':'kun'} • ${total.toLocaleString()} ${l==='kril'?'кун':'kun'}</div>`;
}

// ===== PERCENT =====
function calcPercent(){
  const n=parseFloat(document.getElementById('pctNum').value);
  const p=parseFloat(document.getElementById('pctOf').value);
  const r=document.getElementById('pctResult');
  if(isNaN(n)||isNaN(p))return;
  const res=(n*p)/100;
  const l=getLang();
  r.innerHTML=`<div style="color:var(--green);font-size:1.2rem;font-weight:700">${res.toLocaleString('uz',{maximumFractionDigits:4})}</div><div style="color:var(--text3);font-size:.78rem;margin-top:3px">${n} ${l==='kril'?'нинг':'ning'} ${p}% = ${res.toLocaleString()}</div>`;
}

// ===== PASSWORD =====
function genPass(){
  const len=parseInt(document.getElementById('passLen').value)||16;
  let ch='abcdefghijklmnopqrstuvwxyz';
  if(document.getElementById('passUpper').checked)ch+='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if(document.getElementById('passNum').checked)ch+='0123456789';
  if(document.getElementById('passSym').checked)ch+='!@#$%^&*()-_=+[]{}|;:,.?';
  const arr=new Uint32Array(len);window.crypto.getRandomValues(arr);
  const pass=Array.from(arr).map(n=>ch[n%ch.length]).join('');
  const el=document.getElementById('passResult');
  if(el){el.textContent=pass;el.title='Nusxalash uchun bosing';}
}
function copyPass(){
  const p=document.getElementById('passResult').textContent;
  if(p)navigator.clipboard.writeText(p).then(()=>showToastT('✅ Nusxalandi!'));
}

// ===== TEXT =====
function countText(){
  const text=document.getElementById('textInput').value;
  const l=getLang();
  const chars=text.length;
  const words=text.trim()?text.trim().split(/\s+/).length:0;
  const lines=text?text.split('\n').length:0;
  const rd=Math.ceil(words/200);
  const el=document.getElementById('textStats');
  if(el)el.innerHTML=`
    <span class="stat-chip">${chars} ${l==='kril'?'ҳарф':'harf'}</span>
    <span class="stat-chip">${words} ${l==='kril'?'сўз':"so'z"}</span>
    <span class="stat-chip">${lines} ${l==='kril'?'қатор':'qator'}</span>
    <span class="stat-chip">~${rd} ${l==='kril'?'дақ':'daq'}</span>`;
}

// ===== UNITS =====
const UNITS={
  length:{
    names:{latn:{km:'km',m:'m',cm:'cm',mm:'mm',mi:'mil',ft:'fut',in:'dyuym',yd:'yard'},
           kril:{km:'км',m:'м',cm:'см',mm:'мм',mi:'мил',ft:'фут',in:'дюйм',yd:'ярд'}},
    to_m:{km:1000,m:1,cm:.01,mm:.001,mi:1609.344,ft:.3048,in:.0254,yd:.9144}
  },
  weight:{
    names:{latn:{kg:'kg',g:'g',mg:'mg',t:'tonna',lb:'funt',oz:'unsiya'},
           kril:{kg:'кг',g:'г',mg:'мг',t:'тонна',lb:'фунт',oz:'унсия'}},
    to_m:{kg:1,g:.001,mg:.000001,t:1000,lb:.453592,oz:.0283495}
  },
  temp:{names:{latn:{C:'°C',F:'°F',K:'K'},kril:{C:'°C',F:'°F',K:'K'}},special:true},
  area:{
    names:{latn:{m2:'m²',km2:'km²',cm2:'cm²',ha:'gektar',sotka:'sotka',ft2:'fut²'},
           kril:{m2:'м²',km2:'км²',cm2:'см²',ha:'гектар',sotka:'сотка',ft2:'фут²'}},
    to_m:{m2:1,km2:1e6,cm2:.0001,ha:1e4,sotka:100,ft2:.092903}
  }
};

function updateUnitOptions(){
  const type=document.getElementById('unitType').value;
  const l=getLang();
  const u=UNITS[type];
  const keys=Object.keys(u.names.latn);
  ['unitFrom','unitTo'].forEach((id,i)=>{
    const s=document.getElementById(id);
    s.innerHTML=keys.map(k=>`<option value="${k}">${u.names[l]?.[k]||u.names.latn[k]}</option>`).join('');
    s.value=keys[i===0?0:Math.min(1,keys.length-1)];
  });
  convertUnit();
}

function convertUnit(){
  const type=document.getElementById('unitType').value;
  const val=parseFloat(document.getElementById('unitVal').value);
  const from=document.getElementById('unitFrom').value;
  const to=document.getElementById('unitTo').value;
  const r=document.getElementById('unitResult');
  if(isNaN(val)){if(r)r.textContent='';return;}
  const u=UNITS[type];
  let res;
  if(u.special){ // temp
    let c=from==='C'?val:from==='F'?(val-32)*5/9:val-273.15;
    res=to==='C'?c:to==='F'?c*9/5+32:c+273.15;
  } else {
    res=val*u.to_m[from]/u.to_m[to];
  }
  const l=getLang();
  const fmt=Math.abs(res)>=.0001?res.toLocaleString('uz',{maximumFractionDigits:6}):res.toExponential(4);
  const fromN=u.names[l]?.[from]||u.names.latn[from]||from;
  const toN=u.names[l]?.[to]||u.names.latn[to]||to;
  if(r)r.innerHTML=`<div style="color:var(--green);font-size:1.1rem;font-weight:700">${fmt} ${toN}</div><div style="color:var(--text3);font-size:.78rem;margin-top:3px">${val} ${fromN} → ${fmt} ${toN}</div>`;
}

// ===== COLOR =====
function hexToRgb(h){return{r:parseInt(h.slice(1,3),16),g:parseInt(h.slice(3,5),16),b:parseInt(h.slice(5,7),16)};}
function rgbToHsl(r,g,b){
  r/=255;g/=255;b/=255;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b);
  let h,s,l=(mx+mn)/2;
  if(mx===mn){h=s=0;}else{
    const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);
    switch(mx){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;default:h=((r-g)/d+4)/6;}
  }
  return{h:Math.round(h*360),s:Math.round(s*100),l:Math.round(l*100)};
}
function convertColor(){
  const hex=document.getElementById('colorPicker').value;
  const pr=document.getElementById('colorPreview');
  if(pr)pr.style.background=hex;
  const{r,g,b}=hexToRgb(hex);
  const{h,s,l}=rgbToHsl(r,g,b);
  const vals=[
    {label:'HEX',val:hex.toUpperCase()},
    {label:'RGB',val:`rgb(${r}, ${g}, ${b})`},
    {label:'HSL',val:`hsl(${h}, ${s}%, ${l}%)`},
  ];
  const el=document.getElementById('colorOutputs');
  if(el)el.innerHTML=vals.map(v=>`<div class="color-output">
    <span class="color-output-label">${v.label}</span>
    <span class="color-output-val">${v.val}</span>
    <button class="copy-color-btn" onclick="navigator.clipboard.writeText('${v.val}').then(()=>showToast('✅ Nusxalandi!'))">📋</button>
  </div>`).join('');
}

// ===== RANDOM =====
function randomPick(){
  const text=document.getElementById('randomList').value.trim();
  const r=document.getElementById('randomResult');
  if(!text){if(r)r.textContent='Variantlarni kiriting';return;}
  const items=text.split('\n').map(s=>s.trim()).filter(Boolean);
  if(!items.length)return;
  const chosen=items[Math.floor(Math.random()*items.length)];
  if(r){
    r.style.opacity='0';r.style.transform='scale(.9)';
    setTimeout(()=>{r.textContent='🎯 '+chosen;r.style.opacity='1';r.style.transform='scale(1)';r.style.transition='all .3s ease';},120);
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded',()=>{
  pomDisplay();pomDots();
  updateUnitOptions();
  convertColor();
  const ai=document.getElementById('ageInput');
  if(ai){ai.max=new Date().toISOString().split('T')[0];ai.value='1990-01-01';}
});
