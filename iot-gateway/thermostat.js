const EventEmitter = require("events");
const devicehttp = require("./devicehttp");

module.exports = class Thermostat extends EventEmitter {
  constructor(thermostatConfig) {
    super();

    this.thermostatConfig = thermostatConfig;
    this.timeout = -1;
    this.enabled = false;
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

  async getCurrentEnabled(address) {
    const temp = await devicehttp.getData(address);
    return temp.find(t => t.identifier === "relay").value === "1";
  }

  async update(address) {
    try {
      const currentTemp = await this.getCurrentTemp(address);
      const targetTemp = this.getProgrammedTempNow();
      const active = currentTemp < targetTemp;

      this.emit("update", {
        timestamp: new Date().getTime(),
        currentTemp,
        targetTemp,
        active
      });

      if (active) {
        await devicehttp.setData(address, "relay", "1");
      } else {
        await devicehttp.setData(address, "relay", "0");
      }
    } catch (e) {
      console.error(e);
    }
  }

  async loop(address) {
    if (this.enabled) {
      await this.update(address);
      this.timeout = setTimeout(
        () => this.loop(address),
        this.thermostatConfig.targetTime
      );
    }
  }

  startThermostat(address) {
    this.enabled = true;
    this.emit("start");
    this.loop(address);
  }

  stopThermostat() {
    this.enabled = false;
    clearTimeout(this.timeout);
    this.emit("stop");
  }
};
