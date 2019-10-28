import { useState, useEffect } from "react";

async function fetchJson(url: string) {
  const data = await fetch(url);
  return data.json();
}

export default function Index() {
  const [currentTemp, setCurrentTemp] = useState("");
  const [currentActive, setCurrentActive] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const temp = await fetchJson("http://172.16.10.1:5120/stats/temp/current");
      setCurrentTemp(temp);
      const active = await fetchJson("http://172.16.10.1:5120/stats/relay/current");
      setCurrentActive(active);
    }

    fetchData();
  }, []);

  return (
    <>
      <p>Current temp: {currentTemp}</p>
      <p>Active: {currentActive}</p>
    </>
  );
}
