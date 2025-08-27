(function () {
  console.log("kata script loaded");

  const html = `
<div class="popup">
  <div class="popup-topbar">
    <div class="popup-left">
      <h1 class="popup-title">term</h1>
      <p class="popup-plan popup-plan-free">Free</p>
    </div>
    <a class="popup-status popup-status-online"></a>
  </div>
  <div class="popup-content">
    <ul class="popup-list">
      <li class="popup-list-item">
        <div class="popup-setting active" id="auto-solve">
          <h4 class="popup-setting-title">Auto Solve</h4>
          <label class="popup-switch">
            <input type="checkbox" class="popup-checkbox" />
            <span class="popup-slider"></span>
          </label>
        </div>
        <div class="popup-sub-settings"></div>
      </li>
      <li class="popup-list-item">
        <div class="popup-setting active" id="auto-answer">
          <h4 class="popup-setting-title">Auto Answer</h4>
          <label class="popup-switch">
            <input type="checkbox" class="popup-checkbox" />
            <span class="popup-slider"></span>
          </label>
        </div>
        <div class="popup-sub-settings active" id="delay">
          <div class="popup-sub-setting">
            <div class="popup-range-header">
              <h5 class="popup-range-title">Delay (s)</h5>
              <span class="popup-level-value">0.5</span>
            </div>
            <div class="popup-range">
              <input
                type="range"
                class="popup-range-input"
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
  <div class="popup-footer">
    <p class="popup-footer-text">press ctrl to hide</p>
  </div>
</div>
  `;

  const style = `
  .popup {
  /* CSS Variables scoped to popup */
  --color-bg: #1c1c1c;
  --color-popup: #2a2a2a;
  --color-border: #3a3a3a;
  --color-text: #ffffff; 
  --color-text-secondary: #a3a3a3; 
  --color-text-tertiary: #666666;
  --color-text-disabled: #555555;

  --color-free-bg: #4a4a4a;
  --color-free-border: #4a4a4a;
  --color-premium-bg: #8b5cf6;
  --color-premium-border: #8b5cf6;

  --color-status-online: #10b981;
  --color-status-offline: #ef4444;
  --color-status-idle: #6b7280;

  --color-accent: #8b5cf6;
  --color-switch-on: #8b5cf6;
  --color-switch-off: #4a4a4a;
  --color-switch-knob: #ffffff;

  --popup-width: 280px;
  --popup-height: 320px;
  --popup-radius: 20px;

  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  --font-size-title: 1.4em;
  --font-size-plan: 0.8em;
  --font-size-setting: 1.1em;
  --font-size-subsetting: 0.9em;
  --font-size-footer: 0.85em;

  --switch-width: 44px;
  --switch-height: 24px;
  --switch-knob: 20px;
  --switch-offset: 2px;

  --slider-height: 4px;
  --slider-bg: #4a4a4a;
  --slider-fill-color: #8b5cf6;

  /* Reset and isolate the popup */
  all: initial;
  font-family: var(--font-family);
  
  /* Popup styling */
  width: var(--popup-width);
  height: var(--popup-height);
  border-radius: var(--popup-radius);
  border: 1px solid var(--color-border);
  background: var(--color-popup);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 999999;
  color: var(--color-text);
  box-sizing: border-box;
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.popup * {
  box-sizing: border-box;
}

.popup .topbar {
  flex: 0 0 auto;
  display: flex;
  padding: 20px 24px 16px 24px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0;
}

.popup .topbar .left {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
  padding: 0;
}

.popup .topbar .title {
  font-size: var(--font-size-title);
  margin: 0;
  padding: 0;
  font-weight: 500;
  color: var(--color-text);
}

.popup .topbar .plan {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: var(--font-size-plan);
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.popup .plan.Free {
  background-color: var(--color-free-bg);
  color: var(--color-text);
}

.popup .plan.Plus {
  background-color: var(--color-premium-bg);
  color: white;
}

.popup .status {
  border-radius: 50%;
  width: 12px;
  height: 12px;
  margin: 0;
  padding: 0;
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
  padding: 0 24px;
  margin: 0;
  overflow-y: auto;
}

.popup .content .settings-list {
  list-style-type: none;
  width: 100%;
  padding: 0;
  margin: 0;
}

.popup .content .settings-item {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin: 0 0 20px 0;
}

.popup .setting {
  display: none;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  padding: 0;
  min-height: 32px;
}

.popup .setting.active {
  display: flex;
}

.popup .setting .setting-title {
  margin: 0;
  padding: 0;
  color: var(--color-text);
  font-weight: 500;
  font-size: var(--font-size-setting);
}

.popup .sub-settings {
  font-size: var(--font-size-subsetting);
  color: var(--color-text-secondary);
  display: none;
  margin-top: 12px;
  padding: 0;
  font-weight: 500;
}

.popup .sub-settings.active {
  display: block;
}

.popup .footer {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-disabled);
  font-size: var(--font-size-footer);
  margin: 0;
  padding: 16px 24px 20px 24px;
}

.popup .switch {
  position: relative;
  display: inline-block;
  width: var(--switch-width);
  height: var(--switch-height);
  margin: 0;
  padding: 0;
}

.popup .switch input {
  display: none;
  margin: 0;
  padding: 0;
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
  transition: background 0.2s ease;
  margin: 0;
  padding: 0;
  border: none;
}

.popup .slider::after {
  content: "";
  position: absolute;
  width: var(--switch-knob);
  height: var(--switch-knob);
  left: var(--switch-offset);
  top: var(--switch-offset);
  background: var(--color-switch-knob);
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.popup input:checked + .slider {
  background: var(--color-switch-on);
}

.popup input:checked + .slider::after {
  transform: translateX(calc(var(--switch-width) - var(--switch-knob) - var(--switch-offset) * 2));
}

.popup .range {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
}

.popup .range-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 8px 0;
  padding: 0;
}

.popup .range-header .range-title {
  margin: 0;
  padding: 0;
  font-size: var(--font-size-subsetting);
  font-weight: 500;
  color: var(--color-text-secondary);
}

.popup .range-header .level-value {
  min-width: 2ch;
  font-size: var(--font-size-subsetting);
  text-align: right;
  margin: 0;
  padding: 0;
  color: var(--color-text);
  font-weight: 500;
}

.popup .range .level {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 100%;
  height: var(--slider-height);
  background: var(--slider-bg);
  border-radius: calc(var(--slider-height) / 2);
  cursor: pointer;
  overflow: hidden;
  margin: 0;
  padding: 0;
  border: none;
  outline: none;
}

.popup .range .level::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 0;
  height: 0;
  box-shadow: -300px 0 0 300px var(--slider-fill-color);
  border: none;
}

.popup .range .level::-moz-range-thumb {
  width: 0;
  height: 0;
  box-shadow: -300px 0 0 300px var(--slider-fill-color);
  border: none;
  background: transparent;
}

.popup .range .level:focus {
  outline: none;
}
  `;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectUI);
  } else {
    injectUI();
  }

  function injectUI() {
    const container = document.createElement("div");
    container.innerHTML = html;
    document.body.appendChild(container);

    const styleEl = document.createElement("style");
    styleEl.textContent = style;
    document.head.appendChild(styleEl);
  }
})();

