require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const discovery = require("./discovery");
const devicehttp = require("./devicehttp");
const Thermostat = require("./thermostat");
const Database = require("./database");

const port = parseInt(process.env.API_PORT) || 8080;
const hostname = process.env.API_HOST || "0.0.0.0";
const app = express();
app.use(bodyParser.json());

let database = null;
let thermostat = null;
let currentDevice = null;

app.get("/stats/temp/current", async (req, res) => {
  if (currentDevice) {
    const temp = await thermostat.getCurrentTemp(currentDevice.address);
    res.send(JSON.stringify(temp));
  } else {
    res.status(404).send("No device found");
  }
});

app.get("/stats/relay/current", async (req, res) => {
  if (currentDevice) {
    const temp = await thermostat.getCurrentEnabled(currentDevice.address);
    res.send(JSON.stringify(temp));
  } else {
    res.status(404).send("No device found");
  }
});

app.get("/config", async (req, res) => {
  const config = await database.getConfig();
  res.send(config);
});

app.post("/config", async (req, res) => {
  try {
    await database.setConfig(req.body);
    res.status(200).send("OK");
  } catch (e) {
    res.status(500).send(e);
  }
});

async function start() {
  database = await Database();
  const config = await database.getConfig();
  await database.setConfig(config);

  const devices = await discovery(2000, 1);
  console.log("Found devices:", devices);
  currentDevice = devices[0];
  if (!currentDevice) {
    throw new Error("No devices found!");
  }

  thermostat = new Thermostat(config);
  thermostat.startThermostat(currentDevice.address);

  app.listen(port, hostname, () => console.log("HTTP API Ready"));
}
start();
