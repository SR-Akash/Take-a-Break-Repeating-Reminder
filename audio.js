// audio.js - runs in offscreen document
// Plays simple tones using Web Audio API based on messages from the background.

let audioCtx;

function initCtx() {
  if (!audioCtx) {
    audioCtx = new (self.AudioContext || self.webkitAudioContext)();
  }
}

async function playPattern(name) {
  initCtx();
  const now = audioCtx.currentTime;

  const makeBeep = (freq, start, duration) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.5, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + duration + 0.05);
  };

  // Three distinct patterns
  if (name === "sound1") {
    // single long mid tone
    makeBeep(660, now, 1.0);
  } else if (name === "sound2") {
    // triple short beeps
    makeBeep(880, now, 0.2);
    makeBeep(880, now + 0.35, 0.2);
    makeBeep(880, now + 0.70, 0.2);
  } else {
    // rising chirp pattern
    makeBeep(500, now, 0.25);
    makeBeep(700, now + 0.3, 0.25);
    makeBeep(900, now + 0.6, 0.25);
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "PLAY_SOUND") {
    playPattern(msg.sound || "sound3");
  }
});
