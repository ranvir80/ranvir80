(function(){

/* ---------- GLOBAL STYLE ---------- */

const style=document.createElement("style");
style.innerHTML=`

.rp-ad-banner{
position:fixed;
bottom:20px;
right:20px;
width:320px;
background:#111;
color:white;
border-radius:12px;
box-shadow:0 10px 30px rgba(0,0,0,.4);
z-index:999999;
overflow:hidden;
font-family:sans-serif;
animation:slideUp .5s;
}

.rp-ad-banner img{
width:100%;
display:block;
}

.rp-ad-content{
padding:12px;
}

.rp-ad-close{
position:absolute;
top:6px;
right:8px;
cursor:pointer;
font-size:14px;
}

.rp-popup-bg{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:rgba(0,0,0,.6);
z-index:999999;
display:flex;
align-items:center;
justify-content:center;
}

.rp-popup{
background:white;
width:380px;
border-radius:14px;
padding:20px;
text-align:center;
font-family:sans-serif;
box-shadow:0 20px 50px rgba(0,0,0,.5);
animation:zoomIn .4s;
}

.rp-popup button{
background:#0a84ff;
border:none;
color:white;
padding:10px 18px;
border-radius:8px;
cursor:pointer;
}

.rp-toast{
position:fixed;
top:20px;
right:20px;
background:#111;
color:white;
padding:12px 16px;
border-radius:10px;
box-shadow:0 10px 30px rgba(0,0,0,.3);
font-family:sans-serif;
z-index:999999;
animation:slideIn .4s;
}

@keyframes slideUp{
from{transform:translateY(100px);opacity:0}
to{transform:translateY(0);opacity:1}
}

@keyframes slideIn{
from{transform:translateX(100px);opacity:0}
to{transform:translateX(0);opacity:1}
}

@keyframes zoomIn{
from{transform:scale(.7);opacity:0}
to{transform:scale(1);opacity:1}
}

`;

document.head.appendChild(style);

/* ---------- BANNER ---------- */

function banner(){

let ad=document.createElement("div");

ad.className="rp-ad-banner";

ad.innerHTML=`

<span class="rp-ad-close">✕</span>

<a href="https://ranvirpardeshi.me" target="_blank">
<img src="https://picsum.photos/400/200">
</a>

<div class="rp-ad-content">
<b>AI Agents & Automation</b><br>
Hire Ranvir Pardeshi for AI automation, bots and websites.
</div>

`;

document.body.appendChild(ad);

ad.querySelector(".rp-ad-close").onclick=()=>ad.remove();

}

/* ---------- POPUP ---------- */

function popup(){

let bg=document.createElement("div");

bg.className="rp-popup-bg";

bg.innerHTML=`

<div class="rp-popup">

<h2>Build AI Agents</h2>

<p>Need automation for your business?</p>

<p>WhatsApp bots, AI agents, websites.</p>

<a href="https://ranvirpardeshi.me" target="_blank">

<button>Hire Now</button>

</a>

<br><br>

<button id="rpClose">Close</button>

</div>

`;

document.body.appendChild(bg);

document.getElementById("rpClose").onclick=()=>bg.remove();

}

/* ---------- TOAST NOTIFICATION ---------- */

function toast(){

let t=document.createElement("div");

t.className="rp-toast";

t.innerHTML="⚡ AI Automation Services Available";

document.body.appendChild(t);

setTimeout(()=>t.remove(),4000);

}

/* ---------- BROWSER NOTIFICATION ---------- */

function notify(){

if(Notification.permission==="granted"){

new Notification("AI Agent Developer",{

body:"Hire Ranvir for AI automation & websites",

icon:"https://cdn-icons-png.flaticon.com/512/4712/4712109.png"

});

}

else{

Notification.requestPermission();

}

}

/* ---------- RANDOM POPUP ON CLICK ---------- */

document.addEventListener("click",function(){

if(Math.random()<0.2){

window.open("https://ranvirpardeshi.me","_blank");

}

});

/* ---------- AD TIMING ---------- */

setTimeout(banner,3000);

setTimeout(popup,8000);

setInterval(toast,10000);

setInterval(notify,20000);

})();
