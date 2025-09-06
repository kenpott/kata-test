// Corrected event listeners with proper dependency logic

autoSolve_toggle.addEventListener("change", (event) => {
  const enabled = event.target.checked;

  // If auto-solve is being disabled, also disable auto-answer
  if (!enabled) {
    const autoAnswerCheckbox = document.querySelector("#autoAnswerCheckbox");
    autoAnswerCheckbox.checked = false;
    settings.autoAnswer.enabled = false;
  }

  settings.autoSolve.enabled = enabled;
  toggleHandlers.autoSolve(enabled);
});

autoAnswer_toggle.addEventListener("change", (event) => {
  const enabled = event.target.checked;
  const autoSolveCheckbox = document.querySelector("#autoSolveCheckbox");

  if (enabled) {
    // Auto-answer requires auto-solve, so enable it
    autoSolveCheckbox.checked = true;
    settings.autoSolve.enabled = true;
    settings.autoAnswer.enabled = true;

    // Trigger both handlers
    toggleHandlers.autoSolve(true);
    toggleHandlers.autoAnswer(true);
  } else {
    // Just disable auto-answer, leave auto-solve as user preference
    settings.autoAnswer.enabled = false;
    toggleHandlers.autoAnswer(false);
  }
});

// Updated toggle handlers
const toggleHandlers = {
  autoSolve: async (enabled) => {
    if (!enabled) {
      console.log("Auto-solve disabled");
      return;
    }
    console.log("Auto-solve enabled");

    // Show existing answer if available
    if (currentAnswer) {
      const notifier = promptNotification();
      notifier.showNotification(currentAnswer, { temporary: false });

      // If auto-answer is also enabled, trigger it
      if (settings.autoAnswer.enabled) {
        scheduleAutoAnswer();
      }
      return;
    }

    // Solve new question if data is available
    if (questionData) {
      await Solve(questionData);

      // After solving, if auto-answer is enabled, schedule the submission
      if (settings.autoAnswer.enabled && currentAnswer) {
        scheduleAutoAnswer();
      }
    }
  },

  autoAnswer: (enabled) => {
    console.log(`Auto-answer ${enabled ? "enabled" : "disabled"}`);

    if (enabled && currentAnswer) {
      scheduleAutoAnswer();
    }
  },
};

// Helper function to handle auto-answer scheduling
function scheduleAutoAnswer() {
  console.log(
    `Scheduling auto-answer in ${settings.autoAnswer.subSettings.delay} seconds`
  );

  setTimeout(() => {
    // Double-check that auto-answer is still enabled
    if (settings.autoAnswer.enabled && currentAnswer) {
      submitAnswer(currentAnswer);
    }
  }, settings.autoAnswer.subSettings.delay * 1000);
}

// Updated Solve function to handle auto-answer flow
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
    if (typeof data === "object" && data !== null) {
      payload = { text: JSON.stringify(data) };
    } else {
      payload = { text: String(data) };
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
    currentAnswer = parsed.answer;

    // Always show notification for manual solve or auto-solve only
    if (settings.autoSolve.enabled) {
      const answerNotification = promptNotification();
      answerNotification.showNotification(parsed.answer, {
        temporary: !settings.autoAnswer.enabled, // Permanent if auto-answer will handle it
      });
    }

    // If auto-answer is enabled, schedule the submission
    if (settings.autoAnswer.enabled) {
      scheduleAutoAnswer();
    }

    return parsed.answer;
  } catch (error) {
    console.error("Solve error:", error);
    throw error;
  } finally {
    isSolving = false;
  }
}

// Updated XHR handler with correct dependency logic
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
    } else if (this._url.includes("check_answer")) {
      const response = JSON.parse(this.responseText);
      if (response.skillComplete === true) {
        // Disable both features when skill is complete
        const autoAnswerCheckbox = document.querySelector(
          "#autoAnswerCheckbox"
        );
        const autoSolveCheckbox = document.querySelector("#autoSolveCheckbox");

        if (autoAnswerCheckbox) autoAnswerCheckbox.checked = false;
        if (autoSolveCheckbox) autoSolveCheckbox.checked = false;

        settings.autoAnswer.enabled = false;
        settings.autoSolve.enabled = false;

        console.log("Skill completed - auto features disabled");
      }
    }
  });
  return origSend.call(this, body);
};

// Add the missing submitAnswer function
function submitAnswer(answer) {
  console.log("Auto-submitting answer:", answer);

  // Platform-specific implementation needed here
  // This is a placeholder - you'll need to adapt to your target platform
  const answerInput = document.querySelector(
    'input[type="text"], textarea, [contenteditable="true"]'
  );
  if (answerInput) {
    if (answerInput.contentEditable === "true") {
      answerInput.textContent = answer;
    } else {
      answerInput.value = answer;
    }

    // Trigger input events
    answerInput.dispatchEvent(new Event("input", { bubbles: true }));
    answerInput.dispatchEvent(new Event("change", { bubbles: true }));

    // Find and click submit button after a short delay
    setTimeout(() => {
      const submitButton = document.querySelector(
        'button[type="submit"], input[type="submit"], button:contains("Submit"), button:contains("Check")'
      );
      if (submitButton) {
        submitButton.click();
        console.log("Answer submitted automatically");
      }
    }, 100);
  } else {
    console.warn("Could not find answer input field for auto-submission");
  }
}
