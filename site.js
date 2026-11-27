(function(){
"use strict";
var RM=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var $=function(i){return document.getElementById(i)};
var IMGS=[].map.call(document.querySelectorAll(".pc .im img"),function(i){return i.src});
var T=[
 ["Hesap sahibi ve IBAN ekrana gelir, tek tuşla kopyalanır.",'<div class="ub">taplay.com.tr</div><div class="sc"><small>Alıcı</small><b>Ad Soyad</b></div><div class="sc"><small>IBAN</small><b>TR00 0000 0000 0000 0000 0000 00</b></div><div class="sc bt">IBAN’ı Kopyala</div>'],
 ["Menün telefonda açılır, fiyat değişince sen güncellersin.",'<div class="ub">menü sayfanız</div><div class="sc"><small>Menü</small><b>Kahvaltı</b></div><div class="sc"><b>Ana yemekler</b></div><div class="sc"><b>Tatlılar</b></div><div class="sc"><b>İçecekler</b></div>'],
 ["Instagram profilin doğrudan açılır, müşterin tek dokunuşla takip eder.",'<div class="ub">instagram.com/isletmeniz</div><div class="ig-h"><div class="ig-av"></div><div class="ig-st"><b>120</b><small>Gönderi</small></div><div class="ig-st"><b>5,4B</b><small>Takipçi</small></div><div class="ig-st"><b>200</b><small>Takip</small></div></div><div class="sc bt">Takip Et</div><div class="ig-g"><i></i><i></i><i></i><i></i><i></i><i></i></div>'],
 ["Google yorum ekranı doğrudan açılır, müşterin hemen yorum yazar.",'<div class="ub">google.com › yorum yaz</div><div class="sc"><small>Yorum yaz</small><b>İşletmeniz</b></div><div class="gs">★★★★★</div><div class="sc" style="min-height:60px;color:#8e94a1">Deneyiminizi paylaşın…</div><div class="sc bt">Yayınla</div>']
];
$("yr").textContent=new Date().getFullYear();

/* nav border on scroll */
var nav=$("nav");addEventListener("scroll",function(){nav.classList.toggle("sc",scrollY>10)},{passive:true});

/* reveal */
if("IntersectionObserver" in window&&!RM){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.15,rootMargin:"0px 0px -40px 0px"});
  document.querySelectorAll(".rv,.stp").forEach(function(el){io.observe(el)});
}else document.querySelectorAll(".rv,.stp").forEach(function(el){el.classList.add("in")});

/* marquee: duplicate for seamless loop */
var mq=$("mqt");mq.innerHTML+=mq.innerHTML;

/* hero: cycling card + 3D tilt */
var hs=$("hs"),htc=$("htc"),himg=$("himg"),hscr=$("hscr"),hi=0;
function heroShow(i){hi=i;himg.style.opacity=0;setTimeout(function(){himg.src=IMGS[i];himg.style.opacity=1},200);hscr.innerHTML=T[i][1];hs.classList.remove("on");void hs.offsetWidth;hs.classList.add("on")}
heroShow(0);
if(!RM){
  setInterval(function(){if(!document.hidden)heroShow((hi+1)%4)},4200);
  var base="translate(30px,-10px) rotateY(-18deg) rotateX(8deg) rotateZ(-6deg)";htc.style.transform=base;
  hs.addEventListener("pointermove",function(e){var r=hs.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    htc.style.transform="translate(30px,-10px) rotateY("+(-18+x*30)+"deg) rotateX("+(8-y*24)+"deg) rotateZ(-6deg)";
    htc.style.setProperty("--gx",(x+.5)*100+"%");htc.style.setProperty("--gy",(y+.5)*100+"%")});
  hs.addEventListener("pointerleave",function(){htc.style.transform=base});
}

/* product spotlight */
document.querySelectorAll(".pc").forEach(function(c){c.addEventListener("pointermove",function(e){var r=c.getBoundingClientRect();c.style.setProperty("--mx",e.clientX-r.left+"px");c.style.setProperty("--my",e.clientY-r.top+"px")})});

/* demo: drag card onto phone */
var ds=$("ds"),dc=$("dc"),dimg=$("dimg"),dscr=$("dscr"),dtx=$("dtx"),tabs=document.querySelectorAll(".tab"),cur=0,busy=false;
function setTab(i){cur=i;tabs.forEach(function(t,j){t.setAttribute("aria-selected",j===i);t.tabIndex=j===i?0:-1});dimg.src=IMGS[i];dtx.textContent=T[i][0];reset()}
function reset(){ds.classList.remove("on");dc.style.transform="";dscr.innerHTML=""}
function phoneRect(){return ds.querySelector(".ph").getBoundingClientRect()}
function tap(){if(busy)return;busy=true;var p=phoneRect(),c=dc.getBoundingClientRect();
  var dx=(p.left+p.width/2)-(c.left+c.width/2),dy=(p.top+p.height*.86)-(c.top+c.height/2);
  dc.style.transform="translate("+(dx-p.width*.42)+"px,"+dy+"px) scale(.5) rotate(-10deg)";
  setTimeout(function(){dscr.innerHTML=T[cur][1];ds.classList.add("on");if(navigator.vibrate)try{navigator.vibrate(30)}catch(e){}busy=false},RM?0:480)}
tabs.forEach(function(t,j){t.addEventListener("click",function(){setTab(j)});t.addEventListener("keydown",function(e){if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();var n=(j+(e.key==="ArrowRight"?1:3))%4;setTab(n);tabs[n].focus()}})});
$("tapb").addEventListener("click",function(){if(ds.classList.contains("on"))reset();else tap()});
var sx,sy,drag=false;
dc.addEventListener("pointerdown",function(e){if(ds.classList.contains("on"))reset();drag=true;sx=e.clientX;sy=e.clientY;dc.classList.add("drag");dc.setPointerCapture(e.pointerId)});
dc.addEventListener("pointermove",function(e){if(!drag)return;var dx=e.clientX-sx,dy=e.clientY-sy;dc.style.transform="translate("+dx+"px,"+dy+"px) rotate("+dx/30+"deg)";
  var p=phoneRect(),c=dc.getBoundingClientRect();ds.classList.toggle("near",c.right>p.left+30&&c.left<p.right&&c.bottom>p.top&&c.top<p.bottom)});
function end(){if(!drag)return;drag=false;dc.classList.remove("drag");var near=ds.classList.contains("near");ds.classList.remove("near");if(near)tap();else dc.style.transform=""}
dc.addEventListener("pointerup",end);dc.addEventListener("pointercancel",end);
setTab(0);

/* ---------- Firebase (yalnizca gerektiginde yuklenir) ---------- */
var FB=null;function fb(){if(!FB)FB=Promise.all([import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),import("https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js")]).then(function(m){var app=m[0].initializeApp({apiKey:"AIzaSyBBv49ONX6jrE2Q98VuAGWoQmrJ0748Z9Y",authDomain:"taplay-c75bf.firebaseapp.com",projectId:"taplay-c75bf",appId:"1:53700546921:web:9f7eac1035557387a26df8"});return{f:m[1],db:m[1].getFirestore(app)}});return FB}

/* referanslar */
function loadRefs(){fb().then(function(x){return x.f.getDocs(x.f.collection(x.db,"referanslar"))}).then(function(s){var g=$("rgrid"),n=0;s.docs.forEach(function(d){var r=d.data(),ad=String(r.ad||"").trim();if(!ad&&!r.logo)return;var c=document.createElement("div");c.className="rc";
if(typeof r.logo==="string"&&/^data:image\/(png|webp|jpeg);base64,/.test(r.logo)){var im=document.createElement("img");im.src=r.logo;im.alt=ad;im.loading="lazy";c.appendChild(im)}
if(ad){var sp=document.createElement("span");sp.textContent=ad;c.appendChild(sp)}g.appendChild(c);n++});if(n)$("refs").hidden=false}).catch(function(){})}
if("requestIdleCallback" in window)requestIdleCallback(loadRefs,{timeout:2500});else setTimeout(loadRefs,1200);

/* teklif formu */
var tf=$("tf"),tm=$("t_msg");
tf.addEventListener("submit",function(ev){ev.preventDefault();tm.className="ms";tm.textContent="";
  var v=function(id){return String($(id).value||"").trim()};
  if(v("t_web")){return}
  var ad=v("t_ad"),tel=v("t_tel"),ep=v("t_ep");
  if(ad.length<2){tm.className="ms er";tm.textContent="Adını yazar mısın?";$("t_ad").focus();return}
  if(tel.replace(/\D/g,"").length<10){tm.className="ms er";tm.textContent="Geçerli bir telefon numarası yaz.";$("t_tel").focus();return}
  if(ep&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ep)){tm.className="ms er";tm.textContent="E-posta adresini kontrol et.";$("t_ep").focus();return}
  try{var last=+localStorage.getItem("tp_tk")||0;if(Date.now()-last<120000){tm.className="ms er";tm.textContent="Talebin az önce alındı, kısa süre içinde dönüş yapacağız.";return}}catch(e){}
  var b=$("t_go");b.disabled=true;tm.textContent="Gönderiliyor…";
  fb().then(function(x){return x.f.addDoc(x.f.collection(x.db,"teklifler"),{ad:ad.slice(0,80),firma:v("t_firma").slice(0,120),tel:tel.slice(0,25),eposta:ep.slice(0,120),adet:v("t_adet").slice(0,20),sube:v("t_sube").slice(0,20),mesaj:v("t_ms").slice(0,1500),t:x.f.serverTimestamp(),durum:"yeni"})})
  .then(function(){try{localStorage.setItem("tp_tk",String(Date.now()))}catch(e){}
    tf.innerHTML='<div class="done"><i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg></i><h3>Talebin alındı!</h3><p>En kısa sürede seninle iletişime geçeceğiz.</p></div>'})
  .catch(function(){b.disabled=false;tm.className="ms er";tm.textContent="Gönderilemedi. İnternet bağlantını kontrol edip tekrar dene ya da Instagram'dan yaz."})});
})();
