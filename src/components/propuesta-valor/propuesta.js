
  import { gsap } from 'gsap';

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
