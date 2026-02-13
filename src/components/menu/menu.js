import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

const trigger = document.getElementById("menu-trigger");
const expandedMenu = document.getElementById("expanded-menu");
const backdrop = document.getElementById("menu-backdrop");

if (trigger && expandedMenu && backdrop) {
  let tl = gsap
    .timeline({ paused: true })
    .to("#menu-backdrop", {
      duration: 0.5,
      opacity: 1,
      ease: "power2.out",
      onStart: () => backdrop.classList.add('active'),
      onReverseComplete: () => backdrop.classList.remove('active')
    })
    .to("#expanded-menu", {
      duration: 1.2,
      delay: 0.1,
      height: "auto",
      ease: "power4.out"
    }, 0)
    .to(
      "#sub-menu img",
      {
        duration: 1,
        opacity: 1,
        ease: "power4.inOut",
        stagger: 0.05
      },
      0.3
    )
    .reverse();

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    tl.reversed(!tl.reversed());
  });

  // Cerrar el menú al hacer click en cualquier parte de la pantalla
  document.addEventListener("click", (event) => {
    if (!tl.reversed() && !trigger.contains(event.target) && !expandedMenu.contains(event.target)) {
      tl.reverse();
    }
  });

  // Navegación suave a secciones
  const menuItems = document.querySelectorAll('.menu-item');
  
  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const sectionId = item.getAttribute('data-section');
      const targetSection = document.querySelector(sectionId);
      
      if (targetSection) {
        // Cerrar el menú
        tl.reverse();
        
        // Scroll suave con GSAP
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetSection,
            offsetY: 0
          },
          ease: "power3.inOut"
        });
      }
    });
  });

  // Navegación suave para los botones del hero
  const heroButtons = document.querySelectorAll('a[href^="#"]');
  
  heroButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const href = button.getAttribute('href');
      let targetSection;
      
      // Redirigir #contacto a #ubicacion
      if (href === '#contacto') {
        targetSection = document.querySelector('#ubicacion');
      } else {
        targetSection = document.querySelector(href);
      }
      
      if (targetSection) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: {
            y: targetSection,
            offsetY: 0
          },
          ease: "power3.inOut"
        });
      }
    });
  });
}
