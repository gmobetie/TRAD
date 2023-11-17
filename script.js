const { innerHeight } = window;

gsap.to("#zoom-in img", {
  scale: 30,
  stager: 0.25,
  duration: 3,
  scrollTrigger: {
    trigger: "#zoom-in",
    pin: true,
    end: `+=${innerHeight * 1.3}`,
    scrub: 3,
    onComplete: function () {
        gsap.to("#zoom-in img", { opacity: 0, duration: 1 });
        
        gsap.to(window, { scrollTo: { y: "main:last-of-type" }, duration: 1, snap: 1 });
    }
  },
});
