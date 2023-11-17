const { innerHeight } = window;

gsap.from("#zoom-in img", 
    { scale: 0.1, stager: 0.25, duration: 3, 
        scrollTrigger: {
           trigger: "#zoom-in",
           pin : true, 
           end: `+=${innerHeight *1.5}`,
           scrub: 3
        } });
