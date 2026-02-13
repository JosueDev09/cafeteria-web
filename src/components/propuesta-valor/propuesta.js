import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AOS from 'aos';
import 'aos/dist/aos.css';

console.clear();

gsap.registerPlugin(ScrollTrigger);

// Inicializar AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: false,
  mirror: true,
  offset: 100
});

// Mouse trail animation
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

let flair = gsap.utils.toArray(".propuesta-section .flair");
let gap = 80;
let index = 0;
let wrapper = gsap.utils.wrap(0, flair.length);

let mousePos = { x: 0, y: 0 };
let lastMousePos = mousePos;
let cachedMousePos = mousePos;
let isInSection = false;

const sectionElement = document.querySelector(".propuesta-section");

if (sectionElement) {
  sectionElement.addEventListener("mouseenter", () => {
    isInSection = true;
  });

  sectionElement.addEventListener("mouseleave", () => {
    isInSection = false;
  });

  sectionElement.addEventListener("mousemove", (e) => {
    if (isInSection) {
      const mouseEvent = e;
      mousePos = {
        x: mouseEvent.clientX,
        y: mouseEvent.clientY
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

// ScrollTrigger pin animation
const list = document.querySelector(".list");
const fill = document.querySelector(".fill");
const listItems = gsap.utils.toArray("li", list);
const slides = gsap.utils.toArray(".slide");

const pinSections = gsap.utils.toArray(".pin-section");
const lists = gsap.utils.toArray(".list");

if (list && listItems.length > 0) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".pin-section",
      start: "top top",
      end: "+=" + listItems.length * 110 + "%",
      pin: true,
      scrub: true
      // markers: true
    }
  });

  // First element visible, set the marker
  if (fill) {
    gsap.set(fill, {
      scaleY: 1 / listItems.length,
      transformOrigin: "top left"
    });
  }

  listItems.forEach((item, i) => {
    const previousItem = listItems[i - 1];
    const slideText = slides[i]?.querySelector('.slide-text');
    const prevSlideText = slides[i - 1]?.querySelector('.slide-text');
    
    if (previousItem) {
      tl.set(item, { color: "#000000" }, .5 * i)
        .to(
          slides[i],
          {
            autoAlpha: 1,
            duration: 0.3
          },
          "<"
        )
        .to(
          slideText,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
          },
          "<0.2"
        )
        .set(previousItem, { color: "var(--color-amber-600)" }, "<")
        .to(
          prevSlideText,
          {
            opacity: 0,
            y: -30,
            duration: 0.4,
            ease: "power2.in"
          },
          "<"
        )
        .to(
          slides[i - 1],
          {
            autoAlpha: 0,
            duration: 0.3
          },
          "<0.2"
        );
    } else {
      gsap.set(item, { color: "#000000" });
      gsap.set(slides[i], { autoAlpha: 1 });
      gsap.set(slideText, { opacity: 1, y: 0 });
    }
  });

  if (fill) {
    tl.to(
      fill,
      {
        scaleY: 1,
        transformOrigin: "top left",
        ease: "none",
        duration: tl.duration()
      },
      0
    ).to({}, {}); // add a small pause at the end of the timeline before it un-pins
  }

  // Animar la capa negra progresiva
  const scrollOverlay = document.querySelector('.scroll-overlay');
  if (scrollOverlay) {
    tl.to(
      scrollOverlay,
      {
        opacity: 1,
        ease: "none",
        duration: tl.duration()
      },
      0
    );
  }
}
