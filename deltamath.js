(function () {
  console.log("kata script loaded");

  const html = `
<div class="popup">
  <div class="topbar">
    <div class="left">
      <h1>term</h1>
      <p class="plan Free">Free</p>
    </div>
    <a class="status online"></a>
  </div>
  <div class="content">
    <ul>
      <li>
        <div class="setting active" id="auto-solve">
          <h4>Auto Solve</h4>
          <label class="switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="sub-settings"></div>
      </li>
      <li>
        <div class="setting active" id="auto-answer">
          <h4>Auto Answer</h4>
          <label class="switch">
            <input type="checkbox" />
            <span class="slider"></span>
          </label>
        </div>
        <div class="sub-settings active" id="delay">
          <div class="sub-setting">
            <div class="range-header">
              <h5>Delay (s)</h5>
              <span class="level-value">0.5</span>
            </div>
            <div class="range">
              <input
                type="range"
                class="level"
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
    <p>press ctrl to hide</p>
  </div>
</div>
  `;

  const style = `
.popup {
  all: initial;
  font-family: Arial, sans-serif;
  width: 260px;
  height: 300px;
  border-radius: 16px;
  border: 2px solid #2a2a2a;
  background: #1e1e1e;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 99999999;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: #cfcfcf;
}

.kata-popup .topbar {
  flex: 0 0 5%;
  display: flex;
  padding: 0px 22px 0px 16px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
}

.kata-popup .topbar h1 {
  font-size: 1.2em;
}

.kata-popup .left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.kata-popup .plan.Free {
  background-color: #3a3a3a;
  border: 3px solid #3a3a3a;
  color: #cfcfcf;
  border-radius: 8px;
  padding: 2px 4px;
  font-size: 0.9em;
  font-weight: bolder;
}

.kata-popup .status.online {
  border-radius: 16px;
  padding: 5px;
  background-color: #34d399;
}

.kata-popup .content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 16px;
}

.kata-popup .content ul {
  list-style-type: none;
  width: 100%;
  padding: 0;
  margin: 0;
}

.kata-popup .setting.active {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kata-popup .setting h4 {
  margin: 8px 0;
}

.kata-popup .sub-settings.active {
  display: block;
  font-size: 0.85em;
  color: #a3a3a3;
  margin-top: 4px;
  padding-left: 24px;
  font-weight: bold;
}

.kata-popup .footer {
  flex: 0 0 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3a3a3a;
  font-size: 0.8em;
  pointer-events: none;
}

.kata-popup .switch {
  position: relative;
  display: inline-block;
  width: 28px;
  height: 1em;
}

.kata-popup .switch input {
  display: none;
}

.kata-popup .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #3a3a3a;
  border-radius: 1em;
}

.kata-popup .slider::after {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  left: 2px;
  top: 2px;
  background: #8b5cf6;
  border-radius: 50%;
  transition: transform 0.3s;
}

.kata-popup input:checked + .slider {
  background: #8b5cf6;
}

.kata-popup input:checked + .slider::after {
  transform: translateX(14px);
  background: #3a3a3a;
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
