import React, { useState, useMemo, useEffect } from "react";
import { Group } from "@vx/group";
import { curveBasis } from "@vx/curve";
import { LinePath, Bar } from "@vx/shape";
import { scaleTime, scaleLinear } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { GridRows, GridColumns } from "@vx/grid";

type Data = {
  timestamp: number;
  temp: number;
  humidity: number;
}[];

const hourMS = 1000 * 60 * 60;
const maxSpan = 12 * 30 * 24 * hourMS;
const minSpan = hourMS;
const stepsSpan = maxSpan - minSpan;
const powFactor = 5;

// accessors
const date = d => d.timestamp;
const temp = d => d["temp"];
const humidity = d => d["humidity"];

const sliderValueToTime = (value: number) =>
  Math.round(Math.pow((100 - value) / 100, powFactor) * stepsSpan + minSpan);

export default React.memo(function TempChart({
  width,
  height,
  margin,
  data
}: {
  width: number;
  height: number;
  margin: { left: number; top: number; right: number; bottom: number };
  data: Data;
}) {
  const [timeSpan, setTimeSpan] = useState(1000 * 60 * 60 * 24 * 2);
  const sliderValue =
    100 - Math.pow((timeSpan - minSpan) / stepsSpan, 1 / powFactor) * 100;

  const now = new Date().getTime();
  const filteredData = data
    .sort((a, b) => a.timestamp - b.timestamp)
    .filter(d => d.timestamp >= now - timeSpan);

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  // scales
  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [
          Math.min(...filteredData.map(date)),
          Math.max(...filteredData.map(date))
        ]
      }).range([0, xMax]),
    [filteredData, xMax]
  );
  const yScaleTemp = useMemo(
    () =>
      scaleLinear({
        domain: [
          Math.min(...filteredData.map(d => temp(d))),
          Math.max(...filteredData.map(d => temp(d)))
        ],
        nice: true
      }).range([yMax, 0]),
    [filteredData, yMax]
  );
  const yScaleHum = useMemo(
    () =>
      scaleLinear({
        domain: [0, 100],
        nice: true
      }).range([yMax, 0]),
    [filteredData, yMax]
  );

  return (
    <div>
      <div>
        Time:{" "}
        <input
          type="range"
          value={sliderValue}
          onChange={e =>
            setTimeSpan(sliderValueToTime(parseFloat(e.target.value)))
          }
        />
      </div>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="#f3f3f3" />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScaleTemp}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
          <AxisBottom top={yMax} scale={xScale} numTicks={width / 40} />
          <AxisLeft scale={yScaleTemp} />
          <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
            Temperature (°C)
          </text>
          <LinePath
            data={filteredData}
            curve={curveBasis}
            x={d => xScale(date(d))}
            y={d => yScaleTemp(temp(d))}
            stroke="#000"
            strokeWidth={1.5}
          />
        </Group>
      </svg>
      <svg width={width} height={height}>
        <rect x={0} y={0} width={width} height={height} fill="#f3f3f3" />
        <Group left={margin.left} top={margin.top}>
          <GridRows
            scale={yScaleHum}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <GridColumns
            scale={xScale}
            width={xMax}
            height={yMax}
            stroke="#e0e0e0"
          />
          <line x1={xMax} x2={xMax} y1={0} y2={yMax} stroke="#e0e0e0" />
          <AxisBottom top={yMax} scale={xScale} numTicks={width / 40} />
          <AxisLeft scale={yScaleHum} />
          <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
            Humidity (%)
          </text>
          <LinePath
            data={filteredData}
            curve={curveBasis}
            x={d => xScale(date(d))}
            y={d => yScaleHum(humidity(d))}
            stroke="#000"
            strokeWidth={1.5}
          />
        </Group>
      </svg>
    </div>
  );
});
