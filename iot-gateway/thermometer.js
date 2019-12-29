const EventEmitter = require("events");
const devicehttp = require("./devicehttp");

module.exports = class Thermometer extends EventEmitter {
  constructor(updateTime) {
    super();
    this.updateTime = updateTime;
  }

  async getCurrentTempHumidity(address) {
    const data = await devicehttp.getData(address);
    const [temp, humidity] = data
      .find(t => t.identifier === "dhtSensor")
      .split(";")
      .map(parseFloat);
    return { temp, humidity };
  }

  async update(address) {
    const { temp, humidity } = await this.getCurrentTempHumidity(address);

    this.emit("update", {
      timestamp: new Date().getTime(),
      temp,
      humidity
    });
  }

  async loop(address) {
    await this.update(address);
    this.timeout = setTimeout(() => this.loop(address), updateTime);
  }
};
