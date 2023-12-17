const { innerHeight } = window;
  var sound_neon = new Howl({
    src: ["assets/sound/neon.mp3"],
    volume: 0.05,
    loop: true,
  });

  var sound_clochette = new Howl({
    src: ["assets/sound/clochette.mp3"],
    volume: 1,
    loop: false,
  });
  window.addEventListener("scroll", function () {
    if (window.scrollY > 100) {
      sound_neon.stop();
    } else {
      sound_neon.play();
    }
    if (window.scrollY > 300 && window.scrollY < 400) {
      sound_clochette.play();
    }
  });
  
  gsap.to("#magasin", {
    scale: 50,
    duration: 3,
    scrollTrigger: {
      trigger: "#zoom-in",
      pin: true,
      end: `+=${innerHeight * 1.3}`,
      scrub: 2,
    },
  });


var startButton = document.getElementById("start-button");
var divStart = document.getElementById("start-div");
var divStart2 = document.getElementById("start-div2");

startButton.addEventListener("click", function () {
  divStart.style.display = "none";
  divStart2.style.display = "none";
  sound_neon.play();
});


