import { useState, useEffect } from "react";

type Config = {
  targetTime: number;
  programming: { hour: number; temperature: number }[];
};

async function fetchJson(url: string) {
  const data = await fetch(url);
  return data.json();
}

const boxStyle = {
  display: "flex" as const,
  flexDirection: "column" as const,
  flexWrap: "wrap" as const,
  maxHeight: 450
};

export default function Index() {
  const [currentTemp, setCurrentTemp] = useState("");
  const [currentActive, setCurrentActive] = useState(false);
  const currentActiveText = currentActive ? "on" : "off";
  const [currentConfig, setCurrentConfig] = useState<Config | null>(null);

  useEffect(() => {
    async function fetchData() {
      const temp = await fetchJson(
        "http://172.16.10.1:5120/stats/temp/current"
      );
      setCurrentTemp(temp);
      const active = await fetchJson(
        "http://172.16.10.1:5120/stats/relay/current"
      );
      setCurrentActive(active);
      const config = await fetchJson("http://172.16.10.1:5120/config");
      setCurrentConfig(config);
    }

    fetchData();
  }, []);

  function updateTemperature(i: number, value: number) {
    setCurrentConfig(c => ({
      ...c,
      programming: c.programming.map((p, ii) =>
        ii === i ? { ...p, temperature: value } : p
      )
    }));
  }

  async function saveConfig() {
    const req = await fetch("http://172.16.10.1:5120/config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(currentConfig)
    });
    return req.text();
  }

  return (
    <>
      <p>Current temp: {currentTemp}</p>
      <p>Active: {currentActiveText}</p>
      <hr />
      {currentConfig && (
        <>
          <p>
            Update Time:{" "}
            <input
              type="number"
              value={currentConfig.targetTime}
              onChange={e => {
                e.persist();
                setCurrentConfig(c => ({
                  ...c,
                  targetTime: parseFloat(e.target.value)
                }));
              }}
            />
          </p>
          <h4>Programming</h4>
          <div style={boxStyle}>
            {currentConfig.programming.map((e, i) => (
              <p key={i}>
                {e.hour}:{" "}
                <input
                  type="number"
                  value={e.temperature}
                  onChange={e => {
                    e.persist();
                    updateTemperature(i, parseFloat(e.target.value));
                  }}
                />
              </p>
            ))}
          </div>
          <button onClick={saveConfig}>Save</button>
        </>
      )}
    </>
  );
}
