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
  // Durumu manuel göster (18. madde)
  socket.emit("statusUpdate", {});
}
