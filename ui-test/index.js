const status_dislay = document.querySelector(".status");
const autoSolve_toggle = document.querySelector("#auto-solve");
const autoAnswer_toggle = document.querySelector("#auto-answer");
const delay_input = document.querySelector(".level");

const toggleHandlers = {
  autoSolve: (enabled) => {
    if (enabled) {
      console.log("Auto-solve enabled");
    } else {
      console.log("Auto-solve disabled");
    }
  },
  autoAnswer: (enabled) => {
    if (enabled) {
      console.log("Auto-answer enabled");
    } else {
      console.log("Auto-answer disabled");
    }
  },
};

// Toggle status by fetching server

//

autoSolve_toggle.addEventListener("change", (event) => {
  const enabled = event.target.checked;
  toggleHandlers.autoSolve(enabled);
});

autoAnswer_toggle.addEventListener("change", (event) => {
  const enabled = event.target.checked;
  toggleHandlers.autoAnswer(enabled);
});

delay_input.addEventListener("input", (event) => {
  const level = event.target.value;
  const delay_text = document.querySelector(".level-value");
  delay_text.textContent = level;
});
