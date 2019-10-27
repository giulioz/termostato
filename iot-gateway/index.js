require("dotenv").config();

const express = require("express");
const discovery = require("./discovery");
const devicehttp = require("./devicehttp");
const Thermostat = require("./thermostat");

const port = parseInt(process.env.API_PORT) || 8080;
const hostname = process.env.API_HOST || "0.0.0.0";
const app = express();

const thermostat = new Thermostat();

app.get("/stats/temp/current", async (req, res) => {
  const temp = await thermostat.getCurrentTemp();
  res.send(temp);
});

async function start() {
  app.listen(port, hostname, () => console.log("HTTP API Ready"));

  const devices = await discovery(2000, 1);
  console.log("Found devices:", devices);

  const firstDevice = devices[0];
  if (!firstDevice) {
    throw new Error("No devices found!");
  }

  thermostat.startThermostat(firstDevice.address);
}
start();
