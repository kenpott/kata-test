(function () {
  console.log("term script loaded");

  const settings = {
    autoSolve: {
      enabled: false,
    },
    autoAnswer: {
      enabled: false,
      subSettings: {
        delay: 5.0,
      },
    },
  };

  let isSolving = false;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  async function loadScript(url) {
    let response = await fetch(url);
    let script = await response.text();
    eval(script);
  }
  loadScript("https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js");

  function init() {
    const termHtml = `
<div class="popup active">
  <div class="topbar">
    <div class="left">
      <h1 class="title">term</h1>
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
            <input type="checkbox" class="toggle" id="autoSolveCheckbox"/>
            <span class="slider"></span>
          </label>
        </div>
        <div class="subSettings active" id="get-answer">
          <div class="container">
            <button id="getAnswerButton">
              <span class="">Get Answer</span>
            </button>
          </div>
        </div>
      </li>
      <li class="item">
        <div class="setting active" id="auto-answer">
          <h4 class="title">Auto Answer</h4>
          <label class="switch">
            <input type="checkbox" class="toggle" id="autoAnswerCheckbox"/>
            <span class="slider"></span>
          </label>
        </div>
        <div class="subSettings active" id="delay">
          <div class="container">
            <div class="rangeHeader">
              <h5 class="title">Delay (s)</h5>
              <span class="levelValue" id="delayValue">5.0</span>
            </div>
            <div class="range">
              <input
                type="range"
                class="rangeInput"
                id="delayInput"
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

    const termStyle = `
 .popup {
  --color-bg: #0f0f0f;
  --color-popup: #18181b;
  --color-border: #1f1f22;
  --color-text: #f5f5f5; 
  --color-text-secondary: #9ca3af; 
  --color-text-tertiary: #6b7280;
  --color-text-disabled: #3f3f46;

  --color-free-bg: #2a2a2d;     /* same as toggle background */
  --color-free-border: #2a2a2d; /* matches darker border tone */
  --color-premium-bg: #8b5cf6;
  --color-premium-border: #8b5cf6;

  --color-status-online: #22c55e;
  --color-status-offline: #ef4444;
  --color-status-idle: #52525b;

  --color-accent: #8b5cf6;
  --color-accent-hover: #7c3aed;
  --color-accent-light: #a78bfa;

  --popup-width: 260px;
  --popup-height: 300px;
  --popup-radius: 16px;

  --font-family: 'Inter', Arial, sans-serif;
  --font-size-h1: 1.2em;
  --font-size-plan: 0.9em;

  --button-bg: ##18181b;
  --button-border: #26262a;
  --button-border-hover: #8b5cf6;

  --switch-width: 28px;
  --switch-height: 1em;
  --switch-knob: 12px;
  --switch-offset: 2px;
  --color-switch-off: #2a2a2d;        /* darker toggle background */
  --color-switch-knob: #8b5cf6;
  --color-switch-on: #8b5cf6;
  --color-switch-knob-active: #18181b;

  --slider-width: 70%;
  --slider-height: 6px;
  --slider-bg: #26262a;                /* darker slider track */
  --slider-border-radius: 999px;
  --slider-fill-color: #8b5cf6;
  --slider-transition: 0.2s;
  --slider-value-color: #f5f5f5;
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
  display: none;
  flex-direction: column;
  z-index: 999999;
  color: var(--color-text);
  box-sizing: border-box;
}

.popup.active {
  display: flex;
}

.popup .topbar {
  flex: 0 0 5%;
  height: 46.5px;
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
  pointer-events: none;
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
  height: 217px;
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
  pointer-events: none;
}

.popup .subSettings {
  font-size: 0.85em;
  color: var(--color-text-secondary);
  display: none;
  margin-top: 4px;
  padding-left: 24px;
}

.popup .subSettings.active {
  display: block;
}

.popup .footer {
  flex: 0 0 5%;
  height: 34.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-disabled);
  font-size: 0.8em;
  pointer-events: none;
  padding: 10px 0;
}

.popup #getAnswerButton {
  display: block;
  background-color: var(--button-bg);
  padding: 2px 65px;
  border-radius: 8px;
  border: 1px solid var(--button-border);
}

.popup #getAnswerButton:hover {
  border-color: var(--button-border-hover);  
}

.popup #getAnswerButton span {
  font-size: small;
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
  pointer-events: none;
}

.popup .rangeHeader .levelValue {
  min-width: 2ch;
  font-size: 0.85em;
  text-align: right;
  pointer-events: none;
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

    xhrInterceptor();

    const container = document.createElement("div");
    container.innerHTML = termHtml;
    document.body.appendChild(container);

    const styleEl = document.createElement("style");
    styleEl.textContent = termStyle;
    document.head.appendChild(styleEl);

    const popup = document.querySelector(".popup");
    const status_dislay = document.querySelector(".status");
    const autoSolve_toggle = document.querySelector("#autoSolveCheckbox");
    const getAnswer_button = document.querySelector("#getAnswerButton");
    const autoAnswer_toggle = document.querySelector("#autoAnswerCheckbox");
    const delay_input = document.querySelector("#delay");

    const toggleHandlers = {
      autoSolve: async (enabled) => {
        if (!enabled) {
          console.log("Auto-solve disabled");
          return;
        }
        console.log("Auto-solve enabled");

        if (currentAnswer !== null) {
          const notifier = promptNotification();
          notifier.showNotification(currentAnswer, {
            temporary: false,
          });
          return;
        }

        if (questionData) {
          await Solve(questionData);
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

    dragElement(popup);

    function dragElement(elmnt) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;

      // Desktop
      elmnt.onmousedown = dragMouseDown;
      // Mobile
      elmnt.ontouchstart = dragTouchStart;

      function dragMouseDown(e) {
        if (
          e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.tagName === "BUTTON" ||
          e.target.isContentEditable
        )
          return;

        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }

      function dragTouchStart(e) {
        if (
          e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.tagName === "BUTTON" ||
          e.target.isContentEditable
        )
          return;

        e.preventDefault();
        const touch = e.touches[0];
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        document.ontouchend = closeDragElement;
        document.ontouchmove = elementDragTouch;
      }

      function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }

      function elementDragTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        pos1 = pos3 - touch.clientX;
        pos2 = pos4 - touch.clientY;
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
      }
    }

    let questionData;
    let screenshotData;
    let currentAnswer;

    window.addEventListener("message", async (event) => {
      if (event.data.type === "Problem-Data-XHR") {
        currentAnswer = null;

        try {
          const questionSelector = document.querySelector("#mathBlock");
          questionData = JSON.parse(event.data.response);
          screenshotData = await captureScreenshot(questionSelector);
          console.log("Screenshot Data:", screenshotData);
          console.log("Question data received");
        } catch (error) {
          console.warn("Failed to parse Problem-Data-XHR response:", error);
          return;
        }
        await Solve(questionData);
      }
    });

    // Event listeners for UI

    window.addEventListener("keydown", (event) => {
      if (event.key === "Control") {
        document.querySelector(".popup").classList.toggle("active");
      }
    });

    autoAnswer_toggle.addEventListener("change", (event) => {
      const enabled = event.target.checked;
      const autoAnswerCheckbox = document.querySelector("#autoAnswerCheckbox");
      if (autoAnswerCheckbox.checked && settings.autoAnswer.enabled) {
        autoAnswerCheckbox.checked = false;
      }
      settings.autoSolve.enabled = enabled;
      toggleHandlers.autoSolve(enabled);
    });

    autoSolve_toggle.addEventListener("change", (event) => {
      const autoSolveCheckbox = document.querySelector("#autoSolveCheckbox");
      const enabled = event.target.checked;
      autoSolveCheckbox.checked = enabled;
      settings.autoAnswer.enabled = enabled;
      settings.autoSolve.enabled = enabled;
      toggleHandlers.autoAnswer(enabled);
    });

    getAnswer_button.addEventListener("click", async (event) => {
      if (currentAnswer !== null) {
        const notifier = promptNotification();
        notifier.showNotification(currentAnswer, {
          temporary: false,
        });
        return;
      }

      if (questionData) {
        await Solve(questionData);
      }
    });

    delay_input.addEventListener("input", (event) => {
      const level = event.target.value;
      const delay_text = document.querySelector("#delayValue");
      settings.autoAnswer.subSettings.delay = parseFloat(level);
      delay_text.textContent = level;
    });
  }

  function xhrInterceptor() {
    if (window.__xhrInterceptorActive) return;
    window.__xhrInterceptorActive = true;

    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      this._url = url;
      return origOpen.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function (body) {
      this.addEventListener("load", function () {
        if (this._url.includes("problemByAssignment")) {
          window.postMessage(
            {
              type: "Problem-Data-XHR",
              url: this.responseURL,
              response: this.responseText,
            },
            "*"
          );
          try {
            JSON.parse(this.responseText);
          } catch (error) {
            console.log("⚠️ Could not parse XHR response as JSON:", error);
          }
        } else if (this._url.includes("check_answer")) {
          const response = JSON.parse(this.responseText);
          if (response.skillComplete === true) {
            const autoAnswerCheckbox = document.querySelector(
              "#autoAnswerCheckbox"
            );
            const autoSolveCheckbox =
              document.querySelector("#autoSolveCheckbox");
            autoAnswerCheckbox.enabled = false;
            autoSolveCheckbox.enabled = false;
            settings.autoAnswer.enabled = false;
            settings.autoSolve.enabled = false;
          }
        }
      });
      return origSend.call(this, body);
    };
  }

  function promptNotification() {
    let container = document.querySelector("#notificationContainer");
    if (!container) {
      const containerCss = `
      #notificationContainer {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column-reverse;
        gap: 10px;
        z-index: 999999;

        /* allow scrolling on overflow */
        max-height: 50vh;
        overflow-y: auto;
        width: 250px; /* fixed width */
        padding-right: 5px; /* avoid scrollbar overlap */
      }
    `;

      if (!document.querySelector("#notificationContainerStyles")) {
        const style = document.createElement("style");
        style.id = "notificationContainerStyles";
        style.textContent = containerCss;
        document.head.appendChild(style);
      }

      const containerHtml = `<div id="notificationContainer"></div>`;
      document.body.insertAdjacentHTML("beforeend", containerHtml);

      container = document.querySelector("#notificationContainer");
    }

    if (!document.querySelector("#answerNotificationStyles")) {
      const css = `
.answerNotification {
  --color-popup: #1e1e1e;
  --color-border: #2a2a2a;
  --color-text: #cfcfcf;
  --color-text-secondary: #a3a3a3;
  --color-accent: #8b5cf6;
  --font-family: Arial, sans-serif;

  background: var(--color-popup);
  color: var(--color-text);
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-width: 200px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  font-family: var(--font-family);
  word-wrap: break-word; /* wrap long text */
  white-space: pre-wrap; /* preserve line breaks */
  border: 1px solid var(--color-border);
}

.answerNotification.show {
  opacity: 1;
  transform: translateY(0);
}

.answerNotification button {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  font-size: 16px;
  margin-left: 10px;
  transition: color 0.2s ease;
}

.answerNotification button:hover {
  color: var(--color-accent);
}
`;

      const style = document.createElement("style");
      style.id = "answerNotificationStyles";
      style.textContent = css;
      document.head.appendChild(style);
    }

    function showNotification(
      text,
      options = { temporary: true, duration: 5000 }
    ) {
      const html = `
      <div class="answerNotification">
        <span class="answerNotificationText">${text}</span>
        <button class="answerNotificationClose">✖</button>
      </div>
    `;
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      const notification = tempDiv.firstElementChild;

      const closeBtn = notification.querySelector(".answerNotificationClose");
      if (options.temporary) closeBtn.style.display = "none";

      closeBtn.onclick = () => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 300);
      };

      container.appendChild(notification);
      setTimeout(() => notification.classList.add("show"), 10);

      if (options.temporary) {
        setTimeout(() => {
          notification.classList.remove("show");
          setTimeout(() => notification.remove(), 300);
        }, options.duration || 5000);
      }
    }

    return { showNotification };
  }

  async function captureScreenshot(selector) {
    html2canvas(selector).then((canvas) => {
      const base64Data = canvas.toDataURL('image/png');
      return base64Data;
    });
  }

  async function Solve(data) {
    if (isSolving) {
      console.log("Solve request blocked: already solving");
      return;
    }

    const solvingNotification = promptNotification();
    console.log(data);

    try {
      isSolving = true;
      solvingNotification.showNotification("Solving...");

      let payload;
      if (Array.isArray(data)) {
        payload = {
          text: data,
        };
      } else {
        payload = {
          text: data,
        };
      }

      const result = await fetch(
        "https://term-worker.buyterm-vip.workers.dev/solve",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const parsed = await result.json();
      if (settings.autoSolve.enabled === true) {
        const answerNotification = promptNotification();
        answerNotification.showNotification(parsed.answer, {
          temporary: false,
        });
      }
      return parsed.answer;
    } catch (error) {
      console.error("Solve error:", error);
      throw error;
    } finally {
      isSolving = false;
    }
  }
})();
