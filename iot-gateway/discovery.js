const dgram = require("dgram");

const sendAsync = async (server, data, port, address) =>
  new Promise((resolve, reject) =>
    server.send(data, port, address, (err, bytes) =>
      err ? reject(err) : resolve(bytes)
    )
  );

const sleep = async ms => new Promise(res => setTimeout(res, ms));

module.exports = async function(timeout = 500, retry = 1) {
  const found = [];

  while (retry > 0) {
    const server = dgram.createSocket(
      { type: "udp4", reuseAddr: true },
      (msg, rinfo) => {
        const data = msg.toString("ascii");
        if (data.startsWith("IOT_HELLO;")) {
          const deviceId = data.split(";")[1];
          if (!found.find(d => d.deviceId == deviceId)) {
            found.push({ deviceId, address: rinfo.address });
          }
        }
      }
    );
    server.on("listening", () => server.setBroadcast(true));

    await sendAsync(
      server,
      "IOT_DISCOVERY",
      process.env.DISCOVERY_PORT,
      process.env.DISCOVERY_BROADCAST_ADDRESS
    );

    await sleep(timeout);
    server.close();
    retry--;
  }
  return found;
};
