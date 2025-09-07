(function () {
  console.log("term script loaded");

  const term = window._term || {};

  term.data = {
    settings: {
      autoSolve: {
        enabled: false,
      },
      autoAnswer: {
        enabled: false,
        subSettings: {
          delay: 5.0,
          smartScore: 80,
        },
      },
    },
    state: {
      isSolving: false,
      questionData: null,
      currentAnswer: null,
    },

    setQuestionData(data) {
      this.state.questionData = data;
    },
    setCurrentAnswer(answer) {
      this.state.currentAnswer = answer;
    },
    setSolving(solving) {
      this.state.isSolving = solving;
    },
    updateSetting(path, value) {
      const keys = path.split(".");
      let obj = this.settings;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
    },
  };

  term.ui = {
    templates: {
      popupHTML: `
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
            <input type="checkbox" class="toggle" id="autoAnswerCheckbox" />
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
                id="delay"
                min="0"
                max="10"
                value="5"
                step="0.1"
              />
            </div>
          </div>
        </div>
        <div class="subSettings active" id="smartScore">
          <div class="container">
            <div class="rangeHeader">
              <h5 class="title">SmartScore</h5>
              <span class="levelValue" id="smartScoreValue">80</span>
            </div>
            <div class="range">
              <input
                type="range"
                class="rangeInput"
                id="smartScore"
                min="0"
                max="100"
                value="80"
                step="1"
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
      `,

      popupCSS: `
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
  max-height: 46.5px;
  display: flex;
  padding: 0px 22px 0px 16px;
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
  max-height: 217px;
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
  max-height: 34.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-disabled);
  font-size: 0.8em;
  pointer-events: none;
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
  color: var(--color-text-secondary);
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
      `,
    },

    createPopup() {
      const container = document.createElement("div");
      container.innerHTML = this.templates.popupHTML;
      document.body.appendChild(container);

      const styleEl = document.createElement("style");
      styleEl.textContent = this.templates.popupCSS;
      document.head.appendChild(styleEl);
    },

    togglePopup() {
      document.querySelector(".popup").classList.toggle("active");
    },

    makeDraggable(element) {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      element.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        if (
          e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.tagName === "BUTTON" ||
          e.target.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
      }
    },

    setupEventListeners() {
      // Keyboard toggle
      window.addEventListener("keydown", (event) => {
        if (event.key === "Control") {
          this.togglePopup();
        }
      });

      // Auto solve toggle
      document
        .querySelector("#auto-solve")
        .addEventListener("change", (event) => {
          const enabled = event.target.checked;
          const autoAnswerCheckbox = document.querySelector(
            "#autoAnswerCheckbox"
          );
          if (
            autoAnswerCheckbox.checked &&
            term.data.settings.autoAnswer.enabled
          ) {
            autoAnswerCheckbox.checked = false;
          }
          term.data.updateSetting("autoSolve.enabled", enabled);
          term.handlers.autoSolve(enabled);
        });

      document
        .querySelector("#auto-answer")
        .addEventListener("change", (event) => {
          const autoSolveCheckbox =
            document.querySelector("#autoSolveCheckbox");
          const enabled = event.target.checked;
          autoSolveCheckbox.checked = enabled;
          term.data.updateSetting("autoAnswer.enabled", enabled);
          term.data.updateSetting("autoSolve.enabled", enabled);
          term.handlers.autoAnswer(enabled);
        });

      const getAnswerButton = document.querySelector("#getAnswerButton");
      if (getAnswerButton) {
        getAnswerButton.addEventListener("click", async () => {
          if (term.data.state.currentAnswer) {
            term.ui.notifications.show(term.data.state.currentAnswer, {
              temporary: false,
            });
            return;
          }
          /**
          const questionSelector = document.querySelector("#mathBlock");
          const screenshotData = await term.utils.captureScreenshot(
            questionSelector
          );
          term.data.setScreenshotData(screenshotData);
          console.log("Solving with screenshot!");
          const answer = await term.solve(screenshotData);
          */
          term.ui.notifications.show(answer, {
            temporary: false,
          });
        });
      }

      // Delay input
      document.querySelector("#delay").addEventListener("input", (event) => {
        const level = event.target.value;
        const delayText = document.querySelector("#delayValue");
        term.data.updateSetting(
          "autoAnswer.subSettings.delay",
          parseFloat(level)
        );
        delayText.textContent = level;
      });

      // Smart score input
      document
        .querySelector("#smartScore")
        .addEventListener("input", (event) => {
          const level = event.target.value;
          const scoreText = document.querySelector("#smartScoreValue");
          term.data.updateSetting(
            "autoAnswer.subSettings.smartScore",
            parseInt(level)
          );
          scoreText.textContent = level;
        });
    },

    notifications: {
      createContainer() {
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
            max-height: 50vh;
            overflow-y: auto;
            width: 250px;
            padding-right: 5px;
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
        return container;
      },

      createStyles() {
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
  word-wrap: break-word;
  white-space: pre-wrap;
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
      },

      show(text, options = { temporary: true, duration: 5000 }) {
        const container = this.createContainer();
        this.createStyles();

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

        return { showNotification: this.show.bind(this) };
      },
    },
  };

  term.handlers = {
    async autoSolve(enabled) {
      if (!enabled) {
        console.log("Auto-solve disabled");
        return;
      }
      console.log("Auto-solve enabled");

      if (term.data.state.currentAnswer) {
        term.ui.notifications.show(term.data.state.currentAnswer, {
          temporary: false,
        });
        return;
      }

      if (term.data.state.questionData) {
        await term.solve(term.data.state.questionData);
      }
    },

    autoAnswer(enabled) {
      if (enabled) {
        console.log("Auto-answer enabled");
      } else {
        console.log("Auto-answer disabled");
      }
    },

    async handleProblemData(event) {
      if (event.data.type === "Problem-Data-FETCH") {
        term.data.setCurrentAnswer(null);

        try {
          const questionData = JSON.parse(event.data.response);
          term.data.setQuestionData(questionData);
          console.log("Question data received");
          await term.solve(questionData);
        } catch (error) {
          console.warn("Failed to parse Problem-Data-FETCH response:", error);
        }
      }
    },
  };

  term.network = {
    setupFetchInterceptor() {
      if (window.__fetchInterceptorActive) return;
      window.__fetchInterceptorActive = true;

      const { fetch: originalFetch } = window;
      window.fetch = async (...args) => {
        let [resource, config] = args;
        const url = typeof resource === "string" ? resource : resource.url;

        if (url.includes("pose")) {
          const response = await originalFetch(resource, config);
          const cloned = response.clone();
          try {
            const data = await cloned.json();
            window.postMessage(
              {
                type: "Problem-Data-FETCH",
                url: response.url,
                response: JSON.stringify(data),
              },
              "*"
            );
            console.log("📦 Problem data:", data);
          } catch (error) {
            console.log("⚠️ Could not parse response as JSON:", error);
          }
          return response;
        }
        return originalFetch(resource, config);
      };
    },

    async loadScript(url) {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    },
  };

  term.utils = {
    async captureScreenshot(element) {
      const canvas = await html2canvas(element);
      const base64Data = canvas.toDataURL("image/png");
      console.log("Captured Screenshot: ", base64Data);
      return base64Data;
    },
  };

  term.solve = async function (data) {
    if (term.data.state.isSolving) {
      console.log("Solve request blocked: already solving");
      return;
    }
    console.log(data);

    try {
      term.data.setSolving(true);
      term.ui.notifications.show("Solving...");

      let payload;
      if (typeof data === "object" && data !== null) {
        payload = {
          data: JSON.stringify(data),
          platformType: "ixl",
          dataType: "json",
        };
      } else {
        payload = {
          data: String(data),
          platformType: "ixl",
          dataType: "base64",
        };
      }

      const result = await term.fetch(
        "https://term-worker.buyterm-vip.workers.dev/solve",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const parsed = await result.json();

      if (term.data.settings.autoSolve.enabled === true) {
        term.ui.notifications.show(parsed.answer, {
          temporary: false,
        });
      }

      term.data.setCurrentAnswer(parsed.answer);
      return parsed.answer;
    } catch (error) {
      console.error("Solve error:", error);
      throw error;
    } finally {
      term.data.setSolving(false);
    }
  };

  term.init = function () {
    this.network.setupFetchInterceptor();
    Promise.all([
      this.network.loadScript(
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"
      ),
    ]).then(() => {
      console.log("External scripts loaded and ready!");
    });

    this.ui.createPopup();
    const popup = document.querySelector(".popup");
    this.ui.makeDraggable(popup);
    this.ui.setupEventListeners();
    window.addEventListener("message", this.handlers.handleProblemData);
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => term.init());
  } else {
    term.init();
  }
  Object.assign(window._term, term);
})();
