import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



gsap.registerPlugin(ScrollTrigger);





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
    
    // Pinning and horizontal scrolling solo en desktop (min-width: 769px)
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 769px)", () => {
      gsap.to(pinWrap, {
        scrollTrigger: {
          scrub: 3,
          trigger: ".productos-gallery",
          pin: true,
          start: "top top",
          end: () => `+=${pinWrapWidth}`,
          invalidateOnRefresh: true,
          anticipatePin: 1
        },
        x: () => -horizontalScrollLength,
        ease: "power1.inOut"
      });
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

}



