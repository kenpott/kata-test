(function () {
  console.log("term script loaded");

  const term = window._term || {};

  term.data = {
    settings: {
      autoSolve: {
        enabled: false,
        subSettings: {
          mode: "fast",
          model: "gemini-2.5 flash",
          apikey: "",
        },
      },
      autoAnswer: {
        enabled: false,
        subSettings: {
          delay: 5.0,
        },
      },
    },
    state: {
      isSolving: false,
      questionData: null,
      screenshotData: null,
      currentAnswer: null,
      tallyData: null,
    },
    prompt: `You are a concise math assistant.
Your goal is to solve the given question using all provided information (text and image) and return the final answer in ONE of the following JSON formats:

1. Text Answer:
{
  "type": "text",
  "answer": "<answer text>"
}

2. Numeric Answer:
{
  "type": "number",
  "answer": <answer number>
}

3. Single Choice (Multiple Choice Index):
{
  "type": "single_choice",
  "answer": <answer index>
}

4. Multiple Inputs (Multiple Indexed Answers):
{
  "type": "multi_input",
  "answer": {
    "0": <answer0>,
    "1": <answer1>
  }
}

5. Multiple Selection (Select All That Apply):
{
  "type": "multi_select",
  "answer": {
    "0": true,
    "1": false,
    "2": true
  }
}

6. Drag-and-Drop:
{
  "type": "drag_drop",
  "answer": {
    "0": 0,
    "1": 1,
    "2": 0
  }
}

Rules:
- Return ONLY a single valid JSON object - no markdown code blocks, no extra text.
- Always ensure the JSON is valid and parseable.
- For single_choice: use the zero-based index (0, 1, 2, etc.) of the correct answer choice.
- For multi_input: provide separate answers for each input field using string keys ("0", "1", etc.).
- For multi_select: use boolean values (true/false) for each option, include ALL options.
- For drag_drop: map each draggable item index to its target box index.
- Never combine multiple answers into a single string (e.g., don't use "5/7" for two separate inputs).
- All object keys must be strings of the index numbers starting from "0".

Analyze the question carefully and determine which response type is most appropriate based on the question format.`,

    setQuestionData(data) {
      this.state.questionData = data;
    },
    setScreenshotData(data) {
      this.state.screenshotData = data;
    },
    setCurrentAnswer(answer) {
      this.state.currentAnswer = answer;
    },
    setSolving(solving) {
      this.state.isSolving = solving;
    },
    setTallyData(data) {
      this.state.tallyData = data;
      console.log("Tally data updated:", data);
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
      termHTML: `
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
        <div class="subSettings active" id="solve-mode">
          <div class="container">
            <span>Mode</span>
            <div class="dropdown-wrapper">
              <button class="dropdown-button" id="selected-solve-mode">fast</button>
              <div class="dropdown-container" id="solve-mode-dropdown">
                <span>fast</span>
                <span>accurate</span>
              </div>
            </div>
          </div>
        </div>
        <div class="subSettings active" id="ai-model">
          <div class="container">
            <span>AI Model</span>
            <div class="dropdown-wrapper">
              <button class="dropdown-button" id="selected-ai-model">gemini-2.5 flash</button>
              <div class="dropdown-container" id="ai-model-dropdown">
                <span>term</span>
                <span>gemini-2.5 flash</span>
              </div>
            </div>
          </div>
        </div>
        <div class="subSettings active" id="api-key">
          <div class="container">
            <span>Api Key</span>
            <input type="password" id="api-key-input"/>
          </div>
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

      termCSS: `
      .popup {
        --color-bg: #101010; 
        --color-popup: #202022;
        --color-border: rgba(255, 255, 255, 0.05); 
        --color-text: #f5f5f5; 
        --color-text-secondary: #999999; 
        --color-text-tertiary: #666666; 
        --color-text-disabled: #333333; 

        --color-accent: #6c5ce7; 
        --color-accent-secondary: #52a8ff; 

        --color-button-bg: rgba(255, 255, 255, 0.05); 
        --color-button-border: rgba(255, 255, 255, 0.1);
        --color-button-bg-hover: rgba(255, 255, 255, 0.1);

        --color-input-bg: rgba(255, 255, 255, 0.05); 
        --color-input-border: rgba(255, 255, 255, 0.1);

        --color-status-online: #22c55e;
        --color-status-offline: #ef4444;
        --color-status-idle: #52525b;

        --color-free-bg: #2a2a2d;
        --color-free-border: #2a2a2d;
        --color-premium-bg: var(--color-accent);
        --color-premium-border: var(--color-accent);

        --glass-effect: saturate(180%) blur(20px);
        --glass-bg: rgba(255, 255, 255, 0.08);

        --popup-width: 260px;
        --popup-height: 300px;
        --popup-radius: 20px; 

        --font-family: 'Inter', Arial, sans-serif;
        --font-size-h1: 1.2em;
        --font-size-plan: 0.9em;

        --switch-width: 28px;
        --switch-height: 1em;
        --switch-knob: 12px;
        --switch-offset: 2px;
        --color-switch-off: #2a2a2d;
        --color-switch-knob: #6c5ce7;
        --color-switch-on: var(--color-accent);
        --color-switch-knob-active: var(--color-popup);

        --slider-width: 70%;
        --slider-height: 6px;
        --slider-bg: #2a2a2d;
        --slider-border-radius: 999px;
        --slider-fill-color: var(--color-accent);
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
        max-height: 46.5px;
        display: flex;
        padding: 0px 22px 0px 16px;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        cursor: move;
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
        overflow: scroll;
        scrollbar-width: none;
        margin-bottom: 10px;
      }

      .popup .content::-webkit-scrollbar {
        display: none;
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

      #solve-mode .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
      }

      .dropdown-button {
        padding: 4px 8px;
        border: 1px solid var(--color-button-border);
        border-radius: 8px;
        background-color: var(--color-button-bg);
        color: var(--color-text);
        cursor: pointer;
        font-size: smaller;
      }

      .dropdown-wrapper:hover .dropdown-container {
        display: flex; 
      }

      .dropdown-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-end; 
      }

      .dropdown-container {
        display: none;
        position: absolute;
        top: 100%;        
        right: 0;
        background-color: var(--color-button-bg);
        border: 1px solid var(--color-button-border);
        border-radius: 6px;
        flex-direction: column;
        z-index: 1000;
        cursor: pointer;
        backdrop-filter: var(--glass-effect);
      }

      .dropdown-container span {
        display: block;
        padding: 6px 10px;
        color: var(--color-text);
        text-decoration: none;
      }

      .dropdown-container span:hover {
        background-color: var(--color-button-bg-hover);
      }

      #ai-model .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
      }

      #api-key .container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
      }

      #api-key-input {
        background-color: var(--color-input-bg);
        border: 1px solid var(--color-input-border);
        border-radius: 8px;
        padding: 4px 4px;
        color: var(--color-input);
        font-size: smaller;
        width: 50%;
      }

      .popup #getAnswerButton {
        display: block;
        background-color: var(--color-button-bg);
        padding: 4px 65px;
        border-radius: 8px;
        border: 1px solid var(--color-button-border);
        width: 100%;
      }

      .popup #getAnswerButton:hover {
        background-color: var(--color-button-bg-hover);
      }

      .popup #getAnswerButton span {
        color: var(--color-text-secondary);
        font-size: smaller;
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

      .popup > * {
      user-select: none;
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

      :focus {
        outline: none;
      }
      `,
    },

    createPopup() {
      const container = document.createElement("div");
      container.innerHTML = this.templates.termHTML;
      document.body.appendChild(container);

      const styleEl = document.createElement("style");
      styleEl.textContent = this.templates.termCSS;
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

      const handle = element.querySelector(".topbar") || element;

      handle.onmousedown = dragMouseDown;
      handle.ontouchstart = dragTouchStart;

      function dragMouseDown(e) {
        if (e.target.classList.contains("status")) return;

        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
      }

      function dragTouchStart(e) {
        if (e.target.classList.contains("status")) return;

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
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
      }

      function elementDragTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        pos1 = pos3 - touch.clientX;
        pos2 = pos4 - touch.clientY;
        pos3 = touch.clientX;
        pos4 = touch.clientY;
        element.style.top = element.offsetTop - pos2 + "px";
        element.style.left = element.offsetLeft - pos1 + "px";
      }

      function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
        document.ontouchend = null;
        document.ontouchmove = null;
      }
    },

    setupEventListeners() {
      // Keyboard toggle
      window.addEventListener("keydown", (event) => {
        if (event.key === "Control") {
          this.togglePopup();
        }
      });

      document.querySelectorAll(".setting").forEach((setting) => {
        setting.addEventListener("click", () => {
          let sibling = setting.nextElementSibling;
          while (sibling && !sibling.classList.contains("setting")) {
            if (sibling.classList.contains("subSettings")) {
              sibling.classList.toggle("active");
            }
            sibling = sibling.nextElementSibling;
          }
        });
      });

      // Auto answer toggle
      const autoAnswerToggle = document.querySelector("#autoAnswerCheckbox");
      if (autoAnswerToggle) {
        autoAnswerToggle.addEventListener("change", (event) => {
          const enabled = event.target.checked;
          autoAnswerCheckbox.checked = enabled;
          if (autoSolveToggle.checked !== enabled) {
            autoSolveToggle.checked = enabled;
            term.data.updateSetting("autoAnswer.enabled", enabled);
            term.handlers.autoAnswer(enabled);
          }
          term.data.updateSetting("autoAnswer.enabled", enabled);
          term.handlers.autoAnswer(enabled);
        });
      }

      // Auto solve toggle
      const autoSolveToggle = document.querySelector("#autoSolveCheckbox");
      if (autoSolveToggle) {
        autoSolveToggle.addEventListener("change", (event) => {
          const enabled = event.target.checked;
          autoSolveCheckbox.checked = enabled;
          term.data.updateSetting("autoSolve.enabled", enabled);
          term.handlers.autoSolve(enabled);
        });
      }

      // Solve Mode
      const solveModeButton = document.querySelector("#selected-solve-mode");
      const solveModeDropdown = document.querySelector("#solve-mode-dropdown");
      const solveModeOptions = solveModeDropdown.querySelectorAll("span");

      solveModeOptions.forEach((option) => {
        option.addEventListener("click", () => {
          solveModeButton.textContent = option.textContent;
          term.data.updateSetting(
            "autoSolve.subSettings.mode",
            option.textContent.toLowerCase()
          );
        });
      });

      // Ai Model
      const aiModelButton = document.querySelector("#selected-ai-model");
      const aiModelDropdown = document.querySelector("#ai-model-dropdown");
      const aiModelOptions = aiModelDropdown.querySelectorAll("span");

      aiModelOptions.forEach((option) => {
        option.addEventListener("click", () => {
          aiModelButton.textContent = option.textContent;
          term.data.updateSetting(
            "autoSolve.subSettings.model",
            option.textContent.toLowerCase()
          );
        });
      });

      // Api Key Input
      const apiKeyInput = document.querySelector("#api-key-input");
      apiKeyInput.addEventListener("input", (event) => {
        let timeout;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          term.data.updateSetting(
            "autoSolve.subSettings.apikey",
            event.target.value
          );
        }, 250);
      });

      // Get answer button
      const getAnswerButton = document.querySelector("#getAnswerButton");
      if (getAnswerButton) {
        getAnswerButton.addEventListener("click", async () => {
          const questionSelector = document.querySelector(
            ".practice-views-root"
          );
          const screenshotData = await term.utils.captureScreenshot(
            questionSelector
          );
          term.data.setScreenshotData(screenshotData);
          const answer = await term.solve();

          term.ui.notifications.show(answer.answer, {
            temporary: false,
          });
        });
      }

      // Delay input
      const delayInput = document.querySelector("#delay");
      if (delayInput) {
        delayInput.addEventListener("input", (event) => {
          const level = event.target.value;
          const delayText = document.querySelector("#delayValue");
          term.data.updateSetting(
            "autoAnswer.subSettings.delay",
            parseFloat(level)
          );
          if (delayText) delayText.textContent = level;
        });
      }
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
      const eventType = event.data.type;
      if (eventType === "Problem-Data-FETCH") {
        term.data.setCurrentAnswer(null);

        try {
          const questionSelector = document.querySelector(
            ".practice-views-root"
          );
          const rawData = JSON.parse(event.data.response);

          const parseResponse = await term.fetch(
            "https://term-worker.buyterm-vip.workers.dev/parse",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: rawData,
              }),
            }
          );

          const parseResult = await parseResponse.json();
          let questionData;

          if (parseResult.type === "error") {
            console.warn("Parse API error:", parseResult.message);
            questionData = rawData;
          } else {
            questionData = parseResult.data;
          }

          console.log("Parsed Question Data: ", questionData);
          term.data.setQuestionData(questionData);

          const screenshotData = await term.utils.captureScreenshot(
            questionSelector
          );
          term.data.setScreenshotData(screenshotData);
          console.log("Question data received");
        } catch (error) {
          console.warn("Failed to parse Problem-Data-FETCH response:", error);
        }
      } else if (eventType === "Tally-Data-FETCH") {
        try {
          const rawData = JSON.parse(event.data.response);

          const parseResponse = await term.fetch(
            "https://term-worker.buyterm-vip.workers.dev/parse",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                data: rawData,
              }),
            }
          );

          const parseResult = await parseResponse.json();
          let tallyData;

          if (parseResult.type === "error") {
            console.warn("Parse API error:", parseResult.message);
            tallyData = rawData;
          } else {
            tallyData = parseResult.data; // { correct: boolean, score: number }
          }

          console.log("Parsed Tally Data: ", tallyData);
          term.data.setTallyData(tallyData);
        } catch (error) {
          console.warn("Failed to parse Tally-Data-FETCH response:", error);
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

        if (url.includes("pose") || url.includes("tally")) {
          const response = await originalFetch(resource, config);
          const cloned = response.clone();
          try {
            const data = await cloned.json();

            const dataType = url.includes("pose") ? "pose" : "tally";

            window.postMessage(
              {
                type:
                  dataType === "pose"
                    ? "Problem-Data-FETCH"
                    : "Tally-Data-FETCH",
                url: response.url,
                response: JSON.stringify(data),
                dataType: dataType,
              },
              "*"
            );
            console.log(`📦 ${dataType} data:`, data);
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
      const canvas = await html2canvas(element, {
        logging: false,
      });
      const base64Data = canvas.toDataURL("image/png");
      console.log("Captured Screenshot: ", base64Data);
      return base64Data;
    },
  };

  term.solve = async function () {
    if (term.data.state.isSolving) {
      term.ui.notifications.show("Solving in queue.");
      return;
    }

    const mode = term.data.settings.autoSolve.subSettings.mode;
    const isFastMode = mode === "fast";
    const inputData = isFastMode
      ? term.data.state.questionData
      : term.data.state.screenshotData;

    if (!inputData) {
      console.warn(`No data available for ${mode} mode`);
      term.ui.notifications.show(
        `No ${isFastMode ? "question" : "accurate"} data available`
      );
      return;
    }

    try {
      term.data.setSolving(true);
      term.ui.notifications.show(`[Mode: ${mode}] Solving...`);

      const prompt = term.data.prompt;
      let requestBody;

      if (isFastMode) {
        requestBody = {
          contents: [
            {
              role: "user",
              parts: [{ text: `${prompt} ${JSON.stringify(inputData)}` }],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            response_schema: {
              type: "object",
              properties: {
                type: { type: "string" },
                answer: {
                  oneOf: [{ type: "number" }, { type: "string" }],
                },
              },
              required: ["type", "answer"],
            },
          },
        };
      } else {
        const base64Clean = inputData.replace(/^data:image\/\w+;base64,/, "");
        requestBody = {
          contents: [
            {
              role: "user",
              parts: [
                { text: `${prompt}\nSolve the problem from this screenshot:` },
                { inline_data: { mime_type: "image/png", data: base64Clean } },
              ],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
            response_schema: {
              type: "object",
              properties: {
                type: { type: "string" },
                answer: {
                  oneOf: [{ type: "number" }, { type: "string" }],
                },
              },
              required: ["type", "answer"],
            },
          },
        };
      }

      const userApiKey = term.data.settings.autoSolve.subSettings.apikey;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${userApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result = await response.json();

      // Check for API errors
      if (result.error) {
        throw new Error(`Gemini API error: ${result.error.message}`);
      }

      const rawAnswer =
        result?.candidates?.[0]?.content?.parts
          ?.map((p) => p.text || "")
          .filter((t) => t.trim().length > 0)
          .join(" ")
          .trim() || "No valid response";

      // With forced JSON response, this should now work reliably
      const parsedAnswer = JSON.parse(rawAnswer);

      if (term.data.settings.autoSolve.enabled === true) {
        term.ui.notifications.show(parsedAnswer.answer, { temporary: false });
      }

      term.data.setCurrentAnswer(parsedAnswer.answer);
      return parsedAnswer;
    } catch (error) {
      console.error("Solve error:", error);
      term.ui.notifications.show(`Error: ${error.message}`, {
        temporary: false,
      });
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
