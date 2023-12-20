document.addEventListener("DOMContentLoaded", function () {
  var effetGroupe = document.getElementById("effetGroupe");
  var vonRestorff = document.getElementById("effetVonRestorff");
  var infos_container2 = document.getElementById("infos_container2");
  var containert = document.getElementById("containert");
  var final = document.getElementById("final");
  //visibility hidden
  effetGroupe.style.display = "none";
  vonRestorff.style.display = "none";
  infos_container2.style.display = "none";
  containert.style.display = "none";
  final.style.display = "none";
  


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
  //document.body.style.overflow = "hidden";

  startButton.addEventListener("click", function () {
    document.body.style.overflow = "auto";
    divStart.style.display = "none";
    divStart2.style.display = "none";
    sound_neon.play();
  });

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
        gsap.to("#shoppingCart", {
          x: "+=100vw",
          duration: 2,
          ease: "power1.inOut",
        });

        if (ifBanane()) {
          document.querySelector("#final > div:nth-child(1) > div > h2").innerHTML = "Vous êtes tombé dans le piège du biais de Von Restorff 😮";
        }

        setTimeout(function () {
          document.querySelector("#shoppingCart").style.display = "none";
          final.style.display = "flex";
          gsap.to(window, {scrollTo:"#final", duration:3, ease: "power1.in"});
          gsap.utils.toArray(".explicationFinale").forEach((explication, index) => {
            const direction = index % 2 === 0 ? 1 : -1; // 1 for right, -1 for left
        
            gsap.fromTo(
              explication,
              { x: `${direction * 100}%` },
              {
                x: "0%",
                scrollTrigger: {
                  trigger: explication,
                  start: "bottom bottom",
                  end: "center center",
                  scrub: true,
                },
              }
            );
          });

            
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
  function ifBanane() {
    var dropzones = document.querySelectorAll(".dropzone");
    for (var i = 0; i < dropzones.length; i++) {
      //if document.querySelector("#shoppingCart > div:nth-child(3) > div > img").dataset.fruit === "banane"
      var imgElement = dropzones[i].querySelector("img");
      if (imgElement && imgElement.dataset.fruit === "banane") {
          return true;
      }

    }
    return false;
  }

  const ticketPrev = document.querySelector("#infos_container .tickets");
  const tickets = document.querySelectorAll(
    "#infos_container .tickets__ticket"
  );

  let current = 0;

  tickets.forEach((ticket, index) => {
    gsap.set(ticket, {
      zIndex: index,
      scale: 1 + 0.1 * index,
      yPercent: 0 + 15 * index,
    });
  });

  const animation = function (ticketNumber) {
    tickets.forEach((ticket, index) => {
      let ticketOrder = (ticketNumber + index) % tickets.length;
      if (ticketOrder < 0) {
        ticketOrder = ticketOrder + tickets.length;
      }
      gsap.to(ticket, {
        zIndex: ticketOrder,
        scale: 1 + 0.1 * ticketOrder,
        yPercent: 0 + 15 * ticketOrder,
      });
    });
  };

  ticketPrev.addEventListener("click", function () {
    if (current === tickets.length) {
      console.log("fini");
      effetGroupe.style.display = "flex";;
      document.querySelector("#effetGroupe").scrollIntoView({
        behavior: "smooth",
      });
    }
    const ticketNumber = current % tickets.length;
    const currentTicket = tickets[ticketNumber];
    current = current + 1;

    let direction = "100%";

    if (Math.random() > 0.5) {
      direction = "-100%";
    }

    const timeline = gsap.timeline();
    timeline
      .set(currentTicket, { x: 0, y: 0, duration: 0.5 })
      // .to(currentTicket, { x: direction, y: -40, rotation: "5deg" })
      // .to(currentTicket, { x: 0, y: 0, rotation: "0deg" })
      .call(animation(ticketNumber));
  });


  //get all .path and add event click
  var paths = document.querySelectorAll(".path");
  paths.forEach((path) => {
    path.addEventListener("click", function () {
      //if click on path, display true containert
      containert.style.display = "flex";
      infos_container2.style.display = "flex";
      gsap.to(containert, {
        x: () =>
          -(containert.scrollWidth - document.documentElement.clientWidth) + "px",
    
        scrollTrigger: {
          start: "center center",
          trigger: containert,
          invalidateOnRefresh: true,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          end: () => "+=" + containert.offsetWidth,
        },
      });
            //scroll to containert when click on path
            gsap.to(window, {scrollTo:"#infos_container2", duration:3, ease: "power1.in"});

            
      if (path.dataset.chemin === "true") {
        document.querySelector("#infos_container2 > section h1").innerHTML = "En prenant le chemin le plus emprunté, vous avez surement subit le biais de groupe 😮";
      }
    });
  });

  const ticketPrev2 = document.querySelector("#infos_container2 .tickets2");
  const tickets2 = document.querySelectorAll(
    "#infos_container2 .tickets__ticket"
  );

  let current2 = 0;

  tickets2.forEach((ticket, index) => {
    gsap.set(ticket, {
      zIndex: index,
      scale: 1 + 0.1 * index,
      yPercent: 0 + 15 * index,
    });
  });

  const animation2 = function (ticketNumber) {
    tickets2.forEach((ticket, index) => {
      let ticketOrder = (ticketNumber + index) % tickets2.length;
      if (ticketOrder < 0) {
        ticketOrder = ticketOrder + tickets2.length;
      }
      gsap.to(ticket, {
        zIndex: ticketOrder,
        scale: 1 + 0.1 * ticketOrder,
        yPercent: 0 + 15 * ticketOrder,
      });
    });
  };

  ticketPrev2.addEventListener("click", function () {
    if (current2 === tickets2.length) {
      vonRestorff.style.display = "flex";;
      gsap.to(window, {scrollTo:"#effetVonRestorff", duration:2, ease: "power1.in"});
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
    }
    const ticketNumber2 = current2 % tickets2.length;
    const currentTicket2 = tickets2[ticketNumber2];
    current2 = current2 + 1;

    let direction = "100%";

    if (Math.random() > 0.5) {
      direction = "-100%";
    }

    const timeline2 = gsap.timeline();
    timeline2
      .set(currentTicket2, { x: 0, y: 0, duration: 0.5 })
      // .to(currentTicket2, { x: direction, y: -40, rotation: "5deg" })
      // .to(currentTicket2, { x: 0, y: 0, rotation: "0deg" })
      .call(animation2(ticketNumber2));
  });



});
