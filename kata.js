if (document.getElementById("kata-ui")) return;

const html = `
  <div id="kata-ui">
    <div id="kata-header">
      <strong>DeltaBot</strong>
      <button id="kata-close">×</button>
    </div>
    <div id="kata-body">
      <button id="kata-start">Start Bot</button>
    </div>
  </div>
`;

const css = `
  #kata-ui {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1e1e1e;
    color: white;
    padding: 10px;
    width: 200px;
    font-family: sans-serif;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.5);
    z-index: 9999;
  }
  #kata-ui #kata-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
  #kata-ui button {
    background: #333;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
  }
  #kata-ui button:hover {
    background: #555;
  }
`;

const container = document.createElement("div");
container.innerHTML = html;
document.body.appendChild(container);

const styleEl = document.createElement("style");
styleEl.textContent = css;
document.head.appendChild(styleEl);

document.getElementById("kata-close").onclick = () => {
  container.remove();
  styleEl.remove();
};

document.getElementById("kata-start").onclick = () => {
};
