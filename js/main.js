(()=>{"use strict";
const body=document.body;
const siteHeader=document.querySelector("#site-header");
const menu=document.querySelector(".menu");
const navPanel=document.querySelector("#navlinks");
const navLinks=[...document.querySelectorAll("#navlinks a")];
const sections=[...document.querySelectorAll("main section[id]")];
const revealItems=[...document.querySelectorAll(".reveal")];
const progress=document.querySelector("#progress");
const year=document.querySelector("#year");
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const mobileQuery=window.matchMedia("(max-width: 700px)");

const setCurrent=(id)=>{
  navLinks.forEach(link=>{
    const active=link.getAttribute("href")===`#${id}`;
    link.classList.toggle("active",active);
    if(active) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  });
};

const closeMenu=({restoreFocus=false}={})=>{
  if(!menu||!navPanel) return;
  navPanel.classList.remove("open");
  siteHeader?.classList.remove("menu-open");
  menu.setAttribute("aria-expanded","false");
  menu.setAttribute("aria-label","Open navigation");
  body.classList.remove("nav-open");
  if(restoreFocus) menu.focus();
};

const openMenu=()=>{
  if(!menu||!navPanel) return;
  navPanel.classList.add("open");
  siteHeader?.classList.add("menu-open");
  menu.setAttribute("aria-expanded","true");
  menu.setAttribute("aria-label","Close navigation");
  body.classList.add("nav-open");
  const firstLink=navLinks[0];
  if(firstLink && mobileQuery.matches) requestAnimationFrame(()=>firstLink.focus());
};

if(menu&&navPanel){
  menu.addEventListener("click",()=>menu.getAttribute("aria-expanded")==="true"?closeMenu():openMenu());
  navLinks.forEach(link=>link.addEventListener("click",()=>closeMenu()));
  document.addEventListener("click",(event)=>{
    if(!mobileQuery.matches||menu.getAttribute("aria-expanded")!=="true") return;
    const target=event.target;
    if(target instanceof Node&&!menu.contains(target)&&!navPanel.contains(target)) closeMenu();
  });
  document.addEventListener("keydown",(event)=>{
    if(event.key==="Escape"&&menu.getAttribute("aria-expanded")==="true"){event.preventDefault();closeMenu({restoreFocus:true});return;}
    if(event.key!=="Tab"||menu.getAttribute("aria-expanded")!=="true"||!mobileQuery.matches) return;
    const focusables=[menu,...navLinks].filter(el=>el&&!el.hasAttribute("disabled"));
    const first=focusables[0],last=focusables[focusables.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  mobileQuery.addEventListener("change",event=>{if(!event.matches) closeMenu();});
}

if(!reducedMotion){
  const revealObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("show");revealObserver.unobserve(entry.target);}
    });
  },{threshold:.12});
  revealItems.forEach(item=>revealObserver.observe(item));
}else revealItems.forEach(item=>item.classList.add("show"));

if(sections.length){
  const spyObserver=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{if(entry.isIntersecting)setCurrent(entry.target.id);});
  },{rootMargin:"-42% 0px -48% 0px",threshold:0});
  sections.forEach(section=>spyObserver.observe(section));
}

let ticking=false;
const updateScrollState=()=>{
  if(siteHeader) siteHeader.classList.toggle("is-scrolled",window.scrollY>24);
  if(progress&&!CSS.supports("animation-timeline:scroll()")){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=`${max>0?Math.min(100,Math.max(0,window.scrollY/max*100)):0}%`;
  }
  ticking=false;
};
const requestScrollUpdate=()=>{
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(updateScrollState);
};
window.addEventListener("scroll",requestScrollUpdate,{passive:true});
window.addEventListener("resize",requestScrollUpdate,{passive:true});
updateScrollState();

if(year)year.textContent=String(new Date().getFullYear());
})();