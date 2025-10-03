const socket = io();
const statusEl = document.getElementById("status");

socket.on("statusUpdate", (status) => {
  statusEl.textContent = JSON.stringify(status, null, 2);
});

function setProperty(prop, value) {
  socket.emit("setProperty", { prop, value });
}

function setPropertyFromSelect(id) {
  const el = document.getElementById(id);
  setProperty(id, el.value);
}

function setTemperature() {
  const temp = parseInt(document.getElementById("temperature").value);
  if (!isNaN(temp)) setProperty("temperature", temp);
}

function showStatus() {
  socket.emit("statusUpdate", {});
}

// ---------------------- SESLİ KOMUT ----------------------
const voiceBtn = document.getElementById("voiceBtn");
const voiceStatus = document.getElementById("voiceStatus");

if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'tr-TR';
  recognition.continuous = false;
  recognition.interimResults = false;

  voiceBtn.addEventListener('click', () => {
    recognition.start();
    voiceStatus.textContent = "🎙️ Dinleniyor...";
  });

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript.toLowerCase();
    voiceStatus.textContent = "📝 Komut: " + command;
    handleVoiceCommand(command);
  };

  recognition.onerror = (event) => {
    voiceStatus.textContent = "❌ Hata: " + event.error;
  };
} else {
  voiceStatus.textContent = "⚠️ Tarayıcı sesli komutu desteklemiyor.";
}

// ---------------------- KOMUT İŞLEME ----------------------
function handleVoiceCommand(cmd) {

  // Güç
  if (cmd.includes("aç")) setProperty('power','on');
  else if (cmd.includes("kapat")) setProperty('power','off');

  // Sıcaklık
  const tempMatch = cmd.match(/\d+/);
  if (cmd.includes("sıcaklık") && tempMatch) setProperty('temperature', parseInt(tempMatch[0]));

  // Mod
  if (cmd.includes("mod")) {
    if (cmd.includes("soğutma") || cmd.includes("cool")) setProperty('mode','cool');
    else if (cmd.includes("ısıtma") || cmd.includes("heat")) setProperty('mode','heat');
    else if (cmd.includes("otomatik") || cmd.includes("auto")) setProperty('mode','auto');
    else if (cmd.includes("fan")) setProperty('mode','fan_only');
    else if (cmd.includes("kuru") || cmd.includes("dry")) setProperty('mode','dry');
  }

  // Fan hızı
  if (cmd.includes("fan")) {
    if (cmd.includes("yüksek")) setProperty('fanspeed','high');
    else if (cmd.includes("orta")) setProperty('fanspeed','medium');
    else if (cmd.includes("düşük")) setProperty('fanspeed','low');
    else setProperty('fanspeed','auto');
  }

  // Swing Yatay / Dikey
  if (cmd.includes("swing yatay")) {
    if (cmd.includes("sol")) setProperty('swingHor','fixedLeft');
    else if (cmd.includes("orta")) setProperty('swingHor','fixedMid');
    else if (cmd.includes("sağ")) setProperty('swingHor','fixedRight');
    else setProperty('swingHor','full');
  }
  if (cmd.includes("swing dikey")) {
    if (cmd.includes("üst")) setProperty('swingVert','fixedTop');
    else if (cmd.includes("orta")) setProperty('swingVert','fixedMid');
    else if (cmd.includes("alt")) setProperty('swingVert','fixedBottom');
    else setProperty('swingVert','full');
  }

  // Air Modu
  if (cmd.includes("air")) {
    if (cmd.includes("iç")) setProperty('air','inside');
    else if (cmd.includes("dış")) setProperty('air','outside');
    else if (cmd.includes("kapalı")) setProperty('air','off');
    else setProperty('air','mode3');
  }

  // Blow
  if (cmd.includes("blow")) {
    if (cmd.includes("aç")) setProperty('blow','on');
    else setProperty('blow','off');
  }

  // Health
  if (cmd.includes("health")) {
    if (cmd.includes("aç")) setProperty('health','on');
    else setProperty('health','off');
  }

  // Sleep
  if (cmd.includes("sleep")) {
    if (cmd.includes("aç")) setProperty('sleep','on');
    else setProperty('sleep','off');
  }

  // Lights
  if (cmd.includes("ışık")) {
    if (cmd.includes("aç")) setProperty('lights','on');
    else setProperty('lights','off');
  }

  // Quiet
  if (cmd.includes("quiet")) {
    if (cmd.includes("mod1")) setProperty('quiet','mode1');
    else if (cmd.includes("mod2")) setProperty('quiet','mode2');
    else if (cmd.includes("mod3")) setProperty('quiet','mode3');
    else setProperty('quiet','off');
  }

  // Turbo
  if (cmd.includes("turbo")) {
    if (cmd.includes("aç")) setProperty('turbo','on');
    else setProperty('turbo','off');
  }

  // PowerSave
  if (cmd.includes("powersave") || cmd.includes("enerji")) {
    if (cmd.includes("aç")) setProperty('powerSave','on');
    else setProperty('powerSave','off');
  }

  // SafetyHeating
  if (cmd.includes("safety") || cmd.includes("güvenli")) {
    if (cmd.includes("aç")) setProperty('safetyHeating','on');
    else setProperty('safetyHeating','off');
  }

  // Sıcaklık Birimi
  if (cmd.includes("celsius")) setProperty('temperatureUnit','celsius');
  if (cmd.includes("fahrenheit")) setProperty('temperatureUnit','fahrenheit');

  voiceStatus.textContent += " ✅ İşlem yapıldı";
}
