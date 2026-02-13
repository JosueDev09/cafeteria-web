import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';
 import AOS from 'aos';
  import 'aos/dist/aos.css';
  // Inicializar AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: false,
  mirror: true,
  offset: 100
});


gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(Flip);

let flipCtx;

const createTween = () => {
  let galleryElement = document.querySelector("#gallery-8");
  
  if (!galleryElement) return;
  
  let galleryItems = galleryElement.querySelectorAll(".gallery__item");

  flipCtx && flipCtx.revert();
  galleryElement.classList.remove("gallery--final");

  flipCtx = gsap.context(() => {
    // Temporarily add the final class to capture the final state
    galleryElement.classList.add("gallery--final");
    const flipState = Flip.getState(galleryItems);
    galleryElement.classList.remove("gallery--final");

    const flip = Flip.to(flipState, {
      simple: true,
      ease: "expoScale(1, 5)"
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: galleryElement,
        start: "center center",
        end: "+=100%",
        scrub: true,
        pin: galleryElement.parentNode
      }
    });
    
    tl.add(flip);
    
    return () => gsap.set(galleryItems, { clearProps: "all" });
  });
};

createTween();

window.addEventListener("resize", createTween);

// Mouse trail effect
function playAnimation(shape) {
  let tl = gsap.timeline();
  tl.from(shape, {
    opacity: 0,
    scale: 0,
    ease: "elastic.out(1,0.3)",
  })
  .to(shape, {
    rotation: "random([-360, 360])",
  }, "<")
  .to(shape, {
    y: "120vh",
    ease: "back.in(.4)",
    duration: 1,
  }, 0);
}

let flair = gsap.utils.toArray(".section .flair");
let gap = 80;
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);

let mousePos = { x: 0, y: 0 };
let lastMousePos = mousePos;
let cachedMousePos = mousePos;
let isInSection = false;

const sectionElement = document.querySelector(".section");

if (sectionElement) {
  sectionElement.addEventListener("mouseenter", () => {
    isInSection = true;
  });

  sectionElement.addEventListener("mouseleave", () => {
    isInSection = false;
  });

  sectionElement.addEventListener("mousemove", (e) => {
    if (isInSection) {
      mousePos = {
        x: e.clientX,
        y: e.clientY
      };
    }
  });
}

gsap.ticker.add(imageTrail);

function imageTrail() {
  if (!isInSection) return;

  let travelDistance = Math.hypot(
    lastMousePos.x - mousePos.x,
    lastMousePos.y - mousePos.y
  );

  cachedMousePos.x = gsap.utils.interpolate(
    cachedMousePos.x || mousePos.x,
    mousePos.x,
    0.1
  );
  cachedMousePos.y = gsap.utils.interpolate(
    cachedMousePos.y || mousePos.y,
    mousePos.y,
    0.1
  );

  if (travelDistance > gap) {
    animateImage();
    lastMousePos = mousePos;
  }
}

function animateImage() {
  let wrappedIndex = wrapper(index);
  let img = flair[wrappedIndex];
  
  gsap.killTweensOf(img);
  
  gsap.set(img, {
    clearProps: "all",
  });

  gsap.set(img, {
    opacity: 1,
    left: mousePos.x,
    top: mousePos.y,
    xPercent: -50,
    yPercent: -50,
  });

  playAnimation(img);

  index++;
}
