import { useState, useEffect, useRef } from "react";
import { Grid } from "@material-ui/core";

import TempChart from "../components/TempChart";
import InfoBox from "../components/InfoBox";

type Stats = {
  timestamp: number;
  temp: number;
  humidity: number;
}[];

async function fetchJson(url: string) {
  const data = await fetch(url);
  return data.json();
}

export default function Index() {
  const [currentTemp, setCurrentTemp] = useState("");
  const [currentHumidity, setCurrentHumidity] = useState("");
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
      const temp = await fetchJson("/stats/temp/current");
      setCurrentTemp(temp);

      const humidity = await fetchJson("/stats/humidity/current");
      setCurrentHumidity(humidity);

      const stats = await fetchJson("/stats/100000");
      const statsParsed = stats.map(JSON.parse);
      setCurrentStats(statsParsed);
    }

    setPageWidth(document.body.clientWidth);

    fetchData();
  }, [update]);

  return (
    <>
      <h1>Mansarda Monitor</h1>
      <Grid container spacing={2}>
        <Grid item>
          <InfoBox title="Temperature" value={currentTemp} />
        </Grid>
        <Grid item>
          <InfoBox title="Humidity" value={currentHumidity + "%"} />
        </Grid>
      </Grid>

      {pageWidth && currentStats && (
        <TempChart
          width={pageWidth}
          height={500}
          margin={{ left: 40, right: 40, top: 40, bottom: 40 }}
          data={currentStats}
        />
      )}
      <p>Made with ❤️ by Giulio Zausa.</p>
    </>
  );
}
