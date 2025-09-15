// background.js (MV3 service worker)

const ALARM_NAME = "take_a_break_alarm";

// Ensure offscreen document exists for audio playback (MV3 service worker can't play audio directly)
async function ensureOffscreen() {
  const existing = await chrome.offscreen.hasDocument?.();
  if (existing) return;
  await chrome.offscreen.createDocument({
    url: "audio.html",
    reasons: [chrome.offscreen.Reason.AUDIO_PLAYBACK],
    justification: "Play a notification sound when the timer finishes."
  });
}

// Create (or recreate) an alarm based on saved settings
async function scheduleAlarm() {
  const { timerMinutes = 30 } = await chrome.storage.sync.get({ timerMinutes: 30 });
  const periodInMinutes = parseFloat(timerMinutes);
  if (isNaN(periodInMinutes) || periodInMinutes <= 0) {
    console.warn("Invalid timerMinutes:", timerMinutes);
    return;
  }
  // Clear then create to avoid duplicates
  await chrome.alarms.clear(ALARM_NAME);
  await chrome.alarms.create(ALARM_NAME, { delayInMinutes: periodInMinutes });
}

// Handle alarm trigger
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;

  const settings = await chrome.storage.sync.get({
    popupText: "Time to take a break!",
    sound: "sound3",
    repeat: true,
    timerMinutes: 30
  });

  // Show notification
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon128.png",
    title: "Take a Break",
    message: settings.popupText,
    priority: 2,
    requireInteraction: true
  });

  // Play sound via offscreen document
  try {
    await ensureOffscreen();
    chrome.runtime.sendMessage({ type: "PLAY_SOUND", sound: settings.sound });
  } catch (e) {
    console.warn("Failed to play sound:", e);
  }

  // Reschedule if repeat enabled
  if (settings.repeat) {
    await chrome.alarms.create(ALARM_NAME, { delayInMinutes: parseFloat(settings.timerMinutes) });
  }
});

// Listen for start/stop commands from popup
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg?.type === "START_TIMER") {
    await chrome.storage.sync.set({
      timerMinutes: msg.timerMinutes,
      popupText: msg.popupText,
      sound: msg.sound,
      repeat: msg.repeat
    });
    await scheduleAlarm();
    sendResponse({ ok: true });
  } else if (msg?.type === "STOP_TIMER") {
    await chrome.alarms.clear(ALARM_NAME);
    sendResponse({ ok: true });
  } else if (msg?.type === "PING_AUDIO") {
    // For the test sound button in the UI
    try {
      await ensureOffscreen();
      chrome.runtime.sendMessage({ type: "PLAY_SOUND", sound: msg.sound || "sound1" });
      sendResponse({ ok: true });
    } catch (e) {
      sendResponse({ ok: false, error: String(e) });
    }
  }
  // Indicate we'll respond asynchronously if needed
  return true;
});

// On install set defaults
chrome.runtime.onInstalled.addListener(async () => {
  const defaults = {
    timerMinutes: 30,
    popupText: "Get some water!",
    sound: "sound3",
    repeat: true
  };
  await chrome.storage.sync.set(defaults);
});
