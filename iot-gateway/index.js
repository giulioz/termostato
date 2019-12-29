require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const proxy = require("express-http-proxy");

const discovery = require("./discovery");
const Thermometer = require("./thermometer");
const Database = require("./database");

const port = parseInt(process.env.API_PORT) || 8080;
const hostname = process.env.API_HOST || "0.0.0.0";
const proxyURL = process.env.PROXY_URL || "http://web:3000";
const app = express();
app.use(bodyParser.json());
app.use(cors());

let database = null;
let thermometer = null;
let currentDevice = null;

app.get("/stats/:num", async (req, res) => {
  try {
    const data = await database.getEvents(parseFloat(req.params.num));
    res.send(data);
  } catch (e) {
    res.status(500).send(e);
  }
});

app.get("/stats/temp/current", async (req, res) => {
  if (currentDevice) {
    const { temp, humidity } = await thermometer.getCurrentTempHumidity(
      currentDevice.address
    );
    res.send(JSON.stringify(temp));
  } else {
    res.status(404).send("No device found");
  }
});

app.get("/stats/humidity/current", async (req, res) => {
  if (currentDevice) {
    const { temp, humidity } = await thermometer.getCurrentTempHumidity(
      currentDevice.address
    );
    res.send(JSON.stringify(humidity));
  } else {
    res.status(404).send("No device found");
  }
});

app.use(proxy(proxyURL));

async function start() {
  database = await Database();

  const devices = await discovery(2000, 1);
  console.log("Found devices:", devices);
  currentDevice = devices[0];
  if (!currentDevice) {
    throw new Error("No devices found!");
  }

  const updateTime = 30000;
  thermometer = new Thermometer(updateTime);
  thermometer.on("update", arg => database.pushEvent(arg));
  thermometer.loop(currentDevice.address);

  app.listen(port, hostname, () => console.log("HTTP API Ready"));
}
start();
