import { useState, useEffect, useRef } from "react";
import Head from "next/head";
import TempChart from "../components/TempChart";

type Config = {
  targetTime: number;
  programming: { hour: number; temperature: number }[];
};

type Stats = {
  timestamp: number;
  currentTemp: number;
  targetTemp: number;
  active: boolean;
}[];

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
  const [currentTarget, setCurrentTarget] = useState("");
  const [currentTemp, setCurrentTemp] = useState("");
  const [currentActive, setCurrentActive] = useState(false);
  const currentActiveText = currentActive ? "on" : "off";
  const [currentConfig, setCurrentConfig] = useState<Config | null>(null);
  const [currentStats, setCurrentStats] = useState<Stats | null>(null);
  const [pageWidth, setPageWidth] = useState<number | null>(null);

  const [update, setUpdate] = useState(0);
  function forceUpdate() {
    setUpdate(u => u + 1);
  }
  const timeoutRef = useRef<any>();
  useEffect(() => {
    function updateTick() {
      forceUpdate();
      timeoutRef.current = setTimeout(updateTick, 60000);
    }

    timeoutRef.current = setTimeout(updateTick, 60000);

    return () => void clearTimeout(timeoutRef.current);
  }, [setUpdate]);

  useEffect(() => {
    async function fetchData() {
      const target = await fetchJson(
        "http://172.16.10.1:5120/stats/target/current"
      );
      setCurrentTarget(target);
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

      const stats = await fetchJson("http://172.16.10.1:5120/stats/100000");
      const statsParsed = stats.map(JSON.parse);
      setCurrentStats(statsParsed);
    }

    setPageWidth(document.body.clientWidth);

    fetchData();
  }, [update]);

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
      <Head>
        <link href="/static/style.css" rel="stylesheet" />
      </Head>
      <p>Current hour: {currentTarget[0]}</p>
      <p>Current target: {currentTarget[1]}</p>
      <p>Current temp: {currentTemp}</p>
      <p>Active: {currentActiveText}</p>
      {pageWidth && currentStats && (
        <TempChart
          width={pageWidth}
          height={500}
          margin={{ left: 40, right: 40, top: 40, bottom: 40 }}
          data={currentStats}
        />
      )}
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
