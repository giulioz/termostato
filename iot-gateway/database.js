const redis = require("redis");

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

async function get(redisClient, name) {
  return new Promise(
    (resolve, reject) =>
      void redisClient.get(name, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      })
  );
}

async function set(redisClient, name, value) {
  return new Promise(
    (resolve, reject) =>
      void redisClient.set(name, value, (err, reply) => {
        if (err) {
          reject(err);
        } else {
          resolve(reply);
        }
      })
  );
}

async function tryOrDefault(fn, fallback) {
  try {
    const value = await fn();
    return value || fallback;
  } catch (e) {
    console.warn(
      "Masked error:",
      JSON.stringify(e),
      "using fallback",
      fallback
    );
    return fallback;
  }
}

module.exports = async function() {
  const redisClient = redis.createClient(
    process.env.REDIS_ADDRESS || "redis://redis:6379"
  );

  async function getConfig() {
    const [targetTime, programming] = await Promise.all([
      tryOrDefault(
        async () => parseFloat(await get(redisClient, "targetTime")),
        defaultConfig.targetTime
      ),
      tryOrDefault(
        async () => JSON.parse(await get(redisClient, "programming")),
        defaultConfig.programming
      )
    ]);

    return {
      targetTime,
      programming
    };
  }

  async function setConfig(config) {
    return Promise.all([
      set(redisClient, "targetTime", JSON.stringify(config.targetTime)),
      set(redisClient, "programming", JSON.stringify(config.programming))
    ]);
  }

  async function pushEvent(event) {
    return new Promise((resolve, reject) => {
      redisClient.LPUSH("events", JSON.stringify(event), (err, n) => {
        if (!err && n === 1) {
          resolve();
        } else {
          console.error("Error in pushEvent!", event, n);
          reject(err);
        }
      });
    });
  }

  async function getEvents(num = 5000) {
    return new Promise((resolve, reject) => {
      redisClient.LRANGE("events", 0, num, (err, data) => {
        if (!err) {
          resolve(data);
        } else {
          console.error("Error in getEvents!", num);
          reject(err);
        }
      });
    });
  }

  const API = {
    getConfig,
    setConfig,
    pushEvent,
    getEvents
  };

  return new Promise((resolve, reject) => {
    redisClient.on("error", err => {
      console.error("Error in redis!", err);
      reject(err);
    });

    redisClient.on("connect", () => {
      resolve(API);
    });
  });
};
