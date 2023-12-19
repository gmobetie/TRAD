const ticketPrev = document.querySelector(".tickets");
const tickets = document.querySelectorAll(".tickets__ticket");

let current = 0;

tickets.forEach((ticket, index) => {
  gsap.set(ticket, {
    zIndex: index,
    scale: 1 + 0.1 * index,
    yPercent: 0 + 15 * index
  });
});

const animation = function (ticketNumber) {
  tickets.forEach((ticket, index) => {
    let ticketOrder = (ticketNumber + index - 1) % tickets.length;
    if (ticketOrder < 0) {
      ticketOrder = ticketOrder + tickets.length;
    }
    gsap.to(ticket, {
      zIndex: ticketOrder,
      scale: 1 + 0.1 * ticketOrder,
      yPercent: 0 + 15 * ticketOrder
    });
  });
};

ticketPrev.addEventListener("click", function () {
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
    //.to(currentTicket, { x: direction, y: -40, rotation: "5deg" })
    //.to(currentTicket, { x: 0, y: 0, rotation: "0deg" })
    .call(animation(ticketNumber));
});
