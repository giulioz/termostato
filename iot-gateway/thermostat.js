const EventEmitter = require("events");
const devicehttp = require("./devicehttp");

const defaultConfig = {
  targetTime: 30 * 1000,
  programming: [
    { hour: 0, temperature: 17 },
    { hour: 1, temperature: 17 },
    { hour: 2, temperature: 17 },
    { hour: 3, temperature: 17 },
    { hour: 4, temperature: 17 },
    { hour: 5, temperature: 22 },
    { hour: 6, temperature: 22 },
    { hour: 7, temperature: 22 },
    { hour: 8, temperature: 22 },
    { hour: 9, temperature: 22 },
    { hour: 10, temperature: 22 },
    { hour: 11, temperature: 22 },
    { hour: 12, temperature: 22 },
    { hour: 13, temperature: 22 },
    { hour: 14, temperature: 22 },
    { hour: 15, temperature: 22 },
    { hour: 16, temperature: 22 },
    { hour: 17, temperature: 22 },
    { hour: 18, temperature: 22 },
    { hour: 19, temperature: 22 },
    { hour: 20, temperature: 22 },
    { hour: 21, temperature: 22 },
    { hour: 22, temperature: 17 },
    { hour: 23, temperature: 17 }
  ]
};

module.exports = class Thermostat extends EventEmitter {
  constructor(thermostatConfig = defaultConfig) {
    super();

    this.thermostatConfig = thermostatConfig;
    this.timeout = -1;
  }

  getProgrammedTempNow() {
    const hour = new Date().getHours();
    return this.thermostatConfig.programming.find(p => p.hour === hour)
      .temperature;
  }

  async getCurrentTemp(address) {
    const temp = await devicehttp.getData(address);
    return parseFloat(temp.find(t => t.identifier === "tempSensor").value);
  }

  async update(address) {
    const currentTemp = await this.getCurrentTemp(address);
    const targetTemp = this.getProgrammedTempNow();
    const active = currentTemp < targetTemp;

    this.emit("update", {
      currentTemp,
      targetTemp,
      active
    });

    if (active) {
      await devicehttp.setData(address, "relay", "1");
    } else {
      await devicehttp.setData(address, "relay", "0");
    }
  }

  async loop(address) {
    await this.update(address);
    this.timeout = setTimeout(() => this.loop(address), this.targetTime);
  }

  startThermostat(address) {
    this.timeout = setTimeout(() => {
      this.emit("start");

      this.loop(address);
    }, this.targetTime);
  }

  stopThermostat() {
    clearTimeout(this.timeout);
    this.emit("stop");
  }
};
