document.addEventListener("DOMContentLoaded", function () {
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
  //impossible de scroll
  document.body.style.overflow = "hidden";

  startButton.addEventListener("click", function () {
    document.body.style.overflow = "auto";
    divStart.style.display = "none";
    divStart2.style.display = "none";
    sound_neon.play();
  });

  var vonRestorff = document.getElementById("effetVonRestorff");
  var main = document.getElementById("main");
  vonRestorff.addEventListener("mouseenter", function () {
    document.body.style.cursor = "none";
    var img = document.createElement("img");
    img.src = "../assets/fruit/main.svg";
    main.appendChild(img);
    vonRestorff.addEventListener("mousedown", function () {
      img.src = "../assets/fruit/poing.svg";
    });
    vonRestorff.addEventListener("mouseup", function () {
      img.src = "../assets/fruit/main.svg";
    });
  });
  vonRestorff.addEventListener("mouseleave", function () {
    document.body.style.cursor = "url('../assets/curseur.svg'), auto";
    main.innerHTML = "";
  });

  vonRestorff.addEventListener("mousemove", (e) => {
    let sizeW = main.offsetWidth / 2;
    let sizeH = main.offsetWidth / 2;
    main.style.transform = `translateX(calc(${e.clientX}px - ${sizeW}px)) translateY(calc(${e.clientY}px - ${sizeH}px))`;
  });

  gsap.from("#shoppingCart", {
    x: "-100vw",
    stagger: 0.2,
    duration: 2,
    ease: "power2.out",
    scrollTrigger: {
      trigger: ".container",
      start: "center center",
      end: "+=100vw",
      scrub: 3,
    },
  });

  var container = document.querySelector(".container");

  // Draggable
  interact(".fruit")
    .draggable({
      onstart: function (event) {
        event.target.classList.add("dragging");
      },
      onmove: function (event) {
        var target = event.target;
        target.style.zIndex = 2;
        var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
        var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

        target.style.transform = "translate(" + x + "px, " + y + "px)";
        target.setAttribute("data-x", x);
        target.setAttribute("data-y", y);
      },
      onend: function (event) {
        event.target.style.zIndex = 1;
        event.target.setAttribute("data-x", 0);
        event.target.setAttribute("data-y", 0);

        event.target.classList.remove("dragging");
        event.target.style.transform = ""; // Reset the transform
      },
    })
    .styleCursor(false);

  // Dropzone
  interact(".dropzone").dropzone({
    accept: ".fruit",
    ondragenter: function (event) {
      var draggableElement = event.relatedTarget;
      var dropzoneElement = event.target;

      // Add styles when a fruit enters the dropzone
      dropzoneElement.classList.add("drop-target");
      draggableElement.classList.add("can-drop");
    },
    ondragleave: function (event) {
      var draggableElement = event.relatedTarget;
      var dropzoneElement = event.target;

      // Remove styles when a fruit leaves the dropzone
      dropzoneElement.classList.remove("drop-target");
      draggableElement.classList.remove("can-drop");
    },
    ondrop: function (event) {
      var draggableElement = event.relatedTarget;
      var dropzoneElement = event.target;

      if (dropzoneElement.childElementCount > 0) {
        var existingFruit = dropzoneElement.querySelector(".fruit");
        container.appendChild(existingFruit);
      }

      // Append the new fruit to the dropzone
      dropzoneElement.appendChild(draggableElement);

      // Remove styles
      dropzoneElement.classList.remove("drop-target");
      draggableElement.classList.remove("can-drop");
      if (areAllDropzonesFilled()) {
        console.log("All dropzones are filled");
        gsap.to("#shoppingCart", {
          x: "+=100vw",
          duration: 2,
          ease: "power1.inOut",
        });
        //after display none and go to the next page
        setTimeout(function () {
          vonRestorff.style.display = "none";
          window.location.href = "index.html";

        }, 2000);
      }
    },
  });
  function areAllDropzonesFilled() {
    var dropzones = document.querySelectorAll(".dropzone");
    for (var i = 0; i < dropzones.length; i++) {
      if (dropzones[i].childElementCount === 0) {
        return false;
      }
    }
    return true;
  }


  const pinDistance = 5000;
  const stepHeight = document.querySelector('.stepped-animation').offsetHeight;
  
  gsap.set('.single-step', { autoAlpha: 0 });
  
  // Section
  ScrollTrigger.create({
    trigger: ".pinned",
    start: "center center",
    end: "+=" + pinDistance,
    pin: "body",
    markers: false,
    id: "pinned"
  });
  
  // Texts inside section
  const stepsTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.pinned .stepped-animation',
      start: 'top center',
      end: "+=" + pinDistance,
      scrub: true,
      markers: true,
    }
  });
  
  const steps = gsap.utils.toArray(".pinned .single-step");
  
  
  // loop through each step and add a callback into the timeline, spaced equally (1 second apart just to make things simple)
  steps.forEach((step, i) => {
    stepsTimeline.add(() => {
      // if scrolling backward, we need to invert which element fades in or out
      const forward = stepsTimeline.scrollTrigger.direction > 0,
            inEl = forward ? step : steps[i - 1],
            outEl = forward ? steps[i - 1] : step;
      
      outEl && gsap.to(outEl, {autoAlpha: 0, duration: 0.3, overwrite: true});
      inEl && gsap.to(inEl, {autoAlpha: 1, duration: 0.3, delay: 0.3, overwrite: true});
    }, i || 0.001);
  });
  // add blank space to the end of the timeline so that the last element stays for a bit before unpinning.
  stepsTimeline.to({}, {duration: 1})
});

