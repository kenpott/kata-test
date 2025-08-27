(function () {
  console.log("kata script loaded");

  const html = `
<div class="popup">
  <div class="topbar">
    <div class="left">
      <h1 class="title">kata</h1>
      <p class="plan Free">Free</p>
    </div>
    <a class="status online"></a>
  </div>
  <div class="content">
    <ul class="list">
      <li class="item">
        <div class="setting active" id="auto-solve">
          <h4 class="title">Auto Solve</h4>
          <label class="switch">
            <input type="checkbox" class="toggle" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="subSettings"></div>
      </li>
      <li class="item">
        <div class="setting active" id="auto-answer">
          <h4 class="title">Auto Answer</h4>
          <label class="switch">
            <input type="checkbox" class="toggle" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="subSettings active" id="delay">
          <div class="container">
            <div class="rangeHeader">
              <h5 class="title">Delay (s)</h5>
              <span class="levelValue">0.5</span>
            </div>
            <div class="range">
              <input
                type="range"
                class="rangeInput"
                min="0"
                max="10"
                value="5"
                step="0.1"
              />
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
  <div class="footer">
    <p class="text">press ctrl to hide</p>
  </div>
</div>
  `;

  const style = `
  .popup {
    --color-bg: #1c1c1c;
  --color-popup: #1e1e1e;
  --color-border: #2a2a2a;
  --color-text: #cfcfcf; 
  --color-text-secondary: #a3a3a3; 
  --color-text-tertiary: #444444;
  --color-text-disabled: #3a3a3a;

  --color-free-bg: #3a3a3a;
  --color-free-border: #3a3a3a;
  --color-premium-bg: #8b5cf6;
  --color-premium-border: #8b5cf6;

  --color-status-online: #34d399;
  --color-status-offline: #ef4444;
  --color-status-idle: #6b7280;

  --color-accent: #8b5cf6;
  --color-accent-hover: #7c3aed;
  --color-accent-light: #c4b5fd;

  --popup-width: 260px;
  --popup-height: 300px;
  --popup-radius: 16px;

  --font-family: Arial, sans-serif;
  --font-size-h1: 1.2em;
  --font-size-plan: 0.9em;

  --switch-width: 28px;
  --switch-height: 1em;
  --switch-knob: 12px;
  --switch-offset: 2px;
  --color-switch-off: #3a3a3a;
  --color-switch-knob: #8b5cf6;
  --color-switch-on: #8b5cf6;
  --color-switch-knob-active: #3a3a3a;

  --slider-width: 70%;
  --slider-height: 6px;
  --slider-bg: rgb(82, 82, 82);
  --slider-border-radius: 999px;
  --slider-fill-color: #8b5cf6;
  --slider-transition: 0.1s;
  --slider-value-color: #cfcfcf;
  --slider-value-gap: 12px;

  all: initial;
  font-family: var(--font-family);
  padding: 0;
  margin: 0;
  
  width: var(--popup-width);
  height: var(--popup-height);
  border-radius: var(--popup-radius);
  border: 1px solid var(--color-border);
  background: var(--color-popup);
  position: fixed;
  top: 50%;
  left: 50%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 999999;
  color: var(--color-text);
  box-sizing: border-box;
}

.popup .topbar {
  flex: 0 0 5%;
  display: flex;
  padding: 10px 22px 10px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}

.popup .topbar .left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.popup .topbar .title {
  font-size: var(--font-size-h1);
  font-weight: bold;
}

.popup .topbar .plan {
  display: flex;
  border-radius: 8px;
  padding: 2px 4px;
  font-size: var(--font-size-plan);
  font-weight: bolder;
}

.popup .plan.Free {
  background-color: var(--color-free-bg);
  border: 3px solid var(--color-free-border);
  color: var(--color-text);
}

.popup .plan.Plus {
  background-color: var(--color-premium-bg);
  border: 3px solid var(--color-premium-border);
  color: var(--color-bg);
}

.popup .status {
  border-radius: 16px;
  padding: 5px;
}

.popup .status.online {
  background-color: var(--color-status-online);
}

.popup .status.offline {
  background-color: var(--color-status-offline);
}

.popup .status.idle {
  background-color: var(--color-status-idle);
}

.popup .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
}

.popup .content .list {
  list-style-type: none;
  width: 100%;
  padding: 0;
  margin: 0;
}

.popup .content .item {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 4px 0;
}

.popup .setting {
  display: none;
  justify-content: space-between;
  align-items: center;
}

.popup .setting.active {
  display: flex;
}

.popup .setting .title {
  margin: 8px 0;
  color: var(--color-text);
}

.popup .subSettings {
  font-size: 0.85em;
  color: var(--color-text-secondary);
  display: none;
  margin-top: 4px;
  padding-left: 24px;
  font-weight: bold;
}

.popup .subSettings.active {
  display: block;
}

.popup .footer {
  flex: 0 0 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-disabled);
  font-size: 0.8em;
  pointer-events: none;
  padding: 10px 0;
}

.popup .switch {
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: var(--switch-height);
}

.popup .switch .toggle {
  display: none;
}

.popup .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-switch-off);
  border-radius: var(--switch-height);
  transition: background 0.3s, box-shadow 0.3s;
}

.popup .slider::after {
  content: "";
  position: absolute;
  width: var(--switch-knob);
  height: var(--switch-knob);
  left: var(--switch-offset);
  top: calc((var(--switch-height) - var(--switch-knob)) / 2);
  background: var(--color-switch-knob);
  border-radius: 50%;
  transition: transform 0.3s, background 0.3s;
}

.popup .toggle:checked + .slider {
  background: var(--color-switch-on);
}

.popup .toggle:checked + .slider::after {
  transform: translateX(
    calc(var(--switch-width) - var(--switch-knob) - var(--switch-offset) * 2)
  );
  background: var(--color-switch-knob-active);
}

.popup .range {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.popup .rangeHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.popup .rangeHeader .title {
  margin: 0;
  font-size: 0.85em;
}

.popup .rangeHeader .levelValue {
  min-width: 2ch;
  font-size: 0.85em;
  text-align: right;
}

.popup .range .rangeInput {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  height: var(--slider-height);
  background: var(--slider-bg);
  border-radius: var(--slider-border-radius);
  cursor: pointer;
  overflow: hidden;
  transition: height var(--slider-transition);
  border: none;
  margin: 4px 0;
}

.popup .range .rangeInput::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0;
  height: 0;
  box-shadow: -200px 0 0 200px var(--slider-fill-color);
}

.popup .range .rangeInput::-moz-range-thumb {
  width: 0;
  height: 0;
  box-shadow: -200px 0 0 200px var(--slider-fill-color);
  border: none;
}

.popup .range .rangeInput:focus {
  outline: none;
}
  `;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  function init() {
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const styleEl = document.createElement("style");
    styleEl.textContent = style;
    document.head.appendChild(styleEl);

    const status_dislay = document.querySelector(".status");
    const autoSolve_toggle = document.querySelector("#auto-solve");
    const autoAnswer_toggle = document.querySelector("#auto-answer");
    const delay_input = document.querySelector(".rangeInput");

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
      const delay_text = document.querySelector(".levelValue");
      delay_text.textContent = level;
    });
  }
})();

// use mathjax