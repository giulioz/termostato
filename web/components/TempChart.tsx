import React, { useState, useMemo, useEffect } from "react";
import { Group } from "@vx/group";
import { curveBasis } from "@vx/curve";
import { LinePath, Bar } from "@vx/shape";
import { Threshold } from "@vx/threshold";
import { scaleTime, scaleLinear } from "@vx/scale";
import { AxisLeft, AxisBottom } from "@vx/axis";
import { GridRows, GridColumns } from "@vx/grid";

type Data = {
  timestamp: number;
  currentTemp: number;
  targetTemp: number;
  active: boolean;
}[];

function aggregateOnOff(data: Data) {
  const sorted = data.sort((a, b) => a.timestamp - b.timestamp);

  return sorted.reduce((prev, next) => {
    const lastRecord = prev[prev.length - 1];

    if (lastRecord && next.active === lastRecord.active) {
      return [
        ...prev.slice(0, -1),
        { ...lastRecord, timestampEnd: next.timestamp }
      ];
    } else {
      return [...prev, { ...next, timestampEnd: next.timestamp }];
    }
  }, []);
}

const hourMS = 1000 * 60 * 60;
const maxSpan = 12 * 30 * 24 * hourMS;
const minSpan = hourMS;
const stepsSpan = maxSpan - minSpan;
const powFactor = 5;

// accessors
const date = d => d.timestamp;
const currentTemp = d => d["currentTemp"];
const targetTemp = d => d["targetTemp"];

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
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [
          Math.min(
            ...filteredData.map(d => Math.min(currentTemp(d), targetTemp(d)))
          ),
          Math.max(
            ...filteredData.map(d => Math.max(currentTemp(d), targetTemp(d)))
          )
        ],
        nice: true
      }).range([yMax, 0]),
    [filteredData, yMax]
  );

  const onOff = useMemo(() => aggregateOnOff(data), [data]).filter(
    d => d.timestamp >= now - timeSpan || d.timestampEnd >= now - timeSpan
  );

  return (
    <div>
      <div>
        Time:
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
            scale={yScale}
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
          <AxisLeft scale={yScale} />
          <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
            Temperature (°C)
          </text>
          <Threshold
            data={filteredData}
            x={d => xScale(date(d))}
            y0={d => yScale(currentTemp(d))}
            y1={d => yScale(targetTemp(d))}
            clipAboveTo={0}
            clipBelowTo={yMax}
            curve={curveBasis}
            belowAreaProps={{
              fill: "red",
              fillOpacity: 0.4
            }}
            aboveAreaProps={{
              fill: "green",
              fillOpacity: 0.4
            }}
          />
          <LinePath
            data={filteredData}
            curve={curveBasis}
            x={d => xScale(date(d))}
            y={d => yScale(targetTemp(d))}
            stroke="#000"
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray="1,2"
          />
          <LinePath
            data={filteredData}
            curve={curveBasis}
            x={d => xScale(date(d))}
            y={d => yScale(currentTemp(d))}
            stroke="#000"
            strokeWidth={1.5}
          />
          {onOff.map(
            d =>
              d.active && (
                <Bar
                  key={`bar-${d.timestamp}`}
                  x={xScale(d.timestamp)}
                  y={0}
                  width={xScale(d.timestampEnd) - xScale(d.timestamp)}
                  height={yMax}
                  fill="rgba(0, 0, 255, .4)"
                />
              )
          )}
        </Group>
      </svg>
    </div>
  );
});
