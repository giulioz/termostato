const fetch = require("isomorphic-fetch");

const transformAddress = address => `http://${address}:3000`;

async function getConnectionInfo(address) {
  const request = await fetch(transformAddress(address) + "/connection");
  return request.json();
}

async function setConnection(address, ssid, password) {
  const request = await fetch(transformAddress(address) + "/connection", {
    method: "POST",
    body: JSON.stringify({ ssid, password })
  });
  return request.text();
}

async function getFirmwareVersion(address) {
  const request = await fetch(transformAddress(address) + "/version");
  return request.text();
}

async function getIdentifier(address) {
  const request = await fetch(transformAddress(address) + "/identifier");
  return request.text();
}

async function setIdentifier(address, identifier) {
  const request = await fetch(transformAddress(address) + "/identifier", {
    method: "POST",
    body: identifier
  });
  return request.text();
}

async function getData(address) {
  const request = await fetch(transformAddress(address) + "/data");
  return request.json();
}

async function setData(address, identifier, value) {
  const request = await fetch(transformAddress(address) + "/data", {
    method: "POST",
    body: JSON.stringify({ identifier, value })
  });
  return request.text();
}

module.exports = {
  getConnectionInfo,
  setConnection,
  getFirmwareVersion,
  getIdentifier,
  setIdentifier,
  getData,
  setData
};
