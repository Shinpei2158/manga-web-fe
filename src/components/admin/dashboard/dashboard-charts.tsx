"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { surfaceCardClass } from "@/lib/admin-dashboard/constants";
import { ChartState } from "./data-state";

type DashboardChartsProps = {
  loadingWeekly: boolean;
  weeklyError?: string;
  weeklyData: { label: string; newUsers: number }[];
  loadingGrowth: boolean;
  growthError?: string;
  growthData: { label: string; stories: number }[];
};

const chartMargin = { top: 8, right: 8, left: -20, bottom: 0 };
const axisTick = { fill: "#64748b", fontSize: 12 };
const tooltipStyle = {
  borderRadius: 16,
  borderColor: "#e2e8f0",
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
};

export function DashboardCharts({
  loadingWeekly,
  weeklyError,
  weeklyData,
  loadingGrowth,
  growthError,
  growthData,
}: DashboardChartsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <Card className={surfaceCardClass}>
        <CardHeader className="space-y-2">
          <CardTitle className="text-base text-slate-950 dark:text-slate-50">
            New users by week
          </CardTitle>
          <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
            Fresh registrations over the latest four-week window.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[280px]">
          <ChartState
            loading={loadingWeekly}
            error={weeklyError}
            hasData={weeklyData.length > 0}
            emptyTitle="No new-user trend yet"
            emptyDescription="New registrations will appear here once the API returns weekly data."
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData} margin={chartMargin}>
                <CartesianGrid
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tick={axisTick}
                />
                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={axisTick}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="New users"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#2563eb" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartState>
        </CardContent>
      </Card>

      <StoriesGrowthChart
        data={growthData}
        error={growthError}
        loading={loadingGrowth}
      />
    </section>
  );
}

function StoriesGrowthChart({
  data,
  error,
  loading,
}: {
  data: { label: string; stories: number }[];
  error?: string;
  loading: boolean;
}) {
  return (
    <Card className={surfaceCardClass}>
      <CardHeader className="space-y-2">
        <CardTitle className="text-base text-slate-950 dark:text-slate-50">
          Stories growth
        </CardTitle>
        <CardDescription className="text-sm leading-6 text-slate-600 dark:text-slate-300">
          Monthly additions to the story catalog across the past six months.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ChartState
          loading={loading}
          error={error}
          hasData={data.length > 0}
          emptyTitle="No story growth trend yet"
          emptyDescription="Story growth will show here once monthly growth data is available."
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={chartMargin}>
              <defs>
                <linearGradient id="stories-growth-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.38} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tick={axisTick} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={axisTick} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area
                type="monotone"
                dataKey="stories"
                name="Stories"
                stroke="#0f766e"
                strokeWidth={2.5}
                fill="url(#stories-growth-fill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartState>
      </CardContent>
    </Card>
  );
}
