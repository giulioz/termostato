require("dotenv").config();

const express = require("express");
const discovery = require("./discovery");
const devicehttp = require("./devicehttp");
const Thermostat = require("./thermostat");

const port = parseInt(process.env.API_PORT) || 8080;
const hostname = process.env.API_HOST || "0.0.0.0";
const app = express();

const thermostat = new Thermostat();
let currentDevice = null;

app.get("/stats/temp/current", async (req, res) => {
  if (currentDevice) {
    const temp = await thermostat.getCurrentTemp(currentDevice.address);
    res.send(temp);
  } else {
    res.status(404).send("No device found");
  }
});

async function start() {
  app.listen(port, hostname, () => console.log("HTTP API Ready"));

  const devices = await discovery(2000, 1);
  console.log("Found devices:", devices);

  currentDevice = devices[0];
  if (!currentDevice) {
    throw new Error("No devices found!");
  }

  thermostat.startThermostat(currentDevice.address);
}
start();
