import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger,Flip);


const modal = document.querySelector(".modal");
const modalContent = modal.querySelector(".content");
const modalOverlay = modal.querySelector(".overlay");
const boxes = gsap.utils.toArray(".boxes-container .box");
const boxesContent = gsap.utils.toArray(".product-card");
let boxIndex = undefined;


// Verificar si el elemento existe antes de inicializar
if (document.getElementById("productos")) {
  
  // Horizontal Scroll Galleries
  const horizontalSections = gsap.utils.toArray(".productos-section .horiz-gallery-wrapper");

  horizontalSections.forEach(function (sec, i) {
    const pinWrap = sec.querySelector(".horiz-gallery-strip");

    if (!pinWrap) return;

    let pinWrapWidth;
    let horizontalScrollLength;

    function refresh() {
      pinWrapWidth = pinWrap.scrollWidth;
      horizontalScrollLength = pinWrapWidth - window.innerWidth;
    }

    refresh();
    
    // Pinning and horizontal scrolling con efecto suave
    gsap.to(pinWrap, {
      scrollTrigger: {
        scrub: 3,
        trigger: ".productos-gallery",
        pin: true,
        start: "top top",
        end: () => `+=${pinWrapWidth * 1.2}`,
        invalidateOnRefresh: true,
        anticipatePin: 1
      },
      x: () => -horizontalScrollLength,
      ease: "power1.inOut"
    });

    ScrollTrigger.addEventListener("refreshInit", refresh);
  });

  // Animación de entrada para las tarjetas
  gsap.utils.toArray(".product-card").forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "left right",
        end: "left center",
        toggleActions: "play none none reverse",
        containerAnimation: gsap.getById("productos-scroll")
      },
      opacity: 0,
      scale: 0.8,
      duration: 0.6,
      ease: "power2.out"
    });
  });

  boxesContent.forEach((box, i) => {
  box.addEventListener("click", () => {
    if (boxIndex !== undefined) {
      const state = Flip.getState(box);
      boxes[boxIndex].appendChild(box);
      boxIndex = undefined;
      gsap.to([modal, modalOverlay], {
        autoAlpha: 0,
        ease: "power1.inOut",
        duration: 0.35
      });
      Flip.from(state, {
        duration: 0.7,
        ease: "power1.inOut",
        absolute: true,
        onComplete: () => gsap.set(box, { zIndex: "auto" })
      });
      gsap.set(box, { zIndex: 1002 });
    } else {
      const state = Flip.getState(box);
      modalContent.appendChild(box);
      boxIndex = i;
      gsap.set(modal, { autoAlpha: 1 });
      Flip.from(state, {
        duration: 0.7,
        ease: "power1.inOut"
      });
      gsap.to(modalOverlay, { autoAlpha: 0.65, duration: 0.35 });
    }
  });
});
}



