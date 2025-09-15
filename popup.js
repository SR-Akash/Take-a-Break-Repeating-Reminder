// popup.js - handles UI and countdown logic
const minutesEl = document.getElementById('minutes');
const popupTextEl = document.getElementById('popupText');
const repeatEl = document.getElementById('repeat');
const soundEl = document.getElementById('sound');
const startBtn = document.getElementById('start');
const stopBtn = document.getElementById('stop');
const testSoundBtn = document.getElementById('testSound');

let intervalId;
let totalSeconds;
let remainingSeconds;

// Load saved settings
chrome.storage.sync.get(
  { timerMinutes: 30, popupText: "Get some water!", repeat: true, sound: "sound3" },
  ({ timerMinutes, popupText, repeat, sound }) => {
    minutesEl.value = String(timerMinutes);
    popupTextEl.value = popupText;
    repeatEl.checked = !!repeat;
    soundEl.value = sound;
  }
);

// 🔄 Restore timer if still running
chrome.storage.local.get(["endTime", "totalSeconds"], (data) => {
  if (data.endTime && data.totalSeconds) {
    const now = Date.now();
    const diff = Math.floor((data.endTime - now) / 1000);
    if (diff > 0) {
      totalSeconds = data.totalSeconds;
      remainingSeconds = diff;
      startCountdownLoop();
    } else {
      chrome.storage.local.remove(["endTime", "totalSeconds"]);
    }
  }
});

startBtn.addEventListener('click', () => {
  const minutes = parseFloat(minutesEl.value);

  // Save settings
  chrome.storage.sync.set({
    timerMinutes: minutes,
    popupText: popupTextEl.value || "Time to take a break!",
    repeat: repeatEl.checked,
    sound: soundEl.value
  });

  // Save timer state
  totalSeconds = minutes * 60;
  remainingSeconds = totalSeconds;
  const endTime = Date.now() + remainingSeconds * 1000;

  chrome.storage.local.set({ endTime, totalSeconds });

  startCountdownLoop();

  // Also tell background (optional)
  chrome.runtime.sendMessage({
    type: "START_TIMER",
    timerMinutes: minutes,
    popupText: popupTextEl.value || "Time to take a break!",
    repeat: repeatEl.checked,
    sound: soundEl.value
  });
});

stopBtn.addEventListener('click', () => {
  clearInterval(intervalId);
  document.getElementById("countdown").innerText = "Stopped";
  document.getElementById("progress-bar").style.width = "0%";

  chrome.storage.local.remove(["endTime", "totalSeconds"]); // 🧹 Clear timer data
  chrome.runtime.sendMessage({ type: "STOP_TIMER" });
});

testSoundBtn.addEventListener('click', () => {
  chrome.runtime.sendMessage({ type: "PING_AUDIO", sound: soundEl.value });
});

// ---------------- Helper Functions ----------------
function startCountdownLoop() {
  clearInterval(intervalId);
  updateDisplay();

  intervalId = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds <= 0) {
      clearInterval(intervalId);
      document.getElementById("countdown").innerText = "Time’s up!";
      document.getElementById("progress-bar").style.width = "100%";
      chrome.storage.local.remove(["endTime", "totalSeconds"]); // cleanup
      return;
    }

    updateDisplay();
  }, 1000);
}



function updateDisplay() {
  let minutes = Math.floor(remainingSeconds / 60);
  let seconds = remainingSeconds % 60;

  document.getElementById("countdown").innerText =
    `Remaining: ${minutes}:${seconds.toString().padStart(2, "0")}`;

  let progress = ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  document.getElementById("progress-bar").style.width = progress + "%";
}
