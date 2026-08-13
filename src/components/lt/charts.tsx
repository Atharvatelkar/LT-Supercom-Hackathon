import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const axis = { stroke: "oklch(0.551 0.027 264)", fontSize: 11 };
const grid = "oklch(0.912 0.011 253)";

export function TrendLine({
  data,
  x,
  lines,
  height = 240,
}: {
  data: Record<string, string | number>[];
  x: string;
  lines: { key: string; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey={x} tickLine={false} axisLine={false} tick={axis} />
        <YAxis tickLine={false} axisLine={false} tick={axis} />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid oklch(0.912 0.011 253)",
            fontSize: 12,
          }}
        />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            stroke={l.color}
            strokeWidth={2.5}
            dot={{ r: 3, strokeWidth: 0, fill: l.color }}
            activeDot={{ r: 5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function Bars({
  data,
  x,
  y,
  height = 240,
  color = "var(--color-brand)",
}: {
  data: Record<string, string | number>[];
  x: string;
  y: string;
  height?: number;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke={grid} vertical={false} />
        <XAxis dataKey={x} tickLine={false} axisLine={false} tick={axis} />
        <YAxis tickLine={false} axisLine={false} tick={axis} />
        <Tooltip
          cursor={{ fill: "oklch(0.962 0.008 253)" }}
          contentStyle={{
            borderRadius: 10,
            border: "1px solid oklch(0.912 0.011 253)",
            fontSize: 12,
          }}
        />
        <Bar dataKey={y} fill={color} radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}
