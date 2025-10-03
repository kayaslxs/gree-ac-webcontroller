const Gree = require("gree-hvac-client");
const readline = require("readline");

// AC Controll and connection
const AC_IP = "192.168.1.100"; // Paste AC IP addr to here U can take AC addr visit to 192.168.1.1 and take it

const client = new Gree.Client({ host: AC_IP });
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

// All properties
const options = {
  power: ["on", "off"],
  modes: ["auto", "cool", "heat", "dry", "fan_only"],
  fanSpeeds: ["auto", "low", "mediumLow", "medium", "mediumHigh", "high"],
  swingsH: ["default", "full", "fixedLeft", "fixedMidLeft", "fixedMid", "fixedMidRight", "fixedRight", "fullAlt"],
  swingsV: ["default", "full", "fixedTop", "fixedMidTop", "fixedMid", "fixedMidBottom", "fixedBottom", 
            "swingBottom", "swingMidBottom", "swingMid", "swingMidTop", "swingTop"],
  air: ["off", "inside", "outside", "mode3"],
  blow: ["off", "on"],
  health: ["off", "on"],
  sleep: ["off", "on"],
  lights: ["off", "on"],
  quiet: ["off", "mode1", "mode2", "mode3"],
  turbo: ["off", "on"],
  powerSave: ["off", "on"],
  safetyHeating: ["off", "on"],
  temperatureUnit: ["celsius", "fahrenheit"]
};

// KAYA SLXS
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m"
};

// Print the last AC status
client.on("update", (updated, allProps) => {
  lastStatus = allProps;
});

client.on("error", (err) => console.error("❌ Hata:", err));

client.on("connect", () => {
  console.log(colors.green + "✅ KLIMA SİSTEMİNE BAĞLANDI!" + colors.reset);
  console.log(colors.red + "🚀 by KAYASLXS" + colors.reset);
  showMenu();
});

// ASCII Art Header
function showHeader() {
  console.log(colors.cyan + `
  ██████  ██████  ███████ ███████ ██████  
 ██      ██    ██ ██      ██      ██   ██ 
 ██      ██    ██ █████   █████   ██████  
 ██      ██    ██ ██      ██      ██   ██ 
  ██████  ██████  ██      ███████ ██   ██ 
` + colors.reset);
}

// Menu functions
function showMenu() {
  console.log(colors.yellow + "\n" + "═".repeat(60) + colors.reset);
  showHeader();
  console.log(colors.magenta + "📊 Güncel Durum:" + colors.reset);
  console.log(colors.yellow + "═".repeat(60) + colors.reset);
  
  console.log(colors.bright + colors.green + "🎮 KONTROL MENÜSÜ" + colors.reset);
  console.log(colors.cyan + "1  - 🟢 Klimayı Aç");
  console.log("2  - 🔴 Klimayı Kapat");
  console.log("3  - 🌡️ Sıcaklık Ayarla");
  console.log("4  - 🔧 Mod Değiştir");
  console.log("5  - 💨 Fan Hızı Değiştir");
  console.log("6  - ↔️ Swing Yatay Ayarla");
  console.log("7  - ↕️ Swing Dikey Ayarla");
  console.log("8  - 🌬️ Air Modu");
  console.log("9  - 💨 Blow Modu");
  console.log("10 - 🏥 Health Modu");
  console.log("11 - 😴 Sleep Modu");
  console.log("12 - 💡 Işık Ayarı");
  console.log("13 - 🔇 Quiet Modu");
  console.log("14 - 🚀 Turbo Modu");
  console.log("15 - 💰 PowerSave Modu");
  console.log("16 - 🔥 SafetyHeating Modu");
  console.log("17 - 🌡️ Sıcaklık Birimi Değiştir");
  console.log("18 - 📊 Detaylı Durum Göster");
  console.log("0  - 🚪 Çıkış" + colors.reset);
  
  console.log(colors.yellow + "═".repeat(60) + colors.reset);

  rl.question(colors.bright + "🎯 Seçiminizi yapın: " + colors.reset, async (choice) => {
    switch (choice.trim()) {
      case "1":
        await client.setProperty(Gree.PROPERTY.power, Gree.VALUE.power.on);
        console.log(colors.green + "✅ Klima açıldı" + colors.reset);
        break;
      case "2":
        await client.setProperty(Gree.PROPERTY.power, Gree.VALUE.power.off);
        console.log(colors.red + "🛑 Klima kapatıldı" + colors.reset);
        break;
      case "3":
        rl.question("🌡️  Yeni sıcaklık (°C): ", async (temp) => {
          await client.setProperty(Gree.PROPERTY.temperature, parseInt(temp));
          console.log(colors.green + `✅ Sıcaklık ${temp}°C olarak ayarlandı` + colors.reset);
          showMenu();
        });
        return;
      case "4":
        console.log(colors.cyan + "🔧 Modlar: " + options.modes.join(", ") + colors.reset);
        rl.question("Yeni mod seçin: ", async (mode) => {
          if(options.modes.includes(mode)){
            await client.setProperty(Gree.PROPERTY.mode, Gree.VALUE.mode[mode]);
            console.log(colors.green + `✅ Mod ${mode} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz mod" + colors.reset);
          showMenu();
        });
        return;
      case "5":
        console.log(colors.cyan + "💨 Fan hızları: " + options.fanSpeeds.join(", ") + colors.reset);
        rl.question("Fan hızı seçin: ", async (fan) => {
          if(options.fanSpeeds.includes(fan)){
            await client.setProperty(Gree.PROPERTY.fanspeed, Gree.VALUE.fanSpeed[fan]);
            console.log(colors.green + `✅ Fan hızı ${fan} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz fan hızı" + colors.reset);
          showMenu();
        });
        return;
      case "6":
        console.log(colors.cyan + "↔️  Swing Yatay: " + options.swingsH.join(", ") + colors.reset);
        rl.question("Yeni swing yatay seçin: ", async (swing) => {
          if(options.swingsH.includes(swing)){
            await client.setProperty(Gree.PROPERTY.swingHor, Gree.VALUE.swingHor[swing]);
            console.log(colors.green + `✅ Swing yatay ${swing} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "7":
        console.log(colors.cyan + "↕️  Swing Dikey: " + options.swingsV.join(", ") + colors.reset);
        rl.question("Yeni swing dikey seçin: ", async (swing) => {
          if(options.swingsV.includes(swing)){
            await client.setProperty(Gree.PROPERTY.swingVert, Gree.VALUE.swingVert[swing]);
            console.log(colors.green + `✅ Swing dikey ${swing} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "8":
        console.log(colors.cyan + "🌬️  Air Modları: " + options.air.join(", ") + colors.reset);
        rl.question("Air modu seçin: ", async (air) => {
          if(options.air.includes(air)){
            await client.setProperty(Gree.PROPERTY.air, Gree.VALUE.air[air]);
            console.log(colors.green + `✅ Air modu ${air} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "9":
        console.log(colors.cyan + "💨 Blow Modları: " + options.blow.join(", ") + colors.reset);
        rl.question("Blow modu seçin: ", async (blow) => {
          if(options.blow.includes(blow)){
            await client.setProperty(Gree.PROPERTY.blow, Gree.VALUE.blow[blow]);
            console.log(colors.green + `✅ Blow modu ${blow} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "10":
        console.log(colors.cyan + "🏥 Health Modları: " + options.health.join(", ") + colors.reset);
        rl.question("Health modu seçin: ", async (health) => {
          if(options.health.includes(health)){
            await client.setProperty(Gree.PROPERTY.health, Gree.VALUE.health[health]);
            console.log(colors.green + `✅ Health modu ${health} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "11":
        console.log(colors.cyan + "😴 Sleep Modları: " + options.sleep.join(", ") + colors.reset);
        rl.question("Sleep modu seçin: ", async (sleep) => {
          if(options.sleep.includes(sleep)){
            await client.setProperty(Gree.PROPERTY.sleep, Gree.VALUE.sleep[sleep]);
            console.log(colors.green + `✅ Sleep modu ${sleep} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "12":
        console.log(colors.cyan + "💡 Işık Ayarları: " + options.lights.join(", ") + colors.reset);
        rl.question("Işık ayarı seçin: ", async (lights) => {
          if(options.lights.includes(lights)){
            await client.setProperty(Gree.PROPERTY.lights, Gree.VALUE.lights[lights]);
            console.log(colors.green + `✅ Işık ayarı ${lights} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "13":
        console.log(colors.cyan + "🔇 Quiet Modları: " + options.quiet.join(", ") + colors.reset);
        rl.question("Quiet modu seçin: ", async (quiet) => {
          if(options.quiet.includes(quiet)){
            await client.setProperty(Gree.PROPERTY.quiet, Gree.VALUE.quiet[quiet]);
            console.log(colors.green + `✅ Quiet modu ${quiet} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "14":
        console.log(colors.cyan + "🚀 Turbo Modları: " + options.turbo.join(", ") + colors.reset);
        rl.question("Turbo modu seçin: ", async (turbo) => {
          if(options.turbo.includes(turbo)){
            await client.setProperty(Gree.PROPERTY.turbo, Gree.VALUE.turbo[turbo]);
            console.log(colors.green + `✅ Turbo modu ${turbo} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "15":
        console.log(colors.cyan + "💰 PowerSave Modları: " + options.powerSave.join(", ") + colors.reset);
        rl.question("PowerSave modu seçin: ", async (powerSave) => {
          if(options.powerSave.includes(powerSave)){
            await client.setProperty(Gree.PROPERTY.powerSave, Gree.VALUE.powerSave[powerSave]);
            console.log(colors.green + `✅ PowerSave modu ${powerSave} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "16":
        console.log(colors.cyan + "🔥 SafetyHeating Modları: " + options.safetyHeating.join(", ") + colors.reset);
        rl.question("SafetyHeating modu seçin: ", async (safetyHeating) => {
          if(options.safetyHeating.includes(safetyHeating)){
            await client.setProperty(Gree.PROPERTY.safetyHeating, Gree.VALUE.safetyHeating[safetyHeating]);
            console.log(colors.green + `✅ SafetyHeating modu ${safetyHeating} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "17":
        console.log(colors.cyan + "🌡️  Sıcaklık Birimleri: " + options.temperatureUnit.join(", ") + colors.reset);
        rl.question("Sıcaklık birimi seçin: ", async (unit) => {
          if(options.temperatureUnit.includes(unit)){
            await client.setProperty(Gree.PROPERTY.temperatureUnit, Gree.VALUE.temperatureUnit[unit]);
            console.log(colors.green + `✅ Sıcaklık birimi ${unit} olarak ayarlandı` + colors.reset);
          } else console.log(colors.red + "⚠️  Geçersiz değer" + colors.reset);
          showMenu();
        });
        return;
      case "18":
        console.log(colors.magenta + "📊 DETAYLI KLIMA DURUMU:" + colors.reset);
        console.log(lastStatus);
        break;
      case "0":
        console.log(colors.yellow + "👋 Çıkılıyor..." + colors.reset);
        rl.close();
        client.disconnect();
        return;
      default:
        console.log(colors.red + "⚠️  Geçersiz seçim" + colors.reset);
    }
    showMenu(); // Back to menu
  });
}