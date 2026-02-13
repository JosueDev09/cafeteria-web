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
