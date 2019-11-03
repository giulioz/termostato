import React from "react";
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

export default function TempChart({
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
  // accessors
  const date = d => d.timestamp;
  const currentTemp = d => d["currentTemp"];
  const targetTemp = d => d["targetTemp"];

  // scales
  const xScale = scaleTime({
    domain: [Math.min(...data.map(date)), Math.max(...data.map(date))]
  });
  const yScale = scaleLinear({
    domain: [
      Math.min(...data.map(d => Math.min(currentTemp(d), targetTemp(d)))),
      Math.max(...data.map(d => Math.max(currentTemp(d), targetTemp(d))))
    ],
    nice: true
  });

  const onOff = aggregateOnOff(data);

  // bounds
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  xScale.range([0, xMax]);
  yScale.range([yMax, 0]);

  return (
    <div>
      <svg width={width} height={height}>
        <rect
          x={0}
          y={0}
          width={width}
          height={height}
          fill="#f3f3f3"
          // rx={14}
        />
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
          <AxisBottom
            top={yMax}
            scale={xScale}
            numTicks={width > 520 ? 10 : 5}
          />
          <AxisLeft scale={yScale} />
          <text x="-70" y="15" transform="rotate(-90)" fontSize={10}>
            Temperature (°C)
          </text>
          <Threshold
            data={data}
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
            data={data}
            curve={curveBasis}
            x={d => xScale(date(d))}
            y={d => yScale(targetTemp(d))}
            stroke="#000"
            strokeWidth={1.5}
            strokeOpacity={0.8}
            strokeDasharray="1,2"
          />
          <LinePath
            data={data}
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
                  fill="rgba(255, 0, 0, .4)"
                />
              )
          )}
        </Group>
      </svg>
    </div>
  );
}
