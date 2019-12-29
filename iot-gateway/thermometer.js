const EventEmitter = require("events");
const devicehttp = require("./devicehttp");

module.exports = class Thermometer extends EventEmitter {
  constructor(updateTime) {
    super();
    this.updateTime = updateTime;
  }

  async getCurrentTempHumidity(address) {
    const data = await devicehttp.getData(address);
    const record = data.find(t => t.identifier === "dhtSensor");
    if (!record) {
      return { temp: NaN, humidity: NaN };
    }

    const [temp, humidity] = record.value.split(";").map(parseFloat);
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
    this.timeout = setTimeout(() => this.loop(address), this.updateTime);
  }
};
