/* =======================================
   DEVSPHERE LMS
   Main JavaScript
======================================= */

// ===========================
// PRELOADER
// ===========================

window.addEventListener("load", () => {

    const preloader = document.getElementById("preloader");

    preloader.style.opacity = "0";

    setTimeout(() => {
        preloader.style.display = "none";
    }, 500);

});


// ===========================
// MOBILE MENU
// ===========================

const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");

menuBtn.addEventListener("click", () => {

    navbar.classList.toggle("active");

    if(navbar.classList.contains("active")){

        menuBtn.innerHTML = '<i class="fas fa-times"></i>';

    }else{

        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';

    }

});


// ===========================
// CLOSE MENU AFTER CLICK
// ===========================

document.querySelectorAll("nav a").forEach(link=>{

link.addEventListener("click",()=>{

navbar.classList.remove("active");

menuBtn.innerHTML='<i class="fas fa-bars"></i>';

});

});


// ===========================
// STICKY HEADER
// ===========================

const header=document.querySelector("header");

window.addEventListener("scroll",()=>{

if(window.scrollY>50){

header.style.background="#ffffff";

header.style.boxShadow="0 8px 25px rgba(0,0,0,.12)";

}else{

header.style.background="rgba(255,255,255,.95)";

header.style.boxShadow="0 5px 20px rgba(0,0,0,.08)";

}

});


// ===========================
// COUNTER ANIMATION
// ===========================

const counters=document.querySelectorAll(".counter");

const startCounter=(counter)=>{

const target=+counter.dataset.target;

let count=0;

const speed=target/200;

const update=()=>{

count+=speed;

if(count<target){

counter.innerText=Math.floor(count);

requestAnimationFrame(update);

}else{

counter.innerText=target.toLocaleString();

}

}

update();

};

const observer=new IntersectionObserver((entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

startCounter(entry.target);

observer.unobserve(entry.target);

}

});

});

counters.forEach(counter=>{

observer.observe(counter);

});


// ===========================
// SCROLL TO TOP
// ===========================

const scrollBtn=document.getElementById("scrollTop");

window.addEventListener("scroll",()=>{

if(window.scrollY>500){

scrollBtn.style.display="block";

}else{

scrollBtn.style.display="none";

}

});

scrollBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});


// ===========================
// ACTIVE NAVIGATION
// ===========================

const sections=document.querySelectorAll("section");

const navLinks=document.querySelectorAll("nav a");

window.addEventListener("scroll",()=>{

let current="";

sections.forEach(section=>{

const sectionTop=section.offsetTop-150;

const sectionHeight=section.clientHeight;

if(pageYOffset>=sectionTop){

current=section.getAttribute("id");

}

});

navLinks.forEach(link=>{

link.classList.remove("active");

if(link.getAttribute("href")==="#"+current){

link.classList.add("active");

}

});

});


// ===========================
// SMOOTH SCROLL
// ===========================

document.querySelectorAll('a[href^="#"]').forEach(anchor=>{

anchor.addEventListener("click",function(e){

e.preventDefault();

document.querySelector(this.getAttribute("href")).scrollIntoView({

behavior:"smooth"

});

});

});


// ===========================
// HERO BUTTON
// ===========================

const learnBtn=document.querySelector(".secondary-btn");

if(learnBtn){

learnBtn.addEventListener("click",()=>{

document.querySelector("#about").scrollIntoView({

behavior:"smooth"

});

});

}


// ===========================
// FADE-IN ANIMATION
// ===========================

const hiddenElements=document.querySelectorAll(

".feature-card,.step,.about-image,.about-content,.stat-box,.contact-container div"

);

const revealObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.style.opacity="1";

entry.target.style.transform="translateY(0)";

}

});

},{threshold:.2});

hiddenElements.forEach(el=>{

el.style.opacity="0";

el.style.transform="translateY(60px)";

el.style.transition=".8s ease";

revealObserver.observe(el);

});


// ===========================
// TYPING EFFECT
// ===========================

const heroTitle=document.querySelector(".hero-content h1");

if(heroTitle){

const text=heroTitle.innerText;

heroTitle.innerText="";

let index=0;

function type(){

if(index<text.length){

heroTitle.innerHTML+=text.charAt(index);

index++;

setTimeout(type,40);

}

}

type();

}


// ===========================
// DARK MODE
// ===========================

const darkBtn=document.createElement("button");

darkBtn.innerHTML='<i class="fas fa-moon"></i>';

darkBtn.id="darkMode";

document.body.appendChild(darkBtn);

Object.assign(darkBtn.style,{

position:"fixed",

left:"20px",

bottom:"20px",

width:"55px",

height:"55px",

borderRadius:"50%",

border:"none",

background:"#0D47A1",

color:"#fff",

cursor:"pointer",

fontSize:"20px",

boxShadow:"0 10px 20px rgba(0,0,0,.25)",

zIndex:"999"

});

darkBtn.addEventListener("click",()=>{

document.body.classList.toggle("dark");

if(document.body.classList.contains("dark")){

darkBtn.innerHTML='<i class="fas fa-sun"></i>';

}else{

darkBtn.innerHTML='<i class="fas fa-moon"></i>';

}

});


// ===========================
// TOAST MESSAGE
// ===========================

function showToast(message){

const toast=document.createElement("div");

toast.innerText=message;

Object.assign(toast.style,{

position:"fixed",

right:"20px",

top:"90px",

background:"#0D47A1",

color:"#fff",

padding:"15px 25px",

borderRadius:"10px",

boxShadow:"0 10px 20px rgba(0,0,0,.2)",

zIndex:"9999",

opacity:"0",

transition:".4s"

});

document.body.appendChild(toast);

setTimeout(()=>toast.style.opacity="1",100);

setTimeout(()=>{

toast.style.opacity="0";

setTimeout(()=>toast.remove(),500);

},9000);

}


// ===========================
// DEMO WELCOME
// ===========================

setTimeout(()=>{

showToast("Welcome to DEVSPHERE Library Management System");

},1000);


// ===========================
// CURRENT YEAR
// ===========================

const year=document.querySelector(".copyright");

if(year){

year.innerHTML=`© ${new Date().getFullYear()} DEVSPHERE. All Rights Reserved.`;

}