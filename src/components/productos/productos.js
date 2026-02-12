import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(ScrollTrigger,Flip);


const modal = document.querySelector(".modal");
const modalContent = modal ? modal.querySelector(".content") : null;
const modalOverlay = modal ? modal.querySelector(".overlay") : null;
const boxes = gsap.utils.toArray(".container-fluid .product-card");
let activeCard = null;

if (modal && modalContent && modalOverlay) {
  // Cerrar modal al hacer click en overlay
  modalOverlay.addEventListener("click", closeModal);
  
  // Cerrar modal con ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeCard) {
      closeModal();
    }
  });
}

function closeModal() {
  if (!activeCard) return;
  
  const state = Flip.getState(activeCard.card);
  activeCard.parent.appendChild(activeCard.card);
  
  gsap.to([modal, modalOverlay], {
    autoAlpha: 0,
    duration: 0.3
  });
  
  Flip.from(state, {
    duration: 0.5,
    ease: "power2.inOut",
    absolute: true,
    onComplete: () => {
      gsap.set(activeCard.card, { clearProps: "all" });
      activeCard = null;
      // Desbloquear scroll
      document.body.style.overflow = '';
    }
  });
}

function openModal(card, index) {
  if (activeCard) return;
  
  // Bloquear scroll
  document.body.style.overflow = 'hidden';
  
  const state = Flip.getState(card);
  const parent = card.parentElement;
  
  modalContent.appendChild(card);
  activeCard = { card, parent, index };
  
  gsap.set(modal, { autoAlpha: 1 });
  
  Flip.from(state, {
    duration: 0.5,
    ease: "power2.inOut",
    absolute: true,
    scale: true
  });
  
  gsap.to(modalOverlay, { 
    autoAlpha: 0.7, 
    duration: 0.3 
  });
}


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

  // Event listeners para las tarjetas
  boxes.forEach((card, i) => {
    card.addEventListener("click", () => {
      if (activeCard && activeCard.card === card) {
        closeModal();
      } else if (!activeCard) {
        openModal(card, i);
      }
    });
  });
}



