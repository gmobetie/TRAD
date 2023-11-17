const { innerHeight } = window;
console.log(innerHeight);

gsap.from("#zoom-in h1", 
    { scale: 500, stager: 0.25, duration: 3, 
        scrollTrigger: {
           trigger: "#zoom-in",
           pin : true, 
           end: `+=${innerHeight *1.2}`,
           scrub: 3
        } });
