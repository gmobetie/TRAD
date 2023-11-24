const { innerHeight } = window;
gsap.registerPlugin(ScrollTrigger);
var sound = new Howl({
  src: ['assets/sound/clochette.mp3']
});

gsap.to("#zoom-in img", {
  scale: 50,
  stager: 0.25,
  duration: 3,
  scrollTrigger: {
    trigger: "#zoom-in",
    pin: true,
    end: `+=${innerHeight * 1.3}`,
    scrub: 3,
    onEnter: () => {
      Howler.ctx.resume().then(() => {
        sound.play();
    });
    },

    onComplete: function () {
        gsap.to("#zoom-in ", { opacity: 0, duration: 1 });
        gsap.to(window, { scrollTo: { y: "main:last-of-type" }, duration: 1, snap: 1 });
    }
  },
});
